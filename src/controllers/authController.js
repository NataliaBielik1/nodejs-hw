import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies, generateJwtToken } from '../services/auth.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createHttpError(400, 'Email in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        const session = await createSession(user._id);
        setSessionCookies(res, session);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError(401, 'Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw createHttpError(401, 'Invalid credentials');
        }

        await Session.deleteOne({ userId: user._id });

        const session = await createSession(user._id);
        setSessionCookies(res, session);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const refreshUserSession = async (req, res, next) => {
    const { sessionId, refreshToken } = req.cookies;

    try {
        const session = await Session.findOne({
            _id: sessionId,
            refreshToken,
        });

        if (!session) {
            throw createHttpError(401, 'Session not found');
        }

        const isRefreshTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
        if (isRefreshTokenExpired) {
            throw createHttpError(401, 'Session token expired');
        }

        await Session.deleteOne({ _id: sessionId, refreshToken });

        const newSession = await createSession(session.userId);
        setSessionCookies(res, newSession);

        res.status(200).json({
            message: 'Session refreshed',
        });
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    const { sessionId } = req.cookies;

    try {
        if (sessionId) {
            await Session.deleteOne({ _id: sessionId });
        }

        res.clearCookie('sessionId');
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const requestResetEmail = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: 'Password reset email sent successfully',
            });
        }

        const token = generateJwtToken(user);

        const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`;

        await sendEmail({
            to: user.email,
            subject: 'Скинути пароль',
            templateName: 'reset-password-email',
            templateData: {
                name: user.username || user.email,
                link: resetLink,
            },
        });

        res.status(200).json({
            message: 'Password reset email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { token, password } = req.body;

    try {
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw createHttpError(401, 'Invalid or expired token');
        }

        const user = await User.findOne({
            _id: payload.sub,
            email: payload.email,
        });

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.updateOne({ _id: user._id }, { password: hashedPassword });

        res.status(200).json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};


