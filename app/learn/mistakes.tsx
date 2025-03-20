import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { db, Question } from '../../config/supabase';
import QuestionList from '../../components/QuestionList';

export default function MistakesAnalysis() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      // TODO: Replace with actual user ID
      const userId = 'test-user';
      const progress = await db.userProgress.get(userId);
      
      // Get questions that are in 'reviewing' status
      const reviewingQuestionIds = progress
        .filter(p => p.status === 'reviewing')
        .map(p => p.question_id);
      
      if (reviewingQuestionIds.length > 0) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .in('id', reviewingQuestionIds);
          
        if (error) throw error;
        setQuestions(data);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSelect = (question: Question) => {
    router.push({
      pathname: '/learn/question/[id]',
      params: { id: question.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Error Analysis</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {questions.length} questions to review
        </Text>
      </View>

      {questions.length > 0 ? (
        <QuestionList 
          questions={questions}
          onSelectQuestion={handleQuestionSelect}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge">No questions to review</Text>
          <Text variant="bodyMedium" style={styles.emptyStateSubtitle}>
            Questions you answer incorrectly will appear here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateSubtitle: {
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
}); 