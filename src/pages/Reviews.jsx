import React, { useState, useEffect } from "react";
import { reviewsApi } from "../services/firebaseApi";
import { toast } from "react-toastify";
import { Plus, X, Pencil, Trash2, Star } from "lucide-react";
import { format } from "date-fns";

export default function Reviews({ embedded = false }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: "general", subject: "", content: "", rating: 5 });
  const adminId = localStorage.getItem("adminId");

  const fetchList = async () => {
    if (!adminId) return;
    try {
      const data = await reviewsApi.getByAdmin(adminId);
      setList((data || []).sort((a, b) => {
        const ta = a.created_at?.toDate?.()?.getTime() ?? 0;
        const tb = b.created_at?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      }));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [adminId]);

  const openAdd = () => {
    setEditing(null);
    setForm({ type: "general", subject: "", content: "", rating: 5 });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ type: row.type || "general", subject: row.subject || "", content: row.content || "", rating: row.rating ?? 5 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject?.trim()) {
      toast.error("Subject is required");
      return;
    }
    try {
      const payload = { admin_id: adminId, type: form.type, subject: form.subject.trim(), content: form.content?.trim() || "", rating: Math.min(5, Math.max(1, Number(form.rating) || 5)) };
      if (editing) {
        await reviewsApi.update(editing.id, payload);
        toast.success("Review updated");
      } else {
        await reviewsApi.add({ ...payload, created_at: new Date() });
        toast.success("Review added");
      }
      setShowModal(false);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error(editing ? "Update failed" : "Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewsApi.delete(id);
      toast.success("Deleted");
      fetchList();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const stars = (n) => (
    <span className="flex gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} fill={i <= (n || 0) ? "currentColor" : "none"} />
      ))}
    </span>
  );

  return (
    <div className={embedded ? "min-h-0" : "min-h-screen bg-gray-50 py-8 px-4"}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#108587]">Reviews & Notes</h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#108587] text-white px-4 py-2 rounded-lg hover:bg-[#0e7274]">
            <Plus size={18} /> Add Review
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17BCBE]" />
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No reviews. Click &quot;Add Review&quot; to add one.</div>
        ) : (
          <div className="space-y-3">
            {list.map((row) => (
              <div key={row.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-[#17BCBE]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{row.subject}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-[#E8F8F9] text-[#108587]">{row.type}</span>
                      {stars(row.rating)}
                    </div>
                    {row.content && <p className="text-gray-600 text-sm mt-1">{row.content}</p>}
                    <p className="text-gray-400 text-xs mt-2">{row.created_at?.toDate ? format(row.created_at.toDate(), "dd/MM/yyyy HH:mm") : ""}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(row)} className="p-1.5 text-[#108587] hover:bg-[#E8F8F9] rounded"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#108587]">{editing ? "Edit" : "Add"} Review</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]">
                    <option value="general">General</option>
                    <option value="product">Product</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Subject *</label>
                  <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Content</label>
                  <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Rating (1-5)</label>
                  <select value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#108587] text-white rounded hover:bg-[#0e7274]">Save</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
