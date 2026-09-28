import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useCompare } from '../context/CompareContext';
import { 
  MapPin, 
  Heart, 
  Bed, 
  Bath, 
  Maximize2, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2,
  Share2,
  Sparkles,
  Scale
} from 'lucide-react';

const PropertyCard = ({ property, showActions = false, onEdit, onDelete }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { formatPrice } = useCurrency();
  const { toggleCompare, isInCompare } = useCompare();

  const isCompared = isInCompare(property.id);

  const fallbackImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';

  // Compute simulated human-touch architectural specs based on ID
  const beds = property.id % 2 === 0 ? 4 : 3;
  const baths = property.id % 2 === 0 ? 3.5 : 2.5;
  const sqft = property.id % 2 === 0 ? '3,850' : '2,400';

  return (
    <div className="group luxury-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full bg-white relative">
      
      {/* Photo Container - Clean Unblemished Architectural Frame */}
      <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
        <Link to={`/properties/${property.id}`} className="block w-full h-full">
          <img
            src={property.imageUrl || fallbackImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border border-white/10 ${
              property.type === 'SALE'
                ? 'bg-stone-950/80 text-white'
                : 'bg-emerald-950/80 text-emerald-300'
            }`}
          >
            {property.type === 'SALE' ? 'Acquisition' : 'Lease'}
          </span>

          {property.approved && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/95 text-stone-800 backdrop-blur-md shadow-xs border border-stone-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          )}
        </div>

        {/* Top Right Action Icons */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
          {/* Compare Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(property);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isCompared
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-stone-950/40 text-white hover:bg-white hover:text-stone-900 border border-white/20'
            }`}
            title={isCompared ? "Remove from Comparison" : "Add to Comparison"}
            aria-label="Compare Estate"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-stone-950/40 text-white hover:bg-white hover:text-stone-900 border border-white/20'
            }`}
            aria-label="Save to Private Collection"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${isFavorited ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Details - Editorial Architectural Layout */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Reference Line */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
            <span className="truncate max-w-[200px] text-stone-600">{property.location}</span>
            <span className="font-mono text-stone-400 text-[10px]">#{`RNX-${property.id.toString().padStart(4, '0')}`}</span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property.id}`}>
            <h3 className="text-xl font-serif text-stone-950 group-hover:text-amber-800 transition-colors line-clamp-1 leading-snug font-normal">
              {property.title}
            </h3>
          </Link>

          {/* Valuation */}
          <div className="mt-2 text-2xl font-serif font-bold text-stone-950">
            {formatPrice(property.price)}{property.type === 'RENT' ? '/mo' : ''}
          </div>

          {/* Physical Specifications (Architectural Columns) */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-stone-100 text-center">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block">Chambers</span>
              <span className="text-xs font-semibold text-stone-800">{beds} Beds</span>
            </div>
            <div className="space-y-0.5 border-x border-stone-100">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block">Baths</span>
              <span className="text-xs font-semibold text-stone-800">{baths}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block">Footprint</span>
              <span className="text-xs font-semibold text-stone-800">{sqft} sq ft</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-normal">
            {property.description}
          </p>
        </div>

        {/* Footer / Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-stone-900 text-amber-200 flex items-center justify-center text-[10px] font-serif font-bold">
              {property.ownerName ? property.ownerName.charAt(0) : 'R'}
            </div>
            <span className="text-[11px] font-medium text-stone-600 truncate max-w-[130px]">
              {property.ownerName || 'Lord Alexander Wright'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/properties/${property.id}`}
              className="text-xs font-semibold text-stone-900 hover:text-amber-800 transition-colors"
            >
              View Dossier &rarr;
            </Link>

            {showActions && (
              <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
                {onEdit && (
                  <button
                    onClick={() => onEdit(property)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors"
                    title="Edit Listing"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(property.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PropertyCard;
