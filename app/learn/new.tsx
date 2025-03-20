import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { db, Question } from '../../config/supabase';
import QuestionList from '../../components/QuestionList';

export default function NewQuestions() {
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
      const allQuestions = await db.questions.getAll();
      
      // Filter out questions that have been attempted
      const attemptedQuestionIds = new Set(progress.map(p => p.question_id));
      const newQuestions = allQuestions.filter(q => !attemptedQuestionIds.has(q.id));
      
      setQuestions(newQuestions);
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
        <Text variant="headlineSmall">New Questions</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {questions.length} questions you haven't tried yet
        </Text>
      </View>

      <QuestionList 
        questions={questions}
        onSelectQuestion={handleQuestionSelect}
      />
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
}); 