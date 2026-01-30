import React, { useState, useEffect } from "react";
import { accountPayableApi } from "../services/firebaseApi";
import { toast } from "react-toastify";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AccountPayable({ embedded = false }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ vendor: "", amount: "", description: "", due_date: "", status: "pending" });
  const adminId = localStorage.getItem("adminId");

  const fetchList = async () => {
    if (!adminId) return;
    try {
      const data = await accountPayableApi.getByAdmin(adminId);
      setList(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load payables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [adminId]);

  const openAdd = () => {
    setEditing(null);
    setForm({ vendor: "", amount: "", description: "", due_date: "", status: "pending" });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    const d = row.due_date?.toDate ? row.due_date.toDate() : row.due_date;
    setForm({
      vendor: row.vendor || "",
      amount: String(row.amount ?? ""),
      description: row.description || "",
      due_date: d ? format(new Date(d), "yyyy-MM-dd") : "",
      status: row.status || "pending",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendor?.trim() || !form.amount) {
      toast.error("Vendor and amount are required");
      return;
    }
    try {
      const payload = { admin_id: adminId, vendor: form.vendor.trim(), amount: Number(form.amount), description: form.description?.trim() || "", status: form.status };
      if (form.due_date) payload.due_date = new Date(form.due_date);
      if (editing) {
        await accountPayableApi.update(editing.id, payload);
        toast.success("Payable updated");
      } else {
        await accountPayableApi.add({ ...payload, created_at: new Date() });
        toast.success("Payable added");
      }
      setShowModal(false);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error(editing ? "Update failed" : "Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payable?")) return;
    try {
      await accountPayableApi.delete(id);
      toast.success("Deleted");
      fetchList();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className={embedded ? "min-h-0" : "min-h-screen bg-gray-50 py-8 px-4"}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#108587]">Account Payable</h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#108587] text-white px-4 py-2 rounded-lg hover:bg-[#0e7274]">
            <Plus size={18} /> Add Payable
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17BCBE]" />
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No payables. Click &quot;Add Payable&quot; to add one.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#E8F8F9]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#108587] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {list.map((row) => {
                  const d = row.due_date?.toDate ? row.due_date.toDate() : row.due_date;
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{row.vendor}</td>
                      <td className="px-4 py-3 font-medium">Rs {Number(row.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{d ? format(new Date(d), "dd/MM/yyyy") : "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${row.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openEdit(row)} className="p-1.5 text-[#108587] hover:bg-[#E8F8F9] rounded"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#108587]">{editing ? "Edit" : "Add"} Payable</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Vendor / Supplier *</label>
                  <input value={form.vendor} onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Amount (Rs) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Due Date</label>
                  <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
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
