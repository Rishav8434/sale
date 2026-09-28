import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Heart, Sparkles, MapPin, Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#141416] text-stone-400 border-t border-stone-800 mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-amber-200">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif-luxury">
                REALNEST <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-sans uppercase">X</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              The premier marketplace for architectural masterpieces, waterfront estates, and historic residences. Curated for discerning global clients.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-200 font-semibold">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Title & Provenance</span>
            </div>
          </div>

          {/* Curated Portfolios */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Curated Portfolios</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/properties?type=SALE" className="hover:text-white transition-colors">
                  Architectural Acquisitions
                </Link>
              </li>
              <li>
                <Link to="/properties?type=RENT" className="hover:text-white transition-colors">
                  Private Leases & Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?location=California" className="hover:text-white transition-colors">
                  California Coastal Living
                </Link>
              </li>
              <li>
                <Link to="/properties/new" className="hover:text-white transition-colors">
                  Submit an Estate
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Operations */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Advisory Metros</h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-stone-500" />
                <span>Beverly Hills · Manhattan</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-stone-500" />
                <span>London Mayfair · Zurich</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-stone-500" />
                <span>Dubai Palm · Pune Koregaon Park</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-stone-500" />
                <span>Aspen Snowmass · Seattle</span>
              </li>
            </ul>
          </div>

          {/* Private Client Desk */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Private Client Desk</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Rodeo Drive, Beverly Hills, CA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>concierge@realnest.io</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+1 (888) 732-5637</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} RealNest X Inc. Equal Housing Opportunity. Architectural Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Discretion Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Title Terms</span>
            <span className="hover:text-stone-400 cursor-pointer">Escrow Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
