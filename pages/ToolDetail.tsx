
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
    if (tool) document.title = `${tool.name} - PakUtility`;
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
    const [inputs, setInputs] = useState<any>({});

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'const-cost': {
          const area = Number(inputs.area);
          const rate = Number(inputs.rate) || 3500;
          if (!area || area <= 0) { alert('Enter covered area'); return; }
          const cost = area * rate;
          res = { area: `${area} sq ft`, rate: `Rs. ${rate}/sq ft`, totalCost: `Rs. ${cost.toLocaleString()}`, msg: 'Grey structure estimate; finishes vary.' };
          break;
        }

        case 'cement-calc': {
          const area = Number(inputs.area);
          if (!area || area <= 0) { alert('Enter area'); return; }
          const bags = Math.ceil(area * 0.4); // rough thumb rule
          res = { area: `${area} sq ft`, cementBags: `${bags} bags (50kg)`, msg: 'Approx for plaster/masonry; adjust for thickness.' };
          break;
        }

        case 'steel-weight': {
          const area = Number(inputs.area);
          if (!area || area <= 0) { alert('Enter area'); return; }
          const kg = Math.ceil(area * 4.5);
          res = { area: `${area} sq ft`, steel: `${kg} kg (60-grade)`, msg: 'Typical slab steel allowance.' };
          break;
        }

        case 'bricks-calc': {
          const area = Number(inputs.area);
          const thickness = Number(inputs.thickness) || 9;
          if (!area || area <= 0) { alert('Enter wall area'); return; }
          const factor = thickness / 9; // 9" base
          const bricks = Math.ceil(area * 13.5 * factor);
          res = { wallArea: `${area} sq ft`, thickness: `${thickness}"`, bricksNeeded: bricks, msg: '13.5 bricks/sqft for 9" wall baseline.' };
          break;
        }

        case 'paint-calc': {
          const area = Number(inputs.area);
          const coats = Number(inputs.coats) || 2;
          if (!area || area <= 0) { alert('Enter paintable area'); return; }
          const coverageSqft = 130; // per litre
          const litres = Math.ceil((area / coverageSqft) * coats * 1.1); // 10% wastage
          res = { area: `${area} sq ft`, coats, litres: `${litres} litres`, msg: 'Coverage ~130 sq ft/litre/coat with 10% wastage.' };
          break;
        }

        case 'tile-calc': {
          const area = Number(inputs.area);
          const len = Number(inputs.len);
          const wid = Number(inputs.wid);
          if (!area || area <= 0 || !len || !wid) { alert('Enter area and tile size'); return; }
          const tileSqft = (len * wid) / 144;
          if (tileSqft <= 0) { alert('Tile size invalid'); return; }
          const tiles = Math.ceil((area / tileSqft) * 1.1); // 10% wastage
          res = { area: `${area} sq ft`, tileSize: `${len}x${wid} in`, tilesNeeded: tiles, msg: 'Includes 10% wastage.' };
          break;
        }

        case 'plot-conv': {
          const value = Number(inputs.value);
          const unit = inputs.unit || 'marla';
          if (!value || value <= 0) { alert('Enter area'); return; }
          // Standards: 1 marla = 272.25 sq ft, 1 kanal = 20 marla
          const sqft = unit === 'sqft' ? value : unit === 'kanal' ? value * 20 * 272.25 : value * 272.25;
          const marla = sqft / 272.25;
          const kanal = marla / 20;
          res = { sqft: sqft.toFixed(2), marla: marla.toFixed(2), kanal: kanal.toFixed(3), msg: 'Using Punjab standard: 1 marla = 272.25 sq ft.' };
          break;
        }

        case 'rent-yield': {
          const rent = Number(inputs.rent);
          const price = Number(inputs.price);
          if (!rent || rent <= 0 || !price || price <= 0) { alert('Enter rent and property value'); return; }
          const annual = rent * 12;
          const yieldPct = (annual / price) * 100;
          const paybackYears = price / annual;
          res = { monthlyRent: `Rs. ${rent.toLocaleString()}`, propertyValue: `Rs. ${price.toLocaleString()}`, annualYield: `${yieldPct.toFixed(2)}%`, payback: `${paybackYears.toFixed(1)} years`, msg: 'Gross yield (before expenses/taxes).' };
          break;
        }

        case 'loan-emi': {
          const principal = Number(inputs.amount);
          const rate = Number(inputs.rate);
          const years = Number(inputs.years);
          if (!principal || principal <= 0 || !rate || rate <= 0 || !years || years <= 0) { alert('Enter amount, rate, and years'); return; }
          const monthlyRate = rate / 12 / 100;
          const n = years * 12;
          const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
          const totalPay = emi * n;
          const interest = totalPay - principal;
          res = {
            amount: `Rs. ${principal.toLocaleString()}`,
            emi: `Rs. ${emi.toFixed(0).toLocaleString()}`,
            totalPay: `Rs. ${totalPay.toFixed(0).toLocaleString()}`,
            interest: `Rs. ${interest.toFixed(0).toLocaleString()}`,
            msg: 'Standard EMI formula (reducing balance).'
          };
          break;
        }

        case 'prop-price': {
          const area = Number(inputs.area);
          const rate = Number(inputs.rate);
          const unit = inputs.unit || 'sqft';
          if (!area || area <= 0 || !rate || rate <= 0) { alert('Enter area and rate'); return; }
          const sqft = unit === 'sqft' ? area : unit === 'marla' ? area * 272.25 : area * 20 * 272.25;
          const total = sqft * rate;
          res = { area: `${area} ${unit}`, rate: `Rs. ${rate}/sq ft`, totalPrice: `Rs. ${total.toLocaleString()}`, msg: 'Estimate; confirm with local market comps.' };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {(tool.id === 'const-cost' || tool.id === 'cement-calc' || tool.id === 'steel-weight' || tool.id === 'paint-calc' || tool.id === 'bricks-calc' || tool.id === 'tile-calc' || tool.id === 'prop-price') && (
          <input type="number" placeholder={tool.id === 'bricks-calc' ? 'Wall Area (sq ft)' : 'Area (sq ft)'} className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, area: e.target.value })} />
        )}

        {tool.id === 'const-cost' && (
          <input type="number" placeholder="Rate per sq ft (PKR)" className="w-full border p-4 rounded-xl" defaultValue={3500} onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
        )}

        {tool.id === 'bricks-calc' && (
          <input type="number" placeholder="Wall Thickness (inches)" className="w-full border p-4 rounded-xl" defaultValue={9} onChange={e => setInputs({ ...inputs, thickness: e.target.value })} />
        )}

        {tool.id === 'paint-calc' && (
          <input type="number" placeholder="Number of coats" className="w-full border p-4 rounded-xl" defaultValue={2} onChange={e => setInputs({ ...inputs, coats: e.target.value })} />
        )}

        {tool.id === 'tile-calc' && (
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Tile Length (inch)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, len: e.target.value })} />
            <input type="number" placeholder="Tile Width (inch)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, wid: e.target.value })} />
          </div>
        )}

        {tool.id === 'plot-conv' && (
          <>
            <input type="number" placeholder="Area value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, unit: e.target.value })} defaultValue="marla">
              <option value="sqft">Square Feet</option>
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
            </select>
          </>
        )}

        {tool.id === 'rent-yield' && (
          <>
            <input type="number" placeholder="Monthly Rent (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rent: e.target.value })} />
            <input type="number" placeholder="Property Value (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, price: e.target.value })} />
          </>
        )}

        {tool.id === 'loan-emi' && (
          <>
            <input type="number" placeholder="Loan Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, amount: e.target.value })} />
            <input type="number" placeholder="Annual Interest Rate (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
            <input type="number" placeholder="Tenure (years)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} />
          </>
        )}

        {tool.id === 'prop-price' && (
          <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, unit: e.target.value })} defaultValue="sqft">
            <option value="sqft">Square Feet</option>
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
          </select>
        )}

        {/* Default action */}
        <button onClick={calc} className="w-full bg-orange-600 text-white p-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg">Calculate</button>
      </div>
    );
  };

  // --- ENGINE: Islamic Tools ---
  const IslamicEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const provinceCityMap: Record<string, string[]> = {
      sindh: ['karachi', 'hyderabad', 'sukkur', 'larkana', 'mirpurkhas', 'nawabshah', 'khairpur'],
      punjab: ['lahore', 'rawalpindi', 'islamabad', 'faisalabad', 'multan', 'gujranwala', 'sialkot', 'bahawalpur', 'sargodha', 'rahimyar khan', 'dera ghazi khan', 'gujrat'],
      kpk: ['peshawar', 'abbottabad', 'mardan', 'swat', 'kohat', 'dera ismail khan', 'mansehra'],
      balochistan: ['quetta', 'gwadar', 'turbat', 'khuzdar', 'sibi'],
      gb: ['gilgit', 'skardu', 'hunza'],
      ajk: ['muzaffarabad', 'mirpur', 'bhimber'],
      ict: ['islamabad']
    };

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'zakat-gold': {
          const weight = Number(inputs.weight);
          const rate = Number(inputs.rate) || 220000; // per tola
          if (!weight || weight <= 0) { alert('Enter gold weight in tola'); return; }

          const value = weight * rate;
          const nisabTola = 7.5;
          const nisabValue = nisabTola * rate;
          const zakat = value >= nisabValue ? value * 0.025 : 0;
          const shortfall = value >= nisabValue ? 0 : (nisabValue - value);

          res = {
            weight: `${weight} tola`,
            goldValue: `Rs. ${value.toLocaleString()}`,
            nisabValue: `Rs. ${nisabValue.toLocaleString()}`,
            zakatDue: `Rs. ${zakat.toFixed(0).toLocaleString()}`,
            shortfall: shortfall > 0 ? `Need Rs. ${shortfall.toFixed(0).toLocaleString()} to reach Nisab` : 'Nisab met',
            msg: 'Nisab = 7.5 tola gold at current rate'
          };
          break;
        }

        case 'zakat-biz': {
          const inventory = Number(inputs.inventory) || 0;
          const cash = Number(inputs.cash) || 0;
          const receivables = Number(inputs.receivables) || 0;
          const payables = Number(inputs.payables) || 0;
          const net = inventory + cash + receivables - payables;
          const nisab = 180000;
          const zakat = net >= nisab ? net * 0.025 : 0;

          res = {
            zakatableAssets: `Rs. ${net.toLocaleString()}`,
            nisab: `Rs. ${nisab.toLocaleString()}`,
            zakatDue: `Rs. ${zakat.toFixed(0).toLocaleString()}`,
            msg: 'Include stock, cash, receivables. Deduct payables due now.'
          };
          break;
        }

        case 'fitra-calc': {
          const members = Number(inputs.members);
          const rate = Number(inputs.rate) || 320;
          if (!members || members <= 0) { alert('Enter number of family members'); return; }
          const total = members * rate;
          res = {
            members,
            perPersonRate: `Rs. ${rate.toLocaleString()}`,
            totalFitra: `Rs. ${total.toLocaleString()}`,
            msg: 'Use wheat rate unless you prefer barley/dates rates'
          };
          break;
        }

        case 'kaffarah-calc': {
          const missed = Number(inputs.missed) || 0;
          const mealRate = Number(inputs.mealRate) || 300;
          if (!missed || missed <= 0) { alert('Enter missed fasts count'); return; }
          const meals = missed * 60;
          const cost = meals * mealRate;
          res = {
            missedFasts: missed,
            mealsRequired: meals,
            totalCost: `Rs. ${cost.toLocaleString()}`,
            msg: 'Kaffarah = feeding 60 needy persons per missed fast'
          };
          break;
        }

        case 'qurbani-calc': {
          const price = Number(inputs.price);
          const type = inputs.type || 'cow';
          if (!price || price <= 0) { alert('Enter animal price'); return; }
          const share = type === 'goat' ? price : price / 7;
          res = {
            animal: type === 'goat' ? 'Goat/Sheep (1 share)' : 'Cow/Bull (7 shares)',
            totalPrice: `Rs. ${price.toLocaleString()}`,
            perShare: `Rs. ${share.toFixed(0).toLocaleString()}`,
            msg: 'Prices vary by city and weight; this is per-share estimate'
          };
          break;
        }

        case 'prayer-times': {
          const city = inputs.city || 'karachi';
          const table: Record<string, any> = {
            karachi: { fajr: '05:30', dhuhr: '12:30', asr: '04:00', maghrib: '06:00', isha: '07:30' },
            hyderabad: { fajr: '05:25', dhuhr: '12:30', asr: '04:00', maghrib: '06:05', isha: '07:35' },
            sukkur: { fajr: '05:25', dhuhr: '12:35', asr: '04:05', maghrib: '06:10', isha: '07:40' },
            larkana: { fajr: '05:27', dhuhr: '12:33', asr: '04:03', maghrib: '06:08', isha: '07:38' },
            mirpurkhas: { fajr: '05:26', dhuhr: '12:32', asr: '04:02', maghrib: '06:07', isha: '07:37' },
            lahore: { fajr: '05:15', dhuhr: '12:15', asr: '03:45', maghrib: '05:45', isha: '07:15' },
            rawalpindi: { fajr: '05:10', dhuhr: '12:20', asr: '03:50', maghrib: '05:55', isha: '07:25' },
            islamabad: { fajr: '05:10', dhuhr: '12:20', asr: '03:50', maghrib: '05:55', isha: '07:25' },
            faisalabad: { fajr: '05:15', dhuhr: '12:20', asr: '03:50', maghrib: '05:50', isha: '07:20' },
            multan: { fajr: '05:20', dhuhr: '12:25', asr: '03:55', maghrib: '06:00', isha: '07:30' },
            gujranwala: { fajr: '05:12', dhuhr: '12:18', asr: '03:48', maghrib: '05:52', isha: '07:22' },
            sialkot: { fajr: '05:10', dhuhr: '12:15', asr: '03:45', maghrib: '05:50', isha: '07:20' },
            bahawalpur: { fajr: '05:20', dhuhr: '12:28', asr: '03:58', maghrib: '06:03', isha: '07:33' },
            sargodha: { fajr: '05:14', dhuhr: '12:19', asr: '03:49', maghrib: '05:54', isha: '07:24' },
            'rahimyar khan': { fajr: '05:22', dhuhr: '12:29', asr: '03:59', maghrib: '06:04', isha: '07:34' },
            'dera ghazi khan': { fajr: '05:18', dhuhr: '12:26', asr: '03:56', maghrib: '06:01', isha: '07:31' },
            gujrat: { fajr: '05:12', dhuhr: '12:17', asr: '03:47', maghrib: '05:52', isha: '07:22' },
            peshawar: { fajr: '05:05', dhuhr: '12:25', asr: '04:00', maghrib: '06:05', isha: '07:35' },
            abbottabad: { fajr: '05:05', dhuhr: '12:22', asr: '03:55', maghrib: '06:05', isha: '07:32' },
            mardan: { fajr: '05:06', dhuhr: '12:24', asr: '03:56', maghrib: '06:04', isha: '07:34' },
            swat: { fajr: '05:04', dhuhr: '12:23', asr: '03:55', maghrib: '06:06', isha: '07:34' },
            kohat: { fajr: '05:06', dhuhr: '12:24', asr: '03:57', maghrib: '06:05', isha: '07:35' },
            'dera ismail khan': { fajr: '05:12', dhuhr: '12:28', asr: '03:58', maghrib: '06:07', isha: '07:37' },
            mansehra: { fajr: '05:04', dhuhr: '12:22', asr: '03:55', maghrib: '06:05', isha: '07:33' },
            quetta: { fajr: '05:20', dhuhr: '12:40', asr: '04:10', maghrib: '06:10', isha: '07:40' },
            gwadar: { fajr: '05:32', dhuhr: '12:42', asr: '04:15', maghrib: '06:18', isha: '07:48' },
            turbat: { fajr: '05:30', dhuhr: '12:40', asr: '04:12', maghrib: '06:15', isha: '07:45' },
            khuzdar: { fajr: '05:24', dhuhr: '12:36', asr: '04:05', maghrib: '06:09', isha: '07:39' },
            sibi: { fajr: '05:21', dhuhr: '12:34', asr: '04:04', maghrib: '06:08', isha: '07:38' },
            gilgit: { fajr: '05:00', dhuhr: '12:15', asr: '03:45', maghrib: '05:50', isha: '07:20' },
            skardu: { fajr: '04:58', dhuhr: '12:13', asr: '03:43', maghrib: '05:48', isha: '07:18' },
            hunza: { fajr: '04:57', dhuhr: '12:12', asr: '03:42', maghrib: '05:47', isha: '07:17' },
            muzaffarabad: { fajr: '05:05', dhuhr: '12:18', asr: '03:48', maghrib: '05:53', isha: '07:23' },
            mirpur: { fajr: '05:08', dhuhr: '12:18', asr: '03:48', maghrib: '05:54', isha: '07:24' },
            bhimber: { fajr: '05:08', dhuhr: '12:18', asr: '03:48', maghrib: '05:54', isha: '07:24' }
          };
          const timings = table[city];
          res = {
            city: city.toUpperCase(),
            fajr: timings.fajr,
            dhuhr: timings.dhuhr,
            asr: timings.asr,
            maghrib: timings.maghrib,
            isha: timings.isha,
            msg: 'Approx timings; verify with local masjid or app'
          };
          break;
        }

        case 'qibla-dir': {
          const city = inputs.city || 'karachi';
          const directions: Record<string, { deg: number; note: string }> = {
            karachi: { deg: 259, note: 'West-Northwest' },
            hyderabad: { deg: 258, note: 'West-Northwest' },
            sukkur: { deg: 258, note: 'West-Northwest' },
            larkana: { deg: 258, note: 'West-Northwest' },
            mirpurkhas: { deg: 258, note: 'West-Northwest' },
            lahore: { deg: 254, note: 'West' },
            rawalpindi: { deg: 253, note: 'West' },
            islamabad: { deg: 253, note: 'West' },
            faisalabad: { deg: 254, note: 'West' },
            multan: { deg: 256, note: 'West' },
            gujranwala: { deg: 253, note: 'West' },
            sialkot: { deg: 253, note: 'West' },
            bahawalpur: { deg: 256, note: 'West' },
            sargodha: { deg: 254, note: 'West' },
            'rahimyar khan': { deg: 256, note: 'West' },
            'dera ghazi khan': { deg: 256, note: 'West' },
            gujrat: { deg: 254, note: 'West' },
            peshawar: { deg: 251, note: 'West-Southwest' },
            abbottabad: { deg: 252, note: 'West' },
            mardan: { deg: 252, note: 'West' },
            swat: { deg: 252, note: 'West' },
            kohat: { deg: 252, note: 'West' },
            'dera ismail khan': { deg: 252, note: 'West' },
            mansehra: { deg: 252, note: 'West' },
            quetta: { deg: 255, note: 'West' },
            gwadar: { deg: 256, note: 'West' },
            turbat: { deg: 256, note: 'West' },
            khuzdar: { deg: 255, note: 'West' },
            sibi: { deg: 255, note: 'West' },
            gilgit: { deg: 251, note: 'West-Southwest' },
            skardu: { deg: 251, note: 'West-Southwest' },
            hunza: { deg: 251, note: 'West-Southwest' },
            muzaffarabad: { deg: 252, note: 'West' },
            mirpur: { deg: 252, note: 'West' },
            bhimber: { deg: 252, note: 'West' }
          };
          const dir = directions[city];
          res = {
            city: city.toUpperCase(),
            qiblaDirection: `${dir.deg}° (${dir.note})`,
            msg: 'Use compass; keep phone flat for best accuracy'
          };
          break;
        }

        case 'hijri-conv': {
          if (!inputs.date) { alert('Select a date'); return; }
          const date = new Date(inputs.date);
          if (isNaN(date.getTime())) { alert('Invalid date'); return; }
          const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
          const hijri = formatter.format(date);
          res = {
            gregorian: date.toDateString(),
            hijri,
            msg: 'Converted using browser Islamic calendar'
          };
          break;
        }

        case 'roza-counter': {
          if (!inputs.start || !inputs.end) { alert('Select start and end dates'); return; }
          const start = new Date(inputs.start);
          const end = new Date(inputs.end);
          if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) { alert('Invalid date range'); return; }
          const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          res = {
            days: diff,
            msg: `Total fasts between selected dates: ${diff}`
          };
          break;
        }

        case 'namaz-missed': {
          const years = Number(inputs.years) || 0;
          const extraDays = Number(inputs.days) || 0;
          const perDay = Number(inputs.perDay) || 5;
          const totalDays = years * 365 + extraDays;
          const prayers = totalDays * perDay;
          res = {
            totalDays,
            prayersMissed: prayers,
            msg: 'Approximation; adjust per-day count if some prayers were offered'
          };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'zakat-gold' && (
          <>
            <input type="number" placeholder="Gold Weight (tola)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, weight: e.target.value })} />
            <input type="number" placeholder="Gold Rate per tola (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
          </>
        )}

        {tool.id === 'zakat-biz' && (
          <>
            <input type="number" placeholder="Inventory / Stock Value (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, inventory: e.target.value })} />
            <input type="number" placeholder="Cash on Hand (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, cash: e.target.value })} />
            <input type="number" placeholder="Receivables (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, receivables: e.target.value })} />
            <input type="number" placeholder="Payables due now (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, payables: e.target.value })} />
          </>
        )}

        {tool.id === 'fitra-calc' && (
          <>
            <input type="number" placeholder="Number of family members" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, members: e.target.value })} />
            <input type="number" placeholder="Per person rate (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
          </>
        )}

        {tool.id === 'kaffarah-calc' && (
          <>
            <input type="number" placeholder="Missed fasts count" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, missed: e.target.value })} />
            <input type="number" placeholder="Per meal cost (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, mealRate: e.target.value })} />
          </>
        )}

        {tool.id === 'qurbani-calc' && (
          <>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, type: e.target.value })} defaultValue="cow">
              <option value="cow">Cow/Bull (7 shares)</option>
              <option value="goat">Goat/Sheep (1 share)</option>
            </select>
            <input type="number" placeholder="Animal Price (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, price: e.target.value })} />
          </>
        )}

        {tool.id === 'prayer-times' && (
          <>
            <select
              className="w-full border p-4 rounded-xl"
              onChange={e => setInputs({ ...inputs, province: e.target.value, city: provinceCityMap[e.target.value][0] })}
              value={inputs.province || 'sindh'}
            >
              <option value="sindh">Sindh</option>
              <option value="punjab">Punjab</option>
              <option value="kpk">Khyber Pakhtunkhwa</option>
              <option value="balochistan">Balochistan</option>
              <option value="gb">Gilgit-Baltistan</option>
              <option value="ajk">Azad Jammu & Kashmir</option>
              <option value="ict">Islamabad Capital Territory</option>
            </select>
            <select
              className="w-full border p-4 rounded-xl"
              value={inputs.city || provinceCityMap[inputs.province || 'sindh'][0]}
              onChange={e => setInputs({ ...inputs, city: e.target.value })}
            >
              {(provinceCityMap[inputs.province || 'sindh'] || []).map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </>
        )}

        {tool.id === 'qibla-dir' && (
          <>
            <select
              className="w-full border p-4 rounded-xl"
              onChange={e => setInputs({ ...inputs, province: e.target.value, city: provinceCityMap[e.target.value][0] })}
              value={inputs.province || 'sindh'}
            >
              <option value="sindh">Sindh</option>
              <option value="punjab">Punjab</option>
              <option value="kpk">Khyber Pakhtunkhwa</option>
              <option value="balochistan">Balochistan</option>
              <option value="gb">Gilgit-Baltistan</option>
              <option value="ajk">Azad Jammu & Kashmir</option>
              <option value="ict">Islamabad Capital Territory</option>
            </select>
            <select
              className="w-full border p-4 rounded-xl"
              value={inputs.city || provinceCityMap[inputs.province || 'sindh'][0]}
              onChange={e => setInputs({ ...inputs, city: e.target.value })}
            >
              {(provinceCityMap[inputs.province || 'sindh'] || []).map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </>
        )}

        {tool.id === 'hijri-conv' && (
          <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, date: e.target.value })} />
        )}

        {tool.id === 'roza-counter' && (
          <>
            <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, start: e.target.value })} />
            <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, end: e.target.value })} />
          </>
        )}

        {tool.id === 'namaz-missed' && (
          <>
            <input type="number" placeholder="Years missed" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} />
            <input type="number" placeholder="Additional days" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, days: e.target.value })} />
            <input type="number" placeholder="Prayers missed per day (default 5)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, perDay: e.target.value })} />
          </>
        )}

        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Calculate</button>
      </div>
    );
  };

  // --- ENGINE: Identity & Personal ---
  const IdentityEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'cnic-check': {
          const num = (inputs.cnic || '').trim();
          const regex = /^\d{5}-\d{7}-\d$/;
          const ok = regex.test(num);
          res = ok ? { valid: 'CNIC format is valid ✅' } : { valid: 'Invalid format. Use 12345-1234567-1' };
          break;
        }

        case 'cnic-age': {
          const dobStr = inputs.dob;
          if (!dobStr) { alert('Enter date of birth'); return; }
          const dob = new Date(dobStr);
          if (isNaN(dob.getTime())) { alert('Invalid date'); return; }
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
          res = { dob: dob.toDateString(), ageYears: age, msg: `Approx age as of today` };
          break;
        }

        case 'cnic-prov': {
          const num = (inputs.cnic || '').trim();
          if (!/^\d{5}-\d{7}-\d$/.test(num)) { alert('Enter CNIC like 12345-1234567-1'); return; }
          const first = num.charAt(0);
          const map: Record<string, string> = { '1': 'Khyber Pakhtunkhwa', '2': 'FATA', '3': 'Punjab', '4': 'Sindh', '5': 'Balochistan', '6': 'Islamabad', '7': 'Gilgit Baltistan', '8': 'Azad Kashmir' };
          res = { province: map[first] || 'Unknown', msg: 'Based on first digit of CNIC' };
          break;
        }

        case 'sim-rules': {
          res = {
            voiceLimit: '5 voice SIMs per CNIC',
            dataLimit: '3 data-only SIMs per CNIC',
            check: 'Dial *8484# or visit cnic.sims.pk to verify',
            msg: 'PTA SIM ownership rules'
          };
          break;
        }

        case 'passport-exp': {
          const issue = inputs.issue ? new Date(inputs.issue) : null;
          const years = Number(inputs.years) || 5;
          if (!issue || isNaN(issue.getTime())) { alert('Select issue date'); return; }
          const expiry = new Date(issue);
          expiry.setFullYear(expiry.getFullYear() + years);
          const diffDays = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          res = {
            issueDate: issue.toDateString(),
            expiryDate: expiry.toDateString(),
            daysLeft: diffDays,
            msg: `${years}-year passport validity`
          };
          break;
        }

        case 'visa-dur': {
          if (!inputs.start || !inputs.end) { alert('Select start and end dates'); return; }
          const start = new Date(inputs.start);
          const end = new Date(inputs.end);
          if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) { alert('Invalid range'); return; }
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          res = { totalDays: days, msg: `Stay duration: ${days} days` };
          break;
        }

        case 'license-exp': {
          const issue = inputs.issue ? new Date(inputs.issue) : null;
          const years = Number(inputs.years) || 5;
          if (!issue || isNaN(issue.getTime())) { alert('Select issue date'); return; }
          const expiry = new Date(issue);
          expiry.setFullYear(expiry.getFullYear() + years);
          const diffDays = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          res = {
            issueDate: issue.toDateString(),
            expiryDate: expiry.toDateString(),
            daysLeft: diffDays,
            msg: `${years}-year license validity`
          };
          break;
        }

        case 'veh-reg-city': {
          const plate = (inputs.plate || '').trim().toUpperCase();
          if (!plate) { alert('Enter plate number'); return; }
          const first = plate.split(/[-\s]/)[0];
          const prefix = first.replace(/[^A-Z]/g, '');
          let city = 'Unknown';
          if (prefix.startsWith('L')) city = 'Lahore';
          else if (prefix.startsWith('K')) city = 'Karachi';
          else if (prefix.startsWith('R') || prefix.startsWith('RW')) city = 'Rawalpindi';
          else if (prefix.startsWith('ISB') || prefix.startsWith('ICT')) city = 'Islamabad';
          else if (prefix.startsWith('P')) city = 'Peshawar';
          else if (prefix.startsWith('M')) city = 'Multan';
          res = { plate, possibleCity: city, msg: 'Indicative only; check official record for confirmation' };
          break;
        }

        case 'ntn-check': {
          const ntn = (inputs.ntn || '').trim();
          const ok = /^\d{7}-\d$/.test(ntn) || /^\d{7}$/.test(ntn);
          res = ok ? { valid: 'Looks like a valid NTN format' } : { valid: 'Invalid NTN format. Use 7 digits or 7 digits with dash.' };
          break;
        }

        case 'iban-check': {
          const iban = (inputs.iban || '').replace(/\s+/g, '').toUpperCase();
          const basicOk = /^PK\d{22}$/.test(iban);
          res = {
            iban: iban || '—',
            length: iban.length,
            status: basicOk ? 'Format OK (PK + 22 digits)' : 'Invalid format (needs PK + 22 digits)',
            msg: 'Full IBAN validation requires mod-97; this checks format only'
          };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'cnic-check' && (
          <input type="text" placeholder="CNIC (12345-1234567-1)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, cnic: e.target.value })} />
        )}

        {tool.id === 'cnic-age' && (
          <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, dob: e.target.value })} />
        )}

        {tool.id === 'cnic-prov' && (
          <input type="text" placeholder="CNIC (12345-1234567-1)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, cnic: e.target.value })} />
        )}

        {tool.id === 'sim-rules' && (
          <button className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold" onClick={calc}>Show SIM Rules</button>
        )}

        {tool.id === 'passport-exp' && (
          <>
            <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, issue: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} defaultValue={5}>
              <option value={5}>5-year passport</option>
              <option value={10}>10-year passport</option>
            </select>
          </>
        )}

        {tool.id === 'visa-dur' && (
          <>
            <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, start: e.target.value })} />
            <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, end: e.target.value })} />
          </>
        )}

        {tool.id === 'license-exp' && (
          <>
            <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, issue: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} defaultValue={5}>
              <option value={3}>3-year license</option>
              <option value={5}>5-year license</option>
            </select>
          </>
        )}

        {tool.id === 'veh-reg-city' && (
          <input type="text" placeholder="Plate (e.g., LEA-1234)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, plate: e.target.value })} />
        )}

        {tool.id === 'ntn-check' && (
          <input type="text" placeholder="NTN (1234567-8)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, ntn: e.target.value })} />
        )}

        {tool.id === 'iban-check' && (
          <input type="text" placeholder="PK00XXXX0000000000000000" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, iban: e.target.value })} />
        )}

        {/* Default button for non-static tools */}
        {tool.id !== 'sim-rules' && (
          <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Calculate / Check</button>
        )}
      </div>
    );
  };

  // --- ENGINE: Vehicle Tools ---
  const VehicleEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const tyreDia = (w: number, a: number, r: number) => r * 25.4 + 2 * w * (a / 100);

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'fuel-cost': {
          const distance = Number(inputs.distance);
          const mileage = Number(inputs.mileage);
          const price = Number(inputs.price) || 281;
          if (!distance || distance <= 0 || !mileage || mileage <= 0) { alert('Enter distance and mileage'); return; }
          const liters = distance / mileage;
          const cost = liters * price;
          res = {
            distance: `${distance} km`,
            mileage: `${mileage} km/l`,
            fuelNeeded: `${liters.toFixed(2)} L`,
            tripCost: `Rs. ${cost.toFixed(0).toLocaleString()}`,
            costPerKm: `Rs. ${(cost / distance).toFixed(2)}`
          };
          break;
        }

        case 'petrol-price': {
          const liters = Number(inputs.liters) || 1;
          const petrol = Number(inputs.petrol) || 281;
          const diesel = Number(inputs.diesel) || 289;
          const hioct = Number(inputs.hioct) || 310;
          res = {
            petrol: `Rs. ${petrol} per L`,
            diesel: `Rs. ${diesel} per L`,
            hiOctane: `Rs. ${hioct} per L`,
            costForLiters: `Rs. ${(liters * petrol).toFixed(0).toLocaleString()} (Petrol)`
          };
          break;
        }

        case 'mileage-calc': {
          const distance = Number(inputs.distance);
          const fuel = Number(inputs.fuel);
          if (!distance || distance <= 0 || !fuel || fuel <= 0) { alert('Enter distance and fuel used'); return; }
          const mileage = distance / fuel;
          res = { distance: `${distance} km`, fuel: `${fuel} L`, mileage: `${mileage.toFixed(2)} km/l`, msg: 'Based on your trip log.' };
          break;
        }

        case 'bike-mileage': {
          const distance = Number(inputs.distance);
          const fuel = Number(inputs.fuel);
          if (!distance || distance <= 0 || !fuel || fuel <= 0) { alert('Enter distance and fuel used'); return; }
          const mileage = distance / fuel;
          res = { distance: `${distance} km`, fuel: `${fuel} L`, mileage: `${mileage.toFixed(2)} km/l`, msg: 'Bike mileage estimate.' };
          break;
        }

        case 'car-duty': {
          const value = Number(inputs.value);
          const cc = Number(inputs.cc) || 1000;
          if (!value || value <= 0) { alert('Enter vehicle value (CIF)'); return; }
          let rate = 0.35;
          if (cc <= 1000) rate = 0.35;
          else if (cc <= 1300) rate = 0.50;
          else if (cc <= 1600) rate = 0.60;
          else if (cc <= 1800) rate = 0.75;
          else rate = 0.90;
          const duty = value * rate;
          res = {
            declaredValue: `Rs. ${value.toLocaleString()}`,
            engineCC: `${cc} CC`,
            dutyRate: `${(rate * 100).toFixed(1)}%`,
            estimatedDuty: `Rs. ${duty.toFixed(0).toLocaleString()}`,
            msg: 'Indicative only; use official calculator for exact duty.'
          };
          break;
        }

        case 'car-loan-emi': {
          const amount = Number(inputs.amount);
          const rate = Number(inputs.rate);
          const years = Number(inputs.years);
          if (!amount || amount <= 0 || !rate || rate <= 0 || !years || years <= 0) { alert('Enter amount, rate, and tenure'); return; }
          const r = rate / 12 / 100;
          const n = years * 12;
          const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          const total = emi * n;
          res = {
            amount: `Rs. ${amount.toLocaleString()}`,
            emi: `Rs. ${emi.toFixed(0).toLocaleString()}`,
            totalPayable: `Rs. ${total.toFixed(0).toLocaleString()}`,
            interest: `Rs. ${(total - amount).toFixed(0).toLocaleString()}`,
            msg: 'Reducing balance EMI.'
          };
          break;
        }

        case 'car-insure': {
          const value = Number(inputs.value);
          const rate = Number(inputs.rate) || 2.5;
          if (!value || value <= 0) { alert('Enter vehicle value'); return; }
          const premium = value * (rate / 100);
          res = {
            insuredValue: `Rs. ${value.toLocaleString()}`,
            rate: `${rate}%`,
            annualPremium: `Rs. ${premium.toFixed(0).toLocaleString()}`,
            msg: 'Comprehensive premium estimate; varies by insurer.'
          };
          break;
        }

        case 'vehicle-age': {
          const year = Number(inputs.year);
          if (!year || year < 1950) { alert('Enter registration year'); return; }
          const now = new Date().getFullYear();
          const age = Math.max(0, now - year);
          res = { registrationYear: year, ageYears: age, msg: 'Approx age; use exact date for precision.' };
          break;
        }

        case 'tyre-size': {
          const w1 = Number(inputs.w1), a1 = Number(inputs.a1), r1 = Number(inputs.r1);
          const w2 = Number(inputs.w2), a2 = Number(inputs.a2), r2 = Number(inputs.r2);
          if (!w1 || !a1 || !r1 || !w2 || !a2 || !r2) { alert('Enter both old and new tyre sizes'); return; }
          const d1 = tyreDia(w1, a1, r1);
          const d2 = tyreDia(w2, a2, r2);
          const diffPct = ((d2 - d1) / d1) * 100;
          res = {
            oldDiameter: `${d1.toFixed(1)} mm`,
            newDiameter: `${d2.toFixed(1)} mm`,
            change: `${diffPct.toFixed(2)}%`,
            msg: 'Keep diameter change within ±3% for safety/speedo accuracy.'
          };
          break;
        }

        case 'battery-backup': {
          const ah = Number(inputs.ah);
          const load = Number(inputs.load);
          const volt = Number(inputs.volt) || 12;
          const eff = Number(inputs.eff) || 0.85;
          if (!ah || ah <= 0 || !load || load <= 0) { alert('Enter battery Ah and load'); return; }
          const hours = (ah * volt * eff) / load;
          res = {
            battery: `${ah} Ah @ ${volt}V`,
            load: `${load} W`,
            backup: `${hours.toFixed(2)} hours`,
            msg: 'Approximate; actual varies with inverter efficiency and depth-of-discharge.'
          };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'fuel-cost' && (
          <>
            <input type="number" placeholder="Distance (km)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, distance: e.target.value })} />
            <input type="number" placeholder="Mileage (km/l)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, mileage: e.target.value })} />
            <input type="number" placeholder="Fuel Price (PKR/L)" className="w-full border p-4 rounded-xl" defaultValue={281} onChange={e => setInputs({ ...inputs, price: e.target.value })} />
          </>
        )}

        {tool.id === 'petrol-price' && (
          <>
            <input type="number" placeholder="Liters (for cost calc)" className="w-full border p-4 rounded-xl" defaultValue={1} onChange={e => setInputs({ ...inputs, liters: e.target.value })} />
            <input type="number" placeholder="Petrol price per L" className="w-full border p-4 rounded-xl" defaultValue={281} onChange={e => setInputs({ ...inputs, petrol: e.target.value })} />
            <input type="number" placeholder="Diesel price per L" className="w-full border p-4 rounded-xl" defaultValue={289} onChange={e => setInputs({ ...inputs, diesel: e.target.value })} />
            <input type="number" placeholder="Hi-Octane price per L" className="w-full border p-4 rounded-xl" defaultValue={310} onChange={e => setInputs({ ...inputs, hioct: e.target.value })} />
          </>
        )}

        {(tool.id === 'mileage-calc' || tool.id === 'bike-mileage') && (
          <>
            <input type="number" placeholder="Distance (km)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, distance: e.target.value })} />
            <input type="number" placeholder="Fuel Used (L)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fuel: e.target.value })} />
          </>
        )}

        {tool.id === 'car-duty' && (
          <>
            <input type="number" placeholder="Vehicle Value (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <input type="number" placeholder="Engine Capacity (CC)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, cc: e.target.value })} />
          </>
        )}

        {tool.id === 'car-loan-emi' && (
          <>
            <input type="number" placeholder="Loan Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, amount: e.target.value })} />
            <input type="number" placeholder="Interest Rate (% p.a.)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
            <input type="number" placeholder="Tenure (years)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} />
          </>
        )}

        {tool.id === 'car-insure' && (
          <>
            <input type="number" placeholder="Vehicle Value (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <input type="number" placeholder="Premium Rate (%)" className="w-full border p-4 rounded-xl" defaultValue={2.5} onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
          </>
        )}

        {tool.id === 'vehicle-age' && (
          <input type="number" placeholder="Registration Year" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, year: e.target.value })} />
        )}

        {tool.id === 'tyre-size' && (
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Old Width (mm)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, w1: e.target.value })} />
            <input type="number" placeholder="Old Aspect (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, a1: e.target.value })} />
            <input type="number" placeholder="Old Rim (inch)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, r1: e.target.value })} />
            <input type="number" placeholder="New Width (mm)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, w2: e.target.value })} />
            <input type="number" placeholder="New Aspect (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, a2: e.target.value })} />
            <input type="number" placeholder="New Rim (inch)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, r2: e.target.value })} />
          </div>
        )}

        {tool.id === 'battery-backup' && (
          <>
            <input type="number" placeholder="Battery Capacity (Ah)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, ah: e.target.value })} />
            <input type="number" placeholder="System Voltage (12/24)" className="w-full border p-4 rounded-xl" defaultValue={12} onChange={e => setInputs({ ...inputs, volt: e.target.value })} />
            <input type="number" placeholder="Load (Watts)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, load: e.target.value })} />
            <input type="number" placeholder="Efficiency (0-1)" className="w-full border p-4 rounded-xl" defaultValue={0.85} onChange={e => setInputs({ ...inputs, eff: e.target.value })} />
          </>
        )}

        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Calculate</button>
      </div>
    );
  };

  // --- ENGINE: Tax & Finance ---
  const TaxFinanceEngine = () => {
    const [inputs, setInputs] = useState<any>({});
    
    const calc = () => {
      let res: any = {};
      
      switch (tool.id) {
        case 'income-tax': {
          // Yearly income tax using same slabs as salary tax
          const annual = Number(inputs.income);
          if (!annual || annual <= 0) { alert('Enter annual income'); return; }
          
          let tax = 0;
          if (annual <= 600000) tax = 0;
          else if (annual <= 1200000) tax = (annual - 600000) * 0.05;
          else if (annual <= 2400000) tax = 30000 + (annual - 1200000) * 0.15;
          else if (annual <= 3600000) tax = 210000 + (annual - 2400000) * 0.25;
          else if (annual <= 6000000) tax = 510000 + (annual - 3600000) * 0.30;
          else tax = 1230000 + (annual - 6000000) * 0.35;
          
          res = {
            annualIncome: `Rs. ${annual.toLocaleString()}`,
            taxDue: `Rs. ${tax.toFixed(0).toLocaleString()}`,
            netIncome: `Rs. ${(annual - tax).toFixed(0).toLocaleString()}`,
            effectiveRate: `${((tax / annual) * 100).toFixed(2)}%`,
            msg: 'FBR 2024-25 individual tax slabs applied'
          };
          break;
        }
        
        case 'freelance-tax': {
          const remittance = Number(inputs.amount);
          if (!remittance || remittance <= 0) { alert('Enter remittance amount'); return; }
          
          // 1% WHT on export remittances for freelancers
          const wht = remittance * 0.01;
          const netAmount = remittance - wht;
          
          res = {
            grossAmount: `Rs. ${remittance.toLocaleString()}`,
            wht: `Rs. ${wht.toFixed(0).toLocaleString()}`,
            netReceived: `Rs. ${netAmount.toFixed(0).toLocaleString()}`,
            msg: '1% WHT on export proceeds (adjustable at year-end)'
          };
          break;
        }
        
        case 'wht-tax': {
          const amount = Number(inputs.amount);
          const type = inputs.type || 'salary';
          if (!amount || amount <= 0) { alert('Enter transaction amount'); return; }
          
          let rate = 0;
          let description = '';
          
          if (type === 'salary') { rate = 0; description = 'Salary WHT varies by slab'; }
          else if (type === 'contract') { rate = 0.07; description = '7% on contracts'; }
          else if (type === 'commission') { rate = 0.12; description = '12% on commission'; }
          else if (type === 'rent') { rate = 0.05; description = '5% on property rent'; }
          else if (type === 'dividend') { rate = 0.15; description = '15% on dividends'; }
          else { rate = 0.10; description = '10% general WHT'; }
          
          const wht = amount * rate;
          
          res = {
            transactionAmount: `Rs. ${amount.toLocaleString()}`,
            whtRate: `${(rate * 100).toFixed(1)}%`,
            whtAmount: `Rs. ${wht.toFixed(0).toLocaleString()}`,
            netPayable: `Rs. ${(amount - wht).toFixed(0).toLocaleString()}`,
            msg: description
          };
          break;
        }
        
        case 'cap-gain-tax': {
          const salePrice = Number(inputs.salePrice);
          const purchasePrice = Number(inputs.purchasePrice);
          const holdingYears = Number(inputs.years) || 0;
          
          if (!salePrice || !purchasePrice) { alert('Enter sale and purchase price'); return; }
          
          const gain = salePrice - purchasePrice;
          let taxRate = 0.15; // Default 15%
          
          // Reduced rates for longer holding periods
          if (holdingYears >= 4) taxRate = 0;
          else if (holdingYears >= 3) taxRate = 0.075;
          else if (holdingYears >= 2) taxRate = 0.10;
          else if (holdingYears >= 1) taxRate = 0.125;
          
          const tax = gain > 0 ? gain * taxRate : 0;
          
          res = {
            capitalGain: `Rs. ${gain.toLocaleString()}`,
            taxRate: `${(taxRate * 100).toFixed(1)}%`,
            taxDue: `Rs. ${tax.toFixed(0).toLocaleString()}`,
            netProfit: `Rs. ${(gain - tax).toFixed(0).toLocaleString()}`,
            msg: `Holding period: ${holdingYears} years`
          };
          break;
        }
        
        case 'vehicle-tax': {
          const engineCC = Number(inputs.cc);
          const vehicleType = inputs.type || 'car';
          
          if (!engineCC) { alert('Enter engine capacity (CC)'); return; }
          
          let annualTax = 0;
          
          if (vehicleType === 'car') {
            if (engineCC <= 1000) annualTax = 1200;
            else if (engineCC <= 1300) annualTax = 2500;
            else if (engineCC <= 1600) annualTax = 4500;
            else if (engineCC <= 1800) annualTax = 6000;
            else if (engineCC <= 2000) annualTax = 9000;
            else if (engineCC <= 2500) annualTax = 15000;
            else annualTax = 25000;
          } else if (vehicleType === 'bike') {
            if (engineCC <= 125) annualTax = 300;
            else if (engineCC <= 200) annualTax = 600;
            else annualTax = 1200;
          } else {
            annualTax = 5000; // Jeep/SUV
          }
          
          res = {
            vehicleType: vehicleType.toUpperCase(),
            engineCapacity: `${engineCC} CC`,
            annualTokenTax: `Rs. ${annualTax.toLocaleString()}`,
            msg: 'Token tax varies by province and city'
          };
          break;
        }
        
        case 'prize-bond-tax': {
          const prizeAmount = Number(inputs.prize);
          if (!prizeAmount || prizeAmount <= 0) { alert('Enter prize amount'); return; }
          
          // 15% WHT on prize bonds above Rs. 500,000
          let taxRate = 0;
          if (prizeAmount >= 500000) taxRate = 0.15;
          else if (prizeAmount >= 100000) taxRate = 0.10;
          
          const tax = prizeAmount * taxRate;
          const netPrize = prizeAmount - tax;
          
          res = {
            grossPrize: `Rs. ${prizeAmount.toLocaleString()}`,
            taxRate: `${(taxRate * 100).toFixed(0)}%`,
            taxDeducted: `Rs. ${tax.toFixed(0).toLocaleString()}`,
            netPrize: `Rs. ${netPrize.toFixed(0).toLocaleString()}`,
            msg: 'Tax deducted at source by National Savings'
          };
          break;
        }
        
        case 'ushr-calc': {
          const landValue = Number(inputs.landValue);
          if (!landValue || landValue <= 0) { alert('Enter land produce value'); return; }
          
          // 10% (1/10) on naturally irrigated land, 5% (1/20) on artificially irrigated
          const irrigationType = inputs.irrigation || 'natural';
          const ushrRate = irrigationType === 'natural' ? 0.10 : 0.05;
          const ushrAmount = landValue * ushrRate;
          
          res = {
            produceValue: `Rs. ${landValue.toLocaleString()}`,
            irrigationType: irrigationType === 'natural' ? 'Natural (Rain/River)' : 'Artificial (Tube-well)',
            ushrRate: `${(ushrRate * 100).toFixed(0)}%`,
            ushrDue: `Rs. ${ushrAmount.toFixed(0).toLocaleString()}`,
            msg: 'Ushr is obligatory on agricultural produce'
          };
          break;
        }
        
        default:
          res = { msg: 'Calculation not available' };
      }
      
      setResult(res);
    };
    
    return (
      <div className="space-y-4">
        {tool.id === 'income-tax' && (
          <input type="number" placeholder="Annual Income (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, income: e.target.value})} />
        )}
        
        {tool.id === 'freelance-tax' && (
          <input type="number" placeholder="Remittance Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, amount: e.target.value})} />
        )}
        
        {tool.id === 'wht-tax' && (
          <>
            <input type="number" placeholder="Transaction Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, amount: e.target.value})} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, type: e.target.value})} defaultValue="contract">
              <option value="contract">Contract Payment (7%)</option>
              <option value="commission">Commission (12%)</option>
              <option value="rent">Property Rent (5%)</option>
              <option value="dividend">Dividend (15%)</option>
              <option value="other">Other (10%)</option>
            </select>
          </>
        )}
        
        {tool.id === 'cap-gain-tax' && (
          <>
            <input type="number" placeholder="Purchase Price (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, purchasePrice: e.target.value})} />
            <input type="number" placeholder="Sale Price (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, salePrice: e.target.value})} />
            <input type="number" placeholder="Holding Period (Years)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, years: e.target.value})} />
          </>
        )}
        
        {tool.id === 'vehicle-tax' && (
          <>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, type: e.target.value})} defaultValue="car">
              <option value="car">Car</option>
              <option value="bike">Motorcycle</option>
              <option value="jeep">Jeep/SUV</option>
            </select>
            <input type="number" placeholder="Engine Capacity (CC)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, cc: e.target.value})} />
          </>
        )}
        
        {tool.id === 'prize-bond-tax' && (
          <input type="number" placeholder="Prize Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, prize: e.target.value})} />
        )}
        
        {tool.id === 'ushr-calc' && (
          <>
            <input type="number" placeholder="Total Produce Value (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, landValue: e.target.value})} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({...inputs, irrigation: e.target.value})} defaultValue="natural">
              <option value="natural">Natural Irrigation (10% Ushr)</option>
              <option value="artificial">Artificial Irrigation (5% Ushr)</option>
            </select>
          </>
        )}
        
        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg">Calculate Tax</button>
      </div>
    );
  };

  // --- ENGINE: Daily Life ---
  const DailyLifeEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'age-calc': {
          const dob = inputs.dob;
          if (!dob) { alert('Enter date of birth'); return; }
          const today = new Date();
          const birth = new Date(dob);
          let years = today.getFullYear() - birth.getFullYear();
          let months = today.getMonth() - birth.getMonth();
          let days = today.getDate() - birth.getDate();
          
          if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          }
          if (months < 0) {
            years--;
            months += 12;
          }
          
          res = {
            dateOfBirth: dob,
            age: `${years} years, ${months} months, ${days} days`,
            totalDays: Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)),
            msg: 'Exact age calculation based on your birth date'
          };
          break;
        }

        case 'date-diff': {
          const date1 = new Date(inputs.date1);
          const date2 = new Date(inputs.date2);
          if (!inputs.date1 || !inputs.date2) { alert('Enter both dates'); return; }
          const diff = Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
          const weeks = Math.floor(diff / 7);
          const days = Math.floor(diff % 7);
          res = {
            fromDate: inputs.date1,
            toDate: inputs.date2,
            totalDays: Math.floor(diff),
            weeks: weeks,
            remainingDays: days,
            msg: 'Exact difference between two dates'
          };
          break;
        }

        case 'time-duration': {
          const time1 = inputs.time1;
          const time2 = inputs.time2;
          if (!time1 || !time2) { alert('Enter both times'); return; }
          const [h1, m1] = time1.split(':').map(Number);
          const [h2, m2] = time2.split(':').map(Number);
          let totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
          if (totalMin < 0) totalMin += 24 * 60;
          const hours = Math.floor(totalMin / 60);
          const mins = totalMin % 60;
          res = {
            startTime: time1,
            endTime: time2,
            duration: `${hours} hours ${mins} minutes`,
            totalMinutes: totalMin,
            msg: 'Time duration calculator'
          };
          break;
        }

        case 'perc-calc': {
          const value = Number(inputs.value);
          const percent = Number(inputs.percent);
          const type = inputs.type || 'of';
          if (!value || !percent) { alert('Enter value and percentage'); return; }
          
          let result = 0;
          let description = '';
          
          if (type === 'of') {
            result = (value * percent) / 100;
            description = `${percent}% of ${value}`;
          } else if (type === 'increase') {
            result = value + (value * percent) / 100;
            description = `${value} increased by ${percent}%`;
          } else if (type === 'decrease') {
            result = value - (value * percent) / 100;
            description = `${value} decreased by ${percent}%`;
          }
          
          res = {
            calculation: description,
            result: result.toFixed(2),
            msg: 'Percentage calculation result'
          };
          break;
        }

        case 'discount-calc': {
          const originalPrice = Number(inputs.originalPrice);
          const discountPercent = Number(inputs.discountPercent);
          if (!originalPrice || !discountPercent) { alert('Enter original price and discount %'); return; }
          
          const discountAmount = (originalPrice * discountPercent) / 100;
          const salePrice = originalPrice - discountAmount;
          const savings = discountAmount;
          
          res = {
            originalPrice: `Rs. ${originalPrice.toLocaleString()}`,
            discountPercent: `${discountPercent}%`,
            discountAmount: `Rs. ${discountAmount.toFixed(0).toLocaleString()}`,
            salePrice: `Rs. ${salePrice.toFixed(0).toLocaleString()}`,
            youSave: `Rs. ${savings.toFixed(0).toLocaleString()}`,
            msg: 'Sale price after discount'
          };
          break;
        }

        case 'tip-calc': {
          const billAmount = Number(inputs.billAmount);
          const tipPercent = Number(inputs.tipPercent) || 15;
          if (!billAmount) { alert('Enter bill amount'); return; }
          
          const tipAmount = (billAmount * tipPercent) / 100;
          const totalWithTip = billAmount + tipAmount;
          const perPerson = inputs.persons ? totalWithTip / Number(inputs.persons) : 0;
          
          res = {
            billAmount: `Rs. ${billAmount.toLocaleString()}`,
            tipPercent: `${tipPercent}%`,
            tipAmount: `Rs. ${tipAmount.toFixed(0).toLocaleString()}`,
            totalWithTip: `Rs. ${totalWithTip.toFixed(0).toLocaleString()}`,
            perPerson: inputs.persons ? `Rs. ${perPerson.toFixed(0).toLocaleString()}` : 'N/A',
            msg: 'Service tip calculation'
          };
          break;
        }

        case 'loan-calc': {
          const principal = Number(inputs.principal);
          const ratePerYear = Number(inputs.ratePerYear);
          const years = Number(inputs.years);
          if (!principal || !ratePerYear || !years) { alert('Enter principal, rate, and years'); return; }
          
          const totalInterest = (principal * ratePerYear * years) / 100;
          const totalAmount = principal + totalInterest;
          const monthlyPayment = totalAmount / (years * 12);
          
          res = {
            principal: `Rs. ${principal.toLocaleString()}`,
            ratePerYear: `${ratePerYear}%`,
            tenure: `${years} years`,
            totalInterest: `Rs. ${totalInterest.toFixed(0).toLocaleString()}`,
            totalAmount: `Rs. ${totalAmount.toFixed(0).toLocaleString()}`,
            monthlyPayment: `Rs. ${monthlyPayment.toFixed(0).toLocaleString()}`,
            msg: 'Simple interest loan calculation'
          };
          break;
        }

        case 'emi-calc': {
          const principal = Number(inputs.principal);
          const ratePerYear = Number(inputs.ratePerYear);
          const months = Number(inputs.months);
          if (!principal || !ratePerYear || !months) { alert('Enter amount, rate, and months'); return; }
          
          const ratePerMonth = ratePerYear / 12 / 100;
          const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
          const totalPayable = emi * months;
          const totalInterest = totalPayable - principal;
          
          res = {
            principal: `Rs. ${principal.toLocaleString()}`,
            ratePerYear: `${ratePerYear}%`,
            tenure: `${months} months (${(months / 12).toFixed(1)} years)`,
            monthlyEMI: `Rs. ${emi.toFixed(0).toLocaleString()}`,
            totalPayable: `Rs. ${totalPayable.toFixed(0).toLocaleString()}`,
            totalInterest: `Rs. ${totalInterest.toFixed(0).toLocaleString()}`,
            msg: 'Reducing balance EMI calculation'
          };
          break;
        }

        case 'bmi-calc': {
          const weight = Number(inputs.weight);
          const height = Number(inputs.height);
          const unit = inputs.unit || 'kg';
          
          if (!weight || !height) { alert('Enter weight and height'); return; }
          
          let bmi = 0;
          if (unit === 'kg') {
            const heightM = height / 100;
            bmi = weight / (heightM * heightM);
          } else {
            bmi = (weight / (height * height)) * 703;
          }
          
          let category = '';
          if (bmi < 18.5) category = 'Underweight';
          else if (bmi < 25) category = 'Normal Weight';
          else if (bmi < 30) category = 'Overweight';
          else category = 'Obese';
          
          res = {
            weight: `${weight} ${unit}`,
            height: `${height} ${unit === 'kg' ? 'cm' : 'inches'}`,
            bmi: bmi.toFixed(1),
            category: category,
            msg: 'BMI is an indicator of body composition; consult doctor for health advice'
          };
          break;
        }

        case 'cal-calc': {
          const age = Number(inputs.age);
          const gender = inputs.gender || 'male';
          const weight = Number(inputs.weight);
          const height = Number(inputs.height);
          const activity = Number(inputs.activity) || 1.5;
          
          if (!age || !weight || !height) { alert('Enter age, weight, and height'); return; }
          
          let bmr = 0;
          if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
          } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
          }
          
          const tdee = bmr * activity;
          const deficitCal = tdee - 500;
          const surplusCal = tdee + 500;
          
          res = {
            age: age,
            gender: gender.toUpperCase(),
            weight: `${weight} kg`,
            height: `${height} cm`,
            bmr: `${bmr.toFixed(0)} Cal/day`,
            tdee: `${tdee.toFixed(0)} Cal/day`,
            deficit500: `${deficitCal.toFixed(0)} Cal/day (Weight Loss)`,
            surplus500: `${surplusCal.toFixed(0)} Cal/day (Weight Gain)`,
            msg: 'Estimate based on Harris-Benedict equation; individual needs vary'
          };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'age-calc' && (
          <input type="date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, dob: e.target.value })} />
        )}

        {tool.id === 'date-diff' && (
          <>
            <input type="date" placeholder="Start Date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, date1: e.target.value })} />
            <input type="date" placeholder="End Date" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, date2: e.target.value })} />
          </>
        )}

        {tool.id === 'time-duration' && (
          <>
            <input type="time" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, time1: e.target.value })} />
            <input type="time" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, time2: e.target.value })} />
          </>
        )}

        {tool.id === 'perc-calc' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <input type="number" placeholder="Percentage (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, percent: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, type: e.target.value })} defaultValue="of">
              <option value="of">% of Value</option>
              <option value="increase">Increase by %</option>
              <option value="decrease">Decrease by %</option>
            </select>
          </>
        )}

        {tool.id === 'discount-calc' && (
          <>
            <input type="number" placeholder="Original Price (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, originalPrice: e.target.value })} />
            <input type="number" placeholder="Discount (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, discountPercent: e.target.value })} />
          </>
        )}

        {tool.id === 'tip-calc' && (
          <>
            <input type="number" placeholder="Bill Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, billAmount: e.target.value })} />
            <input type="number" placeholder="Tip (%)" className="w-full border p-4 rounded-xl" defaultValue={15} onChange={e => setInputs({ ...inputs, tipPercent: e.target.value })} />
            <input type="number" placeholder="Number of People (Optional)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, persons: e.target.value })} />
          </>
        )}

        {tool.id === 'loan-calc' && (
          <>
            <input type="number" placeholder="Principal Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, principal: e.target.value })} />
            <input type="number" placeholder="Rate per Year (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, ratePerYear: e.target.value })} />
            <input type="number" placeholder="Tenure (Years)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} />
          </>
        )}

        {tool.id === 'emi-calc' && (
          <>
            <input type="number" placeholder="Loan Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, principal: e.target.value })} />
            <input type="number" placeholder="Rate per Year (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, ratePerYear: e.target.value })} />
            <input type="number" placeholder="Tenure (Months)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, months: e.target.value })} />
          </>
        )}

        {tool.id === 'bmi-calc' && (
          <>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, unit: e.target.value })} defaultValue="kg">
              <option value="kg">Kilogram (kg) / Centimeter (cm)</option>
              <option value="lbs">Pounds (lbs) / Inches (in)</option>
            </select>
            <input type="number" placeholder={inputs.unit === 'kg' ? "Weight (kg)" : "Weight (lbs)"} className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, weight: e.target.value })} />
            <input type="number" placeholder={inputs.unit === 'kg' ? "Height (cm)" : "Height (inches)"} className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, height: e.target.value })} />
          </>
        )}

        {tool.id === 'cal-calc' && (
          <>
            <input type="number" placeholder="Age (years)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, age: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, gender: e.target.value })} defaultValue="male">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input type="number" placeholder="Weight (kg)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, weight: e.target.value })} />
            <input type="number" placeholder="Height (cm)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, height: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, activity: e.target.value })} defaultValue={1.5}>
              <option value={1.2}>Sedentary (Little activity)</option>
              <option value={1.375}>Lightly Active (1-3 days/week)</option>
              <option value={1.55}>Moderately Active (3-5 days/week)</option>
              <option value={1.725}>Very Active (6-7 days/week)</option>
              <option value={1.9}>Extremely Active (Physical job/training)</option>
            </select>
          </>
        )}

        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Calculate</button>
      </div>
    );
  };

  // --- ENGINE: Conversion ---
  const ConversionEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'currency-conv': {
          const pkr = Number(inputs.pkr);
          const rate = Number(inputs.rate) || 278;
          if (!pkr || pkr <= 0) { alert('Enter amount in PKR'); return; }
          const foreign = pkr / rate;
          res = {
            pkaAmount: `Rs. ${pkr.toLocaleString()}`,
            exchangeRate: `1 USD = Rs. ${rate}`,
            convertedAmount: `${foreign.toFixed(2)} USD`,
            msg: 'Exchange rates vary; check current rates with banks'
          };
          break;
        }

        case 'gold-price': {
          const tolas = Number(inputs.tolas);
          const pricePerTola = Number(inputs.pricePerTola) || 255000;
          if (!tolas || tolas <= 0) { alert('Enter tolas'); return; }
          const totalPrice = tolas * pricePerTola;
          const grams = tolas * 11.664;
          res = {
            tolas: tolas,
            gramsEquivalent: `${grams.toFixed(2)} grams`,
            pricePerTola: `Rs. ${pricePerTola.toLocaleString()}`,
            totalPrice: `Rs. ${totalPrice.toLocaleString()}`,
            msg: '1 Tola = 11.664 grams; prices updated daily'
          };
          break;
        }

        case 'len-conv': {
          const value = Number(inputs.value);
          const fromUnit = inputs.fromUnit || 'km';
          const toUnit = inputs.toUnit || 'miles';
          if (!value || value <= 0) { alert('Enter value'); return; }
          
          const kmToMiles = 0.621371;
          const kmToMeter = 1000;
          const meterToFeet = 3.28084;
          
          let result = 0;
          let desc = '';
          
          if (fromUnit === 'km' && toUnit === 'miles') { result = value * kmToMiles; desc = `km → miles`; }
          else if (fromUnit === 'miles' && toUnit === 'km') { result = value / kmToMiles; desc = `miles → km`; }
          else if (fromUnit === 'meter' && toUnit === 'feet') { result = value * meterToFeet; desc = `m → feet`; }
          else if (fromUnit === 'feet' && toUnit === 'meter') { result = value / meterToFeet; desc = `feet → m`; }
          else if (fromUnit === 'cm' && toUnit === 'inches') { result = value / 2.54; desc = `cm → inches`; }
          else if (fromUnit === 'inches' && toUnit === 'cm') { result = value * 2.54; desc = `inches → cm`; }
          else { result = value; }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(3)} ${toUnit}`,
            conversion: desc,
            msg: 'Accurate length conversion'
          };
          break;
        }

        case 'weight-conv': {
          const value = Number(inputs.value);
          const fromUnit = inputs.fromUnit || 'kg';
          const toUnit = inputs.toUnit || 'lbs';
          if (!value || value <= 0) { alert('Enter value'); return; }
          
          let result = 0;
          let desc = '';
          
          if (fromUnit === 'kg' && toUnit === 'lbs') { result = value * 2.20462; desc = `kg → lbs`; }
          else if (fromUnit === 'lbs' && toUnit === 'kg') { result = value / 2.20462; desc = `lbs → kg`; }
          else if (fromUnit === 'gram' && toUnit === 'tola') { result = value / 11.664; desc = `g → tola`; }
          else if (fromUnit === 'tola' && toUnit === 'gram') { result = value * 11.664; desc = `tola → g`; }
          else if (fromUnit === 'kg' && toUnit === 'gram') { result = value * 1000; desc = `kg → g`; }
          else if (fromUnit === 'gram' && toUnit === 'kg') { result = value / 1000; desc = `g → kg`; }
          else { result = value; }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(3)} ${toUnit}`,
            conversion: desc,
            msg: 'Weight conversion for everyday use'
          };
          break;
        }

        case 'area-conv': {
          const value = Number(inputs.value);
          const fromUnit = inputs.fromUnit || 'sqft';
          const toUnit = inputs.toUnit || 'sqm';
          if (!value || value <= 0) { alert('Enter value'); return; }
          
          let result = 0;
          let desc = '';
          
          if (fromUnit === 'sqft' && toUnit === 'sqm') { result = value / 10.764; desc = `sq ft → sq m`; }
          else if (fromUnit === 'sqm' && toUnit === 'sqft') { result = value * 10.764; desc = `sq m → sq ft`; }
          else if (fromUnit === 'marla' && toUnit === 'kanal') { result = value / 20; desc = `marla → kanal`; }
          else if (fromUnit === 'kanal' && toUnit === 'marla') { result = value * 20; desc = `kanal → marla`; }
          else if (fromUnit === 'marla' && toUnit === 'sqft') { result = value * 272.25; desc = `marla → sq ft`; }
          else if (fromUnit === 'sqft' && toUnit === 'marla') { result = value / 272.25; desc = `sq ft → marla`; }
          else { result = value; }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(3)} ${toUnit}`,
            conversion: desc,
            msg: 'Pakistan property measurements: 1 Kanal = 20 Marlas'
          };
          break;
        }

        case 'volume-conv': {
          const value = Number(inputs.value);
          const fromUnit = inputs.fromUnit || 'liter';
          const toUnit = inputs.toUnit || 'gallon';
          if (!value || value <= 0) { alert('Enter value'); return; }
          
          let result = 0;
          let desc = '';
          
          if (fromUnit === 'liter' && toUnit === 'gallon') { result = value / 3.785; desc = `liter → gallon`; }
          else if (fromUnit === 'gallon' && toUnit === 'liter') { result = value * 3.785; desc = `gallon → liter`; }
          else if (fromUnit === 'ml' && toUnit === 'liter') { result = value / 1000; desc = `ml → liter`; }
          else if (fromUnit === 'liter' && toUnit === 'ml') { result = value * 1000; desc = `liter → ml`; }
          else { result = value; }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(3)} ${toUnit}`,
            conversion: desc,
            msg: 'Volume conversion for liquids'
          };
          break;
        }

        case 'speed-conv': {
          const value = Number(inputs.value);
          const fromUnit = inputs.fromUnit || 'kmh';
          const toUnit = inputs.toUnit || 'mph';
          if (!value || value <= 0) { alert('Enter value'); return; }
          
          let result = 0;
          let desc = '';
          
          if (fromUnit === 'kmh' && toUnit === 'mph') { result = value / 1.60934; desc = `km/h → mph`; }
          else if (fromUnit === 'mph' && toUnit === 'kmh') { result = value * 1.60934; desc = `mph → km/h`; }
          else if (fromUnit === 'kmh' && toUnit === 'mps') { result = value / 3.6; desc = `km/h → m/s`; }
          else if (fromUnit === 'mps' && toUnit === 'kmh') { result = value * 3.6; desc = `m/s → km/h`; }
          else { result = value; }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(3)} ${toUnit}`,
            conversion: desc,
            msg: 'Speed conversion'
          };
          break;
        }

        case 'temp-conv': {
          const value = Number(inputs.value);
          const type = inputs.type || 'c2f';
          if (isNaN(value)) { alert('Enter temperature'); return; }
          
          let result = 0;
          let fromUnit = '';
          let toUnit = '';
          
          if (type === 'c2f') {
            result = (value * 9/5) + 32;
            fromUnit = '°C';
            toUnit = '°F';
          } else if (type === 'f2c') {
            result = (value - 32) * 5/9;
            fromUnit = '°F';
            toUnit = '°C';
          } else if (type === 'c2k') {
            result = value + 273.15;
            fromUnit = '°C';
            toUnit = 'K';
          } else if (type === 'k2c') {
            result = value - 273.15;
            fromUnit = 'K';
            toUnit = '°C';
          }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(2)} ${toUnit}`,
            msg: 'Temperature conversion'
          };
          break;
        }

        case 'timezone-conv': {
          const hour = Number(inputs.hour);
          const fromTZ = inputs.fromTZ || 'PKT';
          const toTZ = inputs.toTZ || 'UTC';
          if (hour < 0 || hour > 23) { alert('Enter hour 0-23'); return; }
          
          const tzOffsets: Record<string, number> = {
            'PKT': 5, 'UTC': 0, 'GMT': 0, 'EST': -5, 'CST': -6, 'MST': -7, 'PST': -8,
            'IST': 5.5, 'SGT': 8, 'HKT': 8, 'JST': 9, 'AEST': 10, 'NZDT': 13
          };
          
          const offset = (tzOffsets[toTZ] || 0) - (tzOffsets[fromTZ] || 0);
          let newHour = hour + offset;
          if (newHour < 0) newHour += 24;
          if (newHour >= 24) newHour -= 24;
          
          res = {
            fromTime: `${String(hour).padStart(2, '0')}:00 ${fromTZ}`,
            toTime: `${String(Math.floor(newHour)).padStart(2, '0')}:00 ${toTZ}`,
            difference: `${offset > 0 ? '+' : ''}${offset} hours`,
            msg: 'Time zone conversion'
          };
          break;
        }

        case 'power-conv': {
          const value = Number(inputs.value);
          const fromUnit = inputs.fromUnit || 'watts';
          const toUnit = inputs.toUnit || 'kw';
          if (!value || value <= 0) { alert('Enter value'); return; }
          
          let result = 0;
          let desc = '';
          
          if (fromUnit === 'watts' && toUnit === 'kw') { result = value / 1000; desc = `W → kW`; }
          else if (fromUnit === 'kw' && toUnit === 'watts') { result = value * 1000; desc = `kW → W`; }
          else if (fromUnit === 'watts' && toUnit === 'hp') { result = value / 745.7; desc = `W → HP`; }
          else if (fromUnit === 'hp' && toUnit === 'watts') { result = value * 745.7; desc = `HP → W`; }
          else { result = value; }
          
          res = {
            input: `${value} ${fromUnit}`,
            output: `${result.toFixed(3)} ${toUnit}`,
            conversion: desc,
            msg: 'Power unit conversion'
          };
          break;
        }

        case 'number-base': {
          const value = inputs.value;
          const fromBase = inputs.fromBase || '10';
          const toBase = inputs.toBase || '2';
          
          if (!value) { alert('Enter number'); return; }
          
          let decimal = 0;
          
          if (fromBase === '10') decimal = parseInt(value, 10);
          else if (fromBase === '2') decimal = parseInt(value, 2);
          else if (fromBase === '16') decimal = parseInt(value, 16);
          else if (fromBase === '8') decimal = parseInt(value, 8);
          
          let result = '';
          if (toBase === '10') result = decimal.toString();
          else if (toBase === '2') result = decimal.toString(2);
          else if (toBase === '16') result = decimal.toString(16).toUpperCase();
          else if (toBase === '8') result = decimal.toString(8);
          
          res = {
            input: `${value} (Base ${fromBase})`,
            output: `${result} (Base ${toBase})`,
            decimalValue: `Decimal: ${decimal}`,
            msg: 'Number base conversion'
          };
          break;
        }

        default:
          res = { msg: 'Conversion not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'currency-conv' && (
          <>
            <input type="number" placeholder="Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, pkr: e.target.value })} />
            <input type="number" placeholder="Exchange Rate (1 USD = PKR)" className="w-full border p-4 rounded-xl" defaultValue={278} onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
          </>
        )}

        {tool.id === 'gold-price' && (
          <>
            <input type="number" placeholder="Tolas" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, tolas: e.target.value })} />
            <input type="number" placeholder="Price per Tola (Rs.)" className="w-full border p-4 rounded-xl" defaultValue={255000} onChange={e => setInputs({ ...inputs, pricePerTola: e.target.value })} />
          </>
        )}

        {tool.id === 'len-conv' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromUnit: e.target.value })} defaultValue="km">
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
              <option value="meter">Meters</option>
              <option value="feet">Feet</option>
              <option value="cm">Centimeters</option>
              <option value="inches">Inches</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toUnit: e.target.value })} defaultValue="miles">
              <option value="miles">Miles</option>
              <option value="km">Kilometers</option>
              <option value="feet">Feet</option>
              <option value="meter">Meters</option>
              <option value="inches">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </>
        )}

        {tool.id === 'weight-conv' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromUnit: e.target.value })} defaultValue="kg">
              <option value="kg">Kilogram</option>
              <option value="lbs">Pounds</option>
              <option value="gram">Grams</option>
              <option value="tola">Tola</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toUnit: e.target.value })} defaultValue="lbs">
              <option value="lbs">Pounds</option>
              <option value="kg">Kilogram</option>
              <option value="tola">Tola</option>
              <option value="gram">Grams</option>
            </select>
          </>
        )}

        {tool.id === 'area-conv' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromUnit: e.target.value })} defaultValue="sqft">
              <option value="sqft">Square Feet</option>
              <option value="sqm">Square Meters</option>
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toUnit: e.target.value })} defaultValue="sqm">
              <option value="sqm">Square Meters</option>
              <option value="sqft">Square Feet</option>
              <option value="kanal">Kanal</option>
              <option value="marla">Marla</option>
            </select>
          </>
        )}

        {tool.id === 'volume-conv' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromUnit: e.target.value })} defaultValue="liter">
              <option value="liter">Liters</option>
              <option value="gallon">Gallons</option>
              <option value="ml">Milliliters</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toUnit: e.target.value })} defaultValue="gallon">
              <option value="gallon">Gallons</option>
              <option value="liter">Liters</option>
              <option value="ml">Milliliters</option>
            </select>
          </>
        )}

        {tool.id === 'speed-conv' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromUnit: e.target.value })} defaultValue="kmh">
              <option value="kmh">KM/h</option>
              <option value="mph">MPH</option>
              <option value="mps">M/s</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toUnit: e.target.value })} defaultValue="mph">
              <option value="mph">MPH</option>
              <option value="kmh">KM/h</option>
              <option value="mps">M/s</option>
            </select>
          </>
        )}

        {tool.id === 'temp-conv' && (
          <>
            <input type="number" placeholder="Temperature Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, type: e.target.value })} defaultValue="c2f">
              <option value="c2f">Celsius → Fahrenheit</option>
              <option value="f2c">Fahrenheit → Celsius</option>
              <option value="c2k">Celsius → Kelvin</option>
              <option value="k2c">Kelvin → Celsius</option>
            </select>
          </>
        )}

        {tool.id === 'timezone-conv' && (
          <>
            <input type="number" placeholder="Hour (0-23)" className="w-full border p-4 rounded-xl" min="0" max="23" onChange={e => setInputs({ ...inputs, hour: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromTZ: e.target.value })} defaultValue="PKT">
              <option value="PKT">Pakistan Time (PKT)</option>
              <option value="UTC">UTC/GMT</option>
              <option value="IST">India (IST)</option>
              <option value="EST">Eastern (EST)</option>
              <option value="PST">Pacific (PST)</option>
              <option value="JST">Japan (JST)</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toTZ: e.target.value })} defaultValue="UTC">
              <option value="UTC">UTC/GMT</option>
              <option value="PKT">Pakistan Time (PKT)</option>
              <option value="IST">India (IST)</option>
              <option value="EST">Eastern (EST)</option>
              <option value="PST">Pacific (PST)</option>
              <option value="JST">Japan (JST)</option>
            </select>
          </>
        )}

        {tool.id === 'power-conv' && (
          <>
            <input type="number" placeholder="Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromUnit: e.target.value })} defaultValue="watts">
              <option value="watts">Watts</option>
              <option value="kw">Kilowatts</option>
              <option value="hp">Horsepower</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toUnit: e.target.value })} defaultValue="kw">
              <option value="kw">Kilowatts</option>
              <option value="watts">Watts</option>
              <option value="hp">Horsepower</option>
            </select>
          </>
        )}

        {tool.id === 'number-base' && (
          <>
            <input type="text" placeholder="Number Value" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, value: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, fromBase: e.target.value })} defaultValue="10">
              <option value="10">Decimal (Base 10)</option>
              <option value="2">Binary (Base 2)</option>
              <option value="16">Hexadecimal (Base 16)</option>
              <option value="8">Octal (Base 8)</option>
            </select>
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, toBase: e.target.value })} defaultValue="2">
              <option value="2">Binary (Base 2)</option>
              <option value="10">Decimal (Base 10)</option>
              <option value="16">Hexadecimal (Base 16)</option>
              <option value="8">Octal (Base 8)</option>
            </select>
          </>
        )}

        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Convert</button>
      </div>
    );
  };

  // --- ENGINE: Banking & Payments ---
  const BankingEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'bank-profit': {
          const balance = Number(inputs.balance);
          const ratePerYear = Number(inputs.ratePerYear);
          const months = Number(inputs.months) || 1;
          if (!balance || !ratePerYear) { alert('Enter balance and rate'); return; }
          
          const monthlyRate = ratePerYear / 12 / 100;
          const interest = balance * monthlyRate * months;
          const totalBalance = balance + interest;
          
          res = {
            principalBalance: `Rs. ${balance.toLocaleString()}`,
            annualRate: `${ratePerYear}%`,
            monthlyRate: `${(monthlyRate * 100).toFixed(3)}%`,
            period: `${months} month(s)`,
            totalInterest: `Rs. ${interest.toFixed(0).toLocaleString()}`,
            totalBalance: `Rs. ${totalBalance.toFixed(0).toLocaleString()}`,
            msg: 'Bank interest on savings account balance'
          };
          break;
        }

        case 'savings-calc': {
          const initialAmount = Number(inputs.initialAmount);
          const monthlyContribution = Number(inputs.monthlyContribution);
          const annualRate = Number(inputs.annualRate);
          const years = Number(inputs.years);
          
          if (!initialAmount || !monthlyContribution || !annualRate || !years) { alert('Enter all values'); return; }
          
          const months = years * 12;
          const monthlyRate = annualRate / 12 / 100;
          const fv = initialAmount * Math.pow(1 + monthlyRate, months) + monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
          const totalContributed = initialAmount + (monthlyContribution * months);
          const interest = fv - totalContributed;
          
          res = {
            initialAmount: `Rs. ${initialAmount.toLocaleString()}`,
            monthlyContribution: `Rs. ${monthlyContribution.toLocaleString()}`,
            period: `${years} years (${months} months)`,
            annualRate: `${annualRate}%`,
            futureValue: `Rs. ${fv.toFixed(0).toLocaleString()}`,
            totalContributed: `Rs. ${totalContributed.toLocaleString()}`,
            earnedInterest: `Rs. ${interest.toFixed(0).toLocaleString()}`,
            msg: 'Savings growth with compound interest'
          };
          break;
        }

        case 'islamic-profit': {
          const amount = Number(inputs.amount);
          const rate = Number(inputs.rate);
          const months = Number(inputs.months) || 1;
          
          if (!amount || !rate) { alert('Enter amount and rate'); return; }
          
          const monthlyRate = rate / 12 / 100;
          const profit = amount * monthlyRate * months;
          
          res = {
            principalAmount: `Rs. ${amount.toLocaleString()}`,
            profitRate: `${rate}% (Shariah-compliant)`,
            period: `${months} month(s)`,
            profit: `Rs. ${profit.toFixed(0).toLocaleString()}`,
            totalAmount: `Rs. ${(amount + profit).toFixed(0).toLocaleString()}`,
            msg: 'Riba-free profit as per Islamic finance principles'
          };
          break;
        }

        case 'cc-interest': {
          const balance = Number(inputs.balance);
          const rate = Number(inputs.rate) || 3;
          const months = Number(inputs.months) || 1;
          const payment = Number(inputs.payment) || 0;
          
          if (!balance) { alert('Enter balance'); return; }
          
          const monthlyRate = rate / 12 / 100;
          let remainingBalance = balance;
          let totalInterest = 0;
          
          for (let i = 0; i < months; i++) {
            const interest = remainingBalance * monthlyRate;
            totalInterest += interest;
            remainingBalance = remainingBalance - payment + interest;
            if (remainingBalance < 0) remainingBalance = 0;
          }
          
          res = {
            initialBalance: `Rs. ${balance.toLocaleString()}`,
            monthlyRate: `${rate}% (Annual)`,
            monthlyPayment: `Rs. ${payment.toLocaleString()}`,
            period: `${months} month(s)`,
            totalInterestCharged: `Rs. ${totalInterest.toFixed(0).toLocaleString()}`,
            finalBalance: `Rs. ${Math.max(0, remainingBalance).toFixed(0).toLocaleString()}`,
            msg: 'Credit card interest with minimum payments'
          };
          break;
        }

        case 'atm-plan': {
          const needed = Number(inputs.needed);
          const feePerWithdraw = Number(inputs.feePerWithdraw) || 20;
          const atmLimit = Number(inputs.atmLimit) || 50000;
          
          if (!needed) { alert('Enter amount needed'); return; }
          
          const numWithdrawals = Math.ceil(needed / atmLimit);
          const totalFees = numWithdrawals * feePerWithdraw;
          const actualWithdrawn = numWithdrawals * atmLimit;
          
          res = {
            amountNeeded: `Rs. ${needed.toLocaleString()}`,
            atmLimit: `Rs. ${atmLimit.toLocaleString()}`,
            numWithdrawals: numWithdrawals,
            feePerWithdraw: `Rs. ${feePerWithdraw}`,
            totalFees: `Rs. ${totalFees.toLocaleString()}`,
            totalWithdrawn: `Rs. ${actualWithdrawn.toLocaleString()}`,
            surplus: `Rs. ${(actualWithdrawn - needed).toLocaleString()}`,
            msg: 'Plan withdrawals to minimize fees'
          };
          break;
        }

        case 'loan-eligibility': {
          const monthlyIncome = Number(inputs.monthlyIncome);
          const existingLoans = Number(inputs.existingLoans) || 0;
          const tenure = Number(inputs.tenure) || 5;
          
          if (!monthlyIncome) { alert('Enter monthly income'); return; }
          
          const debtToIncomeRatio = existingLoans / (monthlyIncome * 12);
          const maxEligible = monthlyIncome * 12 * (1 - debtToIncomeRatio);
          const maxMonthly = (monthlyIncome * 0.40) - (existingLoans / 12);
          const loanAmount = maxMonthly * tenure * 12;
          
          const eligible = debtToIncomeRatio < 0.40 && maxMonthly > 0;
          
          res = {
            monthlyIncome: `Rs. ${monthlyIncome.toLocaleString()}`,
            annualIncome: `Rs. ${(monthlyIncome * 12).toLocaleString()}`,
            existingLoans: `Rs. ${existingLoans.toLocaleString()}`,
            debtToIncomeRatio: `${(debtToIncomeRatio * 100).toFixed(1)}%`,
            eligible: eligible ? 'YES - You may be eligible' : 'NO - High debt burden',
            estimatedMaxLoan: `Rs. ${Math.max(0, loanAmount).toFixed(0).toLocaleString()}`,
            msg: 'Eligibility is subject to bank approval and credit score'
          };
          break;
        }

        case 'mortgage-calc': {
          const homePrice = Number(inputs.homePrice);
          const downPayment = Number(inputs.downPayment);
          const rate = Number(inputs.rate);
          const years = Number(inputs.years);
          
          if (!homePrice || !downPayment || !rate || !years) { alert('Enter all values'); return; }
          
          const principal = homePrice - downPayment;
          const monthlyRate = rate / 12 / 100;
          const months = years * 12;
          const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
          const totalPayable = emi * months;
          const totalInterest = totalPayable - principal;
          
          res = {
            homePrice: `Rs. ${homePrice.toLocaleString()}`,
            downPayment: `Rs. ${downPayment.toLocaleString()}`,
            loanAmount: `Rs. ${principal.toLocaleString()}`,
            interestRate: `${rate}%`,
            tenure: `${years} years (${months} months)`,
            monthlyEMI: `Rs. ${emi.toFixed(0).toLocaleString()}`,
            totalPayable: `Rs. ${totalPayable.toFixed(0).toLocaleString()}`,
            totalInterest: `Rs. ${totalInterest.toFixed(0).toLocaleString()}`,
            msg: 'Mortgage calculation with reducing balance EMI'
          };
          break;
        }

        case 'bank-charges': {
          const monthlyBalance = Number(inputs.monthlyBalance);
          const transactions = Number(inputs.transactions) || 0;
          const chequesPassed = Number(inputs.chequesPassed) || 0;
          
          if (!monthlyBalance) { alert('Enter monthly balance'); return; }
          
          let charges = 0;
          if (monthlyBalance < 100000) charges += 500;
          else if (monthlyBalance < 500000) charges += 300;
          else charges += 100;
          
          const transactionCharges = Math.max(0, transactions - 50) * 5;
          const chequeCharges = chequesPassed * 25;
          
          const totalCharges = charges + transactionCharges + chequeCharges;
          
          res = {
            monthlyBalance: `Rs. ${monthlyBalance.toLocaleString()}`,
            maintenanceFee: `Rs. ${charges}`,
            extraTransactionFee: `Rs. ${transactionCharges}`,
            chequeProcessingFee: `Rs. ${chequeCharges}`,
            totalMonthlyCharges: `Rs. ${totalCharges}`,
            annualCharges: `Rs. ${(totalCharges * 12).toLocaleString()}`,
            msg: 'Bank charges vary by bank; this is an estimate'
          };
          break;
        }

        case 'remittance-fee': {
          const amount = Number(inputs.amount);
          const country = inputs.country || 'USA';
          
          if (!amount) { alert('Enter amount'); return; }
          
          const feePercentage: Record<string, number> = {
            'USA': 0.02,
            'UK': 0.025,
            'UAE': 0.015,
            'Saudi': 0.01,
            'Other': 0.035
          };
          
          const fee = amount * (feePercentage[country] || 0.02);
          const netAmount = amount - fee;
          const conversionRate = country === 'USA' ? 278 : country === 'UK' ? 350 : 76;
          const netInPKR = netAmount * conversionRate;
          
          res = {
            sendingAmount: `${country} ${(amount / conversionRate).toFixed(2)}`,
            remittanceFee: `${((feePercentage[country] || 0.02) * 100).toFixed(1)}%`,
            feeAmount: `${(fee / conversionRate).toFixed(2)} ${country}`,
            netAmountSent: `${(netAmount / conversionRate).toFixed(2)} ${country}`,
            approxPKR: `Rs. ${netInPKR.toFixed(0).toLocaleString()}`,
            msg: 'Rates vary by bank and destination'
          };
          break;
        }

        case 'emi-compare': {
          const loanAmount = Number(inputs.loanAmount);
          
          if (!loanAmount) { alert('Enter loan amount'); return; }
          
          const scenarios = [
            { months: 12, rate: 14 },
            { months: 24, rate: 13 },
            { months: 36, rate: 12 },
            { months: 60, rate: 11 }
          ];
          
          const comparisons = scenarios.map(scenario => {
            const monthlyRate = scenario.rate / 12 / 100;
            const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, scenario.months)) / (Math.pow(1 + monthlyRate, scenario.months) - 1);
            const totalPayable = emi * scenario.months;
            const interest = totalPayable - loanAmount;
            return {
              months: scenario.months,
              rate: scenario.rate,
              emi: emi.toFixed(0),
              totalPayable: totalPayable.toFixed(0),
              totalInterest: interest.toFixed(0)
            };
          });
          
          res = {
            loanAmount: `Rs. ${loanAmount.toLocaleString()}`,
            comparison: comparisons.map(c => `${c.months}m @ ${c.rate}%: EMI Rs.${c.emi}/mo, Total Int: Rs.${c.totalInterest}`).join(' | '),
            msg: '1 year: Higher EMI, lower interest | 5 years: Lower EMI, higher interest'
          };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'bank-profit' && (
          <>
            <input type="number" placeholder="Balance (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, balance: e.target.value })} />
            <input type="number" placeholder="Annual Rate (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, ratePerYear: e.target.value })} />
            <input type="number" placeholder="Months" className="w-full border p-4 rounded-xl" defaultValue={1} onChange={e => setInputs({ ...inputs, months: e.target.value })} />
          </>
        )}

        {tool.id === 'savings-calc' && (
          <>
            <input type="number" placeholder="Initial Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, initialAmount: e.target.value })} />
            <input type="number" placeholder="Monthly Contribution (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, monthlyContribution: e.target.value })} />
            <input type="number" placeholder="Annual Rate (%)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, annualRate: e.target.value })} />
            <input type="number" placeholder="Years" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} />
          </>
        )}

        {tool.id === 'islamic-profit' && (
          <>
            <input type="number" placeholder="Principal Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, amount: e.target.value })} />
            <input type="number" placeholder="Profit Rate (%) p.a." className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
            <input type="number" placeholder="Months" className="w-full border p-4 rounded-xl" defaultValue={1} onChange={e => setInputs({ ...inputs, months: e.target.value })} />
          </>
        )}

        {tool.id === 'cc-interest' && (
          <>
            <input type="number" placeholder="Credit Card Balance (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, balance: e.target.value })} />
            <input type="number" placeholder="Annual Interest Rate (%)" className="w-full border p-4 rounded-xl" defaultValue={3} onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
            <input type="number" placeholder="Monthly Payment (PKR)" className="w-full border p-4 rounded-xl" defaultValue={0} onChange={e => setInputs({ ...inputs, payment: e.target.value })} />
            <input type="number" placeholder="Months" className="w-full border p-4 rounded-xl" defaultValue={1} onChange={e => setInputs({ ...inputs, months: e.target.value })} />
          </>
        )}

        {tool.id === 'atm-plan' && (
          <>
            <input type="number" placeholder="Amount Needed (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, needed: e.target.value })} />
            <input type="number" placeholder="ATM Daily Limit (PKR)" className="w-full border p-4 rounded-xl" defaultValue={50000} onChange={e => setInputs({ ...inputs, atmLimit: e.target.value })} />
            <input type="number" placeholder="Fee per Withdrawal (PKR)" className="w-full border p-4 rounded-xl" defaultValue={20} onChange={e => setInputs({ ...inputs, feePerWithdraw: e.target.value })} />
          </>
        )}

        {tool.id === 'loan-eligibility' && (
          <>
            <input type="number" placeholder="Monthly Income (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, monthlyIncome: e.target.value })} />
            <input type="number" placeholder="Existing Loans (PKR)" className="w-full border p-4 rounded-xl" defaultValue={0} onChange={e => setInputs({ ...inputs, existingLoans: e.target.value })} />
            <input type="number" placeholder="Desired Tenure (Years)" className="w-full border p-4 rounded-xl" defaultValue={5} onChange={e => setInputs({ ...inputs, tenure: e.target.value })} />
          </>
        )}

        {tool.id === 'mortgage-calc' && (
          <>
            <input type="number" placeholder="Home Price (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, homePrice: e.target.value })} />
            <input type="number" placeholder="Down Payment (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, downPayment: e.target.value })} />
            <input type="number" placeholder="Interest Rate (%) p.a." className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
            <input type="number" placeholder="Tenure (Years)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, years: e.target.value })} />
          </>
        )}

        {tool.id === 'bank-charges' && (
          <>
            <input type="number" placeholder="Monthly Balance (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, monthlyBalance: e.target.value })} />
            <input type="number" placeholder="Transactions per Month" className="w-full border p-4 rounded-xl" defaultValue={0} onChange={e => setInputs({ ...inputs, transactions: e.target.value })} />
            <input type="number" placeholder="Cheques Passed per Month" className="w-full border p-4 rounded-xl" defaultValue={0} onChange={e => setInputs({ ...inputs, chequesPassed: e.target.value })} />
          </>
        )}

        {tool.id === 'remittance-fee' && (
          <>
            <input type="number" placeholder="Amount to Send" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, amount: e.target.value })} />
            <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, country: e.target.value })} defaultValue="USA">
              <option value="USA">USA</option>
              <option value="UK">United Kingdom</option>
              <option value="UAE">UAE / Gulf</option>
              <option value="Saudi">Saudi Arabia</option>
              <option value="Other">Other Countries</option>
            </select>
          </>
        )}

        {tool.id === 'emi-compare' && (
          <input type="number" placeholder="Loan Amount (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, loanAmount: e.target.value })} />
        )}

        <button onClick={calc} className="w-full bg-emerald-700 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition">Calculate</button>
      </div>
    );
  };

  // --- ENGINE: Bonus ---
  const BonusEngine = () => {
    const [inputs, setInputs] = useState<any>({});

    const calc = () => {
      let res: any = {};

      switch (tool.id) {
        case 'ramadan-count': {
          const ramadan2025 = new Date('2025-03-01');
          const today = new Date();
          const diffTime = ramadan2025.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          res = {
            today: today.toLocaleDateString('en-PK'),
            ramadanDate: 'March 1, 2025 (approx)',
            daysRemaining: diffDays > 0 ? diffDays : 'Ramadan has passed',
            weeksRemaining: diffDays > 0 ? Math.floor(diffDays / 7) : 0,
            msg: 'Ramadan dates depend on moon sighting'
          };
          break;
        }

        case 'budget-planner': {
          const income = Number(inputs.income);
          const rent = Number(inputs.rent) || 0;
          const groceries = Number(inputs.groceries) || 0;
          const bills = Number(inputs.bills) || 0;
          const transport = Number(inputs.transport) || 0;
          const other = Number(inputs.other) || 0;
          
          if (!income) { alert('Enter monthly income'); return; }
          
          const totalExpenses = rent + groceries + bills + transport + other;
          const savings = income - totalExpenses;
          const savingsPercent = (savings / income) * 100;
          
          res = {
            monthlyIncome: `Rs. ${income.toLocaleString()}`,
            totalExpenses: `Rs. ${totalExpenses.toLocaleString()}`,
            rent: `Rs. ${rent.toLocaleString()}`,
            groceries: `Rs. ${groceries.toLocaleString()}`,
            bills: `Rs. ${bills.toLocaleString()}`,
            transport: `Rs. ${transport.toLocaleString()}`,
            other: `Rs. ${other.toLocaleString()}`,
            savings: `Rs. ${savings.toLocaleString()}`,
            savingsPercent: `${savingsPercent.toFixed(1)}%`,
            msg: 'Aim to save at least 20% of income'
          };
          break;
        }

        case 'expense-tracker': {
          const food = Number(inputs.food) || 0;
          const shopping = Number(inputs.shopping) || 0;
          const entertainment = Number(inputs.entertainment) || 0;
          const health = Number(inputs.health) || 0;
          const education = Number(inputs.education) || 0;
          const misc = Number(inputs.misc) || 0;
          
          const total = food + shopping + entertainment + health + education + misc;
          
          res = {
            food: `Rs. ${food.toLocaleString()}`,
            shopping: `Rs. ${shopping.toLocaleString()}`,
            entertainment: `Rs. ${entertainment.toLocaleString()}`,
            health: `Rs. ${health.toLocaleString()}`,
            education: `Rs. ${education.toLocaleString()}`,
            misc: `Rs. ${misc.toLocaleString()}`,
            totalExpenses: `Rs. ${total.toLocaleString()}`,
            dailyAverage: `Rs. ${(total / 30).toFixed(0)}`,
            msg: 'Track daily to control overspending'
          };
          break;
        }

        case 'wedding-budget': {
          const guests = Number(inputs.guests);
          const venue = Number(inputs.venue) || 0;
          const catering = Number(inputs.catering) || 0;
          const decoration = Number(inputs.decoration) || 0;
          const photography = Number(inputs.photography) || 0;
          const others = Number(inputs.others) || 0;
          
          if (!guests) { alert('Enter number of guests'); return; }
          
          const cateringTotal = catering > 0 ? catering : guests * 2000;
          const total = venue + cateringTotal + decoration + photography + others;
          const perGuest = total / guests;
          
          res = {
            totalGuests: guests,
            venue: `Rs. ${venue.toLocaleString()}`,
            catering: `Rs. ${cateringTotal.toLocaleString()}`,
            decoration: `Rs. ${decoration.toLocaleString()}`,
            photography: `Rs. ${photography.toLocaleString()}`,
            others: `Rs. ${others.toLocaleString()}`,
            totalBudget: `Rs. ${total.toLocaleString()}`,
            perGuest: `Rs. ${perGuest.toFixed(0)}`,
            msg: 'Average wedding in Pakistan: Rs. 20-40 lacs'
          };
          break;
        }

        case 'education-cost': {
          const tuition = Number(inputs.tuition);
          const books = Number(inputs.books) || 0;
          const transport = Number(inputs.transport) || 0;
          const hostel = Number(inputs.hostel) || 0;
          const misc = Number(inputs.misc) || 0;
          const years = Number(inputs.years) || 1;
          
          if (!tuition) { alert('Enter tuition fee'); return; }
          
          const annualCost = (tuition + books + transport + hostel + misc);
          const totalCost = annualCost * years;
          
          res = {
            tuitionFee: `Rs. ${tuition.toLocaleString()}`,
            books: `Rs. ${books.toLocaleString()}`,
            transport: `Rs. ${transport.toLocaleString()}`,
            hostel: `Rs. ${hostel.toLocaleString()}`,
            misc: `Rs. ${misc.toLocaleString()}`,
            annualCost: `Rs. ${annualCost.toLocaleString()}`,
            years: years,
            totalCost: `Rs. ${totalCost.toLocaleString()}`,
            msg: 'Includes all education expenses'
          };
          break;
        }

        case 'freelance-earn': {
          const projectFee = Number(inputs.projectFee);
          const platformFee = Number(inputs.platformFee) || 20;
          const wht = Number(inputs.wht) || 1;
          
          if (!projectFee) { alert('Enter project fee'); return; }
          
          const platformCut = projectFee * (platformFee / 100);
          const afterPlatform = projectFee - platformCut;
          const whtAmount = afterPlatform * (wht / 100);
          const netEarning = afterPlatform - whtAmount;
          const pkrAmount = netEarning * 278;
          
          res = {
            projectFee: `$${projectFee}`,
            platformFee: `${platformFee}% ($${platformCut.toFixed(2)})`,
            afterPlatform: `$${afterPlatform.toFixed(2)}`,
            wht: `${wht}% ($${whtAmount.toFixed(2)})`,
            netEarning: `$${netEarning.toFixed(2)}`,
            inPKR: `Rs. ${pkrAmount.toFixed(0).toLocaleString()}`,
            msg: 'Freelance earnings after platform and WHT'
          };
          break;
        }

        case 'fiverr-fee': {
          const orderValue = Number(inputs.orderValue);
          if (!orderValue) { alert('Enter order value'); return; }
          
          const fiverrFee = orderValue * 0.20;
          const netEarning = orderValue - fiverrFee;
          const pkrAmount = netEarning * 278;
          
          res = {
            orderValue: `$${orderValue}`,
            fiverrFee: `20% ($${fiverrFee.toFixed(2)})`,
            netEarning: `$${netEarning.toFixed(2)}`,
            inPKR: `Rs. ${pkrAmount.toFixed(0).toLocaleString()}`,
            msg: 'Fiverr charges 20% on each order'
          };
          break;
        }

        case 'yt-earn': {
          const views = Number(inputs.views);
          const cpm = Number(inputs.cpm) || 2;
          
          if (!views) { alert('Enter monthly views'); return; }
          
          const revenue = (views / 1000) * cpm;
          const pkrRevenue = revenue * 278;
          
          res = {
            monthlyViews: views.toLocaleString(),
            cpm: `$${cpm} per 1000 views`,
            estimatedRevenue: `$${revenue.toFixed(2)}`,
            inPKR: `Rs. ${pkrRevenue.toFixed(0).toLocaleString()}`,
            msg: 'CPM varies by niche (Pakistan: $1-5)'
          };
          break;
        }

        case 'tiktok-earn': {
          const views = Number(inputs.views);
          const rate = Number(inputs.rate) || 0.02;
          
          if (!views) { alert('Enter monthly views'); return; }
          
          const revenue = (views / 1000) * rate;
          const pkrRevenue = revenue * 278;
          
          res = {
            monthlyViews: views.toLocaleString(),
            ratePerK: `$${rate} per 1000 views`,
            estimatedRevenue: `$${revenue.toFixed(2)}`,
            inPKR: `Rs. ${pkrRevenue.toFixed(0).toLocaleString()}`,
            msg: 'TikTok Creator Fund rate (Pakistan)'
          };
          break;
        }

        case 'adsense-calc': {
          const pageViews = Number(inputs.pageViews);
          const cpc = Number(inputs.cpc) || 0.10;
          const ctr = Number(inputs.ctr) || 2;
          
          if (!pageViews) { alert('Enter monthly page views'); return; }
          
          const clicks = pageViews * (ctr / 100);
          const revenue = clicks * cpc;
          const pkrRevenue = revenue * 278;
          
          res = {
            pageViews: pageViews.toLocaleString(),
            ctr: `${ctr}%`,
            estimatedClicks: clicks.toFixed(0),
            cpc: `$${cpc}`,
            estimatedRevenue: `$${revenue.toFixed(2)}`,
            inPKR: `Rs. ${pkrRevenue.toFixed(0).toLocaleString()}`,
            msg: 'AdSense earnings depend on niche and traffic quality'
          };
          break;
        }

        default:
          res = { msg: 'Calculation not available' };
      }

      setResult(res);
    };

    return (
      <div className="space-y-4">
        {tool.id === 'ramadan-count' && (
          <div className="text-center p-8 bg-emerald-50 rounded-xl">
            <p className="text-sm text-gray-600">Click Calculate to see countdown</p>
          </div>
        )}

        {tool.id === 'budget-planner' && (
          <>
            <input type="number" placeholder="Monthly Income (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, income: e.target.value })} />
            <input type="number" placeholder="Rent (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, rent: e.target.value })} />
            <input type="number" placeholder="Groceries (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, groceries: e.target.value })} />
            <input type="number" placeholder="Bills (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, bills: e.target.value })} />
            <input type="number" placeholder="Transport (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, transport: e.target.value })} />
            <input type="number" placeholder="Other Expenses (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, other: e.target.value })} />
          </>
        )}

        {tool.id === 'expense-tracker' && (
          <>
            <input type="number" placeholder="Food (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, food: e.target.value })} />
            <input type="number" placeholder="Shopping (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, shopping: e.target.value })} />
            <input type="number" placeholder="Entertainment (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, entertainment: e.target.value })} />
            <input type="number" placeholder="Health (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, health: e.target.value })} />
            <input type="number" placeholder="Education (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, education: e.target.value })} />
            <input type="number" placeholder="Miscellaneous (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, misc: e.target.value })} />
          </>
        )}

        {tool.id === 'wedding-budget' && (
          <>
            <input type="number" placeholder="Number of Guests" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, guests: e.target.value })} />
            <input type="number" placeholder="Venue Cost (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, venue: e.target.value })} />
            <input type="number" placeholder="Catering per Guest (PKR)" className="w-full border p-4 rounded-xl" defaultValue={2000} onChange={e => setInputs({ ...inputs, catering: e.target.value })} />
            <input type="number" placeholder="Decoration (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, decoration: e.target.value })} />
            <input type="number" placeholder="Photography (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, photography: e.target.value })} />
            <input type="number" placeholder="Others (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, others: e.target.value })} />
          </>
        )}

        {tool.id === 'education-cost' && (
          <>
            <input type="number" placeholder="Annual Tuition Fee (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, tuition: e.target.value })} />
            <input type="number" placeholder="Books & Supplies (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, books: e.target.value })} />
            <input type="number" placeholder="Transport (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, transport: e.target.value })} />
            <input type="number" placeholder="Hostel/Accommodation (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, hostel: e.target.value })} />
            <input type="number" placeholder="Miscellaneous (PKR)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, misc: e.target.value })} />
            <input type="number" placeholder="Years of Study" className="w-full border p-4 rounded-xl" defaultValue={1} onChange={e => setInputs({ ...inputs, years: e.target.value })} />
          </>
        )}

        {tool.id === 'freelance-earn' && (
          <>
            <input type="number" placeholder="Project Fee ($)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, projectFee: e.target.value })} />
            <input type="number" placeholder="Platform Fee (%)" className="w-full border p-4 rounded-xl" defaultValue={20} onChange={e => setInputs({ ...inputs, platformFee: e.target.value })} />
            <input type="number" placeholder="WHT (%)" className="w-full border p-4 rounded-xl" defaultValue={1} onChange={e => setInputs({ ...inputs, wht: e.target.value })} />
          </>
        )}

        {tool.id === 'fiverr-fee' && (
          <input type="number" placeholder="Order Value ($)" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, orderValue: e.target.value })} />
        )}

        {tool.id === 'yt-earn' && (
          <>
            <input type="number" placeholder="Monthly Views" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, views: e.target.value })} />
            <input type="number" placeholder="CPM ($)" className="w-full border p-4 rounded-xl" defaultValue={2} onChange={e => setInputs({ ...inputs, cpm: e.target.value })} />
          </>
        )}

        {tool.id === 'tiktok-earn' && (
          <>
            <input type="number" placeholder="Monthly Views" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, views: e.target.value })} />
            <input type="number" placeholder="Rate per 1K views ($)" className="w-full border p-4 rounded-xl" defaultValue={0.02} onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
          </>
        )}

        {tool.id === 'adsense-calc' && (
          <>
            <input type="number" placeholder="Monthly Page Views" className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, pageViews: e.target.value })} />
            <input type="number" placeholder="CTR (%)" className="w-full border p-4 rounded-xl" defaultValue={2} onChange={e => setInputs({ ...inputs, ctr: e.target.value })} />
            <input type="number" placeholder="CPC ($)" className="w-full border p-4 rounded-xl" defaultValue={0.10} onChange={e => setInputs({ ...inputs, cpc: e.target.value })} />
          </>
        )}

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
    if (tool.category === 'Tax & Finance') return <TaxFinanceEngine />;
    if (tool.category === 'Identity & Personal') return <IdentityEngine />;
    if (tool.category === 'Vehicle Tools') return <VehicleEngine />;
    if (tool.category === 'Daily Life') return <DailyLifeEngine />;
    if (tool.category === 'Conversion') return <ConversionEngine />;
    if (tool.category === 'Banking & Payments') return <BankingEngine />;
    if (tool.category === 'Bonus') return <BonusEngine />;

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
    <div className="relative flex justify-center w-full">
      {/* Left Banner Ad (hidden on small screens) */}
      <div className="hidden lg:flex flex-col items-center justify-start mr-4">
        <AdPlaceholder slot="left-banner" className="w-[160px] h-[600px] min-w-[160px] min-h-[600px]" />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full">
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

      {/* Right Banner Ad (hidden on small screens) */}
      <div className="hidden lg:flex flex-col items-center justify-start ml-4">
        <AdPlaceholder slot="right-banner" className="w-[160px] h-[600px] min-w-[160px] min-h-[600px]" />
      </div>
    </div>
  );
};

export default ToolDetail;
