#!/bin/bash

# Install core dependencies
npm install expo
npm install react-native
npm install react-native-paper
npm install @react-navigation/native
npm install @react-navigation/native-stack

# Install Expo specific packages
npx expo install expo-router
npx expo install expo-linking
npx expo install expo-constants
npx expo install expo-status-bar
npx expo install expo-localization

# Install Supabase
npm install @supabase/supabase-js

# Install UI and styling dependencies
npm install react-native-safe-area-context
npm install react-native-screens
npm install react-native-vector-icons
npx expo install react-native-svg

# Install utility libraries
npm install i18next
npm install react-i18next
npm install date-fns
npm install zustand

# Install dev dependencies
npm install --save-dev typescript
npm install --save-dev @types/react
npm install --save-dev @types/react-native
npm install --save-dev @types/jest
npm install --save-dev babel-plugin-module-resolver
npm install --save-dev @babel/core 