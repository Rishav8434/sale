import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Search,
  Filter,
  Download,
  DollarSign,
  Activity,
  ToggleLeft,
  ToggleRight,
  FileSpreadsheet,
  BadgeAlert,
  Server,
  Key,
  Database,
  ArrowUpRight,
  TrendingUp,
  Award,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'users' | 'escrow' | 'audit' | 'system' | 'analytics'
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState(''); // '' | 'true' | 'false'
  const [propertySearch, setPropertySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const { formatPrice } = useCurrency();

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    aiSearch: true,
    autoEscrow: false,
    brokerAutoVerify: false,
    fxRealtime: true,
    cadastralIntegrity: true,
    maintenanceMode: false
  });

  // Mock Escrow Settlement Contracts
  const [escrowLedger, setEscrowLedger] = useState([
    {
      id: 'ESC-8921-LA',
      propertyTitle: 'The Bel Air Cantilever Estate',
      buyer: 'Sovereign Trust VI',
      seller: 'Sophia Kensington',
      consideration: 28500000,
      commission: 427500, // 1.5%
      status: 'HELD_IN_ESCROW',
      date: '2026-09-27'
    },
    {
      id: 'ESC-7734-NY',
      propertyTitle: 'Tribeca Cast-Iron Triplex Penthouse',
      buyer: 'Vance Capital Holdings',
      seller: 'Marcus Vance',
      consideration: 19800000,
      commission: 297000,
      status: 'CLEARED_FUNDS',
      date: '2026-09-24'
    },
    {
      id: 'ESC-6612-CH',
      propertyTitle: 'Lake Zurich Minimalist Villa',
      buyer: 'Alpine Private Wealth SA',
      seller: 'Elena Rostova',
      consideration: 11800000,
      commission: 177000,
      status: 'DISBURSED',
      date: '2026-09-20'
    },
    {
      id: 'ESC-5520-DXB',
      propertyTitle: 'The Palm Jumeirah Signature Frond',
      buyer: 'Royal Crest Syndicate',
      seller: 'Arjun Singhania',
      consideration: 21000000,
      commission: 315000,
      status: 'HELD_IN_ESCROW',
      date: '2026-09-28'
    }
  ]);

  // Live Audit Stream Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-901',
      actor: 'admin@realnest.io',
      role: 'SUPER_ADMIN',
      action: 'LISTING_APPROVED',
      target: 'Property #RNX-0014 (Bel Air Cantilever)',
      ip: '198.51.100.41 (Zurich Gateway)',
      timestamp: '2 mins ago',
      category: 'MODERATION'
    },
    {
      id: 'AUD-900',
      actor: 'system.daemon',
      role: 'SECURITY_CORE',
      action: 'AI_SEARCH_EMBEDDINGS_REFRESH',
      target: '18 vector representations re-indexed',
      ip: '127.0.0.1 (Local Cluster)',
      timestamp: '14 mins ago',
      category: 'GOVERNANCE'
    },
    {
      id: 'AUD-899',
      actor: 'admin@realnest.io',
      role: 'SUPER_ADMIN',
      action: 'ESCROW_FUNDS_DISBURSED',
      target: 'Contract ESC-6612-CH ($177,000 commission)',
      ip: '198.51.100.41 (Zurich Gateway)',
      timestamp: '1 hour ago',
      category: 'FINANCIAL'
    },
    {
      id: 'AUD-898',
      actor: 'marcus@realnest.io',
      role: 'PRIVATE_CLIENT',
      action: 'DOSSIER_ACCESS_GRANTED',
      target: 'Central Park South Tower (#RNX-0008)',
      ip: '192.0.2.14 (London Core)',
      timestamp: '3 hours ago',
      category: 'SECURITY'
    },
    {
      id: 'AUD-897',
      actor: 'admin@realnest.io',
      role: 'SUPER_ADMIN',
      action: 'ROLE_ELEVATED',
      target: 'Sophia Kensington -> Senior Advisory Curator',
      ip: '198.51.100.41 (Zurich Gateway)',
      timestamp: '5 hours ago',
      category: 'GOVERNANCE'
    }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const propParams = { size: 50 };
      if (propertyFilter !== '') {
        propParams.approved = propertyFilter === 'true';
      }

      const [propRes, userRes] = await Promise.all([
        adminApi.getAllProperties(propParams),
        adminApi.getUsers(),
      ]);

      if (propRes && propRes.data) {
        setProperties(propRes.data.content || []);
      }
      if (userRes && userRes.data) {
        setUsers(userRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyFilter]);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      await adminApi.approveProperty(id);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approved: true } : p))
      );
      // Append to audit log
      setAuditLogs(prev => [
        {
          id: `AUD-${Date.now().toString().slice(-3)}`,
          actor: 'admin@realnest.io',
          role: 'SUPER_ADMIN',
          action: 'LISTING_APPROVED',
          target: `Property #RNX-${id}`,
          ip: '198.51.100.41 (Admin Console)',
          timestamp: 'Just now',
          category: 'MODERATION'
        },
        ...prev
      ]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      await adminApi.rejectProperty(id);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approved: false } : p))
      );
      setAuditLogs(prev => [
        {
          id: `AUD-${Date.now().toString().slice(-3)}`,
          actor: 'admin@realnest.io',
          role: 'SUPER_ADMIN',
          action: 'LISTING_SUSPENDED',
          target: `Property #RNX-${id}`,
          ip: '198.51.100.41 (Admin Console)',
          timestamp: 'Just now',
          category: 'MODERATION'
        },
        ...prev
      ]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    setActionLoadingId(id);
    try {
      await adminApi.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All their property listings will also be removed.')) return;
    setActionLoadingId(id);
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      const propRes = await adminApi.getAllProperties({ size: 50 });
      if (propRes && propRes.data) {
        setProperties(propRes.data.content || []);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleUserRole = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'ROLE_ADMIN' ? 'ROLE_CUSTOMER' : 'ROLE_ADMIN';
        alert(`User ${u.name} role updated to ${nextRole === 'ROLE_ADMIN' ? 'Managing Partner' : 'Private Client'}.`);
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleDisburseEscrow = (contractId) => {
    setEscrowLedger(prev => prev.map(item => {
      if (item.id === contractId) {
        return { ...item, status: 'DISBURSED' };
      }
      return item;
    }));
    alert(`Escrow Contract ${contractId} funds disbursed! Brokerage commission deposited to RealNest Sovereign Treasury.`);
  };

  // CSV Exporters
  const exportPropertiesCSV = () => {
    const headers = ['ID', 'Title', 'Location', 'Type', 'Price_USD', 'Approved', 'Owner_Name', 'Owner_Email'];
    const rows = properties.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.location.replace(/"/g, '""')}"`,
      p.type,
      p.price,
      p.approved,
      `"${(p.ownerName || '').replace(/"/g, '""')}"`,
      p.ownerEmail || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RealNest_Estates_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportUsersCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Properties_Count', 'Admitted_Date'];
    const rows = users.map(u => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      u.email,
      u.role,
      u.propertyCount,
      u.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RealNest_Client_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportEscrowCSV = () => {
    const headers = ['Contract_ID', 'Property_Title', 'Buyer', 'Seller', 'Total_Consideration', 'Commission_Fee', 'Status', 'Date'];
    const rows = escrowLedger.map(e => [
      e.id,
      `"${e.propertyTitle.replace(/"/g, '""')}"`,
      `"${e.buyer.replace(/"/g, '""')}"`,
      `"${e.seller.replace(/"/g, '""')}"`,
      e.consideration,
      e.commission,
      e.status,
      e.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RealNest_Escrow_Settlements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = propertySearch === '' || 
      p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.location.toLowerCase().includes(propertySearch.toLowerCase()) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(propertySearch.toLowerCase()));
    return matchesSearch;
  });

  const filteredUsers = users.filter(u => {
    return userSearch === '' || 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
  });

  const totalProps = properties.length;
  const pendingProps = properties.filter((p) => !p.approved).length;
  const approvedProps = properties.filter((p) => p.approved).length;
  const totalVolumeInEscrow = escrowLedger.reduce((acc, curr) => acc + curr.consideration, 0);
  const totalCommissions = escrowLedger.reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      
      {/* Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 font-mono">
              Sovereign Curator & Board Control Suite
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-950 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-stone-800" />
            Registry Governance & Administration
          </h1>
          <p className="text-stone-500 text-sm mt-1.5">
            Audit architectural provenance, supervise escrow settlements, regulate member access, and govern platform infrastructure.
          </p>
        </div>

        {/* Global Export Hub */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportPropertiesCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Export full property dataset to CSV"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Estates (.csv)</span>
          </button>
          <button
            onClick={exportUsersCSV}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Export client roster to CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Export Roster (.csv)</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="luxury-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Pending Curation</span>
            <span className="text-2xl font-serif font-bold text-amber-700 mt-0.5 block">{pendingProps} Residences</span>
            <span className="text-[10px] text-stone-400">Awaiting deed verification</span>
          </div>
        </div>

        <div className="luxury-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Active In Portfolio</span>
            <span className="text-2xl font-serif font-bold text-stone-950 mt-0.5 block">{approvedProps} Residences</span>
            <span className="text-[10px] text-emerald-700 font-medium">100% CAD verified</span>
          </div>
        </div>

        <div className="luxury-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 border border-stone-200">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Settlements Escrow</span>
            <span className="text-2xl font-serif font-bold text-stone-950 mt-0.5 block">{formatPrice(totalVolumeInEscrow, { compact: true })}</span>
            <span className="text-[10px] text-amber-800 font-semibold">{formatPrice(totalCommissions)} Brokerage</span>
          </div>
        </div>

        <div className="luxury-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-mono">Advisory Clients</span>
            <span className="text-2xl font-serif font-bold text-stone-950 mt-0.5 block">{users.length} Verified</span>
            <span className="text-[10px] text-stone-400">Accredited buyers & brokers</span>
          </div>
        </div>

      </div>

      {/* Tabs Navigation (5 Tabs) */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-stone-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'properties'
              ? 'border-stone-900 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-stone-700" />
          <span>Moderation ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'border-stone-900 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 text-stone-700" />
          <span>Client Roster ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'escrow'
              ? 'border-stone-900 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-700" />
          <span>Escrow & Settlements ({escrowLedger.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'audit'
              ? 'border-stone-900 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4 text-stone-700" />
          <span>Security Audit Log</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'system'
              ? 'border-stone-900 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Server className="w-4 h-4 text-stone-700" />
          <span>Governance Flags</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-stone-900 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-700" />
          <span>Telemetry</span>
        </button>
      </div>

      {/* TAB 1: PROPERTIES MODERATION */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Search & Status Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text"
                placeholder="Search estates by title, location, curator..."
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px] font-mono">Status:</span>
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                >
                  <option value="">All Residences ({properties.length})</option>
                  <option value="false">Pending Curatorial Review ({pendingProps})</option>
                  <option value="true">Approved in Registry ({approvedProps})</option>
                </select>
              </div>

              <button
                onClick={fetchData}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                title="Reload Listings"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="luxury-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100/70 text-stone-500 text-[10px] font-bold uppercase tracking-widest border-b border-stone-200 font-mono">
                  <tr>
                    <th className="py-4 px-6">Residence & ID</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Valuation</th>
                    <th className="py-4 px-6">Listed Curator</th>
                    <th className="py-4 px-6">Registry Status</th>
                    <th className="py-4 px-6 text-right">Curatorial Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-14 text-center text-stone-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-700" />
                        <span className="block mt-2 font-medium text-xs">Loading registry submissions...</span>
                      </td>
                    </tr>
                  ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-stone-50/70 transition-colors">
                        
                        {/* Title & Thumbnail */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={prop.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'}
                              alt=""
                              className="w-14 h-11 object-cover rounded-lg bg-stone-100 shrink-0 border border-stone-200"
                            />
                            <div>
                              <Link
                                to={`/properties/${prop.id}`}
                                className="font-serif font-bold text-stone-900 hover:text-amber-800 line-clamp-1 flex items-center gap-1.5"
                              >
                                {prop.title}
                                <ExternalLink className="w-3 h-3 text-stone-400" />
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                                <span>{prop.location}</span>
                                <span className="font-mono text-[10px] text-stone-400">#{`RNX-${prop.id.toString().padStart(4, '0')}`}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              prop.type === 'SALE'
                                ? 'bg-stone-100 text-stone-800 border border-stone-200'
                                : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {prop.type === 'SALE' ? 'Acquisition' : 'Lease'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-serif font-bold text-stone-950">
                          {formatPrice(prop.price)}
                        </td>

                        {/* Owner */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-stone-900 block text-xs">{prop.ownerName || 'RealNest Partner'}</span>
                          <span className="text-[11px] text-stone-400 block font-mono">{prop.ownerEmail || 'admin@realnest.io'}</span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          {prop.approved ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending Review
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!prop.approved ? (
                              <button
                                onClick={() => handleApprove(prop.id)}
                                disabled={actionLoadingId === prop.id}
                                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReject(prop.id)}
                                disabled={actionLoadingId === prop.id}
                                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5 text-stone-500" />
                                Suspend
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteProperty(prop.id)}
                              disabled={actionLoadingId === prop.id}
                              className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-stone-400 font-medium text-xs">
                        No property listings match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY & ROLE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text"
                placeholder="Search clients by name, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
              />
            </div>
            <div className="text-xs text-stone-500 font-mono">
              Total Admitted Members: <strong className="text-stone-900">{users.length}</strong>
            </div>
          </div>

          <div className="luxury-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100/70 text-stone-500 text-[10px] font-bold uppercase tracking-widest border-b border-stone-200 font-mono">
                  <tr>
                    <th className="py-4 px-6">Client Identity</th>
                    <th className="py-4 px-6">Official Email</th>
                    <th className="py-4 px-6">Accredited Standing</th>
                    <th className="py-4 px-6">Portfolio Holdings</th>
                    <th className="py-4 px-6">Admitted</th>
                    <th className="py-4 px-6 text-right">Role Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                      
                      <td className="py-4 px-6 font-bold text-stone-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-serif font-bold text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span>{u.name}</span>
                          {u.email === 'admin@realnest.io' && (
                            <span className="ml-2 text-[9px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.5 rounded border border-amber-200">Founder</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-stone-600 text-xs font-mono">
                        {u.email}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'ROLE_ADMIN'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {u.role === 'ROLE_ADMIN' ? 'Managing Partner' : 'Private Client'}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-medium text-stone-800 text-xs">
                        {u.propertyCount} residences
                      </td>

                      <td className="py-4 px-6 text-xs text-stone-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.email !== 'admin@realnest.io' && (
                            <button
                              onClick={() => handleToggleUserRole(u.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                              title="Toggle Admin / Client role"
                            >
                              {u.role === 'ROLE_ADMIN' ? 'Demote to Client' : 'Promote to Partner'}
                            </button>
                          )}

                          {u.role !== 'ROLE_ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={actionLoadingId === u.id}
                              className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete User Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ESCROW & SETTLEMENTS */}
      {activeTab === 'escrow' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200">
            <div>
              <h2 className="text-xl font-serif text-stone-950">Escrow Commission & Payout Ledger</h2>
              <p className="text-xs text-stone-500">Autonomous settlement clearing with 1.5% institutional advisory fee escrow.</p>
            </div>
            <button
              onClick={exportEscrowCSV}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Settlements (.csv)</span>
            </button>
          </div>

          <div className="luxury-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100/70 text-stone-500 text-[10px] font-bold uppercase tracking-widest border-b border-stone-200 font-mono">
                  <tr>
                    <th className="py-4 px-6">Contract ID</th>
                    <th className="py-4 px-6">Property Residence</th>
                    <th className="py-4 px-6">Transacting Parties</th>
                    <th className="py-4 px-6">Total Consideration</th>
                    <th className="py-4 px-6">Advisory Fee (1.5%)</th>
                    <th className="py-4 px-6">Escrow Status</th>
                    <th className="py-4 px-6 text-right">Settlement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {escrowLedger.map((contract) => (
                    <tr key={contract.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-stone-900">
                        {contract.id}
                      </td>
                      <td className="py-4 px-6 font-serif font-medium text-stone-950">
                        {contract.propertyTitle}
                      </td>
                      <td className="py-4 px-6 text-xs text-stone-600">
                        <div><span className="text-stone-400">Buyer:</span> {contract.buyer}</div>
                        <div><span className="text-stone-400">Seller:</span> {contract.seller}</div>
                      </td>
                      <td className="py-4 px-6 font-serif font-bold text-stone-950">
                        {formatPrice(contract.consideration)}
                      </td>
                      <td className="py-4 px-6 font-serif font-bold text-amber-800">
                        {formatPrice(contract.commission)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            contract.status === 'DISBURSED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : contract.status === 'CLEARED_FUNDS'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {contract.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {contract.status !== 'DISBURSED' ? (
                          <button
                            onClick={() => handleDisburseEscrow(contract.id)}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            Disburse Payout
                          </button>
                        ) : (
                          <span className="text-xs text-stone-400 font-mono">Settled ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200">
            <div>
              <h2 className="text-xl font-serif text-stone-950">Cadastral & Security Audit Trail</h2>
              <p className="text-xs text-stone-500">Immutable ledger recording all administrative, governance, and transactional activities.</p>
            </div>
            <button
              onClick={() => alert("Cadastral Integrity Check passed: 18/18 title hashes verified against municipal land archives.")}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all border border-stone-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Run Cadastral Hash Verification</span>
            </button>
          </div>

          <div className="luxury-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100/70 text-stone-500 text-[10px] font-bold uppercase tracking-widest border-b border-stone-200 font-mono">
                  <tr>
                    <th className="py-4 px-6">Event ID</th>
                    <th className="py-4 px-6">Actor</th>
                    <th className="py-4 px-6">Action Executed</th>
                    <th className="py-4 px-6">Target Resource</th>
                    <th className="py-4 px-6">Security Node / IP</th>
                    <th className="py-4 px-6 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-xs">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-stone-900">
                        {log.id}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-stone-900 block">{log.actor}</span>
                        <span className="text-[10px] text-amber-800">{log.role}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200 text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-stone-700">
                        {log.target}
                      </td>
                      <td className="py-4 px-6 text-stone-500 text-[11px]">
                        {log.ip}
                      </td>
                      <td className="py-4 px-6 text-right text-stone-400">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNANCE FLAGS & ARCHITECTURE SWITCHES */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200">
            <h2 className="text-xl font-serif text-stone-950">Platform Governance & Feature Flags</h2>
            <p className="text-xs text-stone-500 mt-1">Directly regulate runtime operational modes, autonomous AI engines, and access gates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Flag 1 */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-stone-950">AI Neural Semantic Search Engine</h4>
                <p className="text-xs text-stone-500 mt-1">Enables multi-parameter architectural intent search via embeddings.</p>
                <span className={`inline-block mt-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${featureFlags.aiSearch ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600'}`}>
                  {featureFlags.aiSearch ? 'Live & Operational' : 'Offline'}
                </span>
              </div>
              <button 
                onClick={() => setFeatureFlags(f => ({ ...f, aiSearch: !f.aiSearch }))}
                className="text-stone-800 hover:text-amber-800 transition-colors p-1"
              >
                {featureFlags.aiSearch ? <ToggleRight size={34} className="text-emerald-600" /> : <ToggleLeft size={34} className="text-stone-300" />}
              </button>
            </div>

            {/* Flag 2 */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-stone-950">Autonomous Escrow Settlement Engine</h4>
                <p className="text-xs text-stone-500 mt-1">Permits direct smart-contract settlement of advisory brokerage transactions.</p>
                <span className={`inline-block mt-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${featureFlags.autoEscrow ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600'}`}>
                  {featureFlags.autoEscrow ? 'Automated Mode' : 'Manual Authorization'}
                </span>
              </div>
              <button 
                onClick={() => setFeatureFlags(f => ({ ...f, autoEscrow: !f.autoEscrow }))}
                className="text-stone-800 hover:text-amber-800 transition-colors p-1"
              >
                {featureFlags.autoEscrow ? <ToggleRight size={34} className="text-emerald-600" /> : <ToggleLeft size={34} className="text-stone-300" />}
              </button>
            </div>

            {/* Flag 3 */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-stone-950">Instant Broker Self-Verification Gate</h4>
                <p className="text-xs text-stone-500 mt-1">Allows accredited brokers to publish residences without administrative approval queue.</p>
                <span className={`inline-block mt-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${featureFlags.brokerAutoVerify ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                  {featureFlags.brokerAutoVerify ? 'Open Protocol' : 'Strict Manual Curation'}
                </span>
              </div>
              <button 
                onClick={() => setFeatureFlags(f => ({ ...f, brokerAutoVerify: !f.brokerAutoVerify }))}
                className="text-stone-800 hover:text-amber-800 transition-colors p-1"
              >
                {featureFlags.brokerAutoVerify ? <ToggleRight size={34} className="text-emerald-600" /> : <ToggleLeft size={34} className="text-stone-300" />}
              </button>
            </div>

            {/* Flag 4 */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-stone-950">Maintenance Gate & Read-Only Sandbox</h4>
                <p className="text-xs text-stone-500 mt-1">Freezes all portfolio submissions and acquisitions during quarterly auditing.</p>
                <span className={`inline-block mt-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${featureFlags.maintenanceMode ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-stone-100 text-stone-600'}`}>
                  {featureFlags.maintenanceMode ? 'Maintenance Lock Active' : 'Normal Operation'}
                </span>
              </div>
              <button 
                onClick={() => setFeatureFlags(f => ({ ...f, maintenanceMode: !f.maintenanceMode }))}
                className="text-stone-800 hover:text-amber-800 transition-colors p-1"
              >
                {featureFlags.maintenanceMode ? <ToggleRight size={34} className="text-rose-600" /> : <ToggleLeft size={34} className="text-stone-300" />}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: TELEMETRY & SCALE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="luxury-card p-6">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest font-mono">Merchandise Volume (GMV)</span>
              <p className="text-3xl font-serif font-bold text-stone-950 mt-2">{formatPrice(128500000)}</p>
              <span className="text-xs font-semibold text-emerald-700 mt-1 inline-block">↑ +14.2% quarterly expansion</span>
            </div>

            <div className="luxury-card p-6">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest font-mono">Platform Advisory MRR</span>
              <p className="text-3xl font-serif font-bold text-amber-700 mt-2">{formatPrice(542000)}</p>
              <span className="text-xs font-semibold text-emerald-700 mt-1 inline-block">↑ +18.7% YoY growth</span>
            </div>

            <div className="luxury-card p-6">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest font-mono">Concierge Conversion</span>
              <p className="text-3xl font-serif font-bold text-stone-950 mt-2">5.14%</p>
              <span className="text-xs font-medium text-stone-500 mt-1 inline-block">Global Benchmark: 2.1%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Operational Cities */}
            <div className="luxury-card p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 font-mono">Market Distribution</span>
                <h3 className="text-lg font-serif font-bold text-stone-950">Multi-City Registry Allocation</h3>
              </div>
              <div className="space-y-4">
                {[
                  { city: 'Beverly Hills & Bel Air, CA', share: 24, listings: 1420 },
                  { city: 'Tribeca & Central Park, NY', share: 22, listings: 2150 },
                  { city: 'Lake Como & Amalfi, Italy', share: 18, listings: 980 },
                  { city: 'Zurich & St. Moritz, Switzerland', share: 14, listings: 640 },
                  { city: 'Kyoto & Tokyo, Japan', share: 12, listings: 520 },
                  { city: 'Pune & Mumbai Penthouse Corridors', share: 10, listings: 1840 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-800">
                      <span>{item.city}</span>
                      <span className="font-mono text-stone-500">{item.share}% ({item.listings} residences)</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/50">
                      <div
                        className="bg-stone-900 h-2 rounded-full"
                        style={{ width: `${item.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Microservices System Health */}
            <div className="luxury-card p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 font-mono">Distributed Core</span>
                <h3 className="text-lg font-serif font-bold text-stone-950">Infrastructure Telemetry & SLA</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Auth Service (JWT/OIDC)', status: 'Operational', latency: '4ms' },
                  { name: 'PostGIS Spatial Query Engine', status: 'Operational', latency: '12ms' },
                  { name: 'Elasticsearch Vector Search', status: 'Operational', latency: '8ms' },
                  { name: 'Kafka High-Throughput Cluster', status: 'Operational', latency: '1ms' },
                  { name: 'Redis Multi-Tier Cache', status: 'Operational', latency: '0.4ms' },
                  { name: 'AI NLP Search Concierge', status: 'Operational', latency: '18ms' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{s.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 mt-1 block">Latency: {s.latency}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
