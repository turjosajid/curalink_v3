"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        medicationName: "",
        batchNumber: "",
        expirationDate: "",
        quantity: "",
    });
    const [editingData, setEditingData] = useState(null); // Track the item being edited
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Track modal visibility
    const [showAlertsOnly, setShowAlertsOnly] = useState(false); // Filter toggle for alerts
    const [searchQuery, setSearchQuery] = useState(""); // Search query state

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/inventory`);
                setInventory(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching inventory:", error);
                setLoading(false);
            }
        };

        fetchInventory();
    }, [backendUrl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingData) {
            setEditingData({ ...editingData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/inventory`, formData);
            if (response.status === 201) {
                setInventory([...inventory, response.data.inventory]);
                alert("Medicine added successfully!");
            }
            setFormData({
                medicationName: "",
                batchNumber: "",
                expirationDate: "",
                quantity: "",
                
            });
        } catch (error) {
            console.error("Error adding medicine:", error);
            alert("Failed to add medicine. Please try again later.");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${backendUrl}/api/inventory/${editingData._id}`, editingData);
            if (response.status === 200) {
                setInventory(
                    inventory.map((item) =>
                        item._id === editingData._id ? response.data.inventory : item
                    )
                );
                alert("Medicine updated successfully!");
            }
            setEditingData(null);
            setIsEditModalOpen(false); // Close modal after editing
        } catch (error) {
            console.error("Error updating medicine:", error);
            alert("Failed to update medicine. Please try again later.");
        }
    };

    const handleEditClick = (item) => {
        setEditingData({
            _id: item._id,
            medicationName: item.medicationName,
            batchNumber: item.batchNumber,
            expirationDate: item.expirationDate.split("T")[0],
            quantity: item.quantity,
        });
        setIsEditModalOpen(true); // Open modal
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/inventory/${id}`);
            if (response.status === 200) {
                setInventory(inventory.filter((item) => item._id !== id));
                alert("Medicine deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting medicine:", error);
            alert("Failed to delete medicine. Please try again later.");
        }
    };

    const isLowStock = (quantity) => quantity < 10; // Define low stock threshold
    const isNearingExpiration = (expirationDate) => {
        // Get dates without time components to ensure consistent comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiration = new Date(expirationDate);
        expiration.setHours(0, 0, 0, 0);
        const diffInDays = Math.floor((expiration - today) / (1000 * 60 * 60 * 24));
        return diffInDays <= 30; // Define nearing expiration threshold (30 days)
    };

    const filteredInventory = inventory
        .filter((item) =>
            item.medicationName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((item) =>
            showAlertsOnly
                ? isLowStock(item.quantity) || isNearingExpiration(item.expirationDate)
                : true
        );

    if (loading) {
        return <div className="text-center text-lg text-gray-500 mt-10">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Pharmacist Inventory</h1>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <input          // Search input for filtering medicines     // Search bar
                    type="text"
                    placeholder="Search Medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
                />
                <button          //show alerts only button/show all medicines button
                    className={`px-4 py-2 rounded-lg font-medium ${
                        showAlertsOnly
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                    } transition duration-200`}
                    onClick={() => setShowAlertsOnly(!showAlertsOnly)}
                >
                    {showAlertsOnly ? "Show All Medicines" : "Show Alerts Only"}
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Add Medicine Form */}
                <form className="flex-1 bg-white p-8 rounded-lg shadow-md" onSubmit={handleAddSubmit}>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Medicine</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-gray-600 font-medium mb-2">Medication Name:</label>
                            <input
                                type="text"
                                name="medicationName"
                                value={formData.medicationName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium mb-2">Batch Number:</label>
                            <input
                                type="text"
                                name="batchNumber"
                                value={formData.batchNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium mb-2">Expiration Date:</label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium mb-2">Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Add Medicine
                    </button>
                </form>

                {/* Medicine List */}
                <div className="flex-1 bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Medicine List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Medication Name</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Batch Number</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Expiration Date</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Quantity</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Alerts</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.map((item) => (
                                    <tr key={item._id} className="border-t hover:bg-gray-100 transition duration-200">
                                        <td className="px-6 py-4">{item.medicationName}</td>
                                        <td className="px-6 py-4">{item.batchNumber}</td>
                                        <td className="px-6 py-4">{new Date(item.expirationDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{item.quantity}</td>
                                        <td className="px-6 py-4">
                                            {isLowStock(item.quantity) && isNearingExpiration(item.expirationDate) ? (
                                                <span className="text-red-500 font-bold">
                                                    Low Stock & Nearing Expiration
                                                </span>
                                            ) : isLowStock(item.quantity) ? (
                                                <span className="text-red-500 font-bold">Low Stock</span>
                                            ) : isNearingExpiration(item.expirationDate) ? (
                                                <span className="text-red-500 font-bold">Nearing Expiration</span>
                                            ) : null}
                                        </td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button
                                                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition duration-200"
                                                onClick={() => handleDeleteClick(item._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6">Edit Medicine</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Medication Name:</label>
                                <input
                                    type="text"
                                    name="medicationName"
                                    value={editingData.medicationName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Batch Number:</label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={editingData.batchNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Expiration Date:</label>
                                <input
                                    type="date"
                                    name="expirationDate"
                                    value={editingData.expirationDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={editingData.quantity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition duration-200"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;