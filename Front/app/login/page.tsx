"use client";

import React, { useState } from "react";
import {
  Container,
  SignUpContainer,
  SignInContainer,
  Form,
  Title,
  Input,
  Button,
  GhostButton,
  Anchor,
  Anchor1,
  OverlayContainer,
  Overlay,
  LeftOverlayPanel,
  RightOverlayPanel,
  Paragraph,
} from "../components/Components";

const login: React.FC = () => {
  const [signIn, toggle] = useState(true);

  return (
    <Container>
      <SignUpContainer signinIn={signIn}>
        <Form>
          <h1 className="font-bold m-0 text-black">Create Account</h1>
          <Input type="text" placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Input type="password" placeholder="Confirm Password" />
          <Button>Sign Up</Button>
        </Form>
      </SignUpContainer>

      <SignInContainer signinIn={signIn}>
        <Form>
          <h1 className="font-bold m-0 text-black">Sign in</h1>
          <Input type="text" placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Button>
            <Anchor1 href="/#">Log In with your Intra</Anchor1>
          </Button>
          <Anchor href="/#">Forgot your password?</Anchor>
          <Button>Sign In</Button>
        </Form>
      </SignInContainer>

      <OverlayContainer signinIn={signIn}>
        <Overlay signinIn={signIn}>
          <LeftOverlayPanel signinIn={signIn}>
            <Title>Welcome Back!</Title>
            <Paragraph>Login with your personal info</Paragraph>
            <GhostButton onClick={() => toggle(true)}>Sign In</GhostButton>
          </LeftOverlayPanel>

          <RightOverlayPanel signinIn={signIn}>
            <Title>Hello, Friend!</Title>
            <Paragraph>
              Enter your personal details and start your journey with us
            </Paragraph>
            <GhostButton onClick={() => toggle(false)}>Sign Up</GhostButton>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};

export default login;