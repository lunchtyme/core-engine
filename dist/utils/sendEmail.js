"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const handlebars_converter_1 = require("handlebars-converter");
const node_path_1 = __importDefault(require("node:path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMAIL_TEMPLATE_DEFAULTS = {
    metaData: {
        currentYear: new Date().getFullYear(),
    },
};
const rootDir = process.cwd();
// Initialize the handlebar converter class
const hbsConverter = new handlebars_converter_1.HandlebarsConverter({
    templateDirPath: node_path_1.default.join(rootDir, './templates/contents'),
    partialDirPath: node_path_1.default.join(rootDir, './templates/partials'),
});
const sendEmail = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiver, subject, template, context, from } = params;
        if (!receiver ||
            typeof receiver !== 'string' ||
            receiver === '' ||
            !EMAIL_REGEX.test(receiver)) {
            throw new Error('Provide a valid receiver email address');
        }
        if (!subject || typeof subject !== 'string' || subject === '') {
            throw new Error('Email subject is required');
        }
        if (!template || typeof template !== 'string' || template === '') {
            throw new Error('Provide an email template name');
        }
        // Compile the handlebars code into html string
        const html = yield hbsConverter.compile({
            context: Object.assign(Object.assign({}, EMAIL_TEMPLATE_DEFAULTS.metaData), context),
            templateName: template,
        });
        const mailTransporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: false,
            priority: 'high',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        if (!mailTransporter) {
            logger_1.default.error('Error creating mail transporter:');
            throw new Error('Failed to create mail transporter');
        }
        let sender = process.env.MAIL_SENDER_FROM;
        if (from) {
            sender = from;
        }
        const mailOption = {
            subject,
            html,
            from: sender,
            to: receiver,
        };
        yield mailTransporter.sendMail(mailOption);
        return;
    }
    catch (error) {
        logger_1.default.error('Error sending email:', error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
