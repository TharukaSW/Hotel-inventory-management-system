import React, { useEffect, useState } from 'react';
import { apiService } from '@hotel-inventory/shared-lib';
import { Check, X, AlertCircle } from 'lucide-react';
import { useConfirmation } from '../components/ConfirmationModal';

interface ItemRequestDto {
  id: number;
  itemName: string;
  // Backend sends 'requestedQuantity'; keep 'quantity' for table, normalize after fetch
  quantity?: number;
  requestedQuantity?: number;
  reason: string;
  status: string;
  requestedAt?: string;
  inspectorName?: string;
  rejectionNotes?: string;
}

// Canonical ItemRequests admin page (was AdminItemRequests)
const ItemRequests: React.FC = () => {
  const [requests, setRequests] = useState<ItemRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string>('');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const { confirm } = useConfirmation();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getItemRequests();
      const normalized = (Array.isArray(data) ? data : []).map((d: any) => ({
        ...d,
        quantity: d.quantity ?? d.requestedQuantity ?? d.requested_quantity
      }));
      setRequests(normalized);
    } catch (e: any) {
      if (e?.message?.includes('403')) {
        setError('Forbidden (403) - Check backend auth rules or login.');
      } else {
        setError('Failed to load item requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    const ok = await confirm({ title: 'Approve Request', message: 'Approve this item request?', type: 'info', confirmText: 'Approve' });
    if (!ok) return;
    try {
      await apiService.approveItemRequest(id);
      await load();
    } catch (e) { console.error(e); }
  };

  const handleReject = async (id: number) => {
    setRejectingId(id);
  };

  const submitRejection = async () => {
    if (rejectingId == null) return;
    const ok = await confirm({ title: 'Reject Request', message: 'Reject this item request?', type: 'danger', confirmText: 'Reject' });
    if (!ok) return;
    try {
      await apiService.rejectItemRequest(rejectingId, rejectionNote || 'No reason provided');
      setRejectionNote('');
      setRejectingId(null);
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>Item Requests</h1>
        <p className='text-gray-600'>Review and manage inspector item requests</p>
      </div>
      {error && <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded'>{error}</div>}
      {loading ? (
        <div className='flex justify-center py-10'>Loading...</div>
      ) : (
        <div className='bg-white rounded-lg shadow divide-y'>
          <div className='px-6 py-4 flex justify-between items-center'>
            <h2 className='font-medium text-gray-800'>Requests ({requests.length})</h2>
            <button onClick={load} className='text-sm text-blue-600 hover:underline'>Refresh</button>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Item</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Qty</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Reason</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Inspector</th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {requests.map(r => (
                  <tr key={r.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-2 text-sm text-gray-500'>#{r.id}</td>
                    <td className='px-4 py-2 text-sm font-medium text-gray-900'>{r.itemName}</td>
                    <td className='px-4 py-2 text-sm text-gray-700'>{r.quantity ?? r.requestedQuantity ?? '—'}</td>
                    <td className='px-4 py-2 text-sm text-gray-600 max-w-xs truncate' title={r.reason}>{r.reason}</td>
                    <td className='px-4 py-2 text-sm text-gray-600'>{r.inspectorName || '-'}</td>
                    <td className='px-4 py-2 text-sm'>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${r.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : r.status === 'APPROVED' ? 'bg-green-100 text-green-800' : r.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                    </td>
                    <td className='px-4 py-2 text-sm text-right space-x-2'>
                      {r.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(r.id)} className='inline-flex items-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700'>
                            <Check className='h-4 w-4' />
                          </button>
                          <button onClick={() => handleReject(r.id)} className='inline-flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700'>
                            <X className='h-4 w-4' />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={7} className='px-4 py-8 text-center text-sm text-gray-500'>No item requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rejectingId !== null && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded shadow p-6 w-full max-w-md space-y-4'>
            <h3 className='text-lg font-semibold flex items-center space-x-2'><AlertCircle className='h-5 w-5 text-red-500' /><span>Rejection Reason</span></h3>
            <textarea value={rejectionNote} onChange={e => setRejectionNote(e.target.value)} className='w-full border rounded p-2 h-28' placeholder='Enter rejection reason...' />
            <div className='flex justify-end space-x-3'>
              <button onClick={() => { setRejectingId(null); setRejectionNote(''); }} className='px-4 py-2 border rounded hover:bg-gray-50'>Cancel</button>
              <button onClick={submitRejection} disabled={!rejectionNote.trim()} className='px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50'>Submit Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemRequests;
