import React, { useMemo, useState } from 'react';

const RAW_AREAS = [
  {
    id: 1,
    name: 'Downtown Parking',
    location: '123 Main St, Cityville',
    distanceKm: 0.8,
    freeSlots: 12,
    totalSlots: 60,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Uptown Garage',
    location: '456 Oak Ave, Townsville',
    distanceKm: 2.1,
    freeSlots: 5,
    totalSlots: 30,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Central Mall Lot',
    location: '22 Center Rd, Villagetown',
    distanceKm: 1.4,
    freeSlots: 24,
    totalSlots: 100,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Riverfront Parking',
    location: '85 Riverside, Cityville',
    distanceKm: 3.6,
    freeSlots: 9,
    totalSlots: 40,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1600&auto=format&fit=crop'
  },
];

const DashboardPage = () => {
  const [q, setQ] = useState('');
  const [minFree, setMinFree] = useState(0);
  const [sort, setSort] = useState('distance');

  const areas = useMemo(() => {
    let list = RAW_AREAS.filter(a => a.name.toLowerCase().includes(q.toLowerCase()) || a.location.toLowerCase().includes(q.toLowerCase()));
    list = list.filter(a => a.freeSlots >= Number(minFree || 0));
    if (sort === 'distance') list.sort((a,b)=>a.distanceKm-b.distanceKm);
    if (sort === 'free') list.sort((a,b)=>b.freeSlots-a.freeSlots);
    return list;
  }, [q, minFree, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Parking</h1>
          <p className="text-gray-600">See nearby areas with real-time slot availability.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or location" className="w-64 rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
          <input type="number" min="0" value={minFree} onChange={e=>setMinFree(e.target.value)} placeholder="Min free slots" className="w-36 rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
          <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary">
            <option value="distance">Sort: Nearest</option>
            <option value="free">Sort: Most free</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area.id} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
            <div className="relative h-44">
              <img src={area.image} alt={area.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-md shadow">
                {area.distanceKm} km away
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
                <div className="text-sm">
                  <span className="font-semibold text-green-600">{area.freeSlots}</span>
                  <span className="text-gray-500"> / {area.totalSlots} free</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{area.location}</p>
              <div className="mt-4 flex gap-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area.location)}`} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                  Navigate
                </a>
                <a href="/payment" className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md bg-primary hover:bg-primary-dark text-white text-sm">
                  Pay
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
