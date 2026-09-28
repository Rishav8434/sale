import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import AiSearchModal from './AiSearchModal';
import { 
  Building2, 
  Plus, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Compass,
  Sparkles,
  Zap,
  Bookmark,
  Scale,
  Globe
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AiSearchModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      <header className="sticky top-0 z-50 glass-editorial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo - Bespoke Human Architectural Wordmark */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-amber-200/90 shadow-xs group-hover:bg-amber-950 transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-serif text-stone-950 tracking-tight font-normal">
                    REAL<span className="font-serif italic font-medium text-amber-800">NEST</span>
                  </span>
                </div>
                <span className="text-[8.5px] font-sans font-semibold uppercase tracking-[0.28em] text-stone-400 -mt-1">
                  Estates & Architecture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Human Curated Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              <Link
                to="/properties"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive('/properties')
                    ? 'bg-stone-900 text-stone-100'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                }`}
              >
                The Collection
              </Link>

              {/* Discreet Search Concierge Trigger */}
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide text-stone-700 bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200/70 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>Search Concierge</span>
                <span className="text-[10px] text-stone-400 font-mono ml-0.5">⌘K</span>
              </button>

              <Link
                to="/pricing"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive('/pricing')
                    ? 'bg-stone-900 text-stone-100'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                }`}
              >
                Advisory & Fees
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/properties/new"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                      isActive('/properties/new')
                        ? 'bg-stone-900 text-stone-100'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                    }`}
                  >
                    <Plus className="w-3 h-3 text-stone-400" />
                    <span>Submit Residence</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                      isActive('/dashboard')
                        ? 'bg-stone-900 text-stone-100'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                    }`}
                  >
                    <LayoutDashboard className="w-3 h-3 text-stone-400" />
                    <span>Portfolio</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                        isActive('/admin')
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-amber-900 bg-amber-50/70 hover:bg-amber-100'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-amber-700" />
                      <span>Curator Suite</span>
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center gap-3">
              {/* Currency Selector Pill */}
              <CurrencySelector />

              {/* Compare residences counter button */}
              <CompareNavTrigger />

              {isAuthenticated ? (
                <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-stone-900 leading-none">{user?.name}</p>
                    <span className="text-[10px] text-stone-400">
                      {user?.role === 'ROLE_ADMIN' ? 'Managing Partner' : 'Private Client'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold text-stone-100 bg-stone-900 hover:bg-stone-800 rounded-full shadow-xs transition-all hover:scale-[1.01]"
                  >
                    Client Registry
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-editorial border-b border-stone-200 px-5 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAiModalOpen(true);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs uppercase flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              AI Search Concierge
            </button>
            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-stone-800 hover:bg-stone-100"
            >
              Curated Collection
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-stone-800 hover:bg-stone-100"
            >
              Memberships
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/properties/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-bold text-stone-800 hover:bg-stone-100"
                >
                  List Estate
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-bold text-stone-800 hover:bg-stone-100"
                >
                  Portfolio Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-900 bg-amber-50"
                  >
                    Admin Portal
                  </Link>
                )}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-stone-200 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 bg-stone-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-stone-900 rounded-xl shadow-xs"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

// Helper Subcomponents for Currency and Comparison
const CurrencySelector = () => {
  const { currentCurrency, setCurrentCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 transition-all cursor-pointer"
        title="Select Display Currency"
      >
        <span className="text-xs">{currencies[currentCurrency]?.flag}</span>
        <span>{currentCurrency}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-[#141311] border border-[#2d2a26] rounded-2xl shadow-xl py-2 z-40 animate-fadeIn text-xs">
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#8c827a] font-mono border-b border-[#24211d]">
              Valuation Currency
            </div>
            {Object.values(currencies).map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrentCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                  currentCurrency === curr.code
                    ? 'bg-[#b59a68]/20 text-[#d4af37] font-semibold'
                    : 'text-[#ded7cd] hover:bg-[#1e1c19]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{curr.flag}</span>
                  <span className="font-mono">{curr.code}</span>
                </span>
                <span className="text-[#8c827a] font-mono">{curr.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CompareNavTrigger = () => {
  const { comparedProperties, setIsCompareModalOpen } = useCompare();
  if (comparedProperties.length === 0) return null;

  return (
    <button
      onClick={() => setIsCompareModalOpen(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 transition-all shadow-xs cursor-pointer animate-pulse"
      title="Open Comparison Matrix"
    >
      <Scale size={13} className="text-amber-800" />
      <span className="font-mono font-bold">Compare ({comparedProperties.length})</span>
    </button>
  );
};

export default Navbar;
