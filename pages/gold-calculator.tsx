
import React, { useState } from 'react';
import Head from 'next/head';
import AdPlaceholder from '../components/AdPlaceholder';

const GoldCalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(0);
  const [rate, setRate] = useState<number>(240000); // Default per tola rate
  const [karat, setKarat] = useState<number>(24);
  const [result, setResult] = useState<any | null>(null);

  const calculateGoldValue = () => {
    const totalValue = (weight * rate * (karat / 24));
    setResult({
      weight,
      rate,
      karat,
      totalValue: totalValue.toFixed(0)
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Gold Price Calculator Pakistan | Live Tola & Gram Rates | PakUtility</title>
        <meta name="description" content="Calculate gold prices in Pakistan for 24K, 22K, 21K, and 18K gold. Convert tola to grams and find the current market value of your gold jewelry." />
      </Head>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gold Price Calculator Pakistan</h1>
      <p className="text-gray-600 mb-8">Calculate the value of your gold based on current market rates per tola.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight in Tola</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              placeholder="e.g. 1.5"
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Rate per Tola (PKR)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gold Purity (Karat)</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              onChange={(e) => setKarat(Number(e.target.value))}
              defaultValue={24}
            >
              <option value={24}>24K (Pure Gold)</option>
              <option value={22}>22K (Jewelry Gold)</option>
              <option value={21}>21K</option>
              <option value={18}>18K</option>
            </select>
          </div>
        </div>

        <button 
          onClick={calculateGoldValue}
          className="w-full bg-yellow-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-yellow-700 transition shadow-lg"
        >
          Calculate Gold Value
        </button>

        {result && (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center">
            <p className="text-yellow-700 text-sm uppercase font-bold mb-1">Estimated Market Value</p>
            <p className="text-4xl font-extrabold text-yellow-900">
              Rs. {Number(result.totalValue).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-yellow-600 italic">
              *Based on {result.weight} tola of {result.karat}K gold at Rs. {result.rate.toLocaleString()}/tola.
            </p>
          </div>
        )}
      </div>

      <AdPlaceholder slot="gold-bottom" />
    </div>
  );
};

export default GoldCalculator;
