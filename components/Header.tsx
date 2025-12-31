
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center space-x-2" aria-label="Pak Utility Tools Home">
          <span className="inline-block">
            {/* Modern SVG Logo */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="32" height="32" rx="8" fill="#059669"/>
              <path d="M11 25V11h4.5c2.5 0 4 1.2 4 3.2 0 1.2-.7 2.2-1.8 2.7v.1c1.6.4 2.8 1.5 2.8 3.2C20.5 23 18.7 25 15.7 25H11zm3.7-8.2c1.3 0 2-.6 2-1.7 0-1.1-.7-1.7-2-1.7H13.5v3.4h1.2zm.3 6.1c1.5 0 2.3-.7 2.3-2 0-1.3-.8-2-2.3-2h-1.5v4h1.5z" fill="#fff"/>
              <circle cx="27" cy="9" r="3" fill="#34D399" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </span>
          <span className="text-2xl font-bold tracking-tight ml-2">PakUtility<span className="text-emerald-200">Tools</span></span>
        </Link>
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="hover:text-emerald-200 transition">Home</Link>
          <Link to="/electricity-bill-calculator-pakistan" className="hover:text-emerald-200 transition">Bills</Link>
          <Link to="/salary-tax-calculator-pakistan" className="hover:text-emerald-200 transition">Tax</Link>
          <Link to="/zakat-calculator-pakistan" className="hover:text-emerald-200 transition">Islamic</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <button className="bg-white text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-50 transition">
            Explore Tools
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
