import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = async (options) => {
    const { templateName, templateData, ...mailOptions } = options;

    if (templateName) {
        const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.html`);
        const templateSource = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateSource);
        mailOptions.html = template(templateData);
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            ...mailOptions,
        });
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};
