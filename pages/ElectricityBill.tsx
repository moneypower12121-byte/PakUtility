
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';
import { ELECTRICITY_COMPANIES, DISCLAIMER_TEXT } from '../constants';

const ElectricityBill: React.FC = () => {
  const [units, setUnits] = useState<number>(0);
  const [meterType, setMeterType] = useState('Domestic');
  const [company, setCompany] = useState('LESCO');
  const [result, setResult] = useState<any | null>(null);

  const calculateBill = () => {
    // Slab-based calculation for domestic
    let costOfElectricity = 0;
    
    if (meterType === 'Commercial') {
      costOfElectricity = units * 45; // Flat rate for commercial
    } else {
      // Domestic slab-wise calculation
      let remainingUnits = units;
      
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 100);
        costOfElectricity += unitsInSlab * 16;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 100);
        costOfElectricity += unitsInSlab * 22;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 100);
        costOfElectricity += unitsInSlab * 30;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 400);
        costOfElectricity += unitsInSlab * 40;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        costOfElectricity += remainingUnits * 50;
      }
    }

    const taxes = costOfElectricity * 0.17; // GST 17%
    const total = costOfElectricity + taxes;

    setResult({
      cost: costOfElectricity.toFixed(2),
      taxes: taxes.toFixed(2),
      total: total.toFixed(2)
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Electricity Bill Estimator (Pakistan)</h1>
      <p className="text-gray-600 mb-8">Calculate your estimated monthly bill for LESCO, IESCO, KE, and other DISCOs.</p>

      <AdPlaceholder slot="above-calc" />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Units Consumed</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Electricity Company</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              {ELECTRICITY_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meter Type</label>
            <div className="flex space-x-4">
              {['Domestic', 'Commercial'].map(type => (
                <button 
                  key={type}
                  onClick={() => setMeterType(type)}
                  className={`flex-1 py-3 rounded-lg font-bold border ${meterType === type ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={calculateBill}
          className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition shadow-lg"
        >
          Calculate Estimated Bill
        </button>

        {result && (
          <div className="mt-8 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Bill Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Energy Cost ({units} units - Slab Based)</span>
                <span className="font-bold">Rs. {result.cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST & Surcharges (17%)</span>
                <span className="font-bold text-red-600">Rs. {result.taxes}</span>
              </div>
              <div className="pt-3 border-t border-emerald-200 flex justify-between text-xl font-extrabold text-emerald-900">
                <span>Total Estimated Bill</span>
                <span>Rs. {result.total}</span>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500 italic text-center">
          {DISCLAIMER_TEXT} Prices vary based on fuel adjustment charges.
        </p>
      </div>

      <AdPlaceholder slot="below-results" />
    </div>
  );
};

export default ElectricityBill;
