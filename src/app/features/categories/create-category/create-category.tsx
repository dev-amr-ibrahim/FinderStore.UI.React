import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryUpsertRequest } from '../../../core/models/category-upsert-request';
import { CategoryService } from '../../../core/services/category.service';

const categoryService = new CategoryService();

const initialForm: CategoryUpsertRequest = {
  name: '',
  nameAr: '',
  slug: '',
  description: '',
  descriptionAr: '',
  imageUrl: '',
  displayOrder: 0,
  parentCategoryId: null,
  imageFile: null,
};

export function CreateCategory() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CategoryUpsertRequest>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const updateField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(current => ({
      ...current,
      [name]: name === 'displayOrder' ? Number(value) : name === 'parentCategoryId' ? value || null : value,
    }));
  };

  const updateImageFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0] ?? null;
    setFormData(current => ({ ...current, imageFile }));
    setImagePreview(imageFile ? URL.createObjectURL(imageFile) : null);
  };

  const removeImageFile = () => {
    setFormData(current => ({ ...current, imageFile: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    if (!formData.name.trim() || !formData.nameAr.trim() || !formData.slug.trim()) {
      setErrorMessage('Name, Arabic name, and slug are required.');
      return;
    }

    setIsLoading(true);
    try {
      await categoryService.createCategory({
        ...formData,
        name: formData.name.trim(),
        nameAr: formData.nameAr.trim(),
        slug: formData.slug.trim(),
      });
      navigate('/admin/categories');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.error?.message || 'Failed to create category. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Catalog</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Add category</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Create a category and optionally place it under an existing parent.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {errorMessage && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">{errorMessage}</div>}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-lg font-semibold">Category details</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Name *"><input required name="name" value={formData.name} onChange={updateField} className="input-field" placeholder="Electronics" /></Field>
            <Field label="Name (Arabic) *"><input required dir="rtl" name="nameAr" value={formData.nameAr} onChange={updateField} className="input-field" placeholder="إلكترونيات" /></Field>
            <Field label="Slug *"><input required name="slug" value={formData.slug} onChange={updateField} className="input-field" placeholder="electronics" /></Field>
            <Field label="Display order"><input min="0" type="number" name="displayOrder" value={formData.displayOrder} onChange={updateField} className="input-field" /></Field>
            <Field label="Description"><textarea name="description" value={formData.description} onChange={updateField} className="input-field min-h-28 resize-y" placeholder="Brief category description" /></Field>
            <Field label="Description (Arabic)"><textarea dir="rtl" name="descriptionAr" value={formData.descriptionAr} onChange={updateField} className="input-field min-h-28 resize-y" placeholder="وصف مختصر للفئة" /></Field>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Category image</h2>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={updateImageFile} className="hidden" />
          </div>

          {!formData.imageFile || !imagePreview ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
              <div className="mb-3 text-4xl">🖼️</div>
              <p className="mb-2 text-slate-600 dark:text-slate-400">No image selected</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm">Select image</button>
            </div>
          ) : (
            <div className="mx-auto w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                <img src={imagePreview} alt="Category preview" className="h-full w-full object-cover" />
                <button type="button" onClick={removeImageFile} aria-label="Remove image" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white transition-colors hover:bg-red-600">×</button>
              </div>
              <p className="truncate p-4 text-center text-sm text-slate-600 dark:text-slate-300">{formData.imageFile.name}</p>
            </div>
          )}
        </section>

        <div className="flex justify-end gap-3"><button type="button" onClick={() => navigate('/admin/categories')} className="btn-secondary px-5 py-2.5">Cancel</button><button disabled={isLoading} type="submit" className="btn-primary px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? 'Creating...' : 'Create category'}</button></div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 dark:text-slate-300"><span className="mb-1 block">{label}</span>{children}</label>;
}
