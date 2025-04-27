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

    if (loading) {
        return <div className="text-center text-lg text-gray-500 mt-10">Loading...</div>;
    }

    return (
        <div suppressHydrationWarning className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Pharmacist Inventory</h1>
            <form className="bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleAddSubmit}>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Add Medicine</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Medication Name:</label>
                    <input
                        type="text"
                        name="medicationName"
                        value={formData.medicationName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Batch Number:</label>
                    <input
                        type="text"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Expiration Date:</label>
                    <input
                        type="date"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Add Medicine
                </button>
            </form>
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Medication Name</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Batch Number</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Expiration Date</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Quantity</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item._id} className="border-t">
                            <td className="px-4 py-2">{item.medicationName}</td>
                            <td className="px-4 py-2">{item.batchNumber}</td>
                            <td className="px-4 py-2">{new Date(item.expirationDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2">
                                <button
                                    className="bg-yellow-400 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-500 transition duration-200"
                                    onClick={() => handleEditClick(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                                    onClick={() => handleDeleteClick(item._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Edit Medicine</h2>
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
