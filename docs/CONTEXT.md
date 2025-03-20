# App Structure Documentation

## 1. Overview

This app is designed for practicing the Einbuergerungstest (German Citizenship Test).

### Tech Stack
- **Frontend**: React Native with TypeScript, Expo, and Expo Router
- **Backend**: Supabase
- **UI Framework**: React Native Paper
- **AI Integration**: DeepSeek

### Core Features
- Learn Mode
- Exam Simulation
- Statistics Tracking
- Personalized Settings

## 2. User Experience Flow

### A. Onboarding
- Region/State selection
- Language preference

### B. Main Navigation
1. Learn Section
2. Exam Section
3. Stats Section
4. Settings Sectio
n
## 3. Feature Details

### A. Learn Section
**Purpose**: Interactive question practice

#### Study Modes
- Comprehensive Practice (All Questions)
- New Questions
- Saved Questions Review
- Error Analysis (Failed Questions)

#### Features
- Category-based filtering
- Progress tracking
- Spaced repetition system
- Detailed explanations
- Save/Bookmark functionality
- **Translations**: Multi-language support for questions and answers
- **Explanations**: In-depth explanations for each question and answer
- **Translations and Explanations During Learning**: Support for displaying translations and explanations for each question and answer during practice sessions

### B. Exam Section
**Purpose**: Authentic test simulation

#### Exam Features
- Randomized question selection
- 60-minute countdown timer
- Real-time progress tracking
- Question navigation system
- Comprehensive results analysis
- **Translations**: Multi-language support for exam questions and answers
- **Explanations**: Detailed explanations provided post-exam for each question

#### Exam Flow
1. Pre-exam briefing
2. Timed examination
3. Auto-submission
4. Results breakdown
5. Performance analysis
6. **Explanations**: Post-exam review with explanations for each question

### C. Stats Section
**Purpose**: Comprehensive progress monitoring

#### Analytics Features
- Performance metrics
- Progress visualization
- Category-wise analysis
- Exam readiness indicator
- Learning pattern insights

#### Data Visualization
- Interactive charts
- Progress timelines
- Strength/weakness analysis
- Achievement tracking

### D. Settings Section
**Purpose**: Personalization and configuration

#### Configuration Options
- Account management
- Premium features
- Regional settings
- Accessibility options
- Theme customization
- Notification preferences
- **Language Settings**: Choose preferred language for translations

## 4. Technical Architecture

### Frontend Architecture
- Component hierarchy
- State management
- Navigation structure
- Offline capabilities

### Backend Services
- Data synchronization
- Performance optimization
- Cache management
- Analytics tracking

### Database Schema
- **Question Bank**: Stores all questions, answers, categories, and translations.
  - `questions`: id, text, category_id, difficulty, created_at
  - `answers`: id, question_id, text, is_correct
  - `categories`: id, name
  - `translations`: id, question_id, language, translated_text

- **Progress Tracking**: Tracks user progress and performance.
  - `user_progress`: id, user_id, question_id, status, last_attempted_at
  - `exam_results`: id, user_id, score, date_taken, duration

- **Performance Metrics**: Stores analytics data for user performance.
  - `performance_metrics`: id, user_id, metric_type, value, recorded_at

- **Settings Storage**: Stores user-specific settings and preferences.
  - `user_settings`: id, user_id, language, theme, notifications_enabled

### Optimal Folder Structure
- **/components**: Reusable UI components.
- **/screens**: Main app screens.
- **/navigation**: Navigation setup and configuration.
- **/context**: Context API for state management.
- **/hooks**: Custom hooks.
- **/utils**: Utility functions.
- **/assets**: Static assets like images and icons.
- **/styles**: Global styles and theming.
- **/services**: API and authentication services.
- **/config**: Configuration files.
- **/i18n**: Internationalization setup.


