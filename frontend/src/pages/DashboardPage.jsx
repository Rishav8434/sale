import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyApi } from '../api/propertyApi';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMyProperties = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const res = await propertyApi.getMyListings({ page: pageNumber, size: 6 });
      if (res && res.data) {
        setProperties(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
        setPage(res.data.pageNumber || 0);
      }
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties(0);
  }, []);

  const handleEdit = (property) => {
    navigate(`/properties/edit/${property.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await propertyApi.deleteProperty(id);
      fetchMyProperties(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  const approvedCount = properties.filter((p) => p.approved).length;
  const pendingCount = properties.filter((p) => !p.approved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700 mb-1">
            Private Client Dossier
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-950 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-stone-800" />
            Your Property Portfolio
          </h1>
          <p className="text-stone-500 text-sm mt-1.5">
            Welcome back, <span className="font-semibold text-stone-900">{user?.name}</span>. Manage your registry submissions, track curatorial reviews, and adjust valuations.
          </p>
        </div>

        <Link
          to="/properties/new"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-stone-900/15 transition-all hover:scale-105 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          Submit New Residence
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="luxury-card p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 border border-stone-200">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">Total Portfolio</span>
            <span className="text-3xl font-serif font-bold text-stone-950 mt-1 block">{totalElements}</span>
          </div>
        </div>

        <div className="luxury-card p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">Active in Registry</span>
            <span className="text-3xl font-serif font-bold text-stone-950 mt-1 block">{approvedCount}</span>
          </div>
        </div>

        <div className="luxury-card p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">Curatorial Review</span>
            <span className="text-3xl font-serif font-bold text-amber-700 mt-1 block">{pendingCount}</span>
          </div>
        </div>

      </div>

      {/* Listings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-stone-950">Listed Residences</h2>
          <span className="text-xs text-stone-500 font-medium">Showing {properties.length} of {totalElements} listings</span>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => fetchMyProperties(p)}
            />
          </>
        ) : (
          <div className="text-center py-24 bg-white/70 rounded-3xl border border-dashed border-stone-300 p-8 space-y-5">
            <div className="w-16 h-16 bg-stone-100 text-stone-700 rounded-2xl flex items-center justify-center mx-auto border border-stone-200">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-stone-900">Your Portfolio Registry Is Empty</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Ready to market your architectural estate or luxury apartment? Submit your first listing for curatorial verification and publication.
              </p>
            </div>
            <Link
              to="/properties/new"
              className="inline-block px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-stone-800 transition-all cursor-pointer"
            >
              List First Residence
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
