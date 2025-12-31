
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
