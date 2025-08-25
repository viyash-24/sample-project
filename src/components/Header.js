import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navLinkClass = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`;

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">SP</span>
            <span className="text-lg font-semibold text-gray-800">Smart Parking</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>Parking</NavLink>
            <NavLink to="/payment" className={navLinkClass}>Payment</NavLink>
            {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">Log in</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md">Sign up</Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">{user.email}</div>
                <button onClick={logout} className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">Logout</button>
              </div>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none" aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-4 py-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Parking</NavLink>
            <NavLink to="/payment" className={navLinkClass} onClick={() => setOpen(false)}>Payment</NavLink>
            {isAdmin && <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Admin</NavLink>}
            <div className="pt-2">
              {!user ? (
                <>
                  <Link to="/login" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary" onClick={() => setOpen(false)}>Log in</Link>
                  <Link to="/register" className="block mt-1 px-3 py-2 text-sm font-medium text-white bg-primary rounded-md" onClick={() => setOpen(false)}>Sign up</Link>
                </>
              ) : (
                <button onClick={() => { logout(); setOpen(false); }} className="w-full mt-1 px-3 py-2 text-sm font-medium border rounded-md">Logout</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
