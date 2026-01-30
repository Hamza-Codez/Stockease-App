import React, { useContext, useEffect, useState, useRef } from 'react';
import { inventoryApi } from '../services/firebaseApi';
import InventoryProducts from '../components/InventoryProducts';
import { AdminDataContext } from './AdminContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InventoryItemAdd({ embedded = false }) {
    const { updatedData, setUpdatedData } = useContext(AdminDataContext);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const adminId = localStorage.getItem('adminId');
    const inventoryProductsRef = useRef(null);

    useEffect(() => {
        if (updatedData && Object.keys(updatedData).length > 0) {
            setProductName(updatedData.productName || '');
            setQuantity(updatedData.quantity ?? '');
            setPrice(updatedData.price ?? '');
        }
    }, [updatedData]);

    const resetForm = () => {
        setProductName('');
        setQuantity('');
        setPrice('');
        setUpdatedData(null);
        setTimeout(() => window.location.reload(), 3000);
    };

    const addInventoryItem = async () => {
        if (!productName || !quantity) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            if (!updatedData) {
                await inventoryApi.add({
                    productName,
                    quantity: Number(quantity),
                    price: price === '' ? 0 : Number(price),
                    adminId,
                });
                toast.success('Inventory added successfully!');
            } else {
                await inventoryApi.update(updatedData.id, {
                    productName,
                    quantity: Number(quantity),
                    price: price === '' ? 0 : Number(price),
                });
                toast.success('Inventory updated successfully!');
            }
            if (inventoryProductsRef.current?.fetchInventory) {
                await inventoryProductsRef.current.fetchInventory();
            }
            resetForm();
        } catch (error) {
            console.error('Error saving inventory:', error);
            toast.error(updatedData ? 'Failed to update inventory' : 'Failed to add inventory');
        }
    };

    return (
        <>
            <div className={embedded ? "min-h-0 flex flex-col items-center py-4 md:py-6" : "min-h-screen bg-gray-100 flex flex-col items-center py-12"}>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {updatedData ? 'Update Inventory Item' : 'Add Inventory Item'}
                    </h2>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Product Name"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Quantity"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="number" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per unit (optional)"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={addInventoryItem}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            {updatedData ? 'Update Item' : 'Add Item'}
                        </button>
                        {updatedData && (
                            <button 
                                onClick={resetForm}
                                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel Update
                            </button>
                        )}
                    </div>
                </div>
                <InventoryProducts ref={inventoryProductsRef} />
            </div>
        </>
    );
}

export default InventoryItemAdd;