import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78, label: 'GBP (£)', flag: '🇬🇧' },
  INR: { code: 'INR', symbol: '₹', rate: 86.5, label: 'INR (₹)', flag: '🇮🇳' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)', flag: '🇦🇪' },
  CHF: { code: 'CHF', symbol: 'CHF ', rate: 0.88, label: 'CHF (Fr)', flag: '🇨🇭' },
  JPY: { code: 'JPY', symbol: '¥', rate: 155.0, label: 'JPY (¥)', flag: '🇯🇵' },
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    return localStorage.getItem('realnest_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('realnest_currency', currentCurrency);
  }, [currentCurrency]);

  const activeCurrency = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  const formatPrice = (usdAmount, options = {}) => {
    if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) return 'Price Upon Request';
    const amount = Number(usdAmount) * activeCurrency.rate;
    
    // Format based on currency
    if (currentCurrency === 'JPY') {
      return `${activeCurrency.symbol}${Math.round(amount).toLocaleString()}`;
    }
    
    if (options.compact) {
      if (amount >= 1000000) {
        return `${activeCurrency.symbol}${(amount / 1000000).toFixed(2)}M`;
      }
      if (amount >= 1000) {
        return `${activeCurrency.symbol}${(amount / 1000).toFixed(0)}K`;
      }
    }

    return `${activeCurrency.symbol}${Math.round(amount).toLocaleString('en-US')}`;
  };

  const convertFromUSD = (usdAmount) => {
    if (!usdAmount || isNaN(usdAmount)) return 0;
    return Number(usdAmount) * activeCurrency.rate;
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrentCurrency, activeCurrency, formatPrice, convertFromUSD, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
