import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { sendEmailReceipt, sendSmsReceipt } from '../services/notifications';

const TabButton = ({active, onClick, children}) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>{children}</button>
);

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('vehicles'); // vehicles | users | slots | payments
  const [q, setQ] = useState('');

  // collections state
  const [vehicles, setVehicles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [slots, setSlots] = useState([]);
  const [payments, setPayments] = useState([]);

  // forms
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });
  const [newVehicle, setNewVehicle] = useState({ plate: '', userEmail: '', slot: '' });

  // subscribe to Firestore
  useEffect(() => {
    const unsubV = onSnapshot(query(collection(db, 'vehicles'), orderBy('createdAt', 'desc')), (snap) => {
      setVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubU = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), (snap) => {
      setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubS = onSnapshot(collection(db, 'slots'), (snap) => {
      setSlots(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubP = onSnapshot(query(collection(db, 'payments'), orderBy('time', 'desc')), (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubV(); unsubU(); unsubS(); unsubP(); };
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => [v.userEmail, v.plate, v.slot, v.status, v.userPhone, v.userName].join(' ').toLowerCase().includes(q.toLowerCase()));
  }, [vehicles, q]);

  // actions
  const createUser = async (e) => {
    e.preventDefault();
    if (!newUser.email) return;
    await addDoc(collection(db, 'users'), {
      ...newUser,
      createdAt: serverTimestamp(),
    });
    setNewUser({ name: '', email: '', phone: '' });
  };

  const createVehicle = async (e) => {
    e.preventDefault();
    if (!newVehicle.plate || !newVehicle.userEmail) return;
    await addDoc(collection(db, 'vehicles'), {
      plate: newVehicle.plate.toUpperCase(),
      userEmail: newVehicle.userEmail.toLowerCase(),
      slot: newVehicle.slot || null,
      status: 'Parked',
      paymentStatus: 'Unpaid',
      entryTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      createdBy: user?.email || null,
    });
    // decrease free slot if provided
    if (newVehicle.slot) {
      const slotDoc = slots.find(s => s.name === newVehicle.slot);
      if (slotDoc) await updateDoc(doc(db, 'slots', slotDoc.id), { free: increment(-1) });
    }
    setNewVehicle({ plate: '', userEmail: '', slot: '' });
  };

  const markPaid = async (v) => {
    const amount = v.amount || 50; // demo rate or compute based on duration
    const payRef = await addDoc(collection(db, 'payments'), {
      vehicleId: v.id,
      userEmail: v.userEmail,
      amount,
      method: 'Manual',
      status: 'Success',
      time: serverTimestamp(),
      receiptId: Math.random().toString(36).slice(2,8).toUpperCase(),
    });
    await updateDoc(doc(db, 'vehicles', v.id), { paymentStatus: 'Paid', status: 'Paid' });

    // send receipt (stub)
    sendEmailReceipt({ to: v.userEmail, amount, receiptId: payRef.id }).catch(()=>{});
    if (v.userPhone) sendSmsReceipt({ to: v.userPhone, amount, receiptId: payRef.id }).catch(()=>{});
  };

  const exitVehicle = async (v) => {
    await updateDoc(doc(db, 'vehicles', v.id), { status: 'Exited', exitTime: serverTimestamp() });
    // free up slot
    if (v.slot) {
      const slotDoc = slots.find(s => s.name === v.slot);
      if (slotDoc) await updateDoc(doc(db, 'slots', slotDoc.id), { free: increment(1) });
    }
  };

  const updateSlot = async (s, next) => {
    await updateDoc(doc(db, 'slots', s.id), { total: Number(next.total), free: Number(next.free) });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, vehicles, slots, and payments.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark" onClick={()=>setTab('vehicles')}>New Vehicle</button>
          <button className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50" onClick={()=>setTab('users')}>New User</button>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-2xl shadow-sm">
        <div className="flex gap-2 border-b px-4 pt-4 overflow-x-auto">
          <TabButton active={tab==='vehicles'} onClick={()=>setTab('vehicles')}>Vehicles</TabButton>
          <TabButton active={tab==='users'} onClick={()=>setTab('users')}>Users</TabButton>
          <TabButton active={tab==='slots'} onClick={()=>setTab('slots')}>Slots</TabButton>
          <TabButton active={tab==='payments'} onClick={()=>setTab('payments')}>Payments</TabButton>
        </div>

        {tab==='vehicles' && (
          <div className="p-4">
            <form onSubmit={createVehicle} className="grid sm:grid-cols-4 gap-3">
              <input placeholder="Plate (e.g. TN-09-AB-1234)" value={newVehicle.plate} onChange={e=>setNewVehicle(v=>({...v, plate:e.target.value}))} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <input placeholder="User email" value={newVehicle.userEmail} onChange={e=>setNewVehicle(v=>({...v, userEmail:e.target.value}))} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <input placeholder="Slot (optional)" value={newVehicle.slot} onChange={e=>setNewVehicle(v=>({...v, slot:e.target.value}))} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <button className="px-4 py-2 rounded-md bg-gray-900 text-white">Add Vehicle</button>
            </form>

            <div className="mt-4 flex items-center justify-between gap-3">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search vehicles, users, status..." className="w-72 rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <div className="text-sm text-gray-600">Total: {filteredVehicles.length}</div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-3 pr-4">Plate</th>
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4 text-center">Slot</th>
                    <th className="py-3 pr-4 text-center">Status</th>
                    <th className="py-3 pr-4 text-center">Payment</th>
                    <th className="py-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map(v => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-4 whitespace-nowrap">{v.plate}</td>
                      <td className="py-3 pr-4">{v.userEmail}</td>
                      <td className="py-3 pr-4 text-center">{v.slot || '-'}</td>
                      <td className="py-3 pr-4 text-center"><span className={`px-2 py-1 rounded-full text-xs ${v.status==='Parked'?'bg-yellow-100 text-yellow-800': v.status==='Paid'?'bg-green-100 text-green-700': v.status==='Exited'?'bg-gray-100 text-gray-700':'bg-blue-100 text-blue-700'}`}>{v.status || '-'}</span></td>
                      <td className="py-3 pr-4 text-center">{v.paymentStatus || 'Unpaid'}</td>
                      <td className="py-3 pr-4 text-right">
                        <div className="inline-flex gap-2">
                          {v.paymentStatus !== 'Paid' && <button className="px-2 py-1 rounded-md border text-xs" onClick={()=>markPaid(v)}>Mark Paid</button>}
                          {v.status !== 'Exited' && <button className="px-2 py-1 rounded-md bg-gray-900 text-white text-xs" onClick={()=>exitVehicle(v)}>Exit</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='users' && (
          <div className="p-4">
            <form onSubmit={createUser} className="grid sm:grid-cols-4 gap-3">
              <input placeholder="Name" value={newUser.name} onChange={e=>setNewUser(u=>({...u, name:e.target.value}))} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <input placeholder="Email" value={newUser.email} onChange={e=>setNewUser(u=>({...u, email:e.target.value}))} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <input placeholder="Phone" value={newUser.phone} onChange={e=>setNewUser(u=>({...u, phone:e.target.value}))} className="rounded-md border-gray-300 focus:border-primary focus:ring-primary" />
              <button className="px-4 py-2 rounded-md bg-gray-900 text-white">Add User</button>
            </form>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-4 whitespace-nowrap">{u.name || '-'}</td>
                      <td className="py-3 pr-4">{u.email}</td>
                      <td className="py-3 pr-4">{u.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==='slots' && (
          <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map(s => (
              <div key={s.id} className="p-5 border rounded-xl bg-white shadow-sm">
                <div className="text-sm text-gray-500">{s.area || s.name || 'Area'}</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{s.free ?? 0} / {s.total ?? 0} free</div>
                <div className="mt-3 h-2 bg-gray-100 rounded">
                  <div className="h-2 bg-green-500 rounded" style={{width: `${(Math.max(0, Math.min(1,(s.free||0)/(s.total||1))))*100}%`}} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <input type="number" min="0" defaultValue={s.total ?? 0} onBlur={(e)=>updateSlot(s, { total: e.target.value, free: s.free ?? 0 })} className="rounded-md border-gray-300 text-sm" />
                  <input type="number" min="0" defaultValue={s.free ?? 0} onBlur={(e)=>updateSlot(s, { total: s.total ?? 0, free: e.target.value })} className="rounded-md border-gray-300 text-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='payments' && (
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 pr-4">Receipt</th>
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Method</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 pr-4">{p.receiptId || p.id}</td>
                    <td className="py-3 pr-4">{p.userEmail}</td>
                    <td className="py-3 pr-4">₹ {p.amount}</td>
                    <td className="py-3 pr-4">{p.method}</td>
                    <td className="py-3 pr-4"><span className={`px-2 py-1 rounded-full text-xs ${p.status==='Success'?'bg-green-100 text-green-700': p.status==='Offline'?'bg-gray-100 text-gray-700':'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                    <td className="py-3 pr-4">{p.time && p.time.toDate ? p.time.toDate().toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
