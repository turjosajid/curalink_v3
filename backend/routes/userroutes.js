import express from "express";
import { getUserData, updateUserData } from "../controllers/usercontrollers.js";

const router = express.Router();

router.get("/:userId", getUserData);
router.put("/:userId", updateUserData);

export default router;
