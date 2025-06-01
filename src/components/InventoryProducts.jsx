import React, { useState, useEffect, useContext } from 'react';
import { db } from "../../firebaseConfig";
import { AdminDataContext } from '../pages/AdminContext';
import { customerDataDataContext } from '../pages/CustomerContext';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import Card from './Card'; 
import { Pencil, CirclePlus } from 'lucide-react';

function InventoryProducts({ onInventoryUpdate, searchTerm }) {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ productName: '', quantity: '', createdAt: new Date() });
    const [toast, setToast] = useState({ show: false, message: '' });
    const { setUpdatedData } = useContext(AdminDataContext);
    const { setInventoryItem } = useContext(customerDataDataContext);

    const adminId = localStorage.getItem("adminId");

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const filteredInventory = inventory.filter(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const fetchInventory = async () => {
        try {
            const q = query(collection(db, "inventory"), where("adminId", "==", adminId));
            const querySnapshot = await getDocs(q);
            const inventoryList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date()
                };
            });
            setInventory(inventoryList);
            setInventoryItem(inventoryList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching inventory: ", error);
            showToast('Failed to load inventory');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const deleteProductFromInventory = async (productId) => {
        try {
            await deleteDoc(doc(db, "inventory", productId));
            setInventory(prevInventory => prevInventory.filter(item => item.id !== productId));
            showToast('Product deleted successfully');
        } catch (error) {
            console.error("Error deleting product: ", error);
            showToast('Failed to delete product');
        }
    };

    const editHandler = (item) => {
        setUpdatedData(item);
        setShowForm(true);
        setNewItem(item);
    };

    const handleAddItem = async () => {
        if (!newItem.productName.trim() || !newItem.quantity) {
            showToast('Please enter both product name and quantity');
            return;
        }
    
        try {
            const newItemData = { 
                ...newItem, 
                adminId,
                quantity: Number(newItem.quantity),
                createdAt: newItem.createdAt || new Date()
            };
            
            if (newItem.id) {
                await updateDoc(doc(db, "inventory", newItem.id), newItemData);
                setInventory(prevInventory => 
                    prevInventory.map(item => 
                        item.id === newItem.id ? newItemData : item
                    )
                );
                showToast('Product updated successfully');
            } else {
                const docRef = await addDoc(collection(db, "inventory"), newItemData);
                setInventory(prevInventory => [
                    ...prevInventory,
                    { ...newItemData, id: docRef.id }
                ]);
                showToast('Product added successfully');
            }
            
            setNewItem({ productName: '', quantity: '', createdAt: new Date() });
            setShowForm(false);
        } catch (error) {
            console.error("Error adding/updating item: ", error);
            showToast('Failed to save product');
        }
    };
    

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[960px] w-full pb-8 bg-slate-50 flex flex-col">
            {toast.show && (
                <div className="fixed z-50 bottom-4 right-4 bg-[#108587] text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
                    {toast.message}
                </div>
            )}

            <div className="flex items-center justify-between p-4">
                <h2 className="text-[21px] font-semibold text-[#108587]">
                    Inventory Products
                </h2>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setNewItem({ productName: '', quantity: '', createdAt: new Date() });
                    }}
                    className="bg-[#108587] text-white text-xl font-semibold px-5 py-1 rounded-md cursor-pointer transition hover:bg-[#17BCBE]"
                >
                    +
                </button>
            </div>

            {showForm && (
                <>
                    <div
                        className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-xs z-40"
                        onClick={() => setShowForm(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <div
                            className="w-[415px] h-[437px] mx-auto px-6 pt-13 border border-gray-300 rounded-lg shadow-xl bg-white pointer-events-auto"
                        >
                            <h3 className="text-2xl items-center font-semibold mb-8 flex gap-2 text-[#108587]">
                                {newItem.id ? (
                                    <>
                                        <Pencil className="w-6 h-6" />
                                        <span>Edit Product</span>
                                    </>
                                ) : (
                                    <>
                                        <CirclePlus className="w-5 h-5 text-[#108587]" />
                                        <span>Add New Product</span>
                                    </>
                                )}
                            </h3>
                            <h2 className='mb-3 text-[#108587] font-semibold '>Product Name</h2>
                            <input
                                type="text"
                                value={newItem.productName}
                                onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                className="w-full p-3 mb-2 border border-gray-300 rounded-md"
                            />
                            <h2 className='mb-3 text-[#108587] font-semibold '>Quantity</h2>
                            <input
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                className="w-full p-3 mb-6 border border-gray-300 rounded-md"
                            />
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setNewItem({ productName: '', quantity: '', createdAt: new Date() });
                                    }}
                                    className="px-4 py-2 text-[#DC2626] rounded-md bg-[#FFE7E7] hover:bg-[#fddada] transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddItem}
                                    className="px-4 py-2 bg-[#C9FEFF] text-[#108587] rounded-md hover:bg-[#bdfbfd] transition-colors cursor-pointer"
                                >
                                    {newItem.id ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-4">
                {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                    <Card 
                        key={item.id}
                        item={item}
                        onEdit={editHandler}
                        onDelete={deleteProductFromInventory}
                    />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                    {searchTerm ? 'No products match your search' : 'No products available'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventoryProducts;