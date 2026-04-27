
import React, { useState } from 'react';
import Head from 'next/head';
import AdPlaceholder from '../components/AdPlaceholder';

const LoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [years, setYears] = useState<number>(0);
  const [result, setResult] = useState<any | null>(null);

  const calculateEMI = () => {
    if (!amount || !rate || !years) {
      alert('Please enter all fields');
      return;
    }
    const monthlyRate = rate / 12 / 100;
    const n = years * 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - amount;

    setResult({
      emi: emi.toFixed(0),
      totalPayable: totalPayable.toFixed(0),
      totalInterest: totalInterest.toFixed(0)
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Loan EMI Calculator Pakistan | Personal, Home & Car Loan | PakUtility</title>
        <meta name="description" content="Calculate your monthly loan installments (EMI) for bank loans in Pakistan. Works for personal, home, and car loans with decreasing balance interest rates." />
      </Head>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Loan EMI Calculator</h1>
      <p className="text-gray-600 mb-8">Estimate your monthly bank installments and total interest payable.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Amount (PKR)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 1000000"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (% per year)</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 15.5"
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Tenure (Years)</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 5"
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={calculateEMI}
          className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg"
        >
          Calculate EMI
        </button>

        {result && (
          <div className="mt-8 space-y-4">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <p className="text-blue-700 text-sm uppercase font-bold mb-1">Monthly EMI</p>
              <p className="text-4xl font-extrabold text-blue-900">
                Rs. {Number(result.emi).toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Total Interest</p>
                  <p className="text-xl font-bold text-rose-600">Rs. {Number(result.totalInterest).toLocaleString()}</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Total Payment</p>
                  <p className="text-xl font-bold text-gray-800">Rs. {Number(result.totalPayable).toLocaleString()}</p>
               </div>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="loan-bottom" />
    </div>
  );
};

export default LoanCalculator;
