import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";


//signup user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already in use." });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};