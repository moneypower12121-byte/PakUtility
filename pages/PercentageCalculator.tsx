
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';
import { DISCLAIMER_TEXT } from '../constants';

const PercentageCalculator: React.FC = () => {
  const [mode, setMode] = useState('whatIs'); // whatIs, increase, decrease, percentOf
  const [inputs, setInputs] = useState<any>({ num1: 0, num2: 0 });
  const [result, setResult] = useState<any | null>(null);

  const calculate = () => {
    const { num1, num2 } = inputs;
    let res: any = {};

    switch (mode) {
      case 'whatIs':
        // What is X% of Y?
        res.answer = (num1 / 100) * num2;
        res.explanation = `${num1}% of ${num2} = ${res.answer.toFixed(2)}`;
        break;
      case 'increase':
        // Increase Y by X%
        const increaseAmount = (num1 / 100) * num2;
        res.answer = num2 + increaseAmount;
        res.increaseAmount = increaseAmount;
        res.explanation = `${num2} + ${num1}% = ${res.answer.toFixed(2)}`;
        break;
      case 'decrease':
        // Decrease Y by X%
        const decreaseAmount = (num1 / 100) * num2;
        res.answer = num2 - decreaseAmount;
        res.decreaseAmount = decreaseAmount;
        res.explanation = `${num2} - ${num1}% = ${res.answer.toFixed(2)}`;
        break;
      case 'percentOf':
        // X is what % of Y?
        res.answer = (num1 / num2) * 100;
        res.explanation = `${num1} is ${res.answer.toFixed(2)}% of ${num2}`;
        break;
      default:
        break;
    }

    setResult(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Percentage Calculator</h1>
      <p className="text-gray-600 mb-8">Calculate percentages, increases, decreases, and ratios with ease.</p>
      
      <AdPlaceholder slot="above-tool" />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* How to Use Section */}
        <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            📖 How to Use This Calculator
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Select the type of calculation you want to perform</li>
            <li>Enter the required numbers in the input fields</li>
            <li>Click <strong>"Calculate"</strong> to see the result</li>
            <li>View the detailed explanation of the calculation</li>
          </ol>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Calculation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => setMode('whatIs')}
              className={`py-3 px-4 rounded-lg font-bold border text-sm ${mode === 'whatIs' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              What is X% of Y?
            </button>
            <button 
              onClick={() => setMode('increase')}
              className={`py-3 px-4 rounded-lg font-bold border text-sm ${mode === 'increase' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Increase Y by X%
            </button>
            <button 
              onClick={() => setMode('decrease')}
              className={`py-3 px-4 rounded-lg font-bold border text-sm ${mode === 'decrease' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Decrease Y by X%
            </button>
            <button 
              onClick={() => setMode('percentOf')}
              className={`py-3 px-4 rounded-lg font-bold border text-sm ${mode === 'percentOf' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              X is what % of Y?
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {mode === 'whatIs' ? 'Percentage (X)' : mode === 'percentOf' ? 'Number (X)' : 'Percentage (X)'}
            </label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Enter number"
              value={inputs.num1 || ''}
              onChange={(e) => setInputs({ ...inputs, num1: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {mode === 'whatIs' ? 'Of Number (Y)' : mode === 'percentOf' ? 'Of Number (Y)' : 'Base Number (Y)'}
            </label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Enter number"
              value={inputs.num2 || ''}
              onChange={(e) => setInputs({ ...inputs, num2: Number(e.target.value) })}
            />
          </div>
        </div>
        
        <button 
          onClick={calculate}
          className="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
        >
          Calculate
        </button>
        
        {result && (
          <div className="mt-8 space-y-4">
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <p className="text-sm text-emerald-600 uppercase font-bold mb-2">Result</p>
              <p className="text-5xl font-extrabold text-emerald-800 mb-3">
                {result.answer.toFixed(2)}
              </p>
              <p className="text-lg text-gray-700">{result.explanation}</p>
            </div>

            {result.increaseAmount && (
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Increase Amount:</strong> +{result.increaseAmount.toFixed(2)}
                </p>
              </div>
            )}

            {result.decreaseAmount && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-800">
                  <strong>Decrease Amount:</strong> -{result.decreaseAmount.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-xs text-gray-500 mb-4">{DISCLAIMER_TEXT}</p>
           <button onClick={handleCopy} className="text-emerald-600 text-sm font-semibold flex items-center">
             <span>🔗 Share Tool Link</span>
           </button>
        </div>
      </div>

      <AdPlaceholder slot="below-tool" />

      <section className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100 prose prose-sm">
        <h2 className="text-xl font-bold mb-4">Common Use Cases in Pakistan</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-emerald-800">Shop Discounts</h3>
            <p>Calculate how much you save during sales. Example: 30% off on Rs. 5,000 item = Rs. 1,500 discount.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Exam Marks</h3>
            <p>Calculate percentage scored in exams. Example: 450 marks out of 550 = 81.82%.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Salary Increases</h3>
            <p>Calculate increment amount. Example: 15% raise on Rs. 50,000 salary = Rs. 7,500 increase.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">GST/Tax Calculations</h3>
            <p>Add or subtract tax percentages. Example: Adding 17% GST to Rs. 10,000 = Rs. 11,700 total.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 mt-8">Quick Percentage Formulas</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
          <p><strong>To find X% of Y:</strong> (X ÷ 100) × Y</p>
          <p><strong>To find what % X is of Y:</strong> (X ÷ Y) × 100</p>
          <p><strong>To increase Y by X%:</strong> Y + (X ÷ 100) × Y</p>
          <p><strong>To decrease Y by X%:</strong> Y - (X ÷ 100) × Y</p>
        </div>
      </section>
    </div>
  );
};

export default PercentageCalculator;
