import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  Inline,
  Link,
  SettingsView,
  Spinner,
} from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect, useState } from "react";

const AppSettings = ({userContext, environment}: ExtensionContextValue) => {
  const [hasActiveSubscription, setActiveSubscription] = useState<boolean>(false);
  const [customerPortalURL, setCustomerPortalURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const BACKEND_URL = 'http://localhost:3000';

  const fetchStatus = async () => {    
    try {
      const response = await fetch(`${BACKEND_URL}/api/subscription`, {
        method: 'POST',
        headers: {          
          'Content-Type': 'application/json',
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

  const fetchCustomerPortal = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subscription/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          account_id: userContext?.account.id,
        }),
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
          <Box>Use the buttons below to manage or cancel your subscription</Box>
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
