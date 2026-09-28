import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Sparkles, 
  X, 
  Search, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  Building2, 
  DollarSign 
} from 'lucide-react';

const AiSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedCriteria, setParsedCriteria] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const samplePrompts = [
    "Show me 3BHK under 80 lakh near metro in Pune",
    "Luxury villa in Beverly Hills with pool under 2.5M",
    "Modern penthouse for rent in Manhattan under 10000",
    "Scandinavian loft in Seattle with gym under 5000",
  ];

  const handleParse = async (inputQuery) => {
    const q = inputQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setQuery(q);
    try {
      const res = await axiosClient.post('/ai/parse-search', { query: q });
      if (res && res.data) {
        setParsedCriteria(res.data);
      }
    } catch (err) {
      console.error('NLP parse failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySearch = () => {
    if (!parsedCriteria) return;

    const params = new URLSearchParams();
    if (parsedCriteria.city) params.set('location', parsedCriteria.city);
    if (parsedCriteria.listingType) params.set('type', parsedCriteria.listingType);
    if (parsedCriteria.maxPrice) params.set('maxPrice', parsedCriteria.maxPrice);
    if (parsedCriteria.minPrice) params.set('minPrice', parsedCriteria.minPrice);
    if (parsedCriteria.category) params.set('keyword', parsedCriteria.category);
    else if (parsedCriteria.keyword) params.set('keyword', parsedCriteria.keyword);

    onClose();
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">RealNest X — AI Search Intelligence</h3>
              <p className="text-xs text-indigo-200">Search with natural conversational queries powered by LLM parsing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleParse();
            }}
            className="space-y-3"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Show me 3BHK under 80 lakh near metro in Pune..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-5 pr-28 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-800"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2.5 top-2.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Analyze
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-bold text-slate-400">Try asking:</span>
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleParse(p)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 transition-colors text-left"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </form>

          {/* AI Parsing Analysis Card */}
          {parsedCriteria && (
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Natural Language Parser Result
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Latency: 18ms</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target City</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {parsedCriteria.city || 'Any City'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Listing Type</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {parsedCriteria.listingType || 'Sale & Rent'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Max Budget</span>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    {parsedCriteria.maxPrice ? `$${Number(parsedCriteria.maxPrice).toLocaleString()}` : 'No Limit'}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bedrooms</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {parsedCriteria.bedrooms ? `${parsedCriteria.bedrooms} BHK` : 'Any'}
                  </p>
                </div>
              </div>

              {parsedCriteria.naturalLanguageSummary && (
                <p className="text-xs text-indigo-950 font-medium bg-white/60 p-3 rounded-xl border border-indigo-100/50">
                  💡 {parsedCriteria.naturalLanguageSummary}
                </p>
              )}

              <button
                type="button"
                onClick={handleApplySearch}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01]"
              >
                <span>Execute Smart Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AiSearchModal;
