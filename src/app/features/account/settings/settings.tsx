import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    orderUpdates: true,
    deliveryUpdates: true,
    promotions: false,
    emailReceipts: true,
    personalisedRecommendations: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('account-settings');
    if (savedSettings) {
      try {
        setSettingsForm(JSON.parse(savedSettings));
      } catch {
        localStorage.removeItem('account-settings');
      }
    }
  }, []);

  const save = () => {
    localStorage.setItem('account-settings', JSON.stringify(settingsForm));
    setSaved(true);
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettingsForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-24 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary-600">Your account</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Control how we contact you and how your account works.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose only messages that help you manage purchases and deliveries.</p>
              <div className="mt-5 space-y-4">
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={settingsForm.orderUpdates}
                    onChange={(e) => updateSetting('orderUpdates', e.target.checked)}
                  />
                  <span>
                    <b>Order updates</b>
                    <small>Confirmation, cancellations and refunds</small>
                  </span>
                </label>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={settingsForm.deliveryUpdates}
                    onChange={(e) => updateSetting('deliveryUpdates', e.target.checked)}
                  />
                  <span>
                    <b>Delivery updates</b>
                    <small>Shipping and delivery status changes</small>
                  </span>
                </label>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={settingsForm.emailReceipts}
                    onChange={(e) => updateSetting('emailReceipts', e.target.checked)}
                  />
                  <span>
                    <b>Email receipts</b>
                    <small>Keep a copy of your invoices by email</small>
                  </span>
                </label>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={settingsForm.promotions}
                    onChange={(e) => updateSetting('promotions', e.target.checked)}
                  />
                  <span>
                    <b>Offers and promotions</b>
                    <small>Optional deals and product launches</small>
                  </span>
                </label>
              </div>
            </section>
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h2>
              <label className="toggle-row mt-5">
                <input
                  type="checkbox"
                  checked={settingsForm.personalisedRecommendations}
                  onChange={(e) => updateSetting('personalisedRecommendations', e.target.checked)}
                />
                <span>
                  <b>Personalised recommendations</b>
                  <small>Use browsing and purchase activity to tailor products</small>
                </span>
              </label>
              <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">You can change this at any time. Core order and service messages remain enabled to keep your account secure.</p>
            </section>
            <div className="flex justify-end gap-4">
              <p className={`self-center text-sm text-green-600 ${saved ? '' : 'invisible'}`}>Settings saved on this device.</p>
              <button type="submit" className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                Save settings
              </button>
            </div>
          </form>
          <aside className="space-y-4">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Orders & returns</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your completed orders will appear here when order history is connected.</p>
              <Link to="/products" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">Continue shopping →</Link>
            </section>
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Security</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">For your protection, password and sign-in controls will be available here once the account API supports them.</p>
            </section>
            <Link to="/profile" className="block rounded-2xl border border-primary-200 bg-primary-50 p-5 text-sm font-medium text-primary-700 dark:border-primary-900 dark:bg-gray-800 dark:text-primary-300">
              Update contact details and addresses →
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
