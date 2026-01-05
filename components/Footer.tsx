
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">PakUtility</h3>
          <p className="text-sm leading-relaxed mb-4">
            Smart online utility calculators and estimators for Pakistan. We make complex calculations simple.
          </p>
          <div className="flex space-x-4">
             {/* Simple placeholders for social */}
             <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-emerald-600">FB</span>
             <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-emerald-600">TW</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Top Tools</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/electricity-bill-calculator-pakistan" className="hover:text-emerald-400">Electricity Estimator</Link></li>
            <li><Link to="/salary-tax-calculator-pakistan" className="hover:text-emerald-400">Salary Tax Calc</Link></li>
            <li><Link to="/zakat-calculator-pakistan" className="hover:text-emerald-400">Zakat Calculator</Link></li>
            <li><Link to="/cnic-format-checker" className="hover:text-emerald-400">CNIC Validator</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about-us" className="hover:text-emerald-400">About Us</Link></li>
            <li><Link to="/contact-us" className="hover:text-emerald-400">Contact Us</Link></li>
            <li><Link to="/disclaimer" className="hover:text-emerald-400">Disclaimer</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-emerald-400">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Search</h4>
          <div className="flex">
            <input type="text" placeholder="Find a tool..." className="bg-gray-800 border-none rounded-l px-3 py-2 text-sm w-full focus:ring-1 focus:ring-emerald-500" />
            <button className="bg-emerald-600 px-3 rounded-r hover:bg-emerald-500">🔍</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
        <p>© {new Date().getFullYear()} PakUtility.xyz - All Rights Reserved.</p>
        <p className="mt-2 text-gray-500 italic">Not affiliated with any government department.</p>
      </div>
    </footer>
  );
};

export default Footer;
