import { HandlebarsConverter } from 'handlebars-converter';
import path from 'node:path';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { logger } from './logger';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMAIL_TEMPLATE_DEFAULTS = {
  metaData: {
    currentYear: new Date().getFullYear(),
  },
};

export type SendEmailParams = {
  receiver: string;
  subject: string;
  template: string;
  context?: object;
};

const rootDir = process.cwd();

// Initialize the handlebar converter class
const hbsConverter = new HandlebarsConverter({
  templateDirPath: path.join(rootDir, './templates/contents'),
  partialDirPath: path.join(rootDir, './templates/partials'),
});

export const sendEmail = async (params: SendEmailParams) => {
  try {
    const { receiver, subject, template, context } = params;
    if (
      !receiver ||
      typeof receiver !== 'string' ||
      receiver === '' ||
      !EMAIL_REGEX.test(receiver)
    ) {
      throw new Error('Provide a valid receiver email address');
    }

    if (!subject || typeof subject !== 'string' || subject === '') {
      throw new Error('Email subject is required');
    }

    if (!template || typeof template !== 'string' || template === '') {
      throw new Error('Provide an email template name');
    }

    // Compile the handlebars code into html string
    const html = await hbsConverter.compile({
      context: {
        ...EMAIL_TEMPLATE_DEFAULTS.metaData,
        ...context,
      },
      templateName: template,
    });

    const mailTransporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT!),
      secure: false,
      priority: 'high',
      auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
      },
    });

    if (!mailTransporter) {
      logger.error('Error creating mail transporter:');
      throw new Error('Failed to create mail transporter');
    }

    const mailOption: SendMailOptions = {
      subject,
      html,
      from: process.env.MAIL_SENDER_FROM!,
      to: receiver,
    };

    await mailTransporter.sendMail(mailOption);
    return;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};
