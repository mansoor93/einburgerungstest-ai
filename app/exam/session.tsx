import { View, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text, Button, ProgressBar, Portal, Dialog } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../config/supabase';
import { useTheme } from 'react-native-paper';

interface ExamQuestion {
  id: number;
  text: string;
  explanation?: string;
  difficulty: string;
  category_id: number;
  answers: {
    id: number;
    text: string;
    is_correct: boolean;
  }[];
}

interface ExamResults {
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

export default function ExamSession() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
    startTimer();
  }, []);

  const loadQuestions = async () => {
    try {
      // First check if we can connect to Supabase
      const { data: connectionTest, error: connectionError } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true });
      
      if (connectionError) {
        console.error('Connection test failed:', connectionError);
        throw new Error(`Connection error: ${connectionError.message}`);
      }
      
      // Then proceed with the actual query
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      
      console.log('Question count:', count);
      
      const limit = Math.min(33, count || 0);
      
      const { data, error } = await supabase
        .rpc('get_random_questions', { limit_count: limit });

      if (error) {
        console.error('Error fetching random questions:', error);
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from server');
      }

      const processedQuestions = data.map(q => ({
        ...q,
        answers: typeof q.answers === 'string' ? JSON.parse(q.answers) : q.answers
      }));

      const validQuestions = processedQuestions.filter(q => 
        q && q.id && q.text && Array.isArray(q.answers) && q.answers.length > 0
      );

      if (validQuestions.length === 0) {
        console.error('No valid questions found after processing');
        throw new Error('No valid questions found');
      }

      console.log(`Loaded ${validQuestions.length} valid questions`);
      setQuestions(validQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Show error state instead of just logging
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAutoSubmit(true);
          setShowConfirmDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const submitExam = async () => {
    // Calculate results
    const examResults = {
      totalQuestions: questions.length,
      correctAnswers: 0,
      timeSpent: 3600 - timeRemaining,
      questions: questions.map(question => {
        const userAnswerId = answers[question.id];
        const userAnswer = question.answers.find(a => a.id === userAnswerId);
        const correctAnswer = question.answers.find(a => a.is_correct);
        const isCorrect = userAnswer?.is_correct || false;

        if (isCorrect) {
          examResults.correctAnswers++;
        }

        return {
          id: question.id,
          text: question.text,
          userAnswer: userAnswer?.text || 'Not answered',
          correctAnswer: correctAnswer?.text || '',
          isCorrect,
          explanation: question.explanation
        };
      })
    };

    // Calculate if passed (2 or more correct answers out of 3)
    examResults.passed = examResults.correctAnswers >= 2;

    // Store results in Supabase
    try {
      const { error } = await supabase
        .from('exam_results')
        .insert({
          user_id: 'test-user', // TODO: Replace with actual user ID
          score: examResults.correctAnswers,
          total_questions: examResults.totalQuestions,
          time_spent: examResults.timeSpent,
          passed: examResults.passed,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving exam results:', error);
    }

    // Navigate to results screen with the results data
    router.push({
      pathname: '/exam/results',
      params: {
        results: JSON.stringify(examResults)
      }
    });
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    await submitExam();
  };

  const handleSubmitClick = () => {
    setIsAutoSubmit(false);
    setShowConfirmDialog(true);
  };

  const loadSampleQuestions = () => {
    const sampleQuestions: ExamQuestion[] = [
      {
        id: 1,
        text: "Sample question 1?",
        difficulty: "easy",
        category_id: 1,
        answers: [
          { id: 1, text: "Sample answer 1", is_correct: true },
          { id: 2, text: "Sample answer 2", is_correct: false },
          { id: 3, text: "Sample answer 3", is_correct: false },
        ]
      },
      {
        id: 2,
        text: "Sample question 2?",
        difficulty: "medium",
        category_id: 2,
        answers: [
          { id: 4, text: "Sample answer 1", is_correct: false },
          { id: 5, text: "Sample answer 2", is_correct: true },
          { id: 6, text: "Sample answer 3", is_correct: false },
        ]
      },
      // Add more sample questions as needed
    ];
    
    setQuestions(sampleQuestions);
    setLoading(false);
    setError(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading exam questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', marginBottom: 16 }}>
          Error: {error}
        </Text>
        <Button mode="contained" onPress={loadQuestions} style={{ marginBottom: 12 }}>
          Retry
        </Button>
        <Button mode="outlined" onPress={loadSampleQuestions}>
          Use Sample Questions
        </Button>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                Question {currentIndex + 1} of {questions.length}
              </Text>
              <Text style={styles.headerText}>
                Time: {formatTime(timeRemaining)}
              </Text>
            </View>
            
            <ProgressBar 
              progress={(currentIndex + 1) / questions.length} 
              style={styles.progress} 
            />

            <View style={styles.questionContainer}>
              {currentQuestion && (
                <View style={styles.contentContainer}>
                  <View style={styles.questionBox}>
                    <Text style={styles.questionText}>
                      {currentQuestion.text}
                    </Text>
                  </View>
                  
                  <View style={styles.answersContainer}>
                    {currentQuestion.answers.map((answer) => (
                      <Button
                        key={answer.id}
                        mode={answers[currentQuestion.id] === answer.id ? "contained" : "outlined"}
                        onPress={() => {
                          setAnswers(prev => ({
                            ...prev,
                            [currentQuestion.id]: answer.id
                          }));
                        }}
                        style={[
                          styles.answerButton,
                          {
                            backgroundColor: answers[currentQuestion.id] === answer.id 
                              ? theme.colors.primary 
                              : '#fff'
                          }
                        ]}
                        labelStyle={{
                          fontSize: 16,
                          color: answers[currentQuestion.id] === answer.id 
                            ? '#fff' 
                            : theme.colors.primary
                        }}
                      >
                        {answer.text}
                      </Button>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.navigation}>
          <Button 
            mode="outlined"
            onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          
          {currentIndex === questions.length - 1 ? (
            <Button mode="contained" onPress={handleSubmitClick}>
              Submit
            </Button>
          ) : (
            <Button 
              mode="contained"
              onPress={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          )}
        </View>

        <Portal>
          <Dialog visible={showConfirmDialog} onDismiss={() => !isAutoSubmit && setShowConfirmDialog(false)}>
            <Dialog.Title>
              {isAutoSubmit ? 'Time\'s Up!' : 'Submit Exam?'}
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                {isAutoSubmit 
                  ? 'Your time is up. The exam will be submitted now.'
                  : `You've answered ${Object.keys(answers).length} out of ${questions.length} questions. Are you sure you want to submit?`
                }
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              {!isAutoSubmit && (
                <Button onPress={() => setShowConfirmDialog(false)}>Cancel</Button>
              )}
              <Button mode="contained" onPress={handleConfirmSubmit}>
                {isAutoSubmit ? 'OK' : 'Submit'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  progress: {
    height: 4,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  questionBox: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    lineHeight: 28,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
}); 