
import React from 'react';
import Logo from '../Logo.png';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center" aria-label="PakUtility Home">
          <img src={Logo} alt="PakUtility Logo" className="w-12 h-12 rounded shadow bg-white object-contain" />
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
