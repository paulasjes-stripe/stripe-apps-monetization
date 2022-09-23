import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripe:Stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
  apiVersion: '2022-08-01',
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send('Hello');
});

async function getCustomer(accountId: string): Promise<Stripe.ApiSearchResult<Stripe.Customer>> {
  return await stripe.customers.search({
    query: `metadata['account_id']:'${accountId}'`,
  });
}
// Middleware to verify the signature
function verifySignature(req: Request, res: Response, next: NextFunction) {
  const accountId:string = req.body['account_id'];
  const sig:string = req.headers['stripe-signature'] as string;

  // Retrieve user id and account id from the request body
  const payload = JSON.stringify({
    user_id: req.body['user_id'],
    account_id: accountId,
  });  

  try {
    // Verify the payload and signature from the request with the app secret.
    stripe.webhooks.signature.verifyHeader(payload, sig, process.env.STRIPE_APP_SECRET as string);
  } catch (error: any) {
    console.log(error.message );
    return res.status(400).send('Something went wrong');
  }

  next();
}

app.post('/api/buy', verifySignature, async (req, res) => {  
  const accountId:string = req.body['account_id'];  

  const account:Stripe.Account = await stripe.accounts.retrieve(accountId);

  const customerList:Stripe.ApiSearchResult<Stripe.Customer> = await getCustomer(accountId);

  let customer:Stripe.Customer;

  // If the customer doesn't exist, create one
  if (customerList.data.length === 0) {
    customer = await stripe.customers.create({
      name: account.business_profile ? account.business_profile.name as string : account.id,
      email: account.email || '',
      metadata: {
        account_id: account.id
      }
    });
  } else {
    customer = customerList.data[0];
  }
  
  const priceId:string = process.env.PRICE_ID as string;

  const session:Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],    
    success_url: `https://dashboard.stripe.com/test/dashboard?open_drawer_app=${process.env.STRIPE_APP_ID}`,
    cancel_url: `https://dashboard.stripe.com/test/dashboard?open_drawer_app=${process.env.STRIPE_APP_ID}`,
  });

  return res.status(200).json({url: session.url})
});

app.post('/api/subscription', verifySignature, async (req, res) => {    
  const accountId:string = req.body['account_id'];
  const customerList:Stripe.ApiSearchResult<Stripe.Customer> = await getCustomer(accountId);

  // If this is a new customer, return early
  if (customerList.data.length === 0) {
    return res.status(200).json({isActive: false});
  }

  const customer:Stripe.Customer = customerList.data[0];

  const subscriptions:Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    limit: 1,
  });

  const hasActive:boolean = subscriptions.data.length > 0;

  return res.status(200).json({isActive: hasActive})
});

app.post('/api/subscription/manage', verifySignature, async (req, res) => {  
  const accountId:string = req.body['account_id'];

  // Retrieve the customer
  const customerList:Stripe.ApiSearchResult<Stripe.Customer> = await getCustomer(accountId);

  if (customerList.data.length === 0) {
    return res.status(404).json({
      error: 'Customer not found',
    });
  }

  const customer:Stripe.Customer = customerList.data[0];
  console.log('customer', customer);

  const session:Stripe.BillingPortal.Session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `https://dashboard.stripe.com/test/settings/apps/${process.env.STRIPE_APP_ID}`,
  });

  res.status(200).json({url: session.url})
});

app.listen(3000, () => console.log('Backend running on port 3000'));