import React, { useEffect, useState } from "react";
import { deletedRecordsApi } from "../services/firebaseApi";

export const DeleteHistory = ({ embedded = false }) => {
    const [deleteHistory, setDeleteHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const adminId = localStorage.getItem("adminId");

    const fetchHistory = async () => {
        if (!adminId) return;
        try {
            const list = await deletedRecordsApi.getByAdmin(adminId);
            const sorted = (list || []).sort((a, b) => {
                const da = a.deleted_at?.toDate?.()?.getTime() ?? 0;
                const db_ = b.deleted_at?.toDate?.()?.getTime() ?? 0;
                return db_ - da;
            });
            setDeleteHistory(sorted);
        } catch (error) {
            console.error("Error fetching deleted records:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [adminId]);

    const formatTs = (item) => {
        const t = item.deleted_at?.toDate ? item.deleted_at.toDate() : item.deleted_at;
        return t ? new Date(t).toLocaleString() : "No timestamp";
    };

    const getCardClass = (item) => {
        if (item.type === "inventory") {
            return (item.totalAmount || 0) > 0 ? "bg-green-100" : "bg-red-100";
        }
        return "bg-gray-100";
    };

    const deleteRecord = async (id) => {
        try {
            await deletedRecordsApi.delete(id);
            setDeleteHistory((prev) => prev.filter((i) => i.id !== id));
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <div className={embedded ? "min-h-0 py-4" : "min-h-screen bg-gray-50 py-8 px-4"}>
            <div className="max-w-4xl mx-auto">
                <h2 className="m-8 uppercase font-bold text-center text-2xl text-gray-900">
                    Delete History
                </h2>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
                    </div>
                ) : deleteHistory.length > 0 ? (
                    <div className="space-y-2">
                        {deleteHistory.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 flex flex-wrap items-center justify-between gap-2 border rounded ${getCardClass(item)}`}
                            >
                                <div className="flex flex-wrap items-center gap-4">
                                    {item.type === "inventory" && (
                                        <>
                                            <span>{item.quantity ?? 0} kg</span>
                                            <span>Rs {item.rate ?? 0} /kg</span>
                                            <span>Total: Rs {item.totalAmount ?? 0}</span>
                                        </>
                                    )}
                                    {item.type === "customer" && (
                                        <>
                                            <span className="font-medium">{item.name}</span>
                                            <span>{item.phone}</span>
                                        </>
                                    )}
                                    {item.type === "customer_with_records" && (
                                        <>
                                            <span className="font-medium">{item.customerName}</span>
                                            <span>{item.recordCount ?? 0} records</span>
                                        </>
                                    )}
                                    <span className="text-gray-600 text-sm">{formatTs(item)}</span>
                                </div>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    onClick={() => deleteRecord(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No deleted records found.</p>
                )}
            </div>
        </div>
    );
};
