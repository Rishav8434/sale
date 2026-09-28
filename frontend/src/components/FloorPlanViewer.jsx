import React, { useState } from 'react';
import { Layers, Maximize2, Compass, Home, Shield, Eye } from 'lucide-react';

export const FloorPlanViewer = ({ propertyTitle = "The Estate" }) => {
  const [activeLevel, setActiveLevel] = useState('level1');

  const levels = [
    {
      id: 'level1',
      name: 'Level 01 — Reception & Grand Salon',
      area: '4,850 sq ft',
      ceiling: '14.5 ft Finished Ceilings',
      rooms: [
        { name: 'Double-Height Atrium', dimensions: '32\' x 24\'', features: 'Fluted limestone, pivot bronze entry' },
        { name: 'Formal Ocean/Valley Salon', dimensions: '40\' x 28\'', features: 'Frameless glass curtain wall' },
        { name: 'Curated Chef\'s Scullery & Kitchen', dimensions: '26\' x 18\'', features: 'Bulthaup & Gaggenau 400 Series' },
        { name: 'Catering Kitchen & Pantry', dimensions: '16\' x 14\'', features: 'Separate staff ingress' },
        { name: 'Cantilever Dining Pavilion', dimensions: '24\' x 20\'', features: 'Seats 20 guests with zero-threshold terrace' },
      ],
      svgPlan: (
        <svg viewBox="0 0 800 450" className="w-full h-full text-[#b59a68] select-none">
          {/* Outer Boundary */}
          <rect x="50" y="40" width="700" height="370" fill="#131210" stroke="#3d372e" strokeWidth="2" strokeDasharray="4 2" rx="8" />
          
          {/* Main Rooms */}
          <rect x="70" y="60" width="280" height="200" fill="#1a1815" stroke="#524a3e" strokeWidth="1.5" />
          <text x="210" y="150" fill="#ded7cd" fontSize="13" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">Double-Height Atrium</text>
          <text x="210" y="170" fill="#8c827a" fontSize="10" fontFamily="monospace" textAnchor="middle">32' x 24' • Fluted Limestone</text>

          <rect x="360" y="60" width="370" height="230" fill="#1e1c18" stroke="#b59a68" strokeWidth="1.8" />
          <text x="545" y="165" fill="#f5f2eb" fontSize="14" fontFamily="serif" textAnchor="middle" fontWeight="bold">Grand Ocean / Vista Salon</text>
          <text x="545" y="185" fill="#b59a68" fontSize="10" fontFamily="monospace" textAnchor="middle">40' x 28' • Zero-Threshold Sliders</text>

          <rect x="70" y="270" width="220" height="120" fill="#181613" stroke="#443d33" strokeWidth="1.5" />
          <text x="180" y="325" fill="#ded7cd" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Chef's Scullery</text>
          <text x="180" y="342" fill="#8c827a" fontSize="9" fontFamily="monospace" textAnchor="middle">Gaggenau 400 • Marble Island</text>

          <rect x="300" y="270" width="180" height="120" fill="#151412" stroke="#443d33" strokeWidth="1.5" />
          <text x="390" y="325" fill="#ded7cd" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Formal Dining</text>
          <text x="390" y="342" fill="#8c827a" fontSize="9" fontFamily="monospace" textAnchor="middle">24' x 20' • Seats 20</text>

          <rect x="490" y="300" width="240" height="90" fill="#1b211d" stroke="#2a4736" strokeWidth="1.5" />
          <text x="610" y="345" fill="#a3d9a5" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Infinity Reflection Pool</text>
          <text x="610" y="362" fill="#7ba37d" fontSize="9" fontFamily="monospace" textAnchor="middle">Black Granite • Heated Saline</text>
          
          {/* Compass Rose */}
          <circle cx="730" cy="80" r="18" fill="#1c1a17" stroke="#3d372e" />
          <text x="730" y="77" fill="#b59a68" fontSize="9" textAnchor="middle" fontWeight="bold">N</text>
          <line x1="730" y1="80" x2="730" y2="92" stroke="#b59a68" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'level2',
      name: 'Level 02 — Primary Suite & Private Quarters',
      area: '3,900 sq ft',
      ceiling: '11.5 ft Architectural Reveals',
      rooms: [
        { name: 'Primary Bedroom Chamber', dimensions: '28\' x 22\'', features: 'Corner frameless glass, fireplace' },
        { name: 'Dual Boutique Dressing Salons', dimensions: '22\' x 18\'', features: 'Custom smoked glass & Italian leather cabinetry' },
        { name: 'Sanctuary En-Suite', dimensions: '20\' x 18\'', features: 'Carved solid marble monolith soaking tub' },
        { name: 'Guest Suites II & III', dimensions: '18\' x 16\' each', features: 'Individual marble private baths' },
        { name: 'Executive Library / Observatory', dimensions: '20\' x 16\'', features: 'Acoustic slatted walnut wall panelling' },
      ],
      svgPlan: (
        <svg viewBox="0 0 800 450" className="w-full h-full text-[#b59a68] select-none">
          <rect x="50" y="40" width="700" height="370" fill="#131210" stroke="#3d372e" strokeWidth="2" strokeDasharray="4 2" rx="8" />
          
          <rect x="70" y="60" width="360" height="220" fill="#1e1c18" stroke="#b59a68" strokeWidth="2" />
          <text x="250" y="160" fill="#f5f2eb" fontSize="15" fontFamily="serif" textAnchor="middle" fontWeight="bold">Primary Owner's Sanctuary</text>
          <text x="250" y="180" fill="#b59a68" fontSize="10" fontFamily="monospace" textAnchor="middle">28' x 22' • Private Loggia & Horizon Fireplace</text>

          <rect x="440" y="60" width="290" height="150" fill="#1a1815" stroke="#524a3e" strokeWidth="1.5" />
          <text x="585" y="130" fill="#ded7cd" fontSize="13" fontFamily="sans-serif" textAnchor="middle">Dual Dressing Salons</text>
          <text x="585" y="148" fill="#8c827a" fontSize="10" fontFamily="monospace" textAnchor="middle">Smoked Glass • Climate Controlled</text>

          <rect x="70" y="290" width="220" height="100" fill="#171513" stroke="#443d33" strokeWidth="1.5" />
          <text x="180" y="340" fill="#ded7cd" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Guest Suite II</text>
          <text x="180" y="356" fill="#8c827a" fontSize="9" fontFamily="monospace" textAnchor="middle">En-Suite Bath & Private Terrace</text>

          <rect x="300" y="290" width="220" height="100" fill="#171513" stroke="#443d33" strokeWidth="1.5" />
          <text x="410" y="340" fill="#ded7cd" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Guest Suite III</text>
          <text x="410" y="356" fill="#8c827a" fontSize="9" fontFamily="monospace" textAnchor="middle">En-Suite Bath</text>

          <rect x="530" y="220" width="200" height="170" fill="#1c1915" stroke="#5c5243" strokeWidth="1.5" />
          <text x="630" y="300" fill="#ded7cd" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Executive Library</text>
          <text x="630" y="318" fill="#b59a68" fontSize="9" fontFamily="monospace" textAnchor="middle">Slatted Walnut & Wet Bar</text>
        </svg>
      )
    },
    {
      id: 'sublevel',
      name: 'Sub-Level — Wellness, Cellar & Gallery',
      area: '4,200 sq ft',
      ceiling: '12 ft Sound-Isolated Slabs',
      rooms: [
        { name: 'Sommelier Wine Cellar', dimensions: '22\' x 14\'', features: '1,500-bottle capacity with argon-gas preservation' },
        { name: 'Wellness Spa & Steam Hammam', dimensions: '24\' x 20\'', features: 'Cold plunge pool, cedar sauna & massage suite' },
        { name: 'Dolby Atmos Private Screening Room', dimensions: '28\' x 20\'', features: '180\" micro-perforated acoustic screen, 12 recliners' },
        { name: 'Subterranean 6-Car Auto Gallery', dimensions: '48\' x 32\'', features: 'Turntable display, EV fast-charging stations' },
      ],
      svgPlan: (
        <svg viewBox="0 0 800 450" className="w-full h-full text-[#b59a68] select-none">
          <rect x="50" y="40" width="700" height="370" fill="#131210" stroke="#3d372e" strokeWidth="2" strokeDasharray="4 2" rx="8" />
          
          <rect x="70" y="60" width="400" height="200" fill="#161513" stroke="#524a3e" strokeWidth="1.5" />
          <text x="270" y="150" fill="#ded7cd" fontSize="14" fontFamily="serif" textAnchor="middle" fontWeight="bold">6-Car Auto Gallery & Turntable</text>
          <text x="270" y="170" fill="#8c827a" fontSize="10" fontFamily="monospace" textAnchor="middle">Terrazzo Floor • 4x 80A EV Charging</text>

          <rect x="480" y="60" width="250" height="200" fill="#1e1a17" stroke="#b59a68" strokeWidth="1.8" />
          <text x="605" y="150" fill="#f5f2eb" fontSize="13" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">Dolby Atmos Cinema</text>
          <text x="605" y="170" fill="#b59a68" fontSize="10" fontFamily="monospace" textAnchor="middle">12 Recliners • Meyer Sound</text>

          <rect x="70" y="270" width="220" height="120" fill="#1c1915" stroke="#5c5243" strokeWidth="1.5" />
          <text x="180" y="325" fill="#ded7cd" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Sommelier Wine Vault</text>
          <text x="180" y="342" fill="#8c827a" fontSize="9" fontFamily="monospace" textAnchor="middle">1,500 Bottles • Tasting Room</text>

          <rect x="300" y="270" width="430" height="120" fill="#181e19" stroke="#2d4a36" strokeWidth="1.5" />
          <text x="515" y="325" fill="#a3d9a5" fontSize="12" fontFamily="sans-serif" textAnchor="middle">Thermal Spa, Cold Plunge & Cedar Sauna</text>
          <text x="515" y="342" fill="#7ba37d" fontSize="9" fontFamily="monospace" textAnchor="middle">Hammam Steam • Private Treatment Room</text>
        </svg>
      )
    }
  ];

  const currentPlan = levels.find(l => l.id === activeLevel) || levels[0];

  return (
    <div className="bg-[#141311] border border-[#2d2a26] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24211d]">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#b59a68]" />
            <span className="text-xs uppercase tracking-widest text-[#b59a68] font-mono">Architectural CAD Blueprints</span>
          </div>
          <h3 className="font-serif text-2xl text-[#f5f2eb] mt-1">Spatial Elevation & Floor Matrix</h3>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center bg-[#1c1a17] p-1 rounded-2xl border border-[#332e29]">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setActiveLevel(level.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeLevel === level.id
                  ? 'bg-[#b59a68] text-[#0f0e0c] font-bold shadow-md'
                  : 'text-[#8c827a] hover:text-[#d8d0c5]'
              }`}
            >
              {level.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Blueprint Drawing Display */}
      <div className="mt-6 bg-[#0e0d0c] border border-[#26221d] rounded-2xl p-4 md:p-6 relative group overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-[#f5f2eb] font-semibold">{currentPlan.name}</span>
            <span className="text-xs font-mono text-[#b59a68] bg-[#b59a68]/10 px-2 py-0.5 rounded border border-[#b59a68]/20">{currentPlan.area}</span>
          </div>
          <span className="text-[11px] font-mono text-[#736c64] hidden sm:inline">{currentPlan.ceiling}</span>
        </div>

        {/* Render SVG Blueprint */}
        <div className="w-full aspect-[16/9] max-h-[380px] bg-[#100f0d] rounded-xl overflow-hidden border border-[#1e1c19]">
          {currentPlan.svgPlan}
        </div>
      </div>

      {/* Room Dimensions & Specification Table */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {currentPlan.rooms.map((room, idx) => (
          <div key={idx} className="p-3 bg-[#181614] border border-[#27231e] rounded-xl">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#ded7cd] font-medium">{room.name}</span>
              <span className="font-mono text-[#b59a68]">{room.dimensions}</span>
            </div>
            <p className="text-[11px] text-[#736c64] mt-1">{room.features}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
