import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, RadioButton, useTheme, IconButton, Divider } from 'react-native-paper';
import { useState } from 'react';
import type { Question, Answer } from '../config/supabase';

type QuestionCardProps = {
  question: Question & { 
    answers: Answer[];
    translatedText?: string;
    translatedExplanation?: string;
  };
  onAnswer: (answerId: number) => void;
  onBookmark?: (questionId: number, bookmarked: boolean) => void;
  isBookmarked?: boolean;
  showExplanation?: boolean;
  language?: string;
};

export default function QuestionCard({ 
  question, 
  onAnswer,
  onBookmark,
  isBookmarked = false,
  showExplanation = false,
  language = 'de',
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const theme = useTheme();

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      const correct = question.answers.find(a => a.id === selectedAnswer)?.is_correct ?? false;
      setIsCorrect(correct);
      setAnswered(true);
      onAnswer(selectedAnswer);
    }
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    onBookmark?.(question.id, newBookmarked);
  };

  const getAnswerColor = (answer: Answer) => {
    if (!answered) return undefined;
    if (answer.is_correct) return theme.colors.primary;
    if (answer.id === selectedAnswer && !answer.is_correct) return theme.colors.error;
    return undefined;
  };

  const getAnswerStyle = (answer: Answer) => {
    if (!answered) {
      return { color: theme.colors.onSurface }; // Default text color with good contrast
    }
    
    if (answer.is_correct) {
      return { color: theme.colors.primary };
    }
    
    if (answer.id === selectedAnswer && !answer.is_correct) {
      return { color: theme.colors.error };
    }
    
    return { color: theme.colors.onSurface }; // Default text color for other answers
  };

  const renderExplanation = () => {
    if (!showExplanation || !answered) return null;

    return (
      <View style={styles.explanationContainer}>
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.explanationTitle}>
          Explanation
        </Text>
        <Text style={styles.explanationText}>
          {question.explanation}
        </Text>
        {language !== 'de' && question.translatedExplanation && (
          <>
            <Text variant="titleMedium" style={[styles.explanationTitle, styles.translationTitle]}>
              Translation
            </Text>
            <Text style={styles.explanationText}>
              {question.translatedExplanation}
            </Text>
          </>
        )}
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.questionHeader}>
          <View style={styles.questionText}>
            <Text variant="titleLarge" style={styles.question}>
              {language === 'de' ? question.text : question.translatedText || question.text}
            </Text>
            {language !== 'de' && (
              <Text variant="bodyMedium" style={styles.originalText}>
                {question.text}
              </Text>
            )}
          </View>
          {onBookmark && (
            <IconButton
              icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
              onPress={handleBookmark}
              iconColor={theme.colors.primary}
            />
          )}
        </View>

        <View style={styles.answers}>
          <RadioButton.Group
            onValueChange={value => setSelectedAnswer(Number(value))}
            value={selectedAnswer?.toString() ?? ''}
          >
            {question.answers.map(answer => (
              <View key={answer.id} style={styles.answerRow}>
                <RadioButton
                  value={answer.id.toString()}
                  disabled={answered}
                  color={getAnswerColor(answer)}
                />
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.answerText,
                    getAnswerStyle(answer)
                  ]}
                  onPress={() => !answered && setSelectedAnswer(answer.id)}
                >
                  {answer.text}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
        </View>

        {answered && (
          <View style={styles.feedback}>
            <Text 
              variant="bodyLarge" 
              style={{ 
                color: isCorrect ? theme.colors.primary : theme.colors.error 
              }}
            >
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            {renderExplanation()}
          </View>
        )}
      </Card.Content>

      <Card.Actions>
        {!answered ? (
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => {
              setAnswered(false);
              setSelectedAnswer(null);
            }}
          >
            Try Another Question
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  question: {
    marginBottom: 16,
  },
  answers: {
    marginTop: 8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4, // Add some vertical spacing between answers
  },
  answerText: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 16,
  },
  feedback: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  explanationContainer: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 16,
  },
  explanationTitle: {
    marginBottom: 8,
    color: '#666',
  },
  translationTitle: {
    marginTop: 16,
  },
  explanationText: {
    lineHeight: 22,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionText: {
    flex: 1,
    marginRight: 16,
  },
  originalText: {
    marginTop: 8,
    opacity: 0.7,
    fontStyle: 'italic',
  },
}); 