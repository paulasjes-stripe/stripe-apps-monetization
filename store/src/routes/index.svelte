<svelte:head>
  <script async src="https://js.stripe.com/v3/pricing-table.js"></script>

  <title>Stripe Apps Monetization sample</title>
  <meta name="Sample storefront for Stripe App monetization">
</svelte:head>
<script>
  import createAuth0Client from '@auth0/auth0-spa-js';
  import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID } from '$env/static/public';
  import { onMount } from 'svelte';

  let auth0;
  let isLoggedInPromise;
  onMount(async () => {
    auth0 = await createAuth0Client({
      domain: PUBLIC_AUTH0_DOMAIN,
      client_id: PUBLIC_AUTH0_CLIENT_ID,
      redirect_uri: window.location.origin,
    });

    isLoggedInPromise = auth0.isAuthenticated();

    if (location.search.includes("state=") && 
        (location.search.includes("code=") || 
        location.search.includes("error="))) {
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");

      const profile = await auth0.getUser();

      console.log(profile);
    }
  });
  
  async function onLoginClick() {
    if (auth0 === undefined) return;

    auth0.loginWithRedirect();
  }
</script>

<div class="container mx-auto font-sans rounded-xl shadow-lg mt-6 flex flex-col divide-y">
  <div class="flex flex-row justify-center content-center items-center ml-16">
    <div class="text-4xl font-bold p-6 text-blue-600">Welcome to the Stripe Apps Monetization demo!</div>
    <div class="relative right-0 flex flex-row gap-4 h-10">
      {#await isLoggedInPromise}
        <div></div>
      {:then isLoggedIn}
        {#if isLoggedIn}
          <button>Log out</button>
        {:else}
          <button on:click={onLoginClick} class="rounded-lg shadow-md bg-blue-500 text-white px-4">Login</button>
          <button>Sign up</button>
        {/if}
      {/await}
    </div>
  </div>
  <div class="flex justify-center bg-slate-50">    
    <div class="w-7/12 p-4 text-center">
      <p>Choose a tier below to subscribe to the App.</p>
      <p>After checkout you'll be redirected back to the Stripe Dashboard to complete the process.</p>
    </div>
  </div>

  <div class="p-1">
    <stripe-pricing-table 
      pricing-table-id="prctbl_1LXNRHGUcADgqoEMM8anhaL6"
      publishable-key="pk_test_51KrJdMGUcADgqoEMKiaRg10xK1Ex9ucakQh5ppDOBqXw2gbkVCtNuXw2FQesnmuENuuznSooOgjFqPQG9nGoMMqZ003YtcveTA"
    >
    </stripe-pricing-table>
  </div>

  <div class="flex justify-center absolute inset-x-0 bottom-0">
    Made with ❤️ by Stripe
  </div>
</div>
