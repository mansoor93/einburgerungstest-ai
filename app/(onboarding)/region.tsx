import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import { useRouter } from 'expo-router';

const REGIONS = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
];

export default function RegionScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Select Your Region</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Choose your state to get region-specific questions
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {REGIONS.map((region) => (
          <List.Item
            key={region}
            title={region}
            onPress={() => {
              // TODO: Save region selection
              router.push('/(onboarding)/language');
            }}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        ))}
      </ScrollView>
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
    backgroundColor: '#fff',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
}); 