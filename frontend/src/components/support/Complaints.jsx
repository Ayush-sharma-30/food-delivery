import { useState, useEffect } from 'react';
import { supportAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Headphones, LogOut, Check, AlertCircle, Clock, CheckCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const SupportComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [filter, setFilter] = useState('');
  const { logout, user } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => { fetchComplaints(); }, [filter]);

  const fetchComplaints = async () => {
    try {
      const response = await supportAPI.getComplaints(filter || undefined);
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (complaintId, status) => {
    try {
      await supportAPI.updateComplaint(complaintId, {
        status,
        resolution_notes: resolutionNotes[complaintId] || undefined
      });
      showToast(`Complaint marked as ${status}`);
      fetchComplaints();
    } catch (error) {
      showToast('Failed to update complaint', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl font-semibold text-white flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <Check className="w-5 h-5" />
          {toast.message}
        </div>
      )}

      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Complaints</h2>
          <div className="flex gap-2">
            {['', 'open', 'in_progress', 'resolved', 'closed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                {f === '' ? 'All' : f.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <MessageSquare className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500">All clear! No complaints to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(complaint => (
              <div key={complaint.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      complaint.status === 'open' ? 'bg-red-100' : complaint.status === 'in_progress' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {complaint.status === 'open' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                       complaint.status === 'in_progress' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                       <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Complaint #{complaint.id} — Order #{complaint.order_id}</h3>
                      <p className="text-gray-500 text-sm">{complaint.user_name} ({complaint.user_email})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    {expandedId === complaint.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {expandedId === complaint.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="font-semibold text-gray-700 mb-1">Description</p>
                      <p className="text-gray-600">{complaint.description}</p>
                    </div>

                    {complaint.resolution_notes && (
                      <div className="bg-green-50 rounded-xl p-4 mb-4">
                        <p className="font-semibold text-green-700 mb-1">Resolution Notes</p>
                        <p className="text-green-600">{complaint.resolution_notes}</p>
                      </div>
                    )}

                    {complaint.status !== 'closed' && complaint.status !== 'resolved' && (
                      <div className="space-y-3">
                        <textarea
                          value={resolutionNotes[complaint.id] || ''}
                          onChange={(e) => setResolutionNotes({...resolutionNotes, [complaint.id]: e.target.value})}
                          placeholder="Add resolution notes..."
                          rows="2"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                        />
                        <div className="flex gap-2">
                          {complaint.status === 'open' && (
                            <button onClick={() => handleUpdateStatus(complaint.id, 'in_progress')}
                              className="px-5 py-2.5 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all text-sm">
                              Mark In Progress
                            </button>
                          )}
                          <button onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                            className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all text-sm">
                            Resolve
                          </button>
                          <button onClick={() => handleUpdateStatus(complaint.id, 'closed')}
                            className="px-5 py-2.5 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all text-sm">
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Created: {complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportComplaints;
