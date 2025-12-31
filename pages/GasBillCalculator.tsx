
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';
import { DISCLAIMER_TEXT } from '../constants';

const GasBillCalculator: React.FC = () => {
  const [units, setUnits] = useState<number>(0);
  const [company, setCompany] = useState('SNGPL');
  const [meterType, setMeterType] = useState('Domestic');
  const [result, setResult] = useState<any | null>(null);

  const calculateBill = () => {
    if (units <= 0) {
      alert('Please enter valid gas units consumed');
      return;
    }

    let costOfGas = 0;
    
    if (meterType === 'Domestic') {
      // Domestic slab-wise calculation (SNGPL/SSGC rates approximate)
      let remainingUnits = units;
      
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 0.5); // 0-0.5 MMBTU
        costOfGas += unitsInSlab * 121;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 0.5); // 0.5-1 MMBTU
        costOfGas += unitsInSlab * 244;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 1); // 1-2 MMBTU
        costOfGas += unitsInSlab * 409;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        const unitsInSlab = Math.min(remainingUnits, 1); // 2-3 MMBTU
        costOfGas += unitsInSlab * 590;
        remainingUnits -= unitsInSlab;
      }
      if (remainingUnits > 0) {
        costOfGas += remainingUnits * 775; // Above 3 MMBTU
      }
    } else {
      // Commercial flat rate
      costOfGas = units * 1000;
    }

    const gst = costOfGas * 0.17; // 17% GST
    const meterRent = meterType === 'Domestic' ? 50 : 200;
    const total = costOfGas + gst + meterRent;

    setResult({
      cost: costOfGas.toFixed(2),
      gst: gst.toFixed(2),
      meterRent: meterRent.toFixed(2),
      total: total.toFixed(2)
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gas Bill Calculator (SNGPL / SSGC)</h1>
      <p className="text-gray-600 mb-8">Calculate your estimated monthly gas bill for SNGPL and SSGC connections in Pakistan.</p>
      
      <AdPlaceholder slot="above-tool" />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* How to Use Section */}
        <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            📖 How to Use This Gas Bill Calculator
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Check your gas meter reading (units consumed in MMBTU or HM3)</li>
            <li>Select your gas company (SNGPL for Punjab/KPK or SSGC for Sindh/Balochistan)</li>
            <li>Choose your meter type (Domestic or Commercial)</li>
            <li>Enter the <strong>units consumed</strong> from your gas meter</li>
            <li>Click <strong>"Calculate Bill"</strong> to see your estimated monthly bill</li>
          </ol>
          <div className="mt-3 p-3 bg-white rounded border border-blue-200">
            <p className="text-xs text-blue-700"><strong>💡 Tip:</strong> To find units consumed, subtract the previous month's meter reading from the current reading.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gas Units Consumed (MMBTU)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="e.g., 2.5"
              value={units || ''}
              onChange={(e) => setUnits(Number(e.target.value))}
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gas Company</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="SNGPL">SNGPL (Punjab, KPK)</option>
              <option value="SSGC">SSGC (Sindh, Balochistan)</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Meter Type</label>
          <div className="flex space-x-4">
            <button 
              onClick={() => setMeterType('Domestic')}
              className={`flex-1 py-3 rounded-lg font-bold border ${meterType === 'Domestic' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Domestic
            </button>
            <button 
              onClick={() => setMeterType('Commercial')}
              className={`flex-1 py-3 rounded-lg font-bold border ${meterType === 'Commercial' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Commercial
            </button>
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
                <span>Gas Cost ({units} MMBTU)</span>
                <span className="font-bold">Rs. {result.cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (17%)</span>
                <span className="font-bold text-red-600">Rs. {result.gst}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Meter Rent</span>
                <span className="font-bold">Rs. {result.meterRent}</span>
              </div>
              <div className="pt-3 border-t border-emerald-200 flex justify-between text-xl font-extrabold text-emerald-900">
                <span>Total Estimated Bill</span>
                <span>Rs. {result.total}</span>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500 italic text-center">
          {DISCLAIMER_TEXT} Actual bill may vary based on meter accuracy and additional surcharges.
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100">
           <button onClick={handleCopy} className="text-emerald-600 text-sm font-semibold flex items-center">
             <span>🔗 Share Tool Link</span>
           </button>
        </div>
      </div>

      <AdPlaceholder slot="below-tool" />

      <section className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100 prose prose-sm">
        <h2 className="text-xl font-bold mb-4">Gas Bill Slabs (Domestic - 2024-25)</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Consumption (MMBTU)</th>
                <th className="text-right py-2">Rate per MMBTU</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2">0 - 0.5</td><td className="text-right">Rs. 121</td></tr>
              <tr className="border-b"><td className="py-2">0.5 - 1</td><td className="text-right">Rs. 244</td></tr>
              <tr className="border-b"><td className="py-2">1 - 2</td><td className="text-right">Rs. 409</td></tr>
              <tr className="border-b"><td className="py-2">2 - 3</td><td className="text-right">Rs. 590</td></tr>
              <tr><td className="py-2">Above 3</td><td className="text-right">Rs. 775</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold mb-4 mt-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-emerald-800">How do I read my gas meter?</h3>
            <p>Your gas meter shows cumulative consumption. Note down the current reading and subtract last month's reading to find units consumed.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">What is MMBTU?</h3>
            <p>MMBTU (Million British Thermal Units) is the unit used to measure gas consumption in Pakistan. Some meters show HM3 (Hecta cubic meters), which is similar.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Why is my bill higher than estimated?</h3>
            <p>Bills may include arrears, late payment surcharges, meter reading adjustments, or minimum billing charges. Contact SNGPL/SSGC helpline for clarification.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">How can I reduce my gas bill?</h3>
            <p>Use gas heaters sparingly, fix leaky connections, insulate water heaters, and avoid keeping pilot flames burning unnecessarily.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GasBillCalculator;
