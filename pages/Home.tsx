
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import SEOContent from '../components/SEOContent';
import AdPlaceholder from '../components/AdPlaceholder';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(TOOLS.map(t => t.category)));
  }, []);

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? tool.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-700 -mt-8 -mx-4 px-4 py-16 text-center text-white mb-12 shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-sm">
            Pakistan's Largest Utility Hub
          </h1>
          <p className="text-xl text-emerald-100 mb-10 opacity-90">
            100+ Professional Calculators for Bills, Taxes, Property, and Daily Life.
          </p>
          <div className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search 100+ calculators (e.g., Gas Bill, Salary, Area...)" 
              className="w-full px-8 py-5 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400 shadow-2xl transition-all duration-300 group-hover:shadow-emerald-900/20"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveCategory(null);
              }}
            />
            <span className="absolute right-8 top-5 text-2xl animate-pulse">🔍</span>
          </div>
        </div>
      </section>

      <AdPlaceholder slot="home-top" />

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 rounded-full text-sm font-bold border transition ${!activeCategory ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500'}`}
        >
          All Tools
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition ${activeCategory === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {activeCategory ? activeCategory : 'Trending Tools'}
          </h2>
          <p className="text-gray-500 text-sm">{filteredTools.length} results</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
              <Link 
                key={tool.id} 
                to={`/${tool.slug}`} 
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="text-4xl mb-4 bg-emerald-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-emerald-100 transition">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition">
                  {tool.name}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-grow">
                  {tool.description}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                   <span className="text-[10px] uppercase font-bold text-emerald-600/50">{tool.category}</span>
                   <span className="text-emerald-600 text-lg group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic text-lg">No tools found matching your criteria. Try another keyword!</p>
            </div>
          )}
        </div>
      </section>

      <AdPlaceholder slot="home-bottom" />

      <SEOContent />
    </div>
  );
};

export default Home;
