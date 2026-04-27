
import React, { useState } from 'react';
import Head from 'next/head';
import AdPlaceholder from '../components/AdPlaceholder';

const ZakatCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    cash: 0,
    gold: 0,
    silver: 0,
    business: 0,
    liabilities: 0
  });
  const [nisab, setNisab] = useState(180000); // Current estimated Nisab in PKR (52.5 tola silver)
  const [result, setResult] = useState<number | null>(null);

  const calculateZakat = () => {
    const totalAssets = inputs.cash + inputs.gold + inputs.silver + inputs.business;
    const netAssets = totalAssets - inputs.liabilities;

    if (netAssets >= nisab) {
      setResult(netAssets * 0.025);
    } else {
      setResult(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Zakat Calculator Pakistan | Online Shariah Compliant | PakUtility</title>
        <meta name="description" content="Calculate your Zakat accurately based on Shariah principles (2.5% rate) with our online Zakat Calculator for Pakistan. Updated Nisab values included." />
      </Head>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Zakat Calculator Pakistan</h1>
      <p className="text-gray-600 mb-8">Calculate your Zakat accurately based on Shariah principles (2.5% rate).</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cash at Home/Bank (PKR)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onChange={(e) => setInputs({...inputs, cash: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Value of Gold (PKR)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onChange={(e) => setInputs({...inputs, gold: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Assets (PKR)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onChange={(e) => setInputs({...inputs, business: Number(e.target.value)})}
            />
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Liabilities/Debts (PKR)</label>
             <input 
               type="number" 
               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
               onChange={(e) => setInputs({...inputs, liabilities: Number(e.target.value)})}
             />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-emerald-600 mb-1 uppercase tracking-tight">Silver Nisab Value (PKR)</label>
            <input 
              type="number" 
              className="w-full border border-emerald-200 bg-emerald-50 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={nisab}
              onChange={(e) => setNisab(Number(e.target.value))}
            />
            <p className="text-[10px] text-gray-500 mt-1">Adjust this based on current market rates of 52.5 tolas of silver.</p>
          </div>
        </div>

        <button 
          onClick={calculateZakat}
          className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition"
        >
          Calculate Zakat
        </button>

        {result !== null && (
          <div className="mt-8 p-6 bg-emerald-900 text-white rounded-2xl text-center shadow-inner">
            <p className="text-emerald-300 text-sm uppercase font-bold mb-1">Total Zakat Payable</p>
            <p className="text-4xl font-extrabold tracking-tighter">
              Rs. {result.toLocaleString()}
            </p>
            {result === 0 && <p className="mt-2 text-sm">You are below the Nisab threshold. No Zakat is due.</p>}
          </div>
        )}
      </div>

      <AdPlaceholder slot="zakat-bottom" />
    </div>
  );
};

export default ZakatCalculator;
