<svelte:head>
  <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<div class="container mx-auto font-sans rounded-xl shadow-lg mt-6 flex flex-col divide-y">
  <div class="flex justify-center">
    <div class="text-4xl font-bold p-6 text-blue-600">Welcome to the Stripe Apps Monetization demo!</div>
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
</div>
