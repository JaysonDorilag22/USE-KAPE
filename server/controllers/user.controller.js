import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
// import Listing from '../models/listing.model.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const isAdmin = req.user.role === 'Admin';
  const isUserDeletingOwnAccount = req.user.id === req.params.id;

  // Check if the user is either an admin or deleting their own account
  if (!isAdmin && !isUserDeletingOwnAccount) {
    return next(errorHandler(403, 'Forbidden: Insufficient privileges'));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.clearCookie('access_token');
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};
