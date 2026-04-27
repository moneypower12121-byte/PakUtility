
import React, { useState } from 'react';
import Head from 'next/head';
import AdPlaceholder from '../components/AdPlaceholder';

const CGPACalculator: React.FC = () => {
  const [semesters, setSemesters] = useState([{ gpa: 0, credits: 0 }]);
  const [result, setResult] = useState<string | null>(null);

  const addSemester = () => setSemesters([...semesters, { gpa: 0, credits: 0 }]);

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    semesters.forEach(sem => {
      totalPoints += (sem.gpa * sem.credits);
      totalCredits += sem.credits;
    });

    if (totalCredits === 0) {
      alert('Please enter valid credit hours');
      return;
    }

    setResult((totalPoints / totalCredits).toFixed(2));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>CGPA Calculator for Pakistani Universities | HEC Standard | PakUtility</title>
        <meta name="description" content="Calculate your cumulative GPA (CGPA) according to HEC standards for Pakistani universities. Easy to use semester-wise CGPA tool." />
      </Head>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">CGPA Calculator</h1>
      <p className="text-gray-600 mb-8">Calculate your Cumulative Grade Point Average based on semester-wise GPA and credit hours.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-4 mb-8">
          {semesters.map((sem, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester {index + 1} GPA</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => {
                    const newSemesters = [...semesters];
                    newSemesters[index].gpa = Number(e.target.value);
                    setSemesters(newSemesters);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Credit Hours</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={(e) => {
                    const newSemesters = [...semesters];
                    newSemesters[index].credits = Number(e.target.value);
                    setSemesters(newSemesters);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={addSemester}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            + Add Semester
          </button>
          <button 
            onClick={calculateCGPA}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            Calculate CGPA
          </button>
        </div>

        {result && (
          <div className="p-6 bg-indigo-900 text-white rounded-2xl text-center shadow-inner">
            <p className="text-indigo-300 text-sm uppercase font-bold mb-1">Your Final CGPA</p>
            <p className="text-5xl font-black">{result}</p>
          </div>
        )}
      </div>

      <AdPlaceholder slot="cgpa-bottom" />
    </div>
  );
};

export default CGPACalculator;
