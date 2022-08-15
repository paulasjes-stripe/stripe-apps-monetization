import { Box, Button, ContextView, Inline } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useEffect } from "react";

const HomeOverviewView = ({userContext, environment}: ExtensionContextValue) => {
  useEffect(() => {
    // TODO check secret store for OAuth token
    // if not available, do OAuth dance
  });

  const onLoginPress = () => {
    console.log('log in');
  };

  const onSignUpPress = () => {
    console.log('sign up');
  };

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
        <Button css={{width: "fill", alignX: "center"}} type="primary" size="large" onPress={(e) => {onLoginPress()}}>Log in</Button>
        <Button css={{width: "fill", alignX: "center"}} type="secondary" size="large" onPress={(e) => {onSignUpPress()}}>Sign up</Button>
      </Box>      
    </ContextView>
  );
};

export default HomeOverviewView;
