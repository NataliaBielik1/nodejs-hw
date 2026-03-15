import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
    const { _id } = req.user;
    const avatar = req.file;

    try {
        if (!avatar) {
            throw createHttpError(400, 'No file');
        }

        const cloudinaryResponse = await saveFileToCloudinary(avatar.buffer);

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { avatar: cloudinaryResponse.secure_url },
            { new: true },
        );

        res.status(200).json({
            url: updatedUser.avatar,
        });
    } catch (error) {
        next(error);
    }
};
