import React, { useState, useEffect } from "react";
import { payrollApi } from "../services/firebaseApi";
import { toast } from "react-toastify";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function Payroll({ embedded = false }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ employeeName: "", amount: "", type: "salary", description: "", date: format(new Date(), "yyyy-MM-dd") });
  const adminId = localStorage.getItem("adminId");

  const fetchList = async () => {
    if (!adminId) return;
    try {
      const data = await payrollApi.getByAdmin(adminId);
      setList((data || []).sort((a, b) => (b.date || "").localeCompare(a.date || "")));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load payroll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [adminId]);

  const openAdd = () => {
    setEditing(null);
    setForm({ employeeName: "", amount: "", type: "salary", description: "", date: format(new Date(), "yyyy-MM-dd") });
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    const d = row.date?.toDate ? row.date.toDate() : row.date;
    setForm({
      employeeName: row.employeeName || "",
      amount: String(row.amount ?? ""),
      type: row.type || "salary",
      description: row.description || "",
      date: d ? format(new Date(d), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeName?.trim() || !form.amount) {
      toast.error("Employee name and amount are required");
      return;
    }
    try {
      const payload = { admin_id: adminId, employeeName: form.employeeName.trim(), amount: Number(form.amount), type: form.type, description: form.description?.trim() || "", date: form.date };
      if (editing) {
        await payrollApi.update(editing.id, payload);
        toast.success("Payroll updated");
      } else {
        await payrollApi.add({ ...payload, created_at: new Date() });
        toast.success("Payroll entry added");
      }
      setShowModal(false);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error(editing ? "Update failed" : "Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payroll entry?")) return;
    try {
      await payrollApi.delete(id);
      toast.success("Deleted");
      fetchList();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className={embedded ? "min-h-0" : "min-h-screen bg-gray-50 py-8 px-4"}>
      <div className={embedded ? "max-w-4xl mx-auto" : "max-w-4xl mx-auto"}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#108587]">Payroll</h2>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#108587] text-white px-4 py-2 rounded-lg hover:bg-[#0e7274]"
          >
            <Plus size={18} /> Add Entry
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17BCBE]" />
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No payroll entries. Click &quot;Add Entry&quot; to add one.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#E8F8F9]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#108587] uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#108587] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {list.map((row) => {
                  const d = row.date?.toDate ? row.date.toDate() : row.date;
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{row.employeeName}</td>
                      <td className="px-4 py-3 font-medium">Rs {Number(row.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${row.type === "deduction" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{d ? format(new Date(d), "dd/MM/yyyy") : "-"}</td>
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
                <h3 className="text-lg font-semibold text-[#108587]">{editing ? "Edit" : "Add"} Payroll Entry</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Employee Name *</label>
                  <input value={form.employeeName} onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Amount (Rs) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]">
                    <option value="salary">Salary</option>
                    <option value="bonus">Bonus</option>
                    <option value="deduction">Deduction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Description</label>
                  <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#108587] mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#108587]" />
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
