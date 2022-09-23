# stripe-apps-monetization
This sample app shows how monetize your Stripe App by checking if the user paid, and if not prompt them to subscribe to the service before they can use it.

It uses Stripe Checkout and the Customer Portal to create and manage the subscription, while using [metadata](https://stripe.com/docs/api/metadata) to track the user's status.

## Set up
In the root folder, install dependencies by running
```
yarn
```

Then, in the `backend` directory`, install dependencies there

```
cd src/backend && yarn
```

Still in the `backend` directory, copy the `.env` example and populate with your Stripe API key, Price ID and app name
```
cp .env.example .env
```

```
// Your Stripe secret API key, which you can find on the dashboard
STRIPE_SECRET_API_KEY=sk_test_123

// The ID of the recurring price you want to use. You can create new Prices in the dashboard.
PRICE_ID=price_123

// Your app ID. You can find this in `stripe-app.json` under `id`.
STRIPE_APP_ID=com.example.your-app-name
```

## Running the sample

Start the backend server in the `src/backend` directory
```
yarn start
```

Start the Stripe App back in the root directory
```
stripe apps start
```

In your browser, click the "Sign up" button to be redirected to a new Checkout Session where you can subscribe to the app. To unsubscribe, use the "Manage" button in the app settings page to launch the Customer Portal.

## Development

Start the backend server in watch mode
```
yarn run dev
```

This will automatically compile the TypeScript code and restart the dev server

Start the Stripe App in the root directory
```
stripe apps start
```