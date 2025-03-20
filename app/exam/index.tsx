import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ExamScreen() {
  const router = useRouter();

  const startExam = () => {
    router.push('/exam/session');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium">Official Test Simulation</Text>
        
        <View style={styles.infoContainer}>
          <Text variant="bodyLarge">Test Information:</Text>
          <Text variant="bodyMedium">• 33 questions total</Text>
          <Text variant="bodyMedium">• 60 minutes time limit</Text>
          <Text variant="bodyMedium">• Need 17 correct answers to pass</Text>
          <Text variant="bodyMedium">• Questions are randomly selected</Text>
        </View>

        <Button 
          mode="contained" 
          onPress={startExam}
          style={styles.startButton}
        >
          Start Test
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginVertical: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  startButton: {
    marginTop: 20,
    paddingHorizontal: 32,
  },
}); 