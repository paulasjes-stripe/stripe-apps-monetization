<svelte:head>
  <script async src="https://js.stripe.com/v3/pricing-table.js"></script>

  <title>Stripe Apps Monetization sample</title>
  <meta name="Sample storefront for Stripe App monetization">
</svelte:head>
<script>
  import createAuth0Client from '@auth0/auth0-spa-js';
  import { 
    PUBLIC_AUTH0_DOMAIN, 
    PUBLIC_AUTH0_CLIENT_ID,
    PUBLIC_STRIPE_PUBLISHABLE_API_KEY,
    PUBLIC_STRIPE_PRICING_TABLE_ID
  } from '$env/static/public';
  import { browser } from '$app/env';

  /**
  * @type {import("@auth0/auth0-spa-js").Auth0Client | undefined}
  */
  let auth0;
  let isLoggedIn = false;

  // Only run this code in the browser
  if (browser) {    
    async function initAuth() {
      auth0 = await createAuth0Client({
        domain: PUBLIC_AUTH0_DOMAIN,
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        redirect_uri: window.location.origin,
      });

      // If `state` and `code` exists in the querystring, that means we've likely been redirected by auth0 and have authenticated
      if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");        
      }

      isLoggedIn = await auth0.isAuthenticated();
    }
    
    initAuth();
  }

  async function onLoginClick() {
    if (auth0 === undefined) return;

    auth0.loginWithRedirect();
  }

  async function onLogoutClick() {
    if (auth0 === undefined) return;

    auth0.logout();
  }
</script>

<div class="container mx-auto font-sans rounded-xl shadow-lg mt-6 flex flex-col divide-y">
  <div class="flex flex-row justify-center content-center items-center ml-16">
    <div class="text-4xl font-bold p-6 text-blue-600">Welcome to the Stripe Apps Monetization demo!</div>
    <div class="relative right-0 flex flex-row gap-4 h-10">      
      {#if isLoggedIn}
        <button on:click={onLogoutClick} class="rounded-lg shadow-md bg-slate-50 px-4">Log out</button>      
      {/if}      
    </div>
  </div>
  
  {#if isLoggedIn}
    <div class="flex justify-center bg-slate-50">    
      <div class="w-7/12 p-4 text-center">
        <p>Choose a tier below to subscribe to the App.</p>
        <p>After checkout you'll be redirected back to the Stripe Dashboard to complete the process.</p>
      </div>
    </div>
    <div class="p-1">      
    <stripe-pricing-table 
      pricing-table-id="{PUBLIC_STRIPE_PRICING_TABLE_ID}" 
      publishable-key="{PUBLIC_STRIPE_PUBLISHABLE_API_KEY}">
    </stripe-pricing-table>
    </div>
  {:else}
    <div class="flex justify-center bg-slate-50">    
      <div class="w-7/12 p-4 text-center">
        <p>Please log in or sign up first.</p>        
      </div>
    </div>    
    <div class="flex justify-center p-4 gap-4">
      <button on:click={onLoginClick} class="rounded-lg shadow-md bg-blue-500 text-white px-3 py-1">Login</button>
      <button>Sign up</button>          
    </div>
  {/if}

  <div class="flex justify-center absolute inset-x-0 bottom-0">
    Made with ❤️ by Stripe
  </div>
</div>
