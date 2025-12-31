
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';
import { DISCLAIMER_TEXT } from '../constants';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [unit, setUnit] = useState('metric'); // metric or imperial
  const [result, setResult] = useState<any | null>(null);

  const calculateBMI = () => {
    if (weight <= 0 || height <= 0) {
      alert('Please enter valid weight and height');
      return;
    }

    let bmi: number;
    let heightInMeters: number;
    let weightInKg: number;

    if (unit === 'metric') {
      heightInMeters = height / 100; // cm to meters
      weightInKg = weight;
      bmi = weightInKg / (heightInMeters * heightInMeters);
    } else {
      // Imperial: pounds and inches
      bmi = (weight / (height * height)) * 703;
      weightInKg = weight * 0.453592;
      heightInMeters = height * 0.0254;
    }

    let category = '';
    let color = '';
    let recommendation = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'blue';
      recommendation = 'You may need to gain weight. Consult a nutritionist for a healthy diet plan.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal Weight';
      color = 'green';
      recommendation = 'You have a healthy weight! Maintain your current lifestyle with balanced diet and exercise.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      color = 'yellow';
      recommendation = 'Consider losing some weight through exercise and a balanced diet to improve your health.';
    } else {
      category = 'Obese';
      color = 'red';
      recommendation = 'It is recommended to consult a doctor or nutritionist for a weight management plan.';
    }

    const idealWeightMin = 18.5 * (heightInMeters * heightInMeters);
    const idealWeightMax = 24.9 * (heightInMeters * heightInMeters);

    setResult({
      bmi: bmi.toFixed(1),
      category,
      color,
      recommendation,
      idealWeightMin: idealWeightMin.toFixed(1),
      idealWeightMax: idealWeightMax.toFixed(1)
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">BMI Calculator Pakistan</h1>
      <p className="text-gray-600 mb-8">Calculate your Body Mass Index (BMI) and check if you have a healthy weight.</p>
      
      <AdPlaceholder slot="above-tool" />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* How to Use Section */}
        <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            📖 How to Use This BMI Calculator
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Select your preferred unit system (Metric or Imperial)</li>
            <li>Enter your <strong>weight</strong> (in kg or lbs)</li>
            <li>Enter your <strong>height</strong> (in cm or inches)</li>
            <li>Click <strong>"Calculate BMI"</strong> to see your results</li>
            <li>Check your BMI category and health recommendations</li>
          </ol>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Unit System</label>
          <div className="flex space-x-4">
            <button 
              onClick={() => setUnit('metric')}
              className={`flex-1 py-3 rounded-lg font-bold border ${unit === 'metric' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Metric (kg, cm)
            </button>
            <button 
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-3 rounded-lg font-bold border ${unit === 'imperial' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Imperial (lbs, in)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
            </label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Height {unit === 'metric' ? '(cm)' : '(inches)'}
            </label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder={unit === 'metric' ? 'e.g., 170' : 'e.g., 67'}
              value={height || ''}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>
        
        <button 
          onClick={calculateBMI}
          className="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
        >
          Calculate BMI
        </button>
        
        {result && (
          <div className="mt-8 space-y-4">
            <div className={`p-6 ${result.color === 'green' ? 'bg-green-50 border-green-200' : result.color === 'blue' ? 'bg-blue-50 border-blue-200' : result.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-2xl text-center`}>
              <p className="text-sm text-gray-600 uppercase font-bold mb-2">Your BMI Score</p>
              <p className="text-5xl font-extrabold text-gray-800 mb-3">{result.bmi}</p>
              <p className={`text-lg font-bold ${result.color === 'green' ? 'text-green-700' : result.color === 'blue' ? 'text-blue-700' : result.color === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                {result.category}
              </p>
            </div>

            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>💡 Recommendation:</strong> {result.recommendation}
              </p>
            </div>

            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-sm text-emerald-800">
                <strong>🎯 Your Ideal Weight Range:</strong> {result.idealWeightMin} - {result.idealWeightMax} kg
              </p>
            </div>

            {/* BMI Chart */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-3">BMI Categories Chart</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-blue-50 rounded"><span>Underweight</span><span className="font-bold">{'< 18.5'}</span></div>
                <div className="flex justify-between p-2 bg-green-50 rounded"><span>Normal Weight</span><span className="font-bold">18.5 - 24.9</span></div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded"><span>Overweight</span><span className="font-bold">25 - 29.9</span></div>
                <div className="flex justify-between p-2 bg-red-50 rounded"><span>Obese</span><span className="font-bold">≥ 30</span></div>
              </div>
            </div>
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
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-emerald-800">What is BMI?</h3>
            <p>BMI (Body Mass Index) is a measurement that uses your height and weight to estimate if you have a healthy body weight. It's widely used by doctors in Pakistan and worldwide.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Is BMI accurate for everyone?</h3>
            <p>BMI is a general indicator and may not be accurate for athletes, bodybuilders, pregnant women, or elderly people. It's best used as a screening tool.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">What is a healthy BMI range?</h3>
            <p>A healthy BMI is between 18.5 and 24.9. This range is associated with the lowest health risks according to WHO guidelines.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">How can I improve my BMI?</h3>
            <p>If overweight, focus on regular exercise (30-60 minutes daily), balanced diet with less sugar and oil, and portion control. If underweight, eat nutrient-rich foods and consult a nutritionist.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BMICalculator;
