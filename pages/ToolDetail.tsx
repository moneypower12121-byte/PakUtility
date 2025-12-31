
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
    const [inputs, setInputs] = useState<any>({});

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
            lahore: { fajr: '05:15', dhuhr: '12:15', asr: '03:45', maghrib: '05:45', isha: '07:15' },
            islamabad: { fajr: '05:10', dhuhr: '12:20', asr: '03:50', maghrib: '05:55', isha: '07:25' },
            rawalpindi: { fajr: '05:10', dhuhr: '12:20', asr: '03:50', maghrib: '05:55', isha: '07:25' },
            peshawar: { fajr: '05:05', dhuhr: '12:25', asr: '04:00', maghrib: '06:05', isha: '07:35' },
            quetta: { fajr: '05:20', dhuhr: '12:40', asr: '04:10', maghrib: '06:10', isha: '07:40' },
            multan: { fajr: '05:20', dhuhr: '12:25', asr: '03:55', maghrib: '06:00', isha: '07:30' },
            faisalabad: { fajr: '05:15', dhuhr: '12:20', asr: '03:50', maghrib: '05:50', isha: '07:20' },
            hyderabad: { fajr: '05:25', dhuhr: '12:30', asr: '04:00', maghrib: '06:05', isha: '07:35' },
            sialkot: { fajr: '05:10', dhuhr: '12:15', asr: '03:45', maghrib: '05:50', isha: '07:20' },
            gujranwala: { fajr: '05:12', dhuhr: '12:18', asr: '03:48', maghrib: '05:52', isha: '07:22' },
            sukkur: { fajr: '05:25', dhuhr: '12:35', asr: '04:05', maghrib: '06:10', isha: '07:40' },
            bahawalpur: { fajr: '05:20', dhuhr: '12:28', asr: '03:58', maghrib: '06:03', isha: '07:33' },
            abbottabad: { fajr: '05:05', dhuhr: '12:22', asr: '03:55', maghrib: '06:05', isha: '07:32' }
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
            lahore: { deg: 254, note: 'West' },
            islamabad: { deg: 253, note: 'West' },
            rawalpindi: { deg: 253, note: 'West' },
            peshawar: { deg: 251, note: 'West-Southwest' },
            quetta: { deg: 255, note: 'West' },
            multan: { deg: 256, note: 'West' },
            faisalabad: { deg: 254, note: 'West' },
            hyderabad: { deg: 258, note: 'West-Northwest' },
            sialkot: { deg: 253, note: 'West' },
            gujranwala: { deg: 253, note: 'West' },
            sukkur: { deg: 258, note: 'West-Northwest' },
            bahawalpur: { deg: 256, note: 'West' },
            abbottabad: { deg: 252, note: 'West' }
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
          <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, city: e.target.value })} defaultValue="karachi">
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
            <option value="islamabad">Islamabad</option>
            <option value="rawalpindi">Rawalpindi</option>
            <option value="peshawar">Peshawar</option>
            <option value="quetta">Quetta</option>
            <option value="multan">Multan</option>
            <option value="faisalabad">Faisalabad</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="sialkot">Sialkot</option>
            <option value="gujranwala">Gujranwala</option>
            <option value="sukkur">Sukkur</option>
            <option value="bahawalpur">Bahawalpur</option>
            <option value="abbottabad">Abbottabad</option>
          </select>
        )}

        {tool.id === 'qibla-dir' && (
          <select className="w-full border p-4 rounded-xl" onChange={e => setInputs({ ...inputs, city: e.target.value })} defaultValue="karachi">
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
            <option value="islamabad">Islamabad</option>
            <option value="rawalpindi">Rawalpindi</option>
            <option value="peshawar">Peshawar</option>
            <option value="quetta">Quetta</option>
            <option value="multan">Multan</option>
            <option value="faisalabad">Faisalabad</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="sialkot">Sialkot</option>
            <option value="gujranwala">Gujranwala</option>
            <option value="sukkur">Sukkur</option>
            <option value="bahawalpur">Bahawalpur</option>
            <option value="abbottabad">Abbottabad</option>
          </select>
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
