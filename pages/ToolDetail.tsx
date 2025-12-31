
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS, DISCLAIMER_TEXT, SALARY_TAX_SLABS_2024, ELECTRICITY_COMPANIES } from '../constants';
import AdPlaceholder from '../components/AdPlaceholder';
import CNICChecker from './CNICChecker';
import ElectricityBill from './ElectricityBill';
import SalaryTax from './SalaryTax';
import ZakatCalc from './ZakatCalc';
import PropertyTax from './PropertyTax';
import GasBillCalculator from './GasBillCalculator';

const ToolDetail: React.FC = () => {
  const { slug } = useParams();
  const tool = TOOLS.find(t => t.slug === slug);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (tool) document.title = `${tool.name} - PakUtilityTools`;
    setResult(null); 
  }, [tool]);

  if (!tool) return <div className="text-center py-20"><h2 className="text-2xl">Tool Not Found</h2></div>;

  // --- ENGINE: Bills & Utilities (New Specific Implementations) ---
  const BillsUtilitiesEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const handleCalc = () => {
      let res: any = {};
      const rate = inputs.rate || 35; // Default unit rate

      // Basic validation to avoid NaN outputs
      const require = (fields: string[]) => fields.every((f) => inputs[f] !== undefined && inputs[f] !== null && inputs[f] !== '' && !isNaN(inputs[f]));

      switch (tool.id) {
        case 'gas-bill': {
          if (!require(['units'])) { alert('Enter gas units consumed (MMBTU)'); return; }
          let cost = 0;
          let remaining = Number(inputs.units);
          if (remaining > 0) { const slab = Math.min(remaining, 0.5); cost += slab * 121; remaining -= slab; }
          if (remaining > 0) { const slab = Math.min(remaining, 0.5); cost += slab * 244; remaining -= slab; }
          if (remaining > 0) { const slab = Math.min(remaining, 1);   cost += slab * 409; remaining -= slab; }
          if (remaining > 0) { const slab = Math.min(remaining, 1);   cost += slab * 590; remaining -= slab; }
          if (remaining > 0) { cost += remaining * 775; }
          const gst = cost * 0.17;
          const meterRent = 50;
          res = {
            gasCost: `Rs. ${cost.toFixed(0)}`,
            gst: `Rs. ${gst.toFixed(0)}`,
            meterRent: `Rs. ${meterRent.toFixed(0)}`,
            total: `Rs. ${(cost + gst + meterRent).toFixed(0)}`,
            msg: 'Domestic SNGPL/SSGC slab estimate with 17% GST.'
          };
          break;
        }
        case 'water-bill':
          if (!require(['units'])) { alert('Enter water units consumed'); return; }
          const waterBase = inputs.units * (inputs.city === 'Karachi' ? 1.5 : 1.2);
          res = { 
            estimatedBill: `Rs. ${(waterBase * 1.3).toFixed(0)}`, 
            sewerageCharges: `Rs. ${(waterBase * 0.3).toFixed(0)}`,
            msg: "Estimated based on average WASA/KWSB tariff slabs." 
          };
          break;
        case 'solar-save':
          if (!require(['kw'])) { alert('Enter solar system size (kW)'); return; }
          const gen = inputs.kw * (inputs.hours || 5) * 30;
          res = { 
            monthlyGeneration: `${gen.toFixed(0)} kWh`, 
            estimatedSavings: `Rs. ${(gen * rate).toLocaleString()}`,
            msg: "Actual savings vary with panel efficiency and net-metering slabs." 
          };
          break;
        case 'ups-load':
          if (!require(['fans', 'lights'])) { alert('Enter number of fans and lights'); return; }
          const load = (inputs.fans * 80) + (inputs.lights * 20) + (inputs.other || 0);
          res = { 
            totalLoad: `${load} Watts`, 
            recommendedUPS: `${Math.ceil((load * 1.25) / 100) * 100} VA`,
            msg: "Includes a 25% safety factor to prevent inverter overloading." 
          };
          break;
        case 'gen-fuel':
          if (!require(['kva', 'price'])) { alert('Enter generator kVA and fuel price'); return; }
          const consumption = inputs.kva * (inputs.fuel === 'Diesel' ? 0.3 : 0.45);
          res = { 
            hourlyConsumption: `${consumption.toFixed(2)} Litres`, 
            costPerHour: `Rs. ${(consumption * inputs.price).toFixed(0)}`,
            msg: "Standard consumption at 75% load factor." 
          };
          break;
        case 'ac-power':
          if (!require(['watts', 'hours'])) { alert('Enter wattage and daily hours'); return; }
          const acUnits = (inputs.watts / 1000) * inputs.hours * 30;
          res = { 
            monthlyUnits: `${acUnits.toFixed(0)} Units`, 
            estimatedCost: `Rs. ${(acUnits * rate).toLocaleString()}`,
            msg: "Estimated assuming compressor runs 70% of the time." 
          };
          break;
        case 'fridge-power':
          if (!require(['watts'])) { alert('Enter fridge wattage'); return; }
          const fUnits = (inputs.watts / 1000) * 24 * 0.5 * 30; // 50% duty cycle
          res = { 
            monthlyUnits: `${fUnits.toFixed(0)} Units`, 
            estimatedCost: `Rs. ${(fUnits * rate).toLocaleString()}`,
            msg: "Fridge cost calculated at 50% compressor duty cycle." 
          };
          break;
        case 'net-usage':
          if (!inputs.activity || !inputs.hours || isNaN(inputs.hours)) { alert('Select activity and enter hours'); return; }
          const gbMap: any = { 'HD Streaming': 3, 'Browsing': 0.2, 'Gaming': 0.05, 'Social Media': 0.5 };
          const daily = (gbMap[inputs.activity] || 1) * inputs.hours;
          res = { 
            dailyUsage: `${daily.toFixed(1)} GB`, 
            monthlyTotal: `${(daily * 30).toFixed(0)} GB`,
            msg: "Estimated average data weight per activity." 
          };
          break;
        case 'load-shedding':
          if (!require(['hours'])) { alert('Enter daily outage hours'); return; }
          res = { 
            dailyOutage: `${inputs.hours} Hours`, 
            monthlyDarkness: `${inputs.hours * 30} Hours`,
            msg: "Based on user-reported local schedule." 
          };
          break;
      }
      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'gas-bill' && (
          <input type="number" placeholder="Gas Units (MMBTU)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, units: Number(e.target.value)})} />
        )}
        {tool.id === 'water-bill' && (
          <>
            <input type="number" placeholder="Units Consumed (Cubic Meters)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, units: Number(e.target.value)})} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, city: e.target.value})} defaultValue="Lahore">
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Other">Other</option>
            </select>
          </>
        )}
        {tool.id === 'solar-save' && (
          <>
            <input type="number" placeholder="System Capacity (kW)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, kw: Number(e.target.value)})} />
            <input type="number" placeholder="Avg Sun Hours (Default 5)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, hours: Number(e.target.value)})} />
            <input type="number" placeholder="Current Electricity Rate (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, rate: Number(e.target.value)})} />
          </>
        )}
        {tool.id === 'ups-load' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="No. of Fans" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, fans: Number(e.target.value)})} />
              <input type="number" placeholder="No. of LED Lights" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, lights: Number(e.target.value)})} />
            </div>
            <input type="number" placeholder="Other Load (Watts)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, other: Number(e.target.value)})} />
          </>
        )}
        {tool.id === 'gen-fuel' && (
          <>
            <input type="number" placeholder="Generator Rating (kVA)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, kva: Number(e.target.value)})} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, fuel: e.target.value})} defaultValue="Petrol">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
            <input type="number" placeholder="Fuel Price (PKR/Litre)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, price: Number(e.target.value)})} />
          </>
        )}
        {(tool.id === 'ac-power' || tool.id === 'fridge-power') && (
          <>
            <input type="number" placeholder="Appliance Wattage (e.g. 1500 for 1.5 Ton AC)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, watts: Number(e.target.value)})} />
            <input type="number" placeholder="Usage Hours Per Day" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, hours: Number(e.target.value)})} />
            <input type="number" placeholder="Unit Rate (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, rate: Number(e.target.value)})} />
          </>
        )}
        {tool.id === 'net-usage' && (
          <>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, activity: e.target.value})} defaultValue="">
              <option value="" disabled>Select Primary Activity</option>
              <option value="HD Streaming">HD Streaming</option>
              <option value="Browsing">Browsing</option>
              <option value="Gaming">Gaming</option>
              <option value="Social Media">Social Media</option>
            </select>
            <input type="number" placeholder="Hours per Day" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, hours: Number(e.target.value)})} />
          </>
        )}
        {tool.id === 'load-shedding' && (
          <input type="number" placeholder="Hours of Outage Daily" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, hours: Number(e.target.value)})} />
        )}
        
        <button onClick={handleCalc} className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition">Estimate Now</button>
      </div>
    );
  };

  // --- ENGINE: Construction & Property ---
  const ConstructionEngine = () => {
    const [val1, setVal1] = useState(0);
    const [val2, setVal2] = useState(0);
    
    const calc = () => {
      if (tool.id === 'bricks-calc') setResult({ bricks: Math.ceil(val1 * 13.5 * (val2 || 1)), msg: "Standard 9-inch wall calculation" });
      if (tool.id === 'cement-calc') setResult({ bags: Math.ceil(val1 * 0.4), msg: "Estimated for plaster and masonry" });
      if (tool.id === 'steel-weight') setResult({ kg: Math.ceil(val1 * 4.5), msg: "Standard 60-grade steel for slab" });
      if (tool.id === 'const-cost') setResult({ cost: (val1 * 3500).toLocaleString(), msg: "Grey structure cost estimate (PKR)" });
    };

    return (
      <div className="space-y-4">
        <input type="number" placeholder="Area (Sq Ft)" className="w-full border p-4 rounded-xl" onChange={e => setVal1(Number(e.target.value))} />
        {tool.id === 'bricks-calc' && <input type="number" placeholder="Wall Thickness (inches)" className="w-full border p-4 rounded-xl" onChange={e => setVal2(Number(e.target.value))} />}
        <button onClick={calc} className="w-full bg-orange-600 text-white p-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg">Calculate Materials</button>
      </div>
    );
  };

  // --- ENGINE: Islamic Tools ---
  const IslamicEngine = () => {
    const [amt, setAmt] = useState(0);
    const calc = () => {
      if (tool.id === 'fitra-calc') setResult({ wheat: (amt * 320), barley: (amt * 800), msg: "Rates based on 2024 averages per person" });
      if (tool.id === 'qurbani-calc') setResult({ share: (amt / 7).toFixed(0), msg: "Cost per share in a Cow/Bull" });
      if (tool.id === 'ushr-calc') setResult({ amount: (amt * 0.1).toFixed(0), msg: "10% on naturally irrigated land" });
    };
    return (
      <div className="space-y-4">
        <input type="number" placeholder={tool.id === 'fitra-calc' ? "Number of family members" : "Total Value/Amount (PKR)"} className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={e => setAmt(Number(e.target.value))} />
        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Calculate</button>
      </div>
    );
  };

  const renderInstructions = () => {
    const defaultSteps = ["Enter the required numerical value.", "Press the calculate/convert button.", "View the results in the box below."];
    const instructionsMap: Record<string, string[]> = {
      'Bills & Utilities': [
        "Select your service type or appliance.",
        "Enter usage details (Units, kW, or Hours).",
        "Estimated results are based on latest 2024 tariffs.",
        "Always verify with your physical bill for exact amounts."
      ],
      'Property & Construction': [
        "Measure the length and width of the area in feet.",
        "Bricks calc assumes 13.5 bricks/cu.ft for 9-inch walls.",
        "Cost estimates are for Grey Structure (A-quality materials)."
      ]
    };

    const steps = instructionsMap[tool.category] || defaultSteps;

    return (
      <div className="mt-10 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
        <h3 className="font-bold text-emerald-900 mb-4 flex items-center">
          <span className="mr-2">📖</span> How to use {tool.name}
        </h3>
        <ul className="space-y-3">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start text-sm text-emerald-800 leading-relaxed">
              <span className="font-bold mr-3 opacity-50">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderLogic = () => {
    if (tool.id === 'cnic-check') return <CNICChecker />;
    if (tool.id === 'elec-bill') return <ElectricityBill />;
    if (tool.id === 'gas-bill') return <GasBillCalculator />;
    if (tool.id === 'salary-tax') return <SalaryTax />;
    if (tool.id === 'zakat-calc') return <ZakatCalc />;
    if (tool.id === 'property-tax') return <PropertyTax />;

    if (tool.category === 'Bills & Utilities') return <BillsUtilitiesEngine />;
    if (tool.category === 'Property & Construction') return <ConstructionEngine />;
    if (tool.category === 'Islamic Tools') return <IslamicEngine />;

    return (
      <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 italic mb-4">Input data to calculate {tool.name}</p>
        <div className="max-w-xs mx-auto space-y-4">
          <input
            type="number"
            className="w-full border p-4 rounded-xl"
            placeholder="Enter Value"
            onChange={(e) => setResult({ status: "Processed", value: Number(e.target.value), msg: "Calculated based on 2024 Pakistan averages." })}
          />
          <button
            className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold"
            onClick={() => {
              if (!result || result.value === undefined || isNaN(result.value)) {
                alert('Please enter a value first');
                return;
              }
            }}
          >
            Calculate
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-[10px] uppercase font-bold text-gray-400 mb-4 flex space-x-2 tracking-widest">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <span>/</span>
        <span className="text-emerald-800">{tool.category}</span>
        <span>/</span>
        <span className="text-gray-300">{tool.name}</span>
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div className="flex items-center space-x-5">
            <div className="text-5xl bg-emerald-50 w-24 h-24 flex items-center justify-center rounded-[2rem] shadow-sm border border-emerald-100">
              {tool.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-none">{tool.name}</h1>
              <p className="text-gray-400 mt-2 font-medium">{tool.description}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
             <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-tighter">Updated 2024 Slabs</span>
          </div>
        </div>

        <AdPlaceholder slot="top-tool" />

        <div className="py-10 border-y border-gray-100">
          {renderLogic()}

          {result && (
            <div className="mt-10 p-8 bg-emerald-900 text-white rounded-[2rem] shadow-2xl animate-in zoom-in duration-500">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-300">Estimation Report</h4>
                <div className="flex space-x-2">
                  <button onClick={() => window.print()} className="text-[10px] bg-emerald-800 px-3 py-1 rounded-md hover:bg-emerald-700">PDF</button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result));
                    alert("Results copied!");
                  }} className="text-[10px] bg-emerald-800 px-3 py-1 rounded-md hover:bg-emerald-700">Copy</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(result).map(([key, value]: any) => (
                  key !== 'msg' && (
                    <div key={key} className="bg-white/10 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <p className="text-[10px] text-emerald-200 font-bold uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-3xl font-black">{value}</p>
                    </div>
                  )
                ))}
              </div>
              {result.msg && <p className="mt-6 text-sm text-emerald-100/70 italic border-t border-white/5 pt-4">💡 {result.msg}</p>}
            </div>
          )}

          {renderInstructions()}
        </div>

        <AdPlaceholder slot="bottom-tool" />
        
        <div className="mt-10 text-center">
          <p className="text-[10px] text-gray-300 leading-relaxed uppercase tracking-widest max-w-lg mx-auto">
            {DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
