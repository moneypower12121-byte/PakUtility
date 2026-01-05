
import { Tool, TaxSlab } from './types';

export const TOOLS: Tool[] = [
  // --- Bills & Utilities ---
  { id: 'elec-bill', name: 'Electricity Bill Estimator', slug: 'electricity-bill-calculator-pakistan', description: 'Estimate LESCO, IESCO, KE bills.', icon: '⚡', category: 'Bills & Utilities' },
  { id: 'gas-bill', name: 'Gas Bill Calculator', slug: 'gas-bill-calculator-sngpl-ssgc', description: 'Estimate SNGPL & SSGC monthly gas bills.', icon: '🔥', category: 'Bills & Utilities' },
  { id: 'water-bill', name: 'Water Bill Estimator', slug: 'water-bill-calculator', description: 'Estimate WASA water and sewerage charges.', icon: '💧', category: 'Bills & Utilities' },
  { id: 'solar-save', name: 'Solar Panel Savings', slug: 'solar-savings-calculator', description: 'Calculate monthly savings from solar installation.', icon: '☀️', category: 'Bills & Utilities' },
  { id: 'ups-load', name: 'UPS / Inverter Load', slug: 'ups-load-calculator', description: 'Calculate required UPS capacity for your home.', icon: '🔋', category: 'Bills & Utilities' },
  { id: 'gen-fuel', name: 'Generator Fuel Cost', slug: 'generator-fuel-calculator', description: 'Estimate fuel cost per hour for your generator.', icon: '⚙️', category: 'Bills & Utilities' },
  { id: 'ac-power', name: 'AC Power Consumption', slug: 'ac-power-usage-calculator', description: 'Estimate monthly AC electricity cost.', icon: '❄️', category: 'Bills & Utilities' },
  { id: 'fridge-power', name: 'Fridge Power Usage', slug: 'fridge-power-calculator', description: 'Estimate monthly cost of running a refrigerator.', icon: '🧊', category: 'Bills & Utilities' },
  { id: 'net-usage', name: 'Internet Data Usage', slug: 'internet-data-usage-calculator', description: 'Check how much data your activities consume.', icon: '📶', category: 'Bills & Utilities' },
  { id: 'load-shedding', name: 'Load Shedding Estimator', slug: 'load-shedding-time-estimator', description: 'Track and estimate power outage durations.', icon: '🔦', category: 'Bills & Utilities' },

  // --- Tax & Finance ---
  { id: 'salary-tax', name: 'Salary Tax Calculator', slug: 'salary-tax-calculator-pakistan', description: 'FBR Salary tax slabs 2024-25.', icon: '💰', category: 'Tax & Finance' },
  { id: 'income-tax', name: 'Income Tax (Yearly)', slug: 'income-tax-calculator-yearly', description: 'Calculate yearly tax for individuals.', icon: '📈', category: 'Tax & Finance' },
  { id: 'freelance-tax', name: 'Freelancer Tax Calc', slug: 'freelancer-tax-calculator', description: 'Calculate tax on export remittances.', icon: '💻', category: 'Tax & Finance' },
  { id: 'wht-tax', name: 'Withholding Tax Estimator', slug: 'withholding-tax-estimator', description: 'Calculate WHT on various transactions.', icon: '📉', category: 'Tax & Finance' },
  { id: 'property-tax', name: 'Property Tax Estimator', slug: 'property-tax-calculator-pakistan', description: 'Annual property tax estimation.', icon: '🏠', category: 'Tax & Finance' },
  { id: 'cap-gain-tax', name: 'Capital Gain Tax', slug: 'capital-gain-tax-calculator', description: 'Tax on selling assets like gold or stocks.', icon: '💎', category: 'Tax & Finance' },
  { id: 'vehicle-tax', name: 'Vehicle Token Tax', slug: 'vehicle-token-tax-calculator', description: 'Calculate car/bike yearly token tax.', icon: '🚗', category: 'Tax & Finance' },
  { id: 'prize-bond-tax', name: 'Prize Bond Tax', slug: 'prize-bond-tax-calculator', description: 'Calculate tax on prize bond winnings.', icon: '🎟️', category: 'Tax & Finance' },
  { id: 'zakat-calc', name: 'Zakat Calculator', slug: 'zakat-calculator-pakistan', description: 'Calculate Zakat on cash, gold, and silver.', icon: '🌙', category: 'Tax & Finance' },
  { id: 'ushr-calc', name: 'Ushr Calculator', slug: 'ushr-calculator-pakistan', description: 'Calculate tax on agriculture (Ushr).', icon: '🌾', category: 'Tax & Finance' },

  // --- Islamic Tools ---
  { id: 'zakat-gold', name: 'Zakat on Gold', slug: 'zakat-on-gold-calculator', description: 'Detailed Zakat calculation for gold jewelry.', icon: '💍', category: 'Islamic Tools' },
  { id: 'zakat-biz', name: 'Zakat on Business', slug: 'zakat-on-business-calculator', description: 'Calculate Zakat on trade goods & stock.', icon: '🏢', category: 'Islamic Tools' },
  { id: 'fitra-calc', name: 'Fitra Calculator', slug: 'fitra-calculator', description: 'Calculate Sadqa-e-Fitr for Ramadan.', icon: '🤲', category: 'Islamic Tools' },
  { id: 'kaffarah-calc', name: 'Kaffarah Calculator', slug: 'kaffarah-calculator', description: 'Estimate Kaffarah for missed obligations.', icon: '⚖️', category: 'Islamic Tools' },
  { id: 'qurbani-calc', name: 'Qurbani Share Calc', slug: 'qurbani-share-calculator', description: 'Estimate cost per share for Qurbani.', icon: '🐐', category: 'Islamic Tools' },
  { id: 'prayer-times', name: 'Prayer Time Calculator', slug: 'prayer-times-pakistan', description: 'Namaz timings for major cities.', icon: '🕌', category: 'Islamic Tools' },
  { id: 'qibla-dir', name: 'Qibla Direction', slug: 'qibla-direction-tool', description: 'Find Kaaba direction from your location.', icon: '🧭', category: 'Islamic Tools' },
  { id: 'hijri-conv', name: 'Islamic Calendar', slug: 'islamic-calendar-hijri', description: 'Convert Hijri to Gregorian dates.', icon: '🗓️', category: 'Islamic Tools' },
  { id: 'roza-counter', name: 'Roza Counter', slug: 'roza-counter', description: 'Keep track of your fasts.', icon: '📿', category: 'Islamic Tools' },
  { id: 'namaz-missed', name: 'Namaz Missed Calc', slug: 'namaz-missed-calculator', description: 'Keep track of Qaza Namaz.', icon: '🧎', category: 'Islamic Tools' },

  // --- Identity & Personal ---
  { id: 'cnic-check', name: 'CNIC Format Checker', slug: 'cnic-format-checker', description: 'Legal format validation.', icon: '🪪', category: 'Identity & Personal' },
  { id: 'cnic-age', name: 'CNIC Age Calculator', slug: 'cnic-age-calculator', description: 'Extract age from CNIC or DOB.', icon: '📅', category: 'Identity & Personal' },
  { id: 'cnic-prov', name: 'CNIC Province Identifier', slug: 'cnic-province-identifier', description: 'Detect city/province from CNIC.', icon: '📍', category: 'Identity & Personal' },
  { id: 'sim-rules', name: 'SIM Rules Checker', slug: 'sim-rules-checker-pta', description: 'PTA SIM limit and ownership rules.', icon: '📱', category: 'Identity & Personal' },
  { id: 'passport-exp', name: 'Passport Expiry Calc', slug: 'passport-expiry-calculator', description: 'Track your passport validity.', icon: '🛂', category: 'Identity & Personal' },
  { id: 'visa-dur', name: 'Visa Duration Calc', slug: 'visa-duration-calculator', description: 'Calculate stay duration for visas.', icon: '✈️', category: 'Identity & Personal' },
  { id: 'license-exp', name: 'Driving License Expiry', slug: 'driving-license-expiry-calculator', description: 'Expiry tracker for DL.', icon: '🪪', category: 'Identity & Personal' },
  { id: 'veh-reg-city', name: 'Vehicle City Checker', slug: 'vehicle-registration-city-checker', description: 'Check city by plate number.', icon: '🏷️', category: 'Identity & Personal' },
  { id: 'ntn-check', name: 'NTN Format Checker', slug: 'ntn-format-checker', description: 'Validate NTN number format.', icon: '📝', category: 'Identity & Personal' },
  { id: 'iban-check', name: 'IBAN Validator', slug: 'iban-format-validator', description: 'Verify IBAN format.', icon: '🏦', category: 'Identity & Personal' },

  // --- Property & Construction ---
  { id: 'const-cost', name: 'Construction Cost', slug: 'construction-cost-calculator', description: 'Estimate house building costs.', icon: '🏗️', category: 'Property & Construction' },
  { id: 'cement-calc', name: 'Cement Bags Calc', slug: 'cement-bags-calculator', description: 'Calculate cement for slabs/walls.', icon: '🥡', category: 'Property & Construction' },
  { id: 'steel-weight', name: 'Steel Weight Calc', slug: 'steel-weight-calculator', description: 'Estimate KG of steel needed.', icon: '🔗', category: 'Property & Construction' },
  { id: 'bricks-calc', name: 'Brick Calculator', slug: 'bricks-calculator', description: 'Estimate bricks for construction.', icon: '🧱', category: 'Property & Construction' },
  { id: 'paint-calc', name: 'Paint Coverage Calc', slug: 'paint-coverage-calculator', description: 'Estimate liters of paint needed.', icon: '🎨', category: 'Property & Construction' },
  { id: 'tile-calc', name: 'Tile Calculator', slug: 'tile-calculator', description: 'Calculate floor/wall tiles.', icon: '⬛', category: 'Property & Construction' },
  { id: 'plot-conv', name: 'Plot Area Converter', slug: 'plot-area-converter', description: 'Marla to Kanal to Sq Ft.', icon: '📐', category: 'Property & Construction' },
  { id: 'rent-yield', name: 'Rental Yield Calc', slug: 'rental-yield-calculator', description: 'Estimate return on property rent.', icon: '💵', category: 'Property & Construction' },
  { id: 'loan-emi', name: 'Home Loan EMI', slug: 'home-loan-emi-calculator', description: 'Monthly bank installment calc.', icon: '🏡', category: 'Property & Construction' },
  { id: 'prop-price', name: 'Property Price Estimator', slug: 'property-price-estimator', description: 'Check market value trends.', icon: '📊', category: 'Property & Construction' },

  // --- Vehicle Tools ---
  { id: 'fuel-cost', name: 'Fuel Cost Calculator', slug: 'fuel-cost-calculator', description: 'Estimate trip fuel expense.', icon: '⛽', category: 'Vehicle Tools' },
  { id: 'petrol-price', name: 'Petrol Price Tracker', slug: 'petrol-price-tracker-pakistan', description: 'Track current petrol/diesel prices.', icon: '⛽', category: 'Vehicle Tools' },
  { id: 'mileage-calc', name: 'Mileage Calculator', slug: 'mileage-calculator', description: 'Calculate KM per liter.', icon: '🛣️', category: 'Vehicle Tools' },
  { id: 'car-duty', name: 'Car Import Duty', slug: 'car-import-duty-estimator', description: 'Estimate customs duty for cars.', icon: '🛳️', category: 'Vehicle Tools' },
  { id: 'car-loan-emi', name: 'Car Loan EMI Calculator', slug: 'car-loan-emi-calculator', description: 'Calculate monthly car loan installments.', icon: '🚙', category: 'Vehicle Tools' },
  { id: 'bike-mileage', name: 'Bike Mileage Calc', slug: 'bike-mileage-calculator', description: 'Mileage specific for bikes.', icon: '🏍️', category: 'Vehicle Tools' },
  { id: 'car-insure', name: 'Car Insurance Estimator', slug: 'car-insurance-estimator', description: 'Premium estimation.', icon: '🛡️', category: 'Vehicle Tools' },
  { id: 'vehicle-age', name: 'Vehicle Age Calculator', slug: 'vehicle-age-calculator', description: 'Calculate vehicle age from registration.', icon: '📅', category: 'Vehicle Tools' },
  { id: 'tyre-size', name: 'Tyre Size Calculator', slug: 'tyre-size-calculator', description: 'Compare tyre dimensions.', icon: '⭕', category: 'Vehicle Tools' },
  { id: 'battery-backup', name: 'Battery Backup Calculator', slug: 'battery-backup-calculator', description: 'Estimate car battery life.', icon: '🔋', category: 'Vehicle Tools' },

  // --- Daily Life ---
  { id: 'age-calc', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate exact age.', icon: '🎈', category: 'Daily Life' },
  { id: 'date-diff', name: 'Date Difference', slug: 'date-difference-calculator', description: 'Days between two dates.', icon: '📆', category: 'Daily Life' },
  { id: 'time-duration', name: 'Time Duration Calculator', slug: 'time-duration-calculator', description: 'Calculate hours and minutes between times.', icon: '⏱️', category: 'Daily Life' },
  { id: 'perc-calc', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Simple percentage math.', icon: '🔢', category: 'Daily Life' },
  { id: 'discount-calc', name: 'Discount Calculator', slug: 'discount-calculator', description: 'Find sale price.', icon: '🏷️', category: 'Daily Life' },
  { id: 'tip-calc', name: 'Tip Calculator', slug: 'tip-calculator', description: 'Calculate service tip amount.', icon: '💵', category: 'Daily Life' },
  { id: 'loan-calc', name: 'Loan Calculator', slug: 'loan-calculator', description: 'General loan interest calculation.', icon: '💳', category: 'Daily Life' },
  { id: 'emi-calc', name: 'EMI Calculator', slug: 'emi-calculator', description: 'Monthly installment calculator.', icon: '📊', category: 'Daily Life' },
  { id: 'bmi-calc', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Health check.', icon: '⚖️', category: 'Daily Life' },
  { id: 'cal-calc', name: 'Calorie Calculator', slug: 'calorie-calculator', description: 'Daily calorie needs.', icon: '🍎', category: 'Daily Life' },

  // --- Internet & Mobile ---
  { id: 'net-speed-conv', name: 'Internet Speed Converter', slug: 'internet-speed-converter', description: 'Mbps to MB/s.', icon: '🌐', category: 'Internet & Mobile' },
  { id: 'screen-dpi', name: 'Screen DPI Calculator', slug: 'screen-dpi-calculator', description: 'Calculate screen pixel density.', icon: '📱', category: 'Internet & Mobile' },
  { id: 'screen-size', name: 'Screen Size Calculator', slug: 'screen-size-calculator', description: 'Calculate diagonal screen size.', icon: '📐', category: 'Internet & Mobile' },
  { id: 'mobile-storage', name: 'Mobile Storage Calculator', slug: 'mobile-storage-calculator', description: 'Check how much storage you need.', icon: '💾', category: 'Internet & Mobile' },
  { id: 'bat-health', name: 'Battery Health Estimator', slug: 'battery-health-estimator', description: 'Check phone battery life.', icon: '🔋', category: 'Internet & Mobile' },
  { id: 'app-size', name: 'App Size Estimator', slug: 'app-size-estimator', description: 'Estimate app download size.', icon: '📦', category: 'Internet & Mobile' },
  { id: 'touch-test', name: 'Touch Test Tool', slug: 'touch-test-tool', description: 'Test screen touch response.', icon: '👆', category: 'Internet & Mobile' },
  { id: 'network-band', name: 'Mobile Network Band Info', slug: 'mobile-network-band-info', description: '3G/4G/5G band compatibility checker.', icon: '📡', category: 'Internet & Mobile' },
  { id: 'phone-compare', name: 'Smartphone Comparison Tool', slug: 'smartphone-comparison-tool', description: 'Compare phone specs side by side.', icon: '⚖️', category: 'Internet & Mobile' },

  // --- Conversion ---
  { id: 'currency-conv', name: 'Currency Converter', slug: 'currency-converter', description: 'PKR to USD, EUR, etc.', icon: '💱', category: 'Conversion' },
  { id: 'gold-price', name: 'Gold Price Calculator', slug: 'gold-price-calculator', description: 'Track gold rates per tola in Pakistan.', icon: '🥇', category: 'Conversion' },
  { id: 'len-conv', name: 'Length Converter', slug: 'length-converter', description: 'KM to Miles, Meters to Feet.', icon: '📏', category: 'Conversion' },
  { id: 'weight-conv', name: 'Weight Converter', slug: 'weight-converter', description: 'KG to Lbs, Tola to Grams.', icon: '⚖️', category: 'Conversion' },
  { id: 'area-conv', name: 'Area Converter', slug: 'area-converter', description: 'Sq Ft to Sq M, Marla to Kanal.', icon: '📐', category: 'Conversion' },
  { id: 'volume-conv', name: 'Volume Converter', slug: 'volume-converter', description: 'Liters to Gallons, etc.', icon: '🥤', category: 'Conversion' },
  { id: 'speed-conv', name: 'Speed Converter', slug: 'speed-converter', description: 'KM/h to MPH, etc.', icon: '🚀', category: 'Conversion' },
  { id: 'temp-conv', name: 'Temperature Converter', slug: 'temperature-converter', description: 'Celsius to Fahrenheit, etc.', icon: '🌡️', category: 'Conversion' },
  { id: 'timezone-conv', name: 'Time Zone Converter', slug: 'time-zone-converter', description: 'Convert time between cities.', icon: '🌍', category: 'Conversion' },
  { id: 'power-conv', name: 'Power Unit Converter', slug: 'power-unit-converter', description: 'Watts to KW, HP, etc.', icon: '⚡', category: 'Conversion' },
  { id: 'number-base', name: 'Number Base Converter', slug: 'number-base-converter', description: 'Binary, Decimal, Hex converter.', icon: '🔢', category: 'Conversion' },

  // --- Banking ---
  { id: 'bank-profit', name: 'Bank Profit Calculator', slug: 'bank-profit-calculator', description: 'Monthly profit on savings.', icon: '🏦', category: 'Banking & Payments' },
  { id: 'savings-calc', name: 'Savings Account Calculator', slug: 'savings-account-calculator', description: 'Track savings growth over time.', icon: '💰', category: 'Banking & Payments' },
  { id: 'islamic-profit', name: 'Islamic Bank Profit Calculator', slug: 'islamic-bank-profit-calculator', description: 'Calculate Shariah-compliant profit.', icon: '☪️', category: 'Banking & Payments' },
  { id: 'cc-interest', name: 'Credit Card Interest Calculator', slug: 'credit-card-interest-calculator', description: 'Calculate credit card charges.', icon: '💳', category: 'Banking & Payments' },
  { id: 'atm-plan', name: 'ATM Cash Planner', slug: 'atm-cash-withdrawal-planner', description: 'Plan withdrawals to save fees.', icon: '🏧', category: 'Banking & Payments' },
  { id: 'loan-eligibility', name: 'Loan Eligibility Checker', slug: 'loan-eligibility-checker', description: 'Check if you qualify for a loan.', icon: '✅', category: 'Banking & Payments' },
  { id: 'mortgage-calc', name: 'Mortgage Calculator', slug: 'mortgage-calculator', description: 'Calculate home mortgage payments.', icon: '🏠', category: 'Banking & Payments' },
  { id: 'bank-charges', name: 'Bank Charges Estimator', slug: 'bank-charges-estimator', description: 'Estimate monthly bank fees.', icon: '💸', category: 'Banking & Payments' },
  { id: 'remittance-fee', name: 'Remittance Fee Calculator', slug: 'remittance-fee-calculator', description: 'Calculate money transfer charges.', icon: '🌍', category: 'Banking & Payments' },
  { id: 'emi-compare', name: 'EMI Comparison Tool', slug: 'emi-comparison-tool', description: 'Compare different EMI options.', icon: '📊', category: 'Banking & Payments' },

  // --- Bonus ---
  { id: 'ramadan-count', name: 'Ramadan Countdown', slug: 'ramadan-countdown', description: 'Days to Ramadan 2025.', icon: '☪️', category: 'Bonus' },
  { id: 'budget-planner', name: 'Budget Planner Pakistan', slug: 'budget-planner-pakistan', description: 'Plan your monthly budget.', icon: '📝', category: 'Bonus' },
  { id: 'expense-tracker', name: 'Monthly Expense Tracker', slug: 'monthly-expense-tracker', description: 'Track daily expenses.', icon: '📊', category: 'Bonus' },
  { id: 'wedding-budget', name: 'Wedding Budget Calculator', slug: 'wedding-budget-calculator', description: 'Plan wedding expenses in Pakistan.', icon: '💍', category: 'Bonus' },
  { id: 'education-cost', name: 'Education Cost Calculator', slug: 'education-cost-calculator', description: 'Estimate school/university fees.', icon: '🎓', category: 'Bonus' },
  { id: 'freelance-earn', name: 'Freelance Earnings Calculator', slug: 'freelance-earnings-calculator', description: 'Calculate net freelance income.', icon: '💻', category: 'Bonus' },
  { id: 'fiverr-fee', name: 'Fiverr Fee Calculator', slug: 'fiverr-fee-calculator', description: 'Calculate Fiverr commission.', icon: '🟢', category: 'Bonus' },
  { id: 'yt-earn', name: 'YouTube Income', slug: 'youtube-income-estimator', description: 'Estimate ad revenue.', icon: '🎥', category: 'Bonus' },
  { id: 'tiktok-earn', name: 'TikTok Earnings', slug: 'tiktok-earnings-estimator', description: 'Estimate creator fund earnings.', icon: '🎵', category: 'Bonus' },
  { id: 'adsense-calc', name: 'AdSense Calculator', slug: 'adsense-earnings-calculator', description: 'Estimate website revenue.', icon: '📊', category: 'Bonus' }
];

export const SALARY_TAX_SLABS_2024: TaxSlab[] = [
  { min: 0, max: 600000, baseTax: 0, percentage: 0 },
  { min: 600001, max: 1200000, baseTax: 0, percentage: 5 },
  { min: 1200001, max: 2400000, baseTax: 30000, percentage: 15 },
  { min: 2400001, max: 3600000, baseTax: 210000, percentage: 25 },
  { min: 3600001, max: 6000000, baseTax: 510000, percentage: 30 },
  { min: 6000001, max: null, baseTax: 1230000, percentage: 35 }
];

export const ELECTRICITY_COMPANIES = ['LESCO', 'IESCO', 'KE', 'MEPCO', 'PESCO', 'FESCO', 'GEPCO', 'QESCO', 'SEPCO', 'TESCO'];

export const DISCLAIMER_TEXT = "PakUtility provides estimates for informational purposes only. We do not access NADRA, PTA, FBR, or any government database.";
