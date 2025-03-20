import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Portal, Dialog, Button } from 'react-native-paper';
import { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, Question, Answer } from '../../../config/supabase';
import QuestionCard from '../../../components/QuestionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type QuestionWithAnswers = Question & { answers: Answer[] };

export default function QuestionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<QuestionWithAnswers & {
    translatedText?: string;
    translatedExplanation?: string;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [language, setLanguage] = useState('de');

  useEffect(() => {
    loadQuestion();
    checkBookmarkStatus();
    loadLanguagePreference();
  }, [id]);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const loadQuestion = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage') || 'de';
      console.log('Loading question with language:', savedLanguage);

      const data = await db.translations.getQuestionWithTranslation(
        Number(id),
        savedLanguage
      );

      console.log('Loaded question:', {
        id: data?.id,
        hasTranslation: Boolean(data?.translatedText),
        language: savedLanguage
      });

      setQuestion(data);
      setLanguage(savedLanguage);
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const bookmarkedIds = await db.bookmarks.get();
      setIsBookmarked(bookmarkedIds.includes(Number(id)));
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleAnswer = async (answerId: number) => {
    if (!question) return;

    const selectedAnswer = question.answers.find(a => a.id === answerId);
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer.is_correct;
    setLastAnswerCorrect(isCorrect);

    try {
      await db.userProgress.update(
        question.id,
        isCorrect ? 'mastered' : 'reviewing'
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }

    setTimeout(() => setShowDialog(true), 1500);
  };

  const handleContinue = () => {
    setShowDialog(false);
    router.back();
  };

  const handleBookmark = async (questionId: number, bookmarked: boolean) => {
    try {
      await db.bookmarks.toggle(questionId);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (!loading) {
    return (
      <View style={styles.container}>
        <ScrollView>
          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked}
            showExplanation={true}
            language={language}
          />
        </ScrollView>

        <Portal>
          <Dialog visible={showDialog} onDismiss={handleContinue}>
            <Dialog.Title>
              {lastAnswerCorrect ? 'Well done!' : 'Keep practicing!'}
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                {lastAnswerCorrect
                  ? 'You got it right! Ready for the next question?'
                  : 'Don\'t worry, practice makes perfect. Try another question?'}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleContinue}>Continue</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
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
}); 