import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { db, Question } from '../../config/supabase';
import QuestionList from '../../components/QuestionList';
import { supabase } from '../../config/supabase';

export default function ComprehensivePractice() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      console.log('Loading questions...');
      
      // First, try a simple count query
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      
      console.log('Question count:', count);

      // Then fetch the full data
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          category_id,
          difficulty,
          explanation,
          answers (
            id,
            text,
            is_correct
          )
        `);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Questions loaded:', {
        count: data?.length,
        firstQuestion: data?.[0],
        allQuestions: data
      });

      setQuestions(data || []);
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
        <Text variant="headlineSmall">Comprehensive Practice</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {questions.length} questions available
        </Text>
      </View>

      {questions.length > 0 ? (
        <QuestionList 
          questions={questions}
          onSelectQuestion={handleQuestionSelect}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge">No questions available</Text>
          <Text variant="bodyMedium" style={styles.emptyStateSubtitle}>
            Please check back later or contact support
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