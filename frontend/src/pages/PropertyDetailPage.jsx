import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyApi } from '../api/propertyApi';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { FloorPlanViewer } from '../components/FloorPlanViewer';
import { 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Share2, 
  ShieldCheck, 
  Calendar,
  Send,
  Loader2,
  Bed,
  Bath,
  Maximize2,
  Compass,
  FileText,
  Heart,
  Scale
} from 'lucide-react';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertyApi.getPropertyById(id);
        if (res && res.data) {
          setProperty(res.data);
        }
      } catch (err) {
        console.error('Failed to load property details', err);
        setError('Property not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently withdraw this listing from the portfolio?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await propertyApi.deleteProperty(id);
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setInquiryMessage('');
    setTimeout(() => setInquirySent(false), 5000);
  };

  const isOwner = user && property && user.id === property.ownerId;
  const canModify = isOwner || isAdmin;

  const fallbackImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-stone-700 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Retrieving Architectural Portfolio...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto my-28 p-10 text-center bg-white rounded-[2rem] border border-[#EAE7DD]">
        <h2 className="text-2xl font-bold text-stone-900 font-serif-luxury mb-2">Residence Unavailable</h2>
        <p className="text-stone-500 text-xs mb-6 leading-relaxed">{error || 'This property is not currently accessible.'}</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Registry
        </Link>
      </div>
    );
  }

  const { formatPrice } = useCurrency();
  const { toggleCompare, isInCompare } = useCompare();
  const isCompared = property ? isInCompare(property.id) : false;

  const formattedPrice = formatPrice(property.price);

  const beds = property.id % 2 === 0 ? 4 : 3;
  const baths = property.id % 2 === 0 ? 3.5 : 2.5;
  const sqft = property.id % 2 === 0 ? '4,250' : '2,800';
  const acreage = property.id % 2 === 0 ? '0.62 Acres' : '0.35 Acres';
  const yearBuilt = property.id % 2 === 0 ? '2023 • Modernist' : '1894 • Restored 2024';
  const mlsId = `RNX-${(property.id * 1843).toString().padStart(6, '0')}`;

  const detailPhotos = [
    property.imageUrl || fallbackImage,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio Registry</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Compare Button */}
          <button
            onClick={() => toggleCompare(property)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCompared 
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs' 
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            <Scale className={`w-3.5 h-3.5 ${isCompared ? 'text-amber-800' : 'text-stone-400'}`} />
            <span>{isCompared ? 'Comparing Dossier' : 'Compare Residence'}</span>
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              saved 
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs' 
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-rose-600' : 'text-stone-400'}`} />
            <span>{saved ? 'In Private Collection' : 'Save Residence'}</span>
          </button>

          {canModify && (
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <Link
                to={`/properties/edit/${property.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-all"
              >
                <Edit3 className="w-3 h-3 text-stone-500" />
                <span>Modify</span>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
                <span>{deleteLoading ? 'Withdrawing...' : 'Withdraw'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Presentation Gallery - Architectural 3-Frame Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[420px] sm:h-[500px] lg:h-[560px]">
          
          {/* Grand Primary View (8 cols) */}
          <div className="md:col-span-8 h-full rounded-2xl sm:rounded-3xl overflow-hidden relative group bg-stone-100 border border-stone-200">
            <img
              src={detailPhotos[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
            
            {/* Badges on primary image */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-stone-950/80 text-white backdrop-blur-md border border-white/10">
                {property.type === 'SALE' ? 'Private Acquisition' : 'Curated Lease'}
              </span>
              {property.approved && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-semibold bg-white/95 text-stone-900 backdrop-blur-md shadow-xs border border-stone-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Title Verified
                </span>
              )}
            </div>

            <div className="absolute bottom-5 left-5 text-white/90 text-xs font-medium bg-stone-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Primary Facade & Grounds
            </div>
          </div>

          {/* Secondary Editorial Frames (4 cols) */}
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-3 h-full">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden relative group bg-stone-100 border border-stone-200">
              <img
                src={detailPhotos[1]}
                alt="Interior Finishes"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <span className="absolute bottom-4 left-4 text-white/90 text-[11px] font-medium bg-stone-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                Living Gallery & Fireplace
              </span>
            </div>

            <div className="rounded-2xl sm:rounded-3xl overflow-hidden relative group bg-stone-100 border border-stone-200">
              <img
                src={detailPhotos[2]}
                alt="Exterior Terrace"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <span className="absolute bottom-4 left-4 text-white/90 text-[11px] font-medium bg-stone-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                Travertine Culinary Suite
              </span>

              <div className="absolute bottom-4 right-4 text-stone-900 text-[11px] font-bold bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
                14 Photographs
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Core Grid: Dossier Left & Sticky Scheduler Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left 8 Columns: Architectural Dossier */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Header & Valuation Bar */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-700">{property.location}</span>
              <span className="text-stone-300">/</span>
              <span className="font-mono text-stone-400">Registry Reference: {mlsId}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif text-stone-950 tracking-tight leading-[1.12] font-normal">
              {property.title}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Guide Valuation</span>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-950">
                  {formattedPrice}
                </span>
              </div>
              {property.type === 'RENT' && (
                <span className="text-stone-500 text-sm font-medium">per month (inclusive of grounds maintenance)</span>
              )}
            </div>
          </div>

          {/* Refined Architectural Specs Ribbon (6 Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8 py-7 px-6 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Bedrooms</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Bed className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{beds} En-Suite Chambers</span>
              </div>
            </div>

            <div className="space-y-1 sm:border-l border-stone-100 sm:pl-6">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Bathrooms</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Bath className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{baths} Full Marble Baths</span>
              </div>
            </div>

            <div className="space-y-1 sm:border-l border-stone-100 sm:pl-6">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Living Interior</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Maximize2 className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{sqft} Sq Ft Internal</span>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Site Extent</span>
              <div className="text-sm font-semibold text-stone-900">
                {acreage}
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-stone-100 sm:border-l sm:pl-6">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Heritage & Era</span>
              <div className="text-sm font-semibold text-stone-900">
                {yearBuilt}
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-stone-100 sm:border-l sm:pl-6">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Provenance Status</span>
              <div className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Clean Clear Deed</span>
              </div>
            </div>
          </div>

          {/* Architectural Essay & Narrative */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-950 font-normal">
              Architectural Profile & Materiality
            </h2>
            <div className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
              <p className="editorial-lead">
                {property.description}
              </p>
              <p className="text-stone-600 leading-relaxed text-sm">
                Conceived as a dialogue between geometric clarity and organic landscape, the residence integrates sweeping expanses of low-iron thermal glazing, raw vein-matched travertine wall cladding, and rift-sawn European white oak flooring. Natural illumination cascades across soaring ceilings, culminating in unobstructed panoramic horizons.
              </p>
            </div>
          </div>

          {/* Grouped Architectural Specifications */}
          <div className="space-y-6 pt-6 border-t border-stone-200/80">
            <h3 className="text-lg font-serif text-stone-950">
              Curated Architectural Finishes & Amenities
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                  01 / Finishes & Materiality
                </span>
                <ul className="space-y-2 text-stone-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Italian Calacatta Monet Marble</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Rift-Sawn White Oak Floors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>11-Foot Coffered Ceilings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Custom Bronze Hardware</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                  02 / Wellness & Grounds
                </span>
                <ul className="space-y-2 text-stone-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Heated Saltwater Plunge Pool</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Swedish Cedar Sauna</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Sommelier Temperature Cellar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Manicured Olive Grove</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                  03 / Automation & Security
                </span>
                <ul className="space-y-2 text-stone-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Lutron HomeWorks Automation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Subterranean 3-Car Vault</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Dual Tesla Powerwall 3 Storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Biometric Access Control</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Interactive Architectural CAD Floor Plans */}
          <FloorPlanViewer propertyTitle={property.title} />

          {/* Title & Provenance Guarantee Strip */}
          <div className="p-6 rounded-2xl bg-stone-900 text-stone-200 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Institutional Assurance</div>
              <h4 className="text-base font-serif text-white">RealNest X Title & Escrow Guarantee</h4>
              <p className="text-xs text-stone-400 max-w-lg">
                All property boundaries, historical ownership chains, and municipal permits are independently validated by accredited advisory solicitors.
              </p>
            </div>
            <button
              onClick={() => alert(`Dossier #${mlsId} requested. Verified documentation will be sent to registered client email.`)}
              className="px-5 py-2.5 bg-stone-100 hover:bg-white text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
            >
              Request Title Dossier
            </button>
          </div>

          {/* Interactive Mortgage & Yield Simulator */}
          <MortgageCalculator propertyPrice={property.price} />

        </div>

        {/* Right 4 Columns: Sticky Private Scheduling Suite */}
        <div className="lg:col-span-4 sticky top-28 self-start space-y-6">
          
          <div className="luxury-card p-7 rounded-3xl space-y-6">
            
            <div className="space-y-1.5 pb-4 border-b border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">
                Exclusive Advisory Representation
              </span>
              <h3 className="text-xl font-serif text-stone-950">
                Schedule Confidential Viewing
              </h3>
              <p className="text-xs text-stone-500">
                Private escorted appointments arranged by the managing brokerage partner.
              </p>
            </div>

            {/* Representative Card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/80">
              <div className="w-11 h-11 rounded-xl bg-stone-900 text-amber-200 flex items-center justify-center font-serif font-bold text-base shadow-xs">
                {property.ownerName ? property.ownerName.charAt(0) : 'R'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-950 truncate">{property.ownerName || 'Lord Alexander Wright'}</p>
                <p className="text-[11px] text-amber-800 font-medium">Senior Advisory Partner</p>
                <p className="text-[10px] text-stone-400 font-mono truncate">{property.ownerEmail}</p>
              </div>
            </div>

            {/* Tactile Human-Designed Viewing Scheduler */}
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              
              {/* Day Selection Chips */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                  Select Preferred Viewing Day
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Tomorrow', 'This Weekend', 'Next Week'].map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setInquiryDate(day)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                        inquiryDate === day
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50/70 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot preference */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                  Preferred Light & Atmosphere
                </label>
                <select className="w-full px-3 py-2.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30">
                  <option value="morning">10:30 AM — Morning Natural Glaze</option>
                  <option value="afternoon">02:00 PM — Midday Interior Clarity</option>
                  <option value="sunset">05:30 PM — Golden Hour Vista Walkthrough</option>
                </select>
              </div>

              {/* Confidential Message */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                  Confidential Instructions / Accompanying Guests
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Please arrange a private security escort and architectural briefing note..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full p-3 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-all"
                />
              </div>

              {inquirySent && (
                <div className="p-3.5 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200">
                  Confidential appointment request transmitted. Managing partner will confirm within 4 business hours.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-stone-900/15 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Submit Private Viewing Request</span>
              </button>

            </form>

            <div className="pt-3 border-t border-stone-100 text-[10.5px] text-stone-400 text-center leading-relaxed">
              Discreet NDA protocols apply to all non-public architectural estates.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PropertyDetailPage;
