import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    medicationName: { type: String, required: true },
    batchNumber: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

inventorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
