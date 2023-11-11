import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Function to generate a reset token
export function generateResetToken(length) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to send a password reset email
export async function sendPasswordResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Password Reset',
    html: `
      <p>You have requested a password reset. Click the link below to reset your password:</p>
      <a href="http://localhost:5173/reset-password?token=${resetToken}">Reset Password</a>
      <a href="http://localhost:5173/reset-password?token=${resetToken}">Reset Password</a>
    `,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send password reset email.');
  }
}

// Handle "forgot password" request
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json('Password reset email sent.');
  } catch (error) {
    next(error);
  }
}

// Handle "reset password" request
export async function resetPassword(req, res, next) {
  const token = req.params.token; // Use req.params.token to get the token from the route parameters
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return next(errorHandler(400, 'Invalid or expired token.'));
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    // Return a success message or any relevant information
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
}





// Handle user signup
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};


// Handle user signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ ...rest, role: validUser.role }); // Include the role in the response
  } catch (error) {
    next(error);
  }
};


// Handle Google signin
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Handle user sign out
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
