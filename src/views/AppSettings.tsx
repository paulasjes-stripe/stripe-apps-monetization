import {
  Box,
  Button,
  ButtonGroup,
  SettingsView,
  Spinner,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect, useState } from "react";
import fetchStripeSignature from "@stripe/ui-extension-sdk/signature";

const AppSettings = ({userContext, environment}: ExtensionContextValue) => {
  const [hasActiveSubscription, setActiveSubscription] = useState<boolean>(false);
  const [customerPortalURL, setCustomerPortalURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const BACKEND_URL = 'http://localhost:3000';

  const payload = JSON.stringify({
    user_id: userContext?.id,
    account_id: userContext?.account.id,
  });

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

  const fetchCustomerPortal = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subscription/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Stripe-Signature': await fetchStripeSignature(),
        },
        body: payload,
      });

      const body = await response.json();

      setCustomerPortalURL(body.url);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (!hasActiveSubscription) {
      fetchCustomerPortal();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <SettingsView onSave={()=>{}}>
      <Box
        css={{          
          borderRadius: "medium",
          padding: "large",
        }}>
        <Box css={{ stack: 'y', gap: 'small', paddingBottom: 'large' }}>
          <Box css={{ fontWeight: 'semibold' }}>Manage subscription</Box>
          <Box>Use the button below to manage or cancel your subscription</Box>
        </Box>        
        {loading ? (
          <Spinner />
        ) : (          
          hasActiveSubscription ? (
            <ButtonGroup>
              <Button type="primary" href={customerPortalURL}>Manage</Button>                     
            </ButtonGroup>
          ) : (
            <Box>No subscription detected</Box>
          )
        )}        
      </Box>
    </SettingsView>
  );
};

export default AppSettings;
