import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const MortgageCalculator = ({ propertyPrice = 12500000 }) => {
  const { formatPrice, currentCurrency, activeCurrency } = useCurrency();
  const numericPrice = Number(propertyPrice) || 12500000;

  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(5.85);
  const [projectedMonthlyRent, setProjectedMonthlyRent] = useState(Math.round(numericPrice * 0.0055));

  // Calculations
  const downPaymentAmount = numericPrice * (downPaymentPercent / 100);
  const loanPrincipal = numericPrice - downPaymentAmount;
  
  const monthlyInterestRate = (interestRate / 100) / 12;
  const numberOfPayments = loanTermYears * 12;

  // Monthly Principal & Interest: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyPrincipalAndInterest = monthlyInterestRate > 0
    ? (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    : loanPrincipal / numberOfPayments;

  const monthlyPropertyTaxes = (numericPrice * 0.0085) / 12; // 0.85% annual tax
  const monthlyInsurance = 650;
  const monthlyPrivateHOA = 450;

  const totalMonthlyOutflow = monthlyPrincipalAndInterest + monthlyPropertyTaxes + monthlyInsurance + monthlyPrivateHOA;
  
  // Cap Rate = (Annual Net Operating Income / Purchase Price) * 100
  const annualGrossRentalIncome = projectedMonthlyRent * 12;
  const annualOperatingExpenses = (monthlyPropertyTaxes + monthlyInsurance + monthlyPrivateHOA) * 12;
  const annualNetOperatingIncome = Math.max(0, annualGrossRentalIncome - annualOperatingExpenses);
  const capRate = ((annualNetOperatingIncome / numericPrice) * 100).toFixed(2);
  const netMonthlyCashFlow = projectedMonthlyRent - totalMonthlyOutflow;

  // Percent shares for the bar
  const piShare = Math.round((monthlyPrincipalAndInterest / totalMonthlyOutflow) * 100) || 70;
  const taxShare = Math.round((monthlyPropertyTaxes / totalMonthlyOutflow) * 100) || 20;
  const insShare = 100 - piShare - taxShare;

  return (
    <div className="bg-[#141311] border border-[#2d2a26] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#b59a68]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#24211d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b59a68]" />
            <span className="text-xs uppercase tracking-widest text-[#b59a68] font-mono">Financial Engineering</span>
          </div>
          <h3 className="font-serif text-2xl text-[#f5f2eb] mt-1">Mortgage & Capital Yield Architecture</h3>
          <p className="text-xs text-[#8c827a] mt-1">Simulate leveraged acquisition financing, cash flows, and institutional yield returns.</p>
        </div>

        <div className="bg-[#1c1a17] border border-[#332e29] rounded-2xl p-3 px-5 text-right">
          <p className="text-[10px] uppercase tracking-wider text-[#8c827a] font-mono">Asset Valuation</p>
          <p className="font-serif text-xl text-[#f5f2eb] font-semibold">{formatPrice(numericPrice)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Down Payment Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-[#a09890] flex items-center gap-1.5 font-medium">
                <span>Down Payment Equity</span>
                <span className="text-[#b59a68] font-mono">({downPaymentPercent}%)</span>
              </span>
              <span className="font-mono text-[#f5f2eb] font-semibold">{formatPrice(downPaymentAmount)}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="60" 
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-1.5 bg-[#25221e] rounded-lg appearance-none cursor-pointer accent-[#b59a68]"
            />
            <div className="flex justify-between text-[10px] text-[#736c64] font-mono mt-1">
              <span>10% ($1.25M)</span>
              <span>25% Standard</span>
              <span>50% Conservative</span>
            </div>
          </div>

          {/* Interest Rate & Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#a09890] font-medium">Interest Rate</span>
                <span className="font-mono text-[#f5f2eb] font-semibold">{interestRate}% APR</span>
              </div>
              <input 
                type="range" 
                min="3.5" 
                max="9.0" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-[#25221e] rounded-lg appearance-none cursor-pointer accent-[#b59a68]"
              />
            </div>

            <div>
              <span className="text-[#a09890] text-xs font-medium block mb-2">Amortization Period</span>
              <div className="grid grid-cols-2 gap-2">
                {[15, 30].map(years => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setLoanTermYears(years)}
                    className={`py-1.5 text-xs font-mono rounded-xl border transition-all ${
                      loanTermYears === years
                        ? 'bg-[#b59a68] text-[#0f0e0c] border-[#b59a68] font-bold'
                        : 'bg-[#1a1815] text-[#a09890] border-[#332e29] hover:border-[#524b42]'
                    }`}
                  >
                    {years} Years
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projected Rental Income Slider */}
          <div className="pt-2 border-t border-[#24211d]">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-[#a09890] flex items-center gap-1.5 font-medium">
                <TrendingUp size={13} className="text-[#b59a68]" />
                <span>Projected Gross Monthly Rental</span>
              </span>
              <span className="font-mono text-[#d4af37] font-semibold">{formatPrice(projectedMonthlyRent)}/mo</span>
            </div>
            <input 
              type="range" 
              min={Math.round(numericPrice * 0.002)} 
              max={Math.round(numericPrice * 0.012)} 
              step="500"
              value={projectedMonthlyRent}
              onChange={(e) => setProjectedMonthlyRent(Number(e.target.value))}
              className="w-full h-1.5 bg-[#25221e] rounded-lg appearance-none cursor-pointer accent-[#b59a68]"
            />
            <div className="flex justify-between text-[10px] text-[#736c64] font-mono mt-1">
              <span>Conservative (0.2%)</span>
              <span>Market Median</span>
              <span>Ultra-Luxury (1.2%)</span>
            </div>
          </div>

          {/* Breakdown progress bar */}
          <div className="pt-2">
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#8c827a] mb-1.5">Capital Outflow Allocation</p>
            <div className="h-2 rounded-full overflow-hidden flex bg-[#1e1c19]">
              <div style={{ width: `${piShare}%` }} className="bg-[#b59a68]" title="Principal & Interest" />
              <div style={{ width: `${taxShare}%` }} className="bg-[#8c7853]" title="Property Tax" />
              <div style={{ width: `${insShare}%` }} className="bg-[#4d4436]" title="Insurance & HOA" />
            </div>
            <div className="flex items-center gap-4 text-[10px] text-[#8c827a] font-mono mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#b59a68]" /> P&I ({piShare}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8c7853]" /> Tax ({taxShare}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4d4436]" /> Reserve ({insShare}%)</span>
            </div>
          </div>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#1a1815] border border-[#2d2a26] rounded-2xl p-5 flex flex-col justify-between">
          
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#8c827a]">Estimated Monthly Carry</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl md:text-4xl text-[#f5f2eb] font-medium">
                {formatPrice(Math.round(totalMonthlyOutflow))}
              </span>
              <span className="text-xs text-[#8c827a]">/ month</span>
            </div>

            <div className="mt-5 space-y-2.5 text-xs border-t border-[#2d2a26] pt-4">
              <div className="flex justify-between text-[#ded7cd]">
                <span className="text-[#8c827a]">Principal & Interest</span>
                <span className="font-mono font-medium">{formatPrice(Math.round(monthlyPrincipalAndInterest))}</span>
              </div>
              <div className="flex justify-between text-[#ded7cd]">
                <span className="text-[#8c827a]">Property Tax (Cadastral)</span>
                <span className="font-mono font-medium">{formatPrice(Math.round(monthlyPropertyTaxes))}</span>
              </div>
              <div className="flex justify-between text-[#ded7cd]">
                <span className="text-[#8c827a]">High-Value Hazard Insurance</span>
                <span className="font-mono font-medium">{formatPrice(monthlyInsurance)}</span>
              </div>
              <div className="flex justify-between text-[#ded7cd]">
                <span className="text-[#8c827a]">Private Security & Grounds HOA</span>
                <span className="font-mono font-medium">{formatPrice(monthlyPrivateHOA)}</span>
              </div>
            </div>
          </div>

          {/* Investment metrics box */}
          <div className="mt-6 pt-4 border-t border-[#2d2a26] grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#131210] rounded-xl border border-[#27231e]">
              <span className="text-[10px] font-mono uppercase text-[#8c827a] block">Gross Cap Rate</span>
              <span className="text-lg font-serif font-bold text-[#b59a68] mt-0.5 block">{capRate}%</span>
              <span className="text-[9px] text-[#736c64]">Net yield indexed</span>
            </div>

            <div className="p-3 bg-[#131210] rounded-xl border border-[#27231e]">
              <span className="text-[10px] font-mono uppercase text-[#8c827a] block">Net Monthly Flow</span>
              <span className={`text-lg font-serif font-bold mt-0.5 block ${netMonthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {netMonthlyCashFlow >= 0 ? '+' : ''}{formatPrice(Math.round(netMonthlyCashFlow))}
              </span>
              <span className="text-[9px] text-[#736c64]">After debt service</span>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center gap-2 text-[10px] text-[#736c64]">
            <ShieldCheck size={12} className="text-[#b59a68]" />
            <span>Underwritten by RealNest Private Banking Syndicates</span>
          </div>

        </div>

      </div>
    </div>
  );
};
