import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type StudyMode = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
};

const STUDY_MODES: StudyMode[] = [
  {
    id: 'all',
    title: 'Comprehensive Practice',
    description: 'Practice all available questions',
    icon: 'book-open-variant',
    route: '/learn/comprehensive',
  },
  {
    id: 'new',
    title: 'New Questions',
    description: 'Focus on questions you haven\'t seen before',
    icon: 'star-outline',
    route: '/learn/new',
  },
  {
    id: 'saved',
    title: 'Saved Questions',
    description: 'Review your bookmarked questions',
    icon: 'bookmark-outline',
    route: '/learn/saved',
  },
  {
    id: 'mistakes',
    title: 'Error Analysis',
    description: 'Practice questions you\'ve answered incorrectly',
    icon: 'alert-circle-outline',
    route: '/learn/mistakes',
  },
];

export default function LearnScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Learn Mode
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Choose your study mode to begin practicing
        </Text>
      </View>

      <View style={styles.grid}>
        {STUDY_MODES.map((mode) => (
          <Card
            key={mode.id}
            style={styles.card}
            onPress={() => router.push(mode.route)}
          >
            <Card.Content style={styles.cardContent}>
              <MaterialCommunityIcons
                name={mode.icon}
                size={32}
                color={theme.colors.primary}
                style={styles.icon}
              />
              <Text variant="titleMedium" style={styles.cardTitle}>
                {mode.title}
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                {mode.description}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  grid: {
    padding: 12,
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  cardContent: {
    padding: 16,
  },
  icon: {
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    opacity: 0.7,
  },
}); 