import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

function AddTheCustomer({ searchTerm = '' }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        balance: ""
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: "" });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentCustomerId, setCurrentCustomerId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const adminId = localStorage.getItem("adminId");


    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: "" });
        }, 3000);
    };

    const fetchCustomers = async () => {
        try {
            const q = query(collection(db, "customers"), where("adminId", "==", adminId));
            const querySnapshot = await getDocs(q);
            const customersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomers(customersList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customers: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);


    useEffect(() => {
        if (searchTerm) {
            const filtered = customers.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm) ||
                customer.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCustomers(filtered);
        } else {
            setFilteredCustomers(customers);
        }
    }, [searchTerm, customers]);

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Name is required";
        if (!formData.phone.trim()) {
            tempErrors.phone = "Phone number is required";
        } else if (!/^\d{10,11}$/.test(formData.phone)) {
            tempErrors.phone = "Please enter a valid phone number (10-11 digits)";
        }
        if (!formData.address.trim()) tempErrors.address = "Address is required";
        if (!formData.balance.trim()) tempErrors.balance = "Balance is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const customerData = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                balance: formData.balance.trim(),
                createdAt: new Date(),
                adminId: adminId
            };

            if (modalType === "add") {
                await addDoc(collection(db, "customers"), customerData);
                showToast("Customer added successfully");
            } else {
                await updateDoc(doc(db, "customers", currentCustomerId), customerData);
                showToast("Customer updated successfully");
            }

            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer: ", error);
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            balance: customer.balance
        });
        setCurrentCustomerId(customer.id);
        setModalType("edit");
        setShowModal(true);
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteDoc(doc(db, "customers", customerToDelete.id));
            fetchCustomers();
            showToast("Customer deleted successfully");
        } catch (error) {
            console.error("Error deleting customer: ", error);
        }
        setShowDeleteModal(false);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            address: "",
            balance: ""
        });
        setErrors({});
        setShowModal(false);
        setCurrentCustomerId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (customers.length === 0) {
        return (
            <div className="min-h-[960px] w-full pb-8 bg-[#fcfcfc] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-[#108587] mb-4">No Customers Found</h1>
                <button
                    onClick={() => {
                        setModalType("add");
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#108587] text-white px-4 py-2 rounded-md hover:bg-[#0e7274] transition-colors"
                >
                    <Plus size={18} />
                    Add Customer
                </button>
            </div>
        );
    }
    return (
            <div className="min-h-[960px] w-full pb-8 bg-[#fcfcfc] flex flex-col">
            {/* Customer Section Header */}
            <div className="px-6 flex items-center justify-between h-[87px]">
                <h1 className="text-2xl font-semibold text-[#108587]">Customers</h1>
                <button
                onClick={() => {
                    setModalType("add");
                    setShowModal(true);
                }}
                className="flex items-center gap-2 bg-[#108587] text-white px-4 py-2 rounded-md hover:bg-[#0e7274] transition-colors"
                >
                <Plus size={18} />
                Add Customer
                </button>
            </div>

          {/* Customers Table */}
<div className="min-w-[1005px] overflow-hidden mx-auto mt-4 bg-white rounded-lg shadow-md">
    {/* Add this conditional rendering */}
    {filteredCustomers.length === 0 && customers.length > 0 ? (
        <div className="w-full py-12 text-center">
            <p className="text-gray-500 text-lg">No customers found matching your search</p>
            <button
                onClick={() => {
                    setModalType("add");
                    setShowModal(true);
                }}
                className="mt-4 flex items-center gap-2 bg-[#108587] text-white px-4 py-2 rounded-md hover:bg-[#0e7274] transition-colors mx-auto"
            >
                <Plus size={18} />
                Add New Customer
            </button>
        </div>
    ) : (
        <table className="w-full">
            <thead>
                <tr className="border-b border-[#24dfe6] bg-[#E8F8F9] ">
                    <th className="text-left pl-11 py-3 font-medium text-[#108587]">Name</th>
                    <th className="text-left pl-6 py-3 font-medium text-[#108587]">Phone #</th>
                    <th className="text-left pl-6 py-3 font-medium text-[#108587]">Address</th>
                    <th className="text-left pl-6 py-3 font-medium text-[#108587]">Current Balance</th>
                    <th className="text-left pl-8 py-3 font-medium text-[#108587]">Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredCustomers.map((customer) => (
                    <tr 
                    key={customer.id}
                    className="border-b border-gray-200 hover:bg-[#d6d6d628] transition-colors duration-150"
                    style={{
                        height: '45px',
                    }}
                    >
                    <td className="py-2 pl-10 pr-6 text-gray-900 font-medium">
                        <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#108587] flex items-center justify-center text-white font-semibold mr-3">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{customer.name}</span>
                        </div>
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                        <a href={`tel:${customer.phone}`} className="hover:text-[#108587] hover:underline">
                        {customer.phone}
                        </a>
                    </td>
                    <td className="py-3 px-6 text-gray-600 max-w-xs truncate">
                        {customer.address}
                    </td>
                    <td className="py-3 px-6 font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.balance > 0 
                        ? 'bg-green-100 text-green-800'
                        : customer.balance < 0 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {customer.balance || '0.00'}
                    </span>
                    </td>
                    <td className="py-3 px-6">
                        <div className="flex gap-3 items-center">
                        <button 
                            onClick={() => handleEdit(customer)}
                            className="p-2 rounded-full hover:bg-[#c7faffcb] text-[#108587] hover:text-[#0e7274] transition-colors cursor-pointer"
                            aria-label="Edit customer"
                        >
                            <Pencil size={18} strokeWidth={1.5} />
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(customer)}
                            className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                            aria-label="Delete customer"
                        >
                            <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
                    </table>
                )}
            </div>
            
                        {/* Add/Edit Customer Modal */}
            {showModal && (
            <>
                <div 
                className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-xs z-40" 
                onClick={resetForm}
                ></div>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                <div 
                    className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                    if (e.key === 'Escape') resetForm();
                    if (e.key === 'Enter') handleSubmit();
                    }}
                    tabIndex={0} // Make div focusable
                >
                    <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-[#108587]">
                        {modalType === "add" ? "Add New Customer" : "Edit Customer"}
                        </h2>
                        <button 
                        onClick={resetForm}
                        className="text-[#108587] hover:text-gray-700 focus:outline-none"
                        aria-label="Close modal"
                        >
                        <X size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-[#108587] mb-1">Name *</label>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            type="text" 
                            className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#108587]`}
                            autoFocus
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-[#108587] mb-1">Phone *</label>
                        <input 
                            name="phone"
                            type="text" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#108587]`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                        <label className="block text-[#108587] text-sm font-medium mb-1">Address *</label>
                        <input 
                            name="address"
                            type="text" 
                            value={formData.address}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#108587]`}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-[#108587] mb-1">Current Balance *</label>
                        <input 
                            name="balance"
                            type="text" 
                            value={formData.balance}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className={`w-full p-2 border rounded-md ${errors.balance ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-[#108587]`}
                        />
                        {errors.balance && <p className="text-red-500 text-sm mt-1">{errors.balance}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
                        <button 
                        onClick={resetForm}
                        className="px-4 py-2 text-[#DC2626] rounded-md bg-[#FFE7E7] hover:bg-[#fddada] transition-colors focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
                        >
                        Cancel
                        </button>
                        <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[#C9FEFF] text-[#108587] rounded-md hover:bg-[#bdfbfd] transition-colors focus:outline-none focus:ring-1 focus:ring-[#108587]"
                        >
                        {modalType === "add" ? "Add Customer" : "Update Customer"}
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
            <>
                <div 
                className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-40" 
                onClick={() => setShowDeleteModal(false)}
                ></div>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                <div 
                    className="bg-white rounded-lg shadow-xl w-[340px] max-w-md mx-4 p-5"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowDeleteModal(false);
                    if (e.key === 'Delete') handleDeleteConfirm();
                    }}
                    tabIndex={0} // Make div focusable
                    ref={(el) => el && el.focus()} // Auto-focus on modal open
                >
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#108587]">Confirm Deletion</h2>
                    <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                    </div>
                    <p className="text-gray-600 mb-6">
                    Are you sure you want to delete customer "{customerToDelete?.name}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-3">
                    <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-[#C9FEFF] text-[#108587] rounded-md cursor-pointer hover:bg-[#bdfbfd] transition-colors focus:outline-none focus:ring-1 focus:ring-[#108587]"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDeleteConfirm}
                        className="px-4 py-2 text-[#DC2626] rounded-md bg-[#FFE7E7] cursor-pointer hover:bg-[#fddada] transition-colors focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
                    >
                        Delete
                    </button>
                    </div>
                </div>
                </div>
            </>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed z-50 bottom-4 right-4 bg-[#108587] text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default AddTheCustomer;