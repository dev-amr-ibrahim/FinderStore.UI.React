import { useState } from 'react';

export function Contact() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="bg-primary-50 dark:bg-gray-800 border-b border-primary-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm tracking-widest uppercase">Contact</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white">We are here to help.</h1>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">Send us a message and our team will get back to you as soon as possible.</p>
        </div>
      </section>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid lg:grid-cols-3 gap-10">
        <aside className="lg:col-span-1">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Contact details</h2>
          <div className="mt-6 space-y-6 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Customer support</h3>
              <a className="link" href="mailto:support@finder.example">support@finder.example</a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Response time</h3>
              <p>We aim to respond within 1–2 business days.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Order help</h3>
              <p>Please include your order number so we can help faster.</p>
            </div>
          </div>
        </aside>
        <section className="lg:col-span-2 card p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Thanks for reaching out.</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">This form is ready to connect to your support service. Until then, please email support@finder.example.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Send a message</h2>
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    First name
                    <input
                      className="input-field mt-2"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email address
                    <input
                      type="email"
                      className="input-field mt-2"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Order number <span className="text-gray-400">(optional)</span>
                  <input
                    className="input-field mt-2"
                    name="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  How can we help?
                  <textarea
                    className="input-field mt-2 min-h-32"
                    name="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
                <button type="submit" disabled={!message || !email || !firstName} className="btn-primary disabled:opacity-50">
                  Send message
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}
