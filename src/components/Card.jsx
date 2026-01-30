import React, { useState } from 'react';

const Card = ({ item, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    try {
      const jsDate = date?.toDate ? date.toDate() : new Date(date);
      return isNaN(jsDate.getTime()) 
        ? 'Invalid Date' 
        : jsDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); 
    onEdit(item); 
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white w-full max-w-[351px] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[#E8F8F9]">
        <div className="p-6">
          {/* Header with product name and status */}
          <div className="flex justify-between items-start mb-4 gap-2">
            <h3 className="text-xl font-semibold text-[#108587] truncate flex-1">
              {item.productName}
            </h3>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium shrink-0 ${
              item.quantity > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Product details */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-semibold text-gray-800 text-sm">
                {Number(item.quantity).toLocaleString()} {item.quantity === 1 ? 'unit' : 'units'}
              </span>
            </div>
            {item.price != null && Number(item.price) !== 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Price/unit:</span>
                <span className="font-semibold text-gray-800 text-sm">Rs {Number(item.price).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Added:</span>
              <span className="font-semibold text-gray-800 text-sm">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleEditClick}
              className="px-2 py-1 bg-[#C9FEFF] text-blue-600 rounded-sm hover:bg-blue-100 transition-colors text-[12px] font-sm cursor-pointer"
              aria-label={`Edit ${item.productName}`}
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-3 py-1.2 bg-[#FFE7E7] text-red-600 rounded-sm hover:bg-red-100 
              transition-colors text-[12px] font-sm cursor-pointer"
              aria-label={`Delete ${item.productName}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-40"
            onClick={cancelDelete}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="w-[350px] mx-auto p-6 border border-gray-300 rounded-lg shadow-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-center text-[#108587]">
                Confirm Delete
              </h3>
              <p className="mb-6 text-center">Are you sure you want to delete this product?</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-[#DC2626] rounded-md bg-[#FFE7E7] hover:bg-[#fddada] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-[#C9FEFF] text-[#108587] rounded-md hover:bg-[#bdfbfd] transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(Card);