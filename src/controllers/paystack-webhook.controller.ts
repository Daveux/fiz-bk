import * as crypto from "crypto";
import { Request, Response } from "express";
import logger from "../utils/logger";
import formatLog from "../utils/logger/formatLog";
import sendMail from "../utils/mail";
import { successResponse } from "../utils/responses";
import asyncHandler from "../middleware/async";

import {paystackConfig, bibleStudyLink, bibleStudyRef, echoesOfHopeLink, echoesOfHopeRef, fromEmail} from "../config";

const paystackWebhook = asyncHandler(async (req: Request, res: Response) => {

  logger.info(formatLog(req, "START: Paystack Webook Service "));
  const { body } = req;
  const hash = crypto
    .createHmac("sha512", paystackConfig.secretKey as string)
    .update(JSON.stringify(body))
    .digest("hex");
  if (hash === req.headers["x-paystack-signature"]) {

    const paymentEvent = body.event;

    const { referrer } = body.data.metadata;
    const { email } = body.data.customer

    let transaction;

    if (paymentEvent === "charge.success") {
        logger.info(formatLog(req, "Payment Successful"));
        const EMAIL_TEXT = "Dear reader, partner and friend,\n" +
            "\n" +
            "Reading is the gateway to knowledge and as we all know, knowledge is power. \n" +
            "Congratulations on your purchasing of this book. I trust it helps you on your journey. \n" +
            "Cheers 🥂 \n" +
            "To many more partnerships!!!\n" +
            "\n" +
            "Please kindly find your copy of the book attached below \n \n" +
            "Signed\n" +
            "Taiwo Fisola\n" +
            "Director At Fizzlezbooks"
        if (referrer === bibleStudyRef) {
            sendMail({
                to: email,
                from: `Fizzlez Books<${fromEmail}>`,
                subject: 'Congratulations on your Purchase!',
                text: EMAIL_TEXT,
                attachments: [{
                    content: String.raw`${__dirname}/../../files/What is Bible Study.pdf`,
                    filename: "What is Bible Study.pdf",
                    type: "application/pdf",
                    disposition: "attachment"
                }]
            });
            logger.info(formatLog(req, "END: Paystack Webook Service "));
            return successResponse(res, 200, "Successfully processed webhook");
        }
        if (referrer === echoesOfHopeRef) {
            sendMail({
                to: email,
                from: `Fizzle Books<${fromEmail}>`,
                subject: 'Congratulations on your Purchase!',
                text: EMAIL_TEXT,
                attachments: [{
                    content: String.raw`${__dirname}/../../files/Echoes of Hope.pdf`,
                    filename: "Echoes of Hope.pdf",
                    type: "application/pdf",
                    disposition: "attachment"
                }]
            });
            logger.info(formatLog(req, "END: Paystack Webhook Service "));
            return successResponse(res, 200, "Successfully processed webhook");
        }
    }
    }
    logger.info(formatLog(req, "END: Paystack Webook Service "));
    return successResponse(res, 200, "Successfully processed webhook");
});

export default paystackWebhook;
