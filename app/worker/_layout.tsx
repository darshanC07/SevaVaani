import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
      <Stack.Screen name="SendRequest" options={{ headerShown: false }} />
      <Stack.Screen name="ConfirmRequest" options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" options={{ headerShown: false }} />
      <Stack.Screen name="Requests" options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
      {/* <Stack.Screen name="OTPScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EmailScreen" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
