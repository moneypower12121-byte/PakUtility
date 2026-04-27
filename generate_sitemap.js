
const fs = require('fs');

const tools = [
  { slug: 'electricity-bill-calculator-pakistan' },
  { slug: 'gas-bill-calculator-sngpl-ssgc' },
  { slug: 'water-bill-calculator' },
  { slug: 'solar-savings-calculator' },
  { slug: 'ups-load-calculator' },
  { slug: 'generator-fuel-calculator' },
  { slug: 'ac-power-usage-calculator' },
  { slug: 'fridge-power-calculator' },
  { slug: 'internet-data-usage-calculator' },
  { slug: 'load-shedding-time-estimator' },
  { slug: 'salary-tax-calculator-pakistan' },
  { slug: 'income-tax-calculator-yearly' },
  { slug: 'freelancer-tax-calculator' },
  { slug: 'withholding-tax-estimator' },
  { slug: 'property-tax-calculator-pakistan' },
  { slug: 'capital-gain-tax-calculator' },
  { slug: 'vehicle-token-tax-calculator' },
  { slug: 'prize-bond-tax-calculator' },
  { slug: 'zakat-calculator-pakistan' },
  { slug: 'ushr-calculator-pakistan' },
  { slug: 'zakat-on-gold-calculator' },
  { slug: 'zakat-on-business-calculator' },
  { slug: 'fitra-calculator' },
  { slug: 'kaffarah-calculator' },
  { slug: 'qurbani-share-calculator' },
  { slug: 'prayer-times-pakistan' },
  { slug: 'qibla-direction-tool' },
  { slug: 'islamic-calendar-hijri' },
  { slug: 'roza-counter' },
  { slug: 'namaz-missed-calculator' },
  { slug: 'cnic-format-checker' },
  { slug: 'cnic-age-calculator' },
  { slug: 'cnic-province-identifier' },
  { slug: 'sim-rules-checker-pta' },
  { slug: 'passport-expiry-calculator' },
  { slug: 'visa-duration-calculator' },
  { slug: 'driving-license-expiry-calculator' },
  { slug: 'vehicle-registration-city-checker' },
  { slug: 'ntn-format-checker' },
  { slug: 'iban-format-validator' },
  { slug: 'construction-cost-calculator' },
  { slug: 'cement-bags-calculator' },
  { slug: 'steel-weight-calculator' },
  { slug: 'bricks-calculator' },
  { slug: 'paint-coverage-calculator' },
  { slug: 'tile-calculator' },
  { slug: 'plot-area-converter' },
  { slug: 'rental-yield-calculator' },
  { slug: 'home-loan-emi-calculator' },
  { slug: 'property-price-estimator' },
  { slug: 'fuel-cost-calculator' },
  { slug: 'petrol-price-tracker-pakistan' },
  { slug: 'mileage-calculator' },
  { slug: 'car-import-duty-estimator' },
  { slug: 'car-loan-emi-calculator' },
  { slug: 'bike-mileage-calculator' },
  { slug: 'car-insurance-estimator' },
  { slug: 'vehicle-age-calculator' },
  { slug: 'tyre-size-calculator' },
  { slug: 'battery-backup-calculator' },
  { slug: 'age-calculator' },
  { slug: 'date-difference-calculator' },
  { slug: 'time-duration-calculator' },
  { slug: 'percentage-calculator' },
  { slug: 'discount-calculator' },
  { slug: 'tip-calculator' },
  { slug: 'loan-calculator' },
  { slug: 'emi-calculator' },
  { slug: 'bmi-calculator' },
  { slug: 'calorie-calculator' },
  { slug: 'internet-speed-converter' },
  { slug: 'screen-dpi-calculator' },
  { slug: 'screen-size-calculator' },
  { slug: 'mobile-storage-calculator' },
  { slug: 'battery-health-estimator' },
  { slug: 'app-size-estimator' },
  { slug: 'touch-test-tool' },
  { slug: 'mobile-network-band-info' },
  { slug: 'smartphone-comparison-tool' },
  { slug: 'currency-converter' },
  { slug: 'gold-price-calculator' },
  { slug: 'length-converter' },
  { slug: 'weight-converter' },
  { slug: 'area-converter' },
  { slug: 'volume-converter' },
  { slug: 'speed-converter' },
  { slug: 'temperature-converter' },
  { slug: 'time-zone-converter' },
  { slug: 'power-unit-converter' },
  { slug: 'number-base-converter' },
  { slug: 'bank-profit-calculator' },
  { slug: 'savings-account-calculator' },
  { slug: 'islamic-bank-profit-calculator' },
  { slug: 'credit-card-interest-calculator' },
  { slug: 'atm-cash-withdrawal-planner' },
  { slug: 'loan-eligibility-checker' },
  { slug: 'mortgage-calculator' },
  { slug: 'bank-charges-estimator' },
  { slug: 'remittance-fee-calculator' },
  { slug: 'emi-comparison-tool' },
  { slug: 'ramadan-countdown' },
  { slug: 'budget-planner-pakistan' },
  { slug: 'monthly-expense-tracker' },
  { slug: 'wedding-budget-calculator' },
  { slug: 'education-cost-calculator' },
  { slug: 'freelance-earnings-calculator' },
  { slug: 'fiverr-fee-calculator' },
  { slug: 'youtube-income-estimator' },
  { slug: 'tiktok-earnings-estimator' },
  { slug: 'adsense-earnings-calculator' }
];

const staticPages = [
  '',
  'privacy-policy',
  'disclaimer',
  'about-us',
  'contact-us',
  'terms-and-conditions'
];

const baseUrl = 'https://pakutility.xyz';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

staticPages.forEach(page => {
  xml += `  <url>
    <loc>${baseUrl}/${page}</loc>
    <lastmod>${today}</lastmod>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
});

tools.forEach(tool => {
  xml += `  <url>
    <loc>${baseUrl}/${tool.slug}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>
`;
});

xml += '</urlset>';

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated!');
