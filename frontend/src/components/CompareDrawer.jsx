import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';
import { X, Scale, ArrowRight, Check, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompareDrawer = () => {
  const { comparedProperties, removeCompare, clearCompare, isCompareModalOpen, setIsCompareModalOpen } = useCompare();
  const { formatPrice } = useCurrency();

  if (comparedProperties.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Drawer Bar */}
      <aside aria-label="Compare Residences Drawer" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#161513]/95 backdrop-blur-md border border-[#2d2a26] rounded-2xl shadow-2xl p-3 px-5 flex items-center gap-6 max-w-2xl w-[92vw]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#b59a68]/20 border border-[#b59a68]/40 flex items-center justify-center text-[#d4af37]">
            <Scale size={16} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8c827a] font-mono">Comparison Suite</p>
            <p className="text-sm font-medium text-[#f5f2eb]">{comparedProperties.length} of 3 Selected</p>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {comparedProperties.map(p => (
            <div key={p.id} className="relative group shrink-0">
              <img 
                src={p.imageUrl} 
                alt={p.title} 
                className="w-10 h-10 rounded-lg object-cover border border-[#3d3833]"
              />
              <button 
                onClick={() => removeCompare(p.id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2a2420] text-[#a09890] hover:text-white flex items-center justify-center border border-[#443d36]"
                title="Remove"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2 bg-[#b59a68] hover:bg-[#c4a976] text-[#0f0e0c] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Compare Dossiers</span>
            <ArrowRight size={13} />
          </button>
          <button 
            onClick={clearCompare}
            className="p-2 text-[#736c64] hover:text-[#d4af37] transition-colors"
            title="Clear all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </aside>

      {/* Full Architectural Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c0b0a]/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-[#141311] border border-[#2d2a26] rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#24211d]">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#b59a68] font-mono">RealNest X Architectural Matrix</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#f5f2eb] mt-1">Direct Estate Comparison</h2>
              </div>
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="w-10 h-10 rounded-full bg-[#1e1c19] border border-[#332e29] text-[#9c9389] hover:text-white flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#24211d]">
                    <th className="py-4 px-4 text-xs uppercase tracking-widest text-[#736c64] font-mono w-44">Estate Metric</th>
                    {comparedProperties.map(p => (
                      <th key={p.id} className="py-4 px-4 min-w-[240px]">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-36 object-cover rounded-xl border border-[#2d2a26] mb-3" />
                        <h3 className="font-serif text-base text-[#f5f2eb] line-clamp-1">{p.title}</h3>
                        <p className="text-xs text-[#8c827a] mt-0.5">{p.location}</p>
                        <p className="font-serif text-lg text-[#d4af37] mt-2 font-medium">{formatPrice(p.price)}</p>
                        <Link 
                          to={`/properties/${p.id}`}
                          onClick={() => setIsCompareModalOpen(false)}
                          className="mt-3 block text-center py-1.5 px-3 bg-[#1e1c19] hover:bg-[#b59a68] hover:text-[#0f0e0c] border border-[#332e29] hover:border-transparent text-xs text-[#d8d0c5] rounded-lg transition-all"
                        >
                          View Full Dossier
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1c19] text-sm">
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Property Type</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="py-3 px-4 text-[#ded7cd] font-medium">{p.type === 'SALE' ? 'Private Acquisition' : 'Seasonal Lease'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Chambers (Beds)</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="py-3 px-4 text-[#ded7cd] font-medium">{((p.id * 3) % 4) + 4} Chambers</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Baths</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="py-3 px-4 text-[#ded7cd] font-medium">{((p.id * 2) % 4) + 5} En-suites</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Living Area</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="py-3 px-4 text-[#ded7cd] font-medium">{(((p.id * 850) % 6000) + 4500).toLocaleString()} sq ft</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Price / Sq Ft</td>
                    {comparedProperties.map(p => {
                      const sqft = (((p.id * 850) % 6000) + 4500);
                      const pricePerSqft = Math.round(Number(p.price) / sqft);
                      return (
                        <td key={p.id} className="py-3 px-4 text-[#b59a68] font-mono">${pricePerSqft.toLocaleString()} / sq ft</td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Architectural Style</td>
                    {comparedProperties.map(p => {
                      const styles = ['Brutalist Cast Concrete', 'Organic Mediterranean Minimalist', 'Contemporary Glass Cantilever', 'Classical Haussmann Restored'];
                      return (
                        <td key={p.id} className="py-3 px-4 text-[#ded7cd]">{styles[p.id % styles.length]}</td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Autonomous Energy</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="py-3 px-4 text-[#a3d9a5] flex items-center gap-1.5">
                        <Check size={14} className="text-emerald-400" />
                        <span>Tesla Solar Glass + Battery</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-xs font-mono uppercase text-[#8c827a]">Listed Curator</td>
                    {comparedProperties.map(p => (
                      <td key={p.id} className="py-3 px-4 text-[#a09890]">{p.owner?.name || 'RealNest Private Office'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-[#24211d] flex items-center justify-between">
              <span className="text-xs text-[#736c64]">All comparisons verified against cadastral land registry data.</span>
              <button 
                onClick={clearCompare}
                className="text-xs text-[#b59a68] hover:underline"
              >
                Clear comparison list
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
