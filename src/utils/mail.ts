import sgMail from "@sendgrid/mail";
import logger from "./logger";
import fs from "fs";
import {sendGridApiKey} from "../config";

export interface emailMsg {
    to: string | string[],
    from: string,
    subject: string,
    text: string,
    html?: string,
    attachments: [{
        content: string;
        filename: string;
        type: string;
        disposition: string;
    }]
}

async function sendMail(data: emailMsg) {
    try {
        data.attachments[0].content = fs.readFileSync(data.attachments[0].content).toString("base64");
        sgMail.setApiKey(sendGridApiKey);
        const response = await sgMail.send({ ...data });

        logger.info(`Email response ${JSON.stringify(response)}`);
    } catch (error) {
        logger.error(error);
    }
}

export default sendMail;