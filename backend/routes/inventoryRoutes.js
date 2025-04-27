import express from "express";
import {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

// Route to create a new inventory item
router.post("/", createInventory);

// Route to get all inventory items
router.get("/", getAllInventory);

// Route to get a single inventory item by ID
router.get("/:id", getInventoryById);

// Route to update an inventory item by ID
router.put("/:id", updateInventory);

// Route to delete an inventory item by ID
router.delete("/:id", deleteInventory);

export default router;
