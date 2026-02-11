
import React, { useState, useEffect } from 'react';
import { fetchAdminData, deleteLead } from '../services/submissionService.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hospital' | 'camp'>('hospital');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchAdminData();
    setData(result);
    setLoading(false);
  };

  const handleDelete = async (rowId: number) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this lead? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    const success = await deleteLead(rowId);
    if (success) {
      setData(prev => prev.filter(item => item.rowId !== rowId));
      setSelectedLead(null);
    } else {
      alert("Failed to delete lead. Please check your connection.");
    }
    setIsDeleting(false);
  };

  const filteredData = data.filter(item => {
    const isCorrectType = activeTab === 'hospital' ? item.type === 'hospital' || item.hospitalName : item.type === 'camp' || item.organization;
    const matchesSearch = (item.hospitalName || item.organization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.contactName || item.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.mobile || item.phone || '').includes(searchQuery);
    return isCorrectType && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = activeTab === 'hospital' 
      ? ['Timestamp', 'Hospital', 'Contact', 'Mobile', 'Interest']
      : ['Timestamp', 'Organization', 'Contact', 'Email', 'Phone', 'Date', 'Headcount', 'Requirements'];
    
    const rows = filteredData.map(item => {
      return activeTab === 'hospital'
        ? [item.timestamp, item.hospitalName, item.contactName, item.mobile, item.interest]
        : [item.timestamp, item.organization, item.fullName, item.email, item.phone, item.date, item.headcount, item.requirements];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `scopex_${activeTab}_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full h-full md:max-w-7xl md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-scopex-blue rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-scopex-blue tracking-tighter uppercase">Admin Intelligence Hub</h2>
              <div className="flex items-center space-x-3 mt-1">
                 <span className="flex h-2 w-2 rounded-full bg-scopex-green"></span>
                 <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Secured Registry Database</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-gray-50 text-scopex-blue px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-scopex-blue hover:text-white transition-all border border-gray-100 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button 
              onClick={onClose}
              className="p-4 bg-gray-100 text-gray-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters & Stats */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100 space-y-8 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
                <p className="text-3xl font-black text-scopex-blue">{data.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-scopex-blue rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hospital Partners</p>
                <p className="text-3xl font-black text-scopex-green">{data.filter(i => i.type === 'hospital').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 text-scopex-green rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Camps</p>
                <p className="text-3xl font-black text-orange-500">{data.filter(i => i.type === 'camp').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-white p-1 rounded-2xl flex border border-gray-100 shadow-sm">
              <button 
                onClick={() => { setActiveTab('hospital'); setSelectedLead(null); }}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hospital' ? 'bg-scopex-blue text-white shadow-lg' : 'text-gray-400 hover:text-scopex-blue'}`}
              >
                Hospital Leads
              </button>
              <button 
                onClick={() => { setActiveTab('camp'); setSelectedLead(null); }}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'camp' ? 'bg-scopex-blue text-white shadow-lg' : 'text-gray-400 hover:text-scopex-blue'}`}
              >
                Camp Bookings
              </button>
            </div>
            
            <div className="relative flex-1">
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search by name, organization or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-sm shadow-sm placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto custom-scrollbar p-0 bg-white">
          {loading ? (
            <div className="h-full flex items-center justify-center flex-col space-y-4">
              <div className="w-12 h-12 border-4 border-scopex-blue/10 border-t-scopex-blue rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Registry...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeTab === 'hospital' ? 'Hospital' : 'Organization'}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Communication</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeTab === 'hospital' ? 'Interest' : 'Event Date'}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.length > 0 ? filteredData.map((item, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedLead(item)}
                    className="hover:bg-gray-50/80 transition-all cursor-pointer group active:scale-[0.998]"
                  >
                    <td className="px-8 py-6 text-xs font-bold text-gray-400">{item.timestamp}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-scopex-blue group-hover:underline underline-offset-4 decoration-2">{item.hospitalName || item.organization}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{activeTab === 'hospital' ? 'Healthcare Facility' : 'Corporate Hub'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800">{item.contactName || item.fullName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs font-black text-slate-700">{item.mobile || item.phone}</span>
                        {item.email && <span className="text-[10px] font-medium text-gray-400">{item.email}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {item.interest || item.date}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-[10px] font-black text-scopex-green uppercase tracking-[0.2em] border border-scopex-green/20 px-4 py-2 rounded-lg group-hover:bg-scopex-green group-hover:text-white transition-all">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-100 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No matching records found</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Lead Detail Modal - Overlay inside Dashboard */}
        {selectedLead && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in duration-300 border border-white/20">
              {/* Modal Header */}
              <div className="bg-scopex-blue p-10 text-white relative">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md border border-white/10">
                    {selectedLead.type === 'hospital' ? '🏥' : '🏢'}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">{selectedLead.hospitalName || selectedLead.organization}</h3>
                    <div className="flex items-center space-x-3 mt-1.5">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">Lead ID: #{selectedLead.rowId}</span>
                      <span className="flex h-2 w-2 rounded-full bg-scopex-green"></span>
                      <span className="text-[9px] font-black text-blue-100/60 uppercase tracking-widest">Active Verification</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Contact Person</p>
                    <p className="text-lg font-black text-slate-800">{selectedLead.contactName || selectedLead.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged Into System</p>
                    <p className="text-lg font-bold text-slate-800">{selectedLead.timestamp}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct Contact</p>
                    <p className="text-lg font-black text-scopex-blue">{selectedLead.mobile || selectedLead.phone}</p>
                  </div>
                  {selectedLead.email && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Email</p>
                      <p className="text-lg font-bold text-slate-800 truncate">{selectedLead.email}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedLead.type === 'hospital' ? 'Selected Model' : 'Proposed Date'}</p>
                    <p className="text-lg font-black text-scopex-green">{selectedLead.interest || selectedLead.date}</p>
                  </div>
                  {selectedLead.headcount && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee Count</p>
                      <p className="text-lg font-bold text-slate-800">{selectedLead.headcount}</p>
                    </div>
                  )}
                </div>

                {selectedLead.requirements && (
                  <div className="space-y-3 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <svg className="w-3 h-3 mr-2 text-scopex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                      Comprehensive Requirements
                    </p>
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed">"{selectedLead.requirements}"</p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="px-10 py-8 border-t border-gray-100 flex gap-4 bg-gray-50/30">
                <button 
                  onClick={() => window.open(`tel:${selectedLead.mobile || selectedLead.phone}`)}
                  className="flex-1 bg-scopex-blue text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/10 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>Connect Now</span>
                </button>
                <button 
                  onClick={() => handleDelete(selectedLead.rowId)}
                  disabled={isDeleting}
                  className="px-8 bg-red-50 text-red-500 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  <span>Delete</span>
                </button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-8 bg-gray-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest shrink-0 bg-white">
          <p>Scope X Diagnostics Administration v1.2</p>
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-scopex-green"></span>
                <span>Active Registry: {filteredData.length} Records</span>
             </div>
             <p className="opacity-50">Last Update: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
