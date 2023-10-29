import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


//sign-up new user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};
