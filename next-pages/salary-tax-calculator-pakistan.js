
import Head from 'next/head';
import React, { useState } from 'react';

// Simplified constants for the example, in a real app these would be imported
const SALARY_TAX_SLABS_2024 = [
  { min: 0, max: 600000, baseTax: 0, percentage: 0 },
  { min: 600001, max: 1200000, baseTax: 0, percentage: 5 },
  { min: 1200001, max: 2400000, baseTax: 30000, percentage: 15 },
  { min: 2400001, max: 3600000, baseTax: 210000, percentage: 25 },
  { min: 3600001, max: 6000000, baseTax: 510000, percentage: 30 },
  { min: 6000001, max: null, baseTax: 1230000, percentage: 35 }
];

export default function SalaryTaxCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [result, setResult] = useState(null);

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Head>
        <title>Salary Tax Calculator 2024-25 | PakUtility</title>
        <meta name="description" content="Calculate your monthly and annual income tax according to the latest FBR slabs for 2024-2025 in Pakistan. Easy to use Salary Tax Calculator." />
        <meta name="keywords" content="salary tax calculator, fbr tax slabs 2024, income tax pakistan, pakutility" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Salary Tax Calculator (FBR 2024-25)
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Use our professional tool to estimate your monthly take-home salary after tax deductions based on the latest budget for Tax Year 2024-2025.
        </p>

        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl mx-auto">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Monthly Gross Salary (PKR)
            </label>
            <input 
              type="number" 
              className="w-full border-2 border-emerald-100 rounded-2xl px-6 py-4 text-2xl font-bold text-emerald-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
              placeholder="e.g. 100,000"
              value={monthlySalary || ''}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
            />
          </div>

          <button 
            onClick={calculateTax}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-200"
          >
            Calculate Now
          </button>

          {result && (
            <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-center">
                    <p className="text-xs text-rose-600 uppercase font-black tracking-wider mb-1">Monthly Tax</p>
                    <p className="text-2xl font-bold text-rose-700">Rs. {result.monthlyTax}</p>
                 </div>
                 <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-center">
                    <p className="text-xs text-rose-600 uppercase font-black tracking-wider mb-1">Annual Tax</p>
                    <p className="text-2xl font-bold text-rose-700">Rs. {result.annualTax}</p>
                 </div>
                 <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-xs text-emerald-600 uppercase font-black tracking-wider mb-1">Take Home</p>
                    <p className="text-2xl font-bold text-emerald-800">Rs. {result.monthlyTakeHome}</p>
                 </div>
              </div>
              
              <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
                <span className="font-bold">Summary:</span> Your salary falls into the <span className="font-black underline">{result.percentage}%</span> tax bracket. 
                {monthlySalary <= 50000 && " Great news! Monthly salaries up to 50,000 PKR are exempt from income tax."}
              </div>
            </div>
          )}
        </div>

        <section className="mt-20 prose prose-indigo max-w-3xl mx-auto text-gray-700">
          <h2 className="text-2xl font-bold text-gray-900">How FBR Salary Tax is Calculated?</h2>
          <p>
            In Pakistan, the Federal Board of Revenue (FBR) sets progressive tax slabs. This means the more you earn, the higher the percentage of tax you pay. For the Tax Year 2024-2025, the exemption limit is PKR 600,000 per year (PKR 50,000 per month).
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>0% Tax:</strong> Up to Rs. 600,000 per year</li>
            <li><strong>5% Tax:</strong> Between Rs. 600,001 and Rs. 1,200,000</li>
            <li><strong>15% Tax + Base:</strong> Between Rs. 1,200,001 and Rs. 2,400,000</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
