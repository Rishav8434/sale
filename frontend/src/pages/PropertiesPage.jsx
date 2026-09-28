import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyApi } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  RotateCcw, 
  Building2, 
  DollarSign, 
  ArrowUpDown,
  Grid,
  LayoutGrid,
  Filter
} from 'lucide-react';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);

  // Data State
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params changes
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setLocation(searchParams.get('location') || '');
    setType(searchParams.get('type') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || 'createdAt');
    setSortDir(searchParams.get('sortDir') || 'desc');
    setPage(Number(searchParams.get('page')) || 0);
  }, [searchParams]);

  // Fetch properties whenever query params change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          size: 9,
          sortBy,
          sortDir,
        };

        if (keyword) params.keyword = keyword;
        if (location) params.location = location;
        if (type) params.type = type;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await propertyApi.getProperties(params);
        if (res && res.data) {
          setProperties(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [keyword, location, type, minPrice, maxPrice, sortBy, sortDir, page]);

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);
    params.set('page', '0');
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortDir('desc');
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    let newSortBy = 'createdAt';
    let newSortDir = 'desc';

    if (value === 'price-asc') {
      newSortBy = 'price';
      newSortDir = 'asc';
    } else if (value === 'price-desc') {
      newSortBy = 'price';
      newSortDir = 'desc';
    } else if (value === 'newest') {
      newSortBy = 'createdAt';
      newSortDir = 'desc';
    }

    setSortBy(newSortBy);
    setSortDir(newSortDir);

    const params = new URLSearchParams(searchParams);
    params.set('sortBy', newSortBy);
    params.set('sortDir', newSortDir);
    params.set('page', '0');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
            Certified Registry
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-950 tracking-tight mt-1 font-normal">
            Architectural Residences & Estates
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1.5 max-w-xl">
            Vetted for structural craftsmanship, historical authenticity, clear legal deeds, and verified ownership.
          </p>
        </div>

        {/* Results summary counter */}
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Registry Inventory</p>
          <p className="text-2xl font-serif font-bold text-stone-950 mt-0.5">{totalElements} Residences</p>
        </div>
      </div>

      {/* Filter and Search Console */}
      <div className="luxury-card p-6 sm:p-7 rounded-3xl space-y-4">
        <form onSubmit={applyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          
          {/* Keyword Search */}
          <div className="lg:col-span-3 relative flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Villa, Penthouse, Pool..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600/30 text-stone-900 placeholder-stone-400"
            />
          </div>

          {/* Location */}
          <div className="lg:col-span-3 relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="City or Metro (Beverly Hills, Manhattan...)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600/30 text-stone-900 placeholder-stone-400"
            />
          </div>

          {/* Type Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600/30 text-stone-900 cursor-pointer"
            >
              <option value="">All Transactions</option>
              <option value="SALE">Acquisition (Sale)</option>
              <option value="RENT">Private Lease (Rent)</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="lg:col-span-2 flex gap-1.5">
            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 px-2.5 py-2.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600/30 text-stone-900 placeholder-stone-400"
            />
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 px-2.5 py-2.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600/30 text-stone-900 placeholder-stone-400"
            />
          </div>

          {/* Action buttons */}
          <div className="lg:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Filter className="w-3 h-3 text-amber-400" />
              Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-xl transition-all border border-stone-200 cursor-pointer"
              title="Reset Criteria"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

        {/* Results Metadata & Sorting */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs">
          <div className="text-stone-500 font-medium">
            Displaying <span className="font-semibold text-stone-900">{properties.length}</span> curated residences of{' '}
            <span className="font-semibold text-stone-900">{totalElements}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Order by:</span>
            <select
              value={
                sortBy === 'price'
                  ? sortDir === 'asc'
                    ? 'price-asc'
                    : 'price-desc'
                  : 'newest'
              }
              onChange={handleSortChange}
              className="bg-stone-50/80 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            >
              <option value="newest">Recently Curated</option>
              <option value="price-asc">Valuation: Low to High</option>
              <option value="price-desc">Valuation: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <SkeletonLoader count={9} />
      ) : properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-[#EAE7DD] p-8 space-y-4">
          <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-luxury">No matching estates discovered</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            There are currently no residences matching your precise filter criteria. Please broaden your budget range or search terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-stone-800 transition-all"
          >
            Clear All Criteria
          </button>
        </div>
      )}

    </div>
  );
};

export default PropertiesPage;
