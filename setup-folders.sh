#!/bin/bash

# Create main directories
mkdir -p src/{components,screens,navigation,context,hooks,utils,assets,styles,services,config,i18n}

# Create subdirectories for components
mkdir -p src/components/{common,layout,forms}

# Create subdirectories for screens
mkdir -p src/screens/{learn,exam,stats,settings,onboarding}

# Create subdirectories for assets
mkdir -p src/assets/{images,icons,fonts}

# Create subdirectories for styles
mkdir -p src/styles/{themes,constants}

# Create subdirectories for services
mkdir -p src/services/{api,auth,storage}

# Create initial placeholder files to maintain structure
touch src/navigation/index.ts
touch src/context/AppContext.tsx
touch src/hooks/useAuth.ts
touch src/styles/theme.ts
touch src/config/constants.ts
touch src/i18n/config.ts 