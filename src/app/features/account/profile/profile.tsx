import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../../core/services/auth.service';
import { customerService } from '../../../core/services/customer.service';
import { toastService } from '../../../shared/components/toast/toast.service';
import type { UpdateProfileRequest } from '../../../core/models/update-profile-request';
import type { ProfileDto } from '../../../core/models/profile-dto';

type Address = {
  label: string;
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export function Profile() {
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone1: '',
    phone2: '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = () => {
    customerService.getUserProfile().then((profileData: ProfileDto) => {
      setProfile({
        name: profileData.fullName,
        email: profileData.email,
        phone1: profileData.phone || '',
        phone2: profileData.backupPhone || '',
      });
      setAddresses(
        profileData.addresses.map((addr) => ({
          label: 'Home',
          recipient: '',
          line1: addr.line1,
          line2: addr.line2,
          city: addr.city,
          region: addr.region || '',
          postalCode: addr.postalCode || '',
          country: addr.country,
        }))
      );
      if (addresses.length === 0) {
        addAddress();
      }
    }).catch((error) => {
      const message = error?.error?.message ?? 'Unable to fetch user profile. Please try again.';
      toastService.show(message, 'error');
    });
  };

  const addAddress = (address?: Partial<Address>) => {
    setAddresses((prev) => [
      ...prev,
      {
        label: address?.label ?? 'Home',
        recipient: address?.recipient ?? profile.name ?? '',
        line1: address?.line1 ?? '',
        line2: address?.line2,
        city: address?.city ?? '',
        region: address?.region ?? '',
        postalCode: address?.postalCode ?? '',
        country: address?.country ?? '',
      },
    ]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    setAddresses((prev) =>
      prev.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr))
    );
  };

  const save = async () => {
    setSaved(false);
    setSubmitError(null);

    const hasEmptyRequired = addresses.some(
      (a) => !a.label || !a.recipient || !a.line1 || !a.city || !a.country
    );
    if (!profile.name || !profile.email || !profile.phone1 || hasEmptyRequired) {
      setSubmitError('Please correct the highlighted fields and try again.');
      return;
    }

    const request: UpdateProfileRequest = {
      fullName: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone1.trim(),
      backupPhone: profile.phone2.trim() || undefined,
      addresses: addresses.map((address) => ({
        label: address.label.trim(),
        recipient: address.recipient.trim(),
        line1: address.line1.trim(),
        line2: address.line2?.trim() || undefined,
        city: address.city.trim(),
        region: address.region.trim() || undefined,
        postalCode: address.postalCode.trim() || undefined,
        country: address.country.trim(),
      })),
    };

    setSubmitting(true);
    try {
      await authService.updateProfile(request);
      setSaved(true);
      toastService.show('Your profile has been updated.', 'success');
    } catch (error: any) {
      const message = error?.error?.message ?? 'We could not update your profile. Please try again.';
      setSubmitError(message);
      toastService.show(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const hasError = (controlName: 'name' | 'email' | 'phone1', error: string) => {
    const value = profile[controlName];
    if (error === 'required') return !value;
    if (error === 'minlength') return value.length < 2;
    if (error === 'email') return !value.includes('@');
    if (error === 'pattern') return !/^\+?[0-9][0-9\s()-]{6,19}$/.test(value);
    return false;
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-24 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-600">Your account</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Keep your contact and delivery details ready for a faster checkout.</p>
          </div>
          <Link to="/settings" className="text-sm font-medium text-primary-600 hover:text-primary-700">Account settings →</Link>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Full name <span className="text-red-600">*</span></span>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  autoComplete="name"
                  aria-describedby="name-error"
                  aria-invalid={hasError('name', 'required') || hasError('name', 'minlength')}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                {(hasError('name', 'required') || hasError('name', 'minlength')) && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">Enter your full name (at least 2 characters).</p>
                )}
              </label>
              <label className="block sm:col-span-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Email address <span className="text-red-600">*</span></span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  autoComplete="email"
                  aria-describedby="email-error"
                  aria-invalid={hasError('email', 'required') || hasError('email', 'email')}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                {(hasError('email', 'required') || hasError('email', 'email')) && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">Enter a valid email address.</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Primary phone <span className="text-red-600">*</span></span>
                <input
                  type="tel"
                  value={profile.phone1}
                  onChange={(e) => setProfile({ ...profile, phone1: e.target.value })}
                  autoComplete="tel"
                  placeholder="+20 10 0000 0000"
                  aria-describedby="phone-error"
                  aria-invalid={hasError('phone1', 'required') || hasError('phone1', 'pattern')}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                {(hasError('phone1', 'required') || hasError('phone1', 'pattern')) && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">Enter a valid phone number.</p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Backup phone <span className="font-normal text-gray-500">(optional)</span></span>
                <input
                  type="tel"
                  value={profile.phone2}
                  onChange={(e) => setProfile({ ...profile, phone2: e.target.value })}
                  autoComplete="tel"
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved addresses</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use a clear label so you can choose an address quickly at checkout.</p>
              </div>
              <button type="button" onClick={() => addAddress()} className="rounded-lg border border-primary-600 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700">
                Add address
              </button>
            </div>
            <div className="mt-5 space-y-5">
              {addresses.map((address, index) => (
                <fieldset key={index} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-4 flex justify-between">
                    <legend className="font-medium text-gray-900 dark:text-white">Address {index + 1}</legend>
                    {addresses.length > 1 && (
                      <button type="button" onClick={() => removeAddress(index)} className="text-sm text-red-600 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Label</span>
                      <input
                        value={address.label}
                        onChange={(e) => updateAddress(index, 'label', e.target.value)}
                        placeholder="Home, Work"
                        className="field"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Recipient</span>
                      <input
                        value={address.recipient}
                        onChange={(e) => updateAddress(index, 'recipient', e.target.value)}
                        autoComplete="shipping name"
                        className="field"
                      />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Address line 1</span>
                      <input
                        value={address.line1}
                        onChange={(e) => updateAddress(index, 'line1', e.target.value)}
                        autoComplete="shipping address-line1"
                        className="field"
                      />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Address line 2 (optional)</span>
                      <input
                        value={address.line2 || ''}
                        onChange={(e) => updateAddress(index, 'line2', e.target.value)}
                        autoComplete="shipping address-line2"
                        className="field"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">City</span>
                      <input
                        value={address.city}
                        onChange={(e) => updateAddress(index, 'city', e.target.value)}
                        autoComplete="shipping address-level2"
                        className="field"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Region / State</span>
                      <input
                        value={address.region}
                        onChange={(e) => updateAddress(index, 'region', e.target.value)}
                        autoComplete="shipping address-level1"
                        className="field"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Postal code</span>
                      <input
                        value={address.postalCode}
                        onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                        autoComplete="shipping postal-code"
                        className="field"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Country</span>
                      <input
                        value={address.country}
                        onChange={(e) => updateAddress(index, 'country', e.target.value)}
                        autoComplete="shipping country-name"
                        className="field"
                      />
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-4" aria-live="polite">
            <p className={`text-sm ${submitError ? 'text-red-600' : 'text-green-600'} ${!submitError && !saved ? 'invisible' : ''}`}>
              {submitError || 'Profile updated successfully.'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
