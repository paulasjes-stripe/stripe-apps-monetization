import { Banner, Box, Button, ContextView, Icon, Inline, Link, Spinner } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import fetchStripeSignature from '@stripe/ui-extension-sdk/signature';
import { useEffect, useState } from "react";

const HomeOverviewView = ({userContext}: ExtensionContextValue) => {
  const [hasActiveSubscription, setActiveSubscription] = useState<boolean>(false);
  const [checkoutURL, setCheckoutURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const BACKEND_URL = 'http://localhost:3000';

  const payload = JSON.stringify({
    user_id: userContext?.id,
    account_id: userContext?.account.id,
  });  

  const fetchCheckout = async () => {    
    try {      
      const response = await fetch(`${BACKEND_URL}/api/buy`, {
        method: 'POST',
        headers: {          
          'Content-Type': 'application/json',
          'Stripe-Signature': await fetchStripeSignature(),
        },
        body: payload,
      }); 
      
      const body = await response.json();

      const checkoutUrl = body.url;

      setCheckoutURL(checkoutUrl);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatus = async () => {    
    try {
      const response = await fetch(`${BACKEND_URL}/api/subscription`, {
        method: 'POST',
        headers: {          
          'Content-Type': 'application/json',
          'Stripe-Signature': await fetchStripeSignature(),
        },
        body: payload,
      }); 
      
      const body = await response.json();

      setActiveSubscription(body.isActive);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Only fetch the Checkout Session URL if we don't have an active subscription
    if (!hasActiveSubscription) {
      fetchCheckout();
    } else {
      setLoading(false);
    }
  }, []);

  return (    
    <ContextView
      title="Monetization example"
      externalLink={{
        label: "View docs",
        href: "https://stripe.com/docs/stripe-apps",
      }}
    >
      <Box css={{        
        padding: "large",        
        stack: "y",
        gap: "medium",
        wrap: "wrap",        
      }}>        
        {loading ? (
          <Spinner />          
        ) : (
          !hasActiveSubscription && (
            <Box css={{marginTop: 'large', marginBottom: 'large'}}>
              <Banner
                type="caution"
                title="Subscription required"
                description="A subscription is required to use this app"
                actions={
                  checkoutURL && (
                    <Button css={{width: 'fill', alignX: 'center'}} type="primary" href={checkoutURL}>Sign up</Button>)                  
                }
              />      
            </Box>
          )
        )}
        
        {hasActiveSubscription && !loading && (
          <Box css={{
            marginTop: 'xlarge',
            padding: 'medium',
            background: 'container',
            borderRadius: 'medium',
          }}>
            <Box css={{stack: 'y', gap: 'medium', distribute: 'space-between', alignY: 'center', width: 'fill'}}>
              <Box css={{ fontWeight: 'semibold' }}>Thanks for signing up!</Box>
              <Box>This user now has access to the rest of the Stripe App</Box>              
              <Link href="https://dashboard.stripe.com/test/apps/settings-preview">Manage your subscription in the settings page</Link>
            </Box>
          </Box>
        )}
      </Box>      
    </ContextView>    
  );
};

export default HomeOverviewView;
