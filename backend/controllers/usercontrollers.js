import User from "../models/user.model.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

