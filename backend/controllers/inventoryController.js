import { Inventory } from '../models/inventoryModel.js';

// Create a new inventory item
export const createInventory = async (req, res) => {
    try {
        const { medicationName, batchNumber, expirationDate, quantity } = req.body;

        // Validate input data
        if (!medicationName || !batchNumber || !expirationDate || !quantity) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const inventory = new Inventory(req.body);
        await inventory.save();
        res.status(201).json({ message: 'Inventory item created successfully', inventory });
    } catch (error) {
        console.error('Error creating inventory:', error);
        res.status(500).json({ error: 'Failed to create inventory item. Please try again later.' });
    }
};

// Get all inventory items
export const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching all inventory:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get a single inventory item by ID
export const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching inventory by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update an inventory item by ID
export const updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item updated successfully', inventory });
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete an inventory item by ID
export const deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory:', error);
        res.status(500).json({ error: error.message });
    }
};
