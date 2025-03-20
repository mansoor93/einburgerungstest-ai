import { View, StyleSheet } from 'react-native';
import { Text, List, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const LANGUAGES = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ar', name: 'العربية' },
];

export default function LanguageScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Select Your Language</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Choose your preferred language for translations
        </Text>
      </View>

      <View style={styles.content}>
        {LANGUAGES.map((language) => (
          <List.Item
            key={language.code}
            title={language.name}
            onPress={() => {
              // TODO: Save language selection
              router.replace('/(tabs)');
            }}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={() => router.back()}
        >
          Back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
}); 