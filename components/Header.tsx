
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-700 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center space-x-2" aria-label="Pak Utility Tools Home">
          <img src={require('../Logo.png')} alt="Pak Utility Tools Logo" className="w-10 h-10 rounded shadow bg-white object-contain" />
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
