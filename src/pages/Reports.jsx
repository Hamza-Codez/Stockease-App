import React, { useState, useEffect } from "react";
import { reportsApi } from "../services/firebaseApi";
import { BarChart2, Users, Package, Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";

export default function Reports({ embedded = false }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (!adminId) return;
    reportsApi
      .getDashboardStats(adminId)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [adminId]);

  const cards = [
    { key: "customersCount", label: "Customers", value: stats?.customersCount ?? 0, icon: Users, color: "bg-[#E8F8F9] text-[#108587]", border: "border-[#17BCBE]" },
    { key: "inventoryCount", label: "Inventory Items", value: stats?.inventoryCount ?? 0, icon: Package, color: "bg-[#E8F8F9] text-[#108587]", border: "border-[#17BCBE]" },
    { key: "inventoryValue", label: "Inventory Value (Rs)", value: (stats?.inventoryValue ?? 0).toLocaleString(), icon: TrendingUp, color: "bg-green-50 text-green-800", border: "border-green-200" },
    { key: "customerBalancesTotal", label: "Customer Balances (Rs)", value: (stats?.customerBalancesTotal ?? 0).toLocaleString(), icon: ArrowDownLeft, color: "bg-amber-50 text-amber-800", border: "border-amber-200" },
    { key: "payrollTotal", label: "Payroll Total (Rs)", value: (stats?.payrollTotal ?? 0).toLocaleString(), icon: Wallet, color: "bg-[#E8F8F9] text-[#108587]", border: "border-[#17BCBE]" },
    { key: "receivablePending", label: "Receivable Pending (Rs)", value: (stats?.receivablePending ?? 0).toLocaleString(), icon: ArrowDownLeft, color: "bg-green-50 text-green-800", border: "border-green-200" },
    { key: "payablePending", label: "Payable Pending (Rs)", value: (stats?.payablePending ?? 0).toLocaleString(), icon: ArrowUpRight, color: "bg-red-50 text-red-800", border: "border-red-200" },
    { key: "receivableEntries", label: "Receivable Entries", value: stats?.receivableEntries ?? 0, icon: BarChart2, color: "bg-[#E8F8F9] text-[#108587]", border: "border-[#17BCBE]" },
    { key: "payableEntries", label: "Payable Entries", value: stats?.payableEntries ?? 0, icon: BarChart2, color: "bg-[#E8F8F9] text-[#108587]", border: "border-[#17BCBE]" },
  ];

  return (
    <div className={embedded ? "min-h-0" : "min-h-screen bg-gray-50 py-8 px-4"}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#108587] mb-8">Reports & Dashboard</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17BCBE]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(({ key, label, value, icon: Icon, color, border }) => (
              <div key={key} className={`bg-white rounded-lg shadow border-l-4 ${border} p-5 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase">{label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
