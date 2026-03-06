import { randomBytes } from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export const createSession = async (userId) => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

export const setSessionCookies = (res, session) => {
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    };

    res.cookie('accessToken', session.accessToken, {
        ...cookieOptions,
        maxAge: FIFTEEN_MINUTES,
    });

    res.cookie('refreshToken', session.refreshToken, {
        ...cookieOptions,
        maxAge: ONE_DAY,
    });

    res.cookie('sessionId', session._id, {
        ...cookieOptions,
        maxAge: ONE_DAY,
    });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
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

    const newSession = await createSession(session.userId);

    await Session.deleteOne({ _id: sessionId, refreshToken });

    return newSession;
};
