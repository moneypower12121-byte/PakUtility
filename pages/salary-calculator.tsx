
import React, { useState } from 'react';
import Head from 'next/head';
import AdPlaceholder from '../components/AdPlaceholder';
import { SALARY_TAX_SLABS_2024, DISCLAIMER_TEXT } from '../constants';

const SalaryCalculator: React.FC = () => {
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [result, setResult] = useState<any | null>(null);

  const calculateTax = () => {
    const annualSalary = monthlySalary * 12;
    let slab = SALARY_TAX_SLABS_2024.find(s => annualSalary >= s.min && (s.max === null || annualSalary <= s.max));
    
    if (!slab) slab = SALARY_TAX_SLABS_2024[0];

    let annualTax = 0;
    if (annualSalary > slab.min) {
      const taxableAmount = annualSalary - slab.min;
      annualTax = slab.baseTax + (taxableAmount * (slab.percentage / 100));
    } else {
      annualTax = slab.baseTax;
    }
    
    const monthlyTax = annualTax / 12;
    const monthlyTakeHome = monthlySalary - monthlyTax;

    setResult({
      annualSalary,
      annualTax: annualTax.toFixed(2),
      monthlyTax: monthlyTax.toFixed(2),
      monthlyTakeHome: monthlyTakeHome.toFixed(2),
      percentage: slab.percentage
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Pakistan Salary Tax Calculator 2025 | PakUtility</title>
        <meta name="description" content="Calculate your monthly and annual take-home salary after FBR tax deductions according to the latest 2024-2025 budget in Pakistan. Fast & accurate." />
      </Head>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pakistan Salary Tax Calculator 2025</h1>
      <p className="text-gray-600 mb-8">Updated income tax estimator for Tax Year 2024-2025 in Pakistan.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Gross Salary (PKR)</label>
          <input 
            type="number" 
            className="w-full border border-gray-300 rounded-lg px-4 py-4 text-xl font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. 100000"
            value={monthlySalary || ''}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
          />
        </div>

        <button 
          onClick={calculateTax}
          className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition shadow-lg"
        >
          Calculate Tax
        </button>

        {result && (
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Monthly Tax</p>
                  <p className="text-2xl font-bold text-red-600">Rs. {result.monthlyTax}</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Annual Tax</p>
                  <p className="text-2xl font-bold text-red-600">Rs. {result.annualTax}</p>
               </div>
               <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                  <p className="text-xs text-emerald-600 uppercase font-bold">Take Home</p>
                  <p className="text-2xl font-bold text-emerald-800">Rs. {result.monthlyTakeHome}</p>
               </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              Your salary falls into the <strong>{result.percentage}%</strong> tax slab. 
              {monthlySalary <= 50000 && " Good news! Monthly salaries up to 50,000 are tax-free."}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 italic">
          <strong>Note:</strong> These figures are based on standard salaried individual slabs for 2024-2025. Non-salary income or additional deductible allowances are not considered. {DISCLAIMER_TEXT}
        </div>
      </div>
      
      <AdPlaceholder slot="tax-bottom" />
    </div>
  );
};

export default SalaryCalculator;
