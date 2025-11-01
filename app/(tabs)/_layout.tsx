import { Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the default header
        tabBarStyle: {
          display: 'none', // Hide tab bar for now
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todo',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}