import { Banner, Box, Button, ContextView, Icon, Inline, Link, Spinner } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect, useState } from "react";

const HomeOverviewView = ({userContext}: ExtensionContextValue) => {
  const [hasActiveSubscription, setActiveSubscription] = useState<boolean>(false);
  const [checkoutURL, setCheckoutURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const BACKEND_URL = 'http://localhost:3000';

  const fetchCheckout = async () => {    
    try {      
      const response = await fetch(`${BACKEND_URL}/api/buy`, {
        method: "POST",
        headers: {          
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: userContext?.account.id,
        }),
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
        method: "POST",
        headers: {
          // "Stripe-Signature": await fetchStripeSignature(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify( {
          account_id: userContext?.account.id,
        }),
      }); 
      const body = await response.json();

      setActiveSubscription(body.isActive);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchCheckout();
  }, []);

  return (    
    <ContextView
      title="Welcome"
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
        
        {hasActiveSubscription && (
          <Box css={{
            marginTop: 'xlarge',
            padding: 'medium',
            background: 'container',
            borderRadius: 'medium',
          }}>
            <Box css={{stack: 'x', distribute: 'space-between', alignY: 'center', width: 'fill'}}>
              <Link  href="customers"><Inline>Customers</Inline></Link>
              <Box css={{ color: "info"}}>
                <Icon name="next" />
              </Box>
            </Box>
          </Box>
        )}
      </Box>      
    </ContextView>    
  );
};

export default HomeOverviewView;
