import { Router } from 'express';
import paystackWebhook from "../controllers/paystack-webhook.controller";

const webhookRouter = Router();

webhookRouter.post("/webhook", paystackWebhook)

export default webhookRouter;