import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  questions: {
    id: number;
    text: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export default function ExamResults() {
  const router = useRouter();
  const params = useLocalSearchParams<{ results: string }>();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (params.results) {
      try {
        const parsedResults = JSON.parse(params.results);
        setResult(parsedResults);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
    setLoading(false);
  }, [params.results]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  if (loading || !result) {
    return (
      <View style={styles.container}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text variant="headlineMedium">
            {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            {result.passed 
              ? 'You passed the exam!'
              : 'You didn\'t pass this time, but don\'t give up!'}
          </Text>
        </View>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="titleLarge">{result.correctAnswers}</Text>
                <Text variant="bodyMedium">Correct</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </Text>
                <Text variant="bodyMedium">Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">{formatTime(result.timeSpent)}</Text>
                <Text variant="bodyMedium">Time</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.questionsSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Question Review
          </Text>

          {result.questions.map((question, index) => (
            <Card 
              key={question.id} 
              style={[
                styles.questionCard,
                { borderLeftColor: question.isCorrect ? '#4CAF50' : '#F44336' }
              ]}
            >
              <Card.Title
                title={`Question ${index + 1}`}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon={expandedQuestions.includes(question.id) ? "chevron-up" : "chevron-down"}
                    onPress={() => toggleQuestion(question.id)}
                  />
                )}
              />
              {expandedQuestions.includes(question.id) && (
                <Card.Content>
                  <Text variant="bodyMedium">{question.text}</Text>
                  <View style={styles.answerSection}>
                    <Text variant="bodyMedium" style={styles.answerLabel}>
                      Your answer: {question.userAnswer}
                    </Text>
                    <Text variant="bodyMedium" style={styles.answerLabel}>
                      Correct answer: {question.correctAnswer}
                    </Text>
                  </View>
                  {question.explanation && (
                    <Text variant="bodySmall" style={styles.explanation}>
                      {question.explanation}
                    </Text>
                  )}
                </Card.Content>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          mode="contained"
          onPress={() => router.push('/(tabs)/exam')}
          style={styles.button}
        >
          Back to Exam
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
    padding: 16,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  summaryCard: {
    margin: 16,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  questionsSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  questionCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  answerSection: {
    marginTop: 12,
  },
  answerLabel: {
    marginVertical: 4,
  },
  explanation: {
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    width: '100%',
  },
}); 