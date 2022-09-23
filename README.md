# stripe-apps-monetization
This sample app shows how monetize your Stripe App by checking if the user paid, and if not prompt them to subscribe to the service before they can use it.

It uses Stripe Checkout and the Customer Portal to create and manage the subscription, while using [metadata](https://stripe.com/docs/api/metadata) to track the user's status.

View without subscription             |  View with subscription
:-------------------------:|:-------------------------:
<img width="317" alt="Screenshot 2022-09-23 at 13 01 14" src="https://user-images.githubusercontent.com/46610432/191947047-da6bc9eb-7a6e-4600-9d41-6ef1a5afdf64.png">  |  <img width="322" alt="Screenshot 2022-09-23 at 13 01 39" src="https://user-images.githubusercontent.com/46610432/191947064-73715f05-9972-4dfd-8ccd-f3034f791f6c.png">


## Set up
In the root folder, install dependencies by running
```
yarn
```

Next, obtain the app signing secret by uploading your app. This will just install the app on your Stripe account, it can be uninstalled at any time.

**Note: To upload an app successfully its ID needs to be unique (similar to npm packages).** Either rename the ID in `stripe-app.json` to something unique or use the supplied script to randomly generate a new ID for both `stripe-app.json` and `package.json`:

```
npm run unique-id
```

Once you have a unique ID, upload the app with:

```
stripe apps upload
```

Note the app signing secret in the context menu on the right:

![Screenshot 2022-09-23 at 15 29 33](https://user-images.githubusercontent.com/46610432/191988965-e420a134-9250-40c1-bb14-5dad1f9d98c0.png)

Then, in the `backend` directory, install dependencies there

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

// The app signing secret, which you can get from the dashboard after uploading the app using `stripe apps upload`
STRIPE_APP_SECRET=absec_123
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
