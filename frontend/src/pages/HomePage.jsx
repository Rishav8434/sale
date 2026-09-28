import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyApi } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Search, 
  MapPin, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Compass,
  Award,
  Layers,
  CheckCircle2,
  Building,
  Star
} from 'lucide-react';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await propertyApi.getProperties({ size: 6, sortBy: 'createdAt', sortDir: 'desc' });
        if (res && res.data && res.data.content) {
          setFeaturedProperties(res.data.content);
        }
      } catch (err) {
        console.error('Failed to load featured properties', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (searchType) params.append('type', searchType);
    if (searchKeyword) params.append('keyword', searchKeyword);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-28 pb-16">
      
      {/* Editorial Luxury Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Editorial Provenance Monogram Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-stone-100/90 border border-stone-200 text-stone-700 text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
              <span>Autumn 2026 Curated Architectural Registry</span>
            </div>

            {/* Serif Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-stone-950 tracking-tight leading-[1.08] font-normal">
              Architecture as Art.<br />
              <span className="font-serif italic text-amber-800 font-normal">Sanctuary for Generations.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
              A private collective connecting discerning individuals with certified architectural residences, mid-century modernist icons, and discreet global estates.
            </p>

            {/* Human-Made Tactile Search Console */}
            <div className="pt-4 max-w-4xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-3 sm:p-3.5 rounded-3xl shadow-[0_12px_40px_rgba(28,25,23,0.06)] border border-stone-200/90 grid grid-cols-1 sm:grid-cols-12 gap-2 text-left"
              >
                {/* Destination */}
                <div className="sm:col-span-4 px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-100 flex flex-col justify-center">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-stone-400">Global Destination</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Beverly Hills, Tribeca, Pune..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-stone-900 placeholder-stone-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Listing Type */}
                <div className="sm:col-span-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-100 flex flex-col justify-center">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-stone-400">Standing</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-stone-900 focus:outline-none cursor-pointer mt-1"
                  >
                    <option value="">All Transactions</option>
                    <option value="SALE">Acquisition (For Sale)</option>
                    <option value="RENT">Private Lease (For Rent)</option>
                  </select>
                </div>

                {/* Architectural Style */}
                <div className="sm:col-span-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-stone-100 flex flex-col justify-center">
                  <label className="text-[9.5px] font-bold uppercase tracking-widest text-stone-400">Materiality / Style</label>
                  <input
                    type="text"
                    placeholder="Brownstone, Villa, Penthouse..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-stone-900 placeholder-stone-400 focus:outline-none mt-1"
                  />
                </div>

                {/* Search Execution Button */}
                <div className="sm:col-span-2 p-1 flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full py-3 sm:py-0 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>Search</span>
                  </button>
                </div>
              </form>

              {/* Curated Collection Filter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-5 text-xs">
                <span className="text-stone-400 text-[11px] font-medium uppercase tracking-wider">Curated Collections:</span>
                {[
                  { label: 'Waterfront Sanctuaries', url: '/properties?keyword=Villa' },
                  { label: 'Skyline Penthouses', url: '/properties?keyword=Penthouse' },
                  { label: 'Historic Brownstones', url: '/properties?keyword=Brownstone' },
                  { label: 'California Modernism', url: '/properties?location=California' },
                  { label: 'Curated Leases', url: '/properties?type=RENT' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigate(chip.url)}
                    className="px-3 py-1 rounded-full bg-white/90 border border-stone-200/80 hover:border-stone-900 text-stone-700 hover:text-stone-950 transition-all text-[11px] font-semibold cursor-pointer shadow-xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Proof Metric Bar - Grounded Architectural Grid */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-stone-200/80 max-w-4xl mx-auto">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">$2.8B+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Curated Volume</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">14</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Global Capitals</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Title-Vetted Deeds</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">4.97 / 5</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Client Trust Score</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
              The Curated Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-1 font-serif-luxury">
              Notable Architectural Residences
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Hand-vetted properties possessing exceptional structural character, rare vistas, and premium acreage.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-stone-600 transition-colors group"
          >
            <span>Browse Complete Portfolio ({featuredProperties.length} active)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <Building className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No properties currently listed in this category</h3>
            <p className="text-xs text-stone-500">Be the first premier agent or owner to publish an estate.</p>
            <Link
              to="/properties/new"
              className="mt-3 inline-block px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              List an Estate
            </Link>
          </div>
        )}
      </section>

      {/* The RealNest Standard (Editorial Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-white rounded-[2.5rem] p-8 sm:p-16 space-y-12 relative overflow-hidden">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
              The RealNest X Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif-luxury">
              Crafted for transparency, privacy, and architectural merit.
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              We reject the noise of generic listing aggregators. Every residence showcased on RealNest X undergoes rigorous provenance verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-stone-800">
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury">100% Provenance Verification</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Prior to publication, property records, ownership deeds, and agent licenses are vetted to eliminate duplicate entries and counterfeit listings.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury">AI Valuation & Geo-Intelligence</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                PostGIS spatial computation coupled with hedonic regression algorithms calculate realistic fair-market value benchmarks and social infrastructure scores.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-200">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury">Private Discretion & Escrow</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Client privacy is paramount. High-net-worth buyers and sellers utilize discreet messaging channels and escrow protocols throughout negotiations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Press Mentions Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
          Featured & Recognized In Leading Publications
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all text-xs font-serif font-bold tracking-widest text-stone-800">
          <span>ARCHITECTURAL DIGEST</span>
          <span>ROBB REPORT</span>
          <span>FINANCIAL TIMES</span>
          <span>WALL STREET JOURNAL</span>
          <span>BLOOMBERG PURSUITS</span>
        </div>
      </section>

      {/* Estate Owner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4F2EC] border border-[#EAE7DD] rounded-[2.5rem] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Listing Advisory</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-luxury">
              Representing a world-class property?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Showcase your residence directly to pre-qualified buyers and elite tenant networks with customized drone videography and virtual walkthrough integration.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/properties/new"
              className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              Submit Property
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3.5 bg-white border border-[#EAE7DD] hover:border-stone-900 text-stone-800 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              Agency Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
