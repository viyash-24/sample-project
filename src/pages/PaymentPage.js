import React, { useState } from 'react';

const tabs = [
  { key: 'upi', label: 'UPI' },
  { key: 'card', label: 'Card' },
  { key: 'wallet', label: 'Wallet' },
];

const PaymentPage = () => {
  const [method, setMethod] = useState('upi');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Complete your payment</h1>
      <p className="text-gray-600 mt-1">Secure checkout with instant receipt.</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex gap-2 border-b mb-6">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${method===t.key? 'border-primary text-primary': 'border-transparent text-gray-600 hover:text-gray-900'}`}
                onClick={()=>setMethod(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {method === 'upi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                <input className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" placeholder="yourname@bank" />
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-primary hover:bg-primary-dark text-white">Pay via UPI</button>
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card number</label>
                <input className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" placeholder="xxxx xxxx xxxx xxxx" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry</label>
                  <input className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary" placeholder="***" />
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-primary hover:bg-primary-dark text-white">Pay by Card</button>
            </div>
          )}

          {method === 'wallet' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select wallet</label>
                <select className="mt-1 w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary">
                  <option>Paytm</option>
                  <option>PhonePe</option>
                  <option>Amazon Pay</option>
                </select>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-primary hover:bg-primary-dark text-white">Pay with Wallet</button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900">Order summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Parking area</span><span>Downtown Parking</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Duration</span><span>2h 30m</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Rate</span><span>₹ 50 / hour</span></div>
            <div className="border-t pt-3 flex justify-between font-medium"><span>Total</span><span>₹ 125</span></div>
          </div>
          <p className="text-xs text-gray-500 mt-3">A digital receipt will be sent to your email once the payment is complete.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
