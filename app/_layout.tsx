import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Initialize Convex client
// You'll get this URL after running: npx convex dev
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ConvexProvider>
  );
}