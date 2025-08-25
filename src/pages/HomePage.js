import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Live Availability', desc: 'See real-time free slots across nearby parking areas.' },
  { title: 'Secure Payments', desc: 'Pay online via UPI, cards, and wallets with instant receipts.' },
  { title: 'Admin Controls', desc: 'Manage vehicles, slots, and payments from a powerful dashboard.' },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Park smarter in busy cities
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Find nearby parking, view live slot availability, and pay seamlessly. All in one place.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard" className="px-6 py-3 rounded-md text-white bg-primary hover:bg-primary-dark font-medium text-center">
                  Find Parking
                </Link>
                <Link to="/register" className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-center">
                  Create Account
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-gray-500 text-sm">Parking Areas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2k+</div>
                  <div className="text-gray-500 text-sm">Daily Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-gray-500 text-sm">Uptime</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img className="rounded-xl shadow-2xl w-full object-cover h-80" src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600&auto=format&fit=crop" alt="Parking" />
              <div className="absolute -bottom-6 -left-6 bg-white/90 border shadow rounded-xl p-4 w-64 hidden sm:block">
                <div className="text-sm font-semibold text-gray-800">Live Slots</div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-600">Downtown Garage</span>
                  <span className="font-semibold text-green-600">12 free</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-600">Central Mall</span>
                  <span className="font-semibold text-green-600">8 free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Everything you need to park with ease</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <div className="h-10 w-10 rounded-md bg-blue-100 text-primary flex items-center justify-center font-bold">✓</div>
                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
