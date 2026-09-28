import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Loader2, 
  Building2 
} from 'lucide-react';

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [checkoutLoadingId, setCheckoutLoadingId] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosClient.get('/payments/plans');
        if (res && res.data) {
          setPlans(res.data);
        }
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/pricing');
      return;
    }

    setCheckoutLoadingId(plan.id);
    try {
      const res = await axiosClient.post('/payments/checkout-session', {
        planId: plan.id,
        amount: plan.price,
        gateway: 'STRIPE',
      });

      if (res && res.data) {
        setCheckoutSuccess(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>RealNest X Advisory Membership</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-stone-950 tracking-tight">
          Supercharge Your Real Estate Portfolio
        </h1>
        <p className="text-stone-500 text-base sm:text-lg max-w-2xl mx-auto">
          Tailored membership tiers engineered for high-performing luxury agents, boutique brokerages, and institutional syndicates.
        </p>
      </div>

      {/* Checkout Success Notification */}
      {checkoutSuccess && (
        <div className="max-w-2xl mx-auto p-6 bg-stone-900 text-white rounded-3xl border border-amber-600/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Membership License Active</span>
          </div>
          <p className="text-xs text-stone-300">
            Invoice reference <span className="font-mono font-bold text-amber-200">{checkoutSuccess.invoiceNumber}</span>. Live Gateway Session: <span className="font-mono text-stone-400">{checkoutSuccess.transactionId}</span>.
          </p>
        </div>
      )}

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => {
            const isPopular = plan.id === 'AGENT_PRO';
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 sm:p-10 transition-all flex flex-col justify-between ${
                  isPopular
                    ? 'bg-stone-900 text-stone-100 shadow-2xl ring-1 ring-amber-500/40 relative -translate-y-3'
                    : 'luxury-card text-stone-900'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-stone-950 text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-lg border border-amber-300">
                    Curated Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                      Tier 0{i + 1}
                    </div>
                    <h3 className="text-2xl font-serif font-medium">{plan.name}</h3>
                    <p className={`text-xs mt-1.5 ${isPopular ? 'text-stone-400' : 'text-stone-500'}`}>
                      Engineered for high-velocity real estate operations
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-2">
                    <span className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">${plan.price}</span>
                    <span className={`text-xs font-semibold ${isPopular ? 'text-stone-400' : 'text-stone-500'}`}>
                      / month
                    </span>
                  </div>

                  <div className="space-y-3.5 pt-6 border-t border-stone-200/40">
                    <div className={`text-[11px] font-bold uppercase tracking-wider ${isPopular ? 'text-stone-400' : 'text-stone-500'}`}>
                      Membership Privileges:
                    </div>
                    <ul className="space-y-3 text-sm">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-amber-400' : 'text-amber-700'}`} />
                          <span className={isPopular ? 'text-stone-300' : 'text-stone-600'}>{f}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-amber-400' : 'text-amber-700'}`} />
                        <span className={isPopular ? 'text-stone-300 font-medium' : 'text-stone-700 font-medium'}>
                          {plan.aiCredits} Monthly Concierge Search Credits
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={checkoutLoadingId === plan.id}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-lg shadow-amber-400/20 hover:scale-[1.02]'
                        : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                    }`}
                  >
                    {checkoutLoadingId === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Activate Membership
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Enterprise SLA Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-10 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl">
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Institutional Advisory</div>
          <h3 className="text-xl sm:text-2xl font-serif">Custom Institutional White-Label Licensing</h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
            Need multi-region database sharding, private Kafka stream connectors, or custom PostGIS geo-fencing for large real estate funds?
          </p>
        </div>
        <button
          onClick={() => alert('Our Senior Principal Solutions Architect will contact your executive team within 24 business hours.')}
          className="px-6 py-3.5 bg-stone-100 hover:bg-white text-stone-950 rounded-xl text-xs font-bold shrink-0 shadow-md cursor-pointer transition-all"
        >
          Request Institutional Briefing
        </button>
      </div>

    </div>
  );
};

export default PricingPage;
