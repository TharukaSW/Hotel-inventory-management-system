import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInspectionById, addInspectionItem, updateInspectionItem, removeInspectionItem, completeInspection, updateInspection, InspectionDto, InspectionItemDto, getAllInventoryItems } from '../services/inspectorService';
import { Plus, Trash2, Edit2, CheckCircle2, Loader2 } from 'lucide-react';

const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<InspectionDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addingItem, setAddingItem] = useState(false);
    const [itemForm, setItemForm] = useState<InspectionItemDto>({ inventoryItemId: 0 });
    const [editNotes, setEditNotes] = useState(false);
    const [notesDraft, setNotesDraft] = useState('');
    const [confirmAction, setConfirmAction] = useState<null | { message: string; onConfirm: () => Promise<void> | void }>(null);
    const [toast, setToast] = useState<null | { type: 'error' | 'success'; text: string }>(null);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [inventorySearch, setInventorySearch] = useState('');
    const showError = (text: string) => { setToast({ type: 'error', text }); setTimeout(() => setToast(null), 3500); };
    const showSuccess = (text: string) => { setToast({ type: 'success', text }); setTimeout(() => setToast(null), 2500); };

  const load = async () => {
    if (!id) return;
      try {
        setLoading(true);
        const data = await getInspectionById(Number(id));
        setInspection(data);
        setNotesDraft(data.notes || '');
      } catch (e) {
        console.error('Failed to load inspection', e);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => { load(); }, [id]);
    useEffect(() => { (async () => { try { const items = await getAllInventoryItems(); setInventoryItems(items); } catch (e) { console.error('Inventory load failed', e);} })(); }, []);

  const formatDate = (d?: string) => d ? new Date(d).toLocaleString() : '-';

  const handleAddItem = async () => {
    if (!inspection || !itemForm.inventoryItemId) { showError('Select an inventory item'); return; }
      try {
        setAddingItem(true);
        await addInspectionItem(inspection.id, itemForm);
        setItemForm({ inventoryItemId: 0 });
        await load();
        showSuccess('Item added');
      } catch (e) {
        console.error('Add item failed', e);
        showError('Failed to add item');
      } finally { setAddingItem(false); }
    };

  const handleUpdateItem = async (item: InspectionItemDto) => {
      if (!item.id) return;
      const newActual = prompt('Actual quantity', String(item.actualQuantity ?? ''));
      if (newActual === null) return;
      try {
        await updateInspectionItem(item.id, { ...item, actualQuantity: Number(newActual) });
        await load();
        showSuccess('Item updated');
      } catch (e) {
        console.error('Update item failed', e);
        showError('Failed to update item');
      }
    };

  const handleRemoveItem = (item: InspectionItemDto) => {
      if (!item.id) return;
      setConfirmAction({
        message: 'Remove this inspection item?',
        onConfirm: async () => {
          try {
            await removeInspectionItem(item.id!);
            showSuccess('Item removed');
            await load();
          } catch (e) {
            console.error('Remove item failed', e);
            showError('Failed to remove item');
          }
        }
      });
    };

  const handleComplete = () => {
      if (!inspection) return;
      setConfirmAction({
        message: 'Mark inspection as complete?',
        onConfirm: async () => {
          try {
            setSaving(true);
            await completeInspection(inspection.id!);
            showSuccess('Inspection completed');
            await load();
          } catch (e) {
            console.error('Complete failed', e);
            showError('Failed to complete');
          } finally { setSaving(false); }
        }
      });
    };

  const handleSaveNotes = async () => {
      if (!inspection) return;
      try {
        setSaving(true);
        await updateInspection(inspection.id, { notes: notesDraft });
        setEditNotes(false);
        await load();
        showSuccess('Notes saved');
      } catch (e) {
        console.error('Save notes failed', e);
        showError('Failed to save notes');
      } finally { setSaving(false); }
    };

  if (loading) return (<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>);
  if (!inspection) return <div className="text-center py-12">Inspection not found.</div>;
  const inProgress = inspection.status === 'IN_PROGRESS';

    return (
      <div className="max-w-5xl mx-auto space-y-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inspection Details</h1>
            <p className="mt-1 text-sm text-gray-600">Location: {inspection.locationType} - {inspection.locationIdentifier}</p>
          </div>
          <div className="space-x-3">
            <button onClick={() => navigate(-1)} className="px-3 py-2 text-sm rounded-md border">Back</button>
            {inProgress && (
              <button disabled={saving} onClick={handleComplete} className={`inline-flex items-center px-4 py-2 rounded-md text-sm text-white ${saving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}>
                <CheckCircle2 className="h-4 w-4 mr-1"/> Complete
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white shadow rounded-lg p-5">
            <h2 className="font-semibold mb-4">Overview</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Status:</span> {inspection.status}</div>
              <div><span className="font-medium">Started:</span> {formatDate(inspection.startedAt)}</div>
              <div><span className="font-medium">Completed:</span> {formatDate(inspection.completedAt)}</div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Notes</h3>
                {!editNotes && inProgress && <button onClick={() => setEditNotes(true)} className="text-blue-600 text-xs flex items-center"><Edit2 className="h-3 w-3 mr-1"/>Edit</button>}
              </div>
              {!editNotes && <p className="text-sm text-gray-700 whitespace-pre-line min-h-[40px]">{inspection.notes || 'No notes yet.'}</p>}
              {editNotes && (
                <div className="space-y-2">
                  <textarea className="w-full border rounded-md p-2 text-sm" rows={4} value={notesDraft} onChange={e => setNotesDraft(e.target.value)} />
                  <div className="flex space-x-2">
                    <button disabled={saving} onClick={handleSaveNotes} className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm">{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => { setEditNotes(false); setNotesDraft(inspection.notes || ''); }} className="px-3 py-1.5 rounded-md border text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="font-semibold mb-4">Add Item</h2>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Search inventory items..."
                    value={inventorySearch}
                    onChange={e => setInventorySearch(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm mb-2"
                  />
                  <select
                    className="w-full border rounded-md p-2 text-sm"
                    value={itemForm.inventoryItemId || ''}
                    onChange={e => setItemForm(f => ({ ...f, inventoryItemId: Number(e.target.value) }))}
                  >
                    <option value="">Select Item</option>
                    {inventoryItems
                      .filter(it => !inventorySearch || it.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                      .slice(0, 50)
                      .map(it => (
                        <option key={it.id} value={it.id}>{it.name} (Qty: {it.quantity})</option>
                      ))}
                  </select>
                </div>
                <input type="number" placeholder="Expected Qty" value={itemForm.expectedQuantity || ''} onChange={e => setItemForm(f => ({ ...f, expectedQuantity: Number(e.target.value) }))} className="w-full border rounded-md p-2 text-sm" />
                <input type="number" placeholder="Actual Qty" value={itemForm.actualQuantity || ''} onChange={e => setItemForm(f => ({ ...f, actualQuantity: Number(e.target.value) }))} className="w-full border rounded-md p-2 text-sm" />
                <input type="text" placeholder="Condition (e.g. GOOD)" value={itemForm.conditionStatus || ''} onChange={e => setItemForm(f => ({ ...f, conditionStatus: e.target.value }))} className="w-full border rounded-md p-2 text-sm" />
                <textarea placeholder="Notes" value={itemForm.notes || ''} onChange={e => setItemForm(f => ({ ...f, notes: e.target.value }))} className="w-full border rounded-md p-2 text-sm" rows={2} />
                <button disabled={addingItem || !inProgress} onClick={handleAddItem} className={`w-full inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-white ${addingItem ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>{addingItem && <Loader2 className="h-4 w-4 mr-1 animate-spin"/>}<Plus className="h-4 w-4 mr-1"/> Add Item</button>
                {!inProgress && <p className="text-xs text-gray-500">Inspection not editable.</p>}
              </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Inspection Items</h2>
            <span className="text-xs text-gray-500">{inspection.inspectionItems?.length || 0} items</span>
          </div>
          {inspection.inspectionItems && inspection.inspectionItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left font-medium text-gray-600">ID</th><th className="px-3 py-2 text-left font-medium text-gray-600">Item</th><th className="px-3 py-2 text-left font-medium text-gray-600">Expected</th><th className="px-3 py-2 text-left font-medium text-gray-600">Actual</th><th className="px-3 py-2 text-left font-medium text-gray-600">Condition</th><th className="px-3 py-2 text-left font-medium text-gray-600">Notes</th><th className="px-3 py-2"/></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {inspection.inspectionItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{item.id}</td>
                      <td className="px-3 py-2">{item.itemName || item.inventoryItemId}</td>
                      <td className="px-3 py-2">{item.expectedQuantity ?? '-'}</td>
                      <td className="px-3 py-2">{item.actualQuantity ?? '-'}</td>
                      <td className="px-3 py-2">{item.conditionStatus || '-'}</td>
                      <td className="px-3 py-2 max-w-xs truncate" title={item.notes}>{item.notes || '-'}</td>
                      <td className="px-3 py-2 text-right space-x-2">{inProgress && (<><button onClick={() => handleUpdateItem(item)} className="inline-flex items-center px-2 py-1 text-xs rounded border"><Edit2 className="h-3 w-3"/></button><button onClick={() => handleRemoveItem(item)} className="inline-flex items-center px-2 py-1 text-xs rounded border text-red-600"><Trash2 className="h-3 w-3"/></button></>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<div className="text-sm text-gray-500">No items added yet.</div>)}
        </div>
        {confirmAction && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5 space-y-4">
              <h3 className="text-base font-semibold">Confirm</h3>
              <p className="text-sm text-gray-700">{confirmAction.message}</p>
              <div className="flex justify-end space-x-2 pt-2">
                <button onClick={() => setConfirmAction(null)} className="px-3 py-1.5 text-sm rounded border">Cancel</button>
                <button onClick={async () => { const fn = confirmAction.onConfirm; setConfirmAction(null); await fn(); }} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white">Confirm</button>
              </div>
            </div>
          </div>
        )}
        {toast && (<div className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded shadow text-sm text-white ${toast.type==='error'?'bg-red-600':'bg-green-600'}`}>{toast.text}</div>)}
      </div>
    );
};

export default InspectionDetails;
