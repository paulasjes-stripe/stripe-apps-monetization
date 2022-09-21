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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_API_KEY, {
    apiVersion: '2022-08-01',
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send('Hello');
}));
app.post('/api/buy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('buy');
    const accountId = req.body['account_id'];
    const account = yield stripe.accounts.retrieve(accountId);
    const customerList = yield stripe.customers.search({
        query: `metadata['account_id']:'${accountId}'`,
    });
    let customer;
    // If the customer doesn't exist, create one
    if (customerList.data.length === 0) {
        customer = yield stripe.customers.create({
            name: account.business_profile ? account.business_profile.name : account.id,
            email: account.email || '',
            metadata: {
                account_id: account.id
            }
        });
    }
    else {
        customer = customerList.data[0];
    }
    const priceId = process.env.PRICE_ID;
    const session = yield stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customer.id,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `https://dashboard.stripe.com/test/settings/apps/${process.env.STRIPE_APP_ID}`,
        cancel_url: `https://dashboard.stripe.com/test/settings/apps/${process.env.STRIPE_APP_ID}`,
    });
    return res.status(200).json({ url: session.url });
}));
app.post('/api/subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = req.body['account_id'];
    const customerList = yield stripe.customers.search({
        query: `metadata['account_id']:'${accountId}'`,
    });
    // If this is a new customer, return early
    if (customerList.data.length === 0) {
        return res.status(200).json({ isActive: false });
    }
    const customer = customerList.data[0];
    const subscriptions = yield stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1,
    });
    const hasActive = subscriptions.data.length > 0;
    res.status(200).json({ isActive: hasActive });
}));
app.listen(3000, () => console.log('Backend running on port 3000'));
