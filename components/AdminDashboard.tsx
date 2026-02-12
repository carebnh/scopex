
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
    try {
      const result = await fetchAdminData();
      setData(result);
    } catch (e) {
      console.error("Dashboard failed to load data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lead: any) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this record?")) return;
    
    setIsDeleting(true);
    const success = await deleteLead(lead.id, lead.type);
    if (success) {
      setData(prev => prev.filter(item => item.id !== lead.id));
      setSelectedLead(null);
    } else {
      alert("Failed to delete record. Please check your credentials.");
    }
    setIsDeleting(false);
  };

  const filteredData = data.filter(item => {
    const isHospital = item.type === 'hospital';
    const isCamp = item.type === 'camp';
    const isCorrectTab = activeTab === 'hospital' ? isHospital : isCamp;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (item.hospitalName || '').toLowerCase().includes(searchLower) ||
      (item.organization || '').toLowerCase().includes(searchLower) ||
      (item.contactName || '').toLowerCase().includes(searchLower) ||
      (item.fullName || '').toLowerCase().includes(searchLower) ||
      (item.mobile || item.phone || '').includes(searchQuery);

    return isCorrectTab && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full h-full md:max-w-7xl md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
        
        {/* Dashboard Header */}
        <div className="px-8 py-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-scopex-blue rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-scopex-blue tracking-tighter uppercase leading-none mb-1">Administrative Hub</h2>
              <div className="flex items-center space-x-3">
                 <span className="flex h-2 w-2 rounded-full bg-scopex-green"></span>
                 <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Hybrid Registry Synchronized</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={loadData}
              className="p-4 bg-gray-50 text-scopex-blue hover:bg-scopex-blue hover:text-white rounded-2xl transition-all shadow-sm"
              title="Refresh Data"
            >
              <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
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

        {/* Filters */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100 space-y-4 shrink-0">
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
              <input 
                type="text" 
                placeholder="Search synchronized records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-scopex-blue/5 outline-none transition-all font-bold text-sm shadow-sm"
              />
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar p-0 bg-white">
          {loading ? (
            <div className="h-full flex items-center justify-center flex-col space-y-4">
              <div className="w-12 h-12 border-4 border-scopex-blue/10 border-t-scopex-blue rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Registry Database...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source / Institution</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.length > 0 ? filteredData.map((item, idx) => (
                  <tr 
                    key={item.id || idx} 
                    onClick={() => setSelectedLead(item)}
                    className="hover:bg-gray-50/80 transition-all cursor-pointer group active:scale-[0.998]"
                  >
                    <td className="px-8 py-6 text-xs font-bold text-gray-400">{item.timestamp}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-scopex-blue group-hover:underline underline-offset-4 decoration-2">{item.hospitalName || item.organization}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-800">{item.contactName || item.fullName}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-700">{item.mobile || item.phone}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.id.includes('local_') ? 'bg-orange-50 text-orange-500' : 'bg-scopex-green/10 text-scopex-green'}`}>
                        {item.id.includes('local_') ? 'Local Cache' : 'Cloud Firestore'}
                      </span>
                    </td>
                    <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setSelectedLead(item)}
                          className="p-2.5 bg-scopex-blue/5 text-scopex-blue hover:bg-scopex-blue hover:text-white rounded-xl transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-300 font-black uppercase tracking-[0.2em] italic">Waiting for synchronized records...</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Modal */}
        {selectedLead && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-in zoom-in duration-300">
              <div className="bg-scopex-blue p-10 text-white relative">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h3 className="text-3xl font-black tracking-tighter leading-tight uppercase">{selectedLead.hospitalName || selectedLead.organization}</h3>
                <p className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest mt-2">Registry Reference: {selectedLead.id}</p>
              </div>

              <div className="p-10 space-y-8 overflow-y-auto max-h-[50vh] custom-scrollbar">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Authority</p>
                    <p className="text-lg font-black text-slate-800">{selectedLead.contactName || selectedLead.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile Interface</p>
                    <p className="text-lg font-black text-scopex-blue">{selectedLead.mobile || selectedLead.phone}</p>
                  </div>
                  {selectedLead.email && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Verified Email</p>
                      <p className="text-sm font-bold text-slate-800">{selectedLead.email}</p>
                    </div>
                  )}
                  {selectedLead.requirements && (
                    <div className="col-span-2 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Technical Requirements</p>
                      <p className="text-sm text-slate-600 font-semibold italic leading-relaxed">"{selectedLead.requirements}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => window.open(`tel:${selectedLead.mobile || selectedLead.phone}`)}
                  className="flex-1 bg-scopex-blue text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>Connect</span>
                </button>
                <button 
                  onClick={() => handleDelete(selectedLead)}
                  disabled={isDeleting}
                  className="px-8 bg-red-50 text-red-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  Delete Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
