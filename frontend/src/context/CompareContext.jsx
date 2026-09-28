import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [comparedProperties, setComparedProperties] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (property) => {
    setComparedProperties(prev => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 estates simultaneously.");
        return prev;
      }
      return [...prev, property];
    });
  };

  const removeCompare = (propertyId) => {
    setComparedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const clearCompare = () => {
    setComparedProperties([]);
  };

  const isInCompare = (propertyId) => {
    return comparedProperties.some(p => p.id === propertyId);
  };

  return (
    <CompareContext.Provider value={{
      comparedProperties,
      toggleCompare,
      removeCompare,
      clearCompare,
      isInCompare,
      isCompareModalOpen,
      setIsCompareModalOpen
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
