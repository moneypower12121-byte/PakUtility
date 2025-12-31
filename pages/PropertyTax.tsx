
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';

const PropertyTax: React.FC = () => {
  const [area, setArea] = useState(0);
  const [city, setCity] = useState('Lahore');
  const [type, setType] = useState('Residential');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    // Property tax is typically 5-20% of annual rental value
    // Using simplified estimation: residential approx 3-5 PKR/sqft, commercial 10-15 PKR/sqft
    let baseRate = type === 'Residential' ? 4 : 12; // Rate per sq ft annual
    
    // City-based multiplier
    let cityMultiplier = 1.0;
    if (city === 'Lahore' || city === 'Karachi') cityMultiplier = 1.3;
    else if (city === 'Islamabad') cityMultiplier = 1.5;
    else if (city === 'Rawalpindi') cityMultiplier = 1.1;
    
    const annualTax = area * baseRate * cityMultiplier;
    setResult(Math.round(annualTax));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Property Tax Estimator</h1>
      <p className="text-gray-600 mb-8">Estimate your annual property tax for urban areas in Pakistan.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Covered Area (Sq Ft)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={area || ''}
              onChange={(e) => setArea(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2" value={city} onChange={e => setCity(e.target.value)}>
              <option>Lahore</option>
              <option>Karachi</option>
              <option>Islamabad</option>
              <option>Rawalpindi</option>
              <option>Faisalabad</option>
              <option>Multan</option>
              <option>Peshawar</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
            <div className="flex space-x-4">
              {['Residential', 'Commercial'].map(t => (
                <button 
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-3 rounded-lg border font-bold ${type === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={calculate}
          className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition"
        >
          Estimate Annual Tax
        </button>

        {result !== null && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center">
             <p className="text-gray-500 text-xs uppercase font-bold">Estimated Annual Tax</p>
             <p className="text-3xl font-bold text-emerald-800">Rs. {result.toLocaleString()}</p>
             <p className="text-[10px] text-gray-400 mt-4 italic">Final tax is determined by excise & taxation departments based on rental value.</p>
          </div>
        )}
      </div>
      
      <AdPlaceholder slot="property-bottom" />
    </div>
  );
};

export default PropertyTax;
