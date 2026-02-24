import { useState, useEffect } from 'react';
import { Button, TextInput } from 'react-native';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import './i18n';
import { useTranslation } from 'react-i18next';
// import type { FirebaseAuthTypes } from 'firebase/auth';

function App() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState<ConfirmationResult | null>(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  // Handle login
  function handleAuthStateChanged(user: any) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function handleSignInWithPhoneNumber(phoneNumber: string) {
    const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    if (!confirm) {
      console.log('No confirmation available.');
      return;
    }
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (!confirm) {
    return (
      <Button
        title="Phone Number Sign In"
        onPress={() => handleSignInWithPhoneNumber('+91 9049826205')}
      />
    );
  }

  return (
    <>
      <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </>
  );
}

export default App;