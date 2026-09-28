import React from 'react';

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
          <div className="aspect-[16/10] bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded-md w-1/3" />
            <div className="h-6 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-200 rounded-md w-full" />
            <div className="h-4 bg-slate-200 rounded-md w-2/3" />
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded-md w-1/4" />
              <div className="h-8 bg-slate-200 rounded-md w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
