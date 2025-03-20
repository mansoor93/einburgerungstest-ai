import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { Question } from '../config/supabase';

type QuestionListProps = {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
};

export default function QuestionList({ questions, onSelectQuestion }: QuestionListProps) {
  const theme = useTheme();

  const renderItem = ({ item: question }: { item: Question }) => (
    <Card 
      style={styles.card}
      onPress={() => onSelectQuestion(question)}
    >
      <Card.Content>
        <Text variant="titleMedium" numberOfLines={2} style={styles.questionText}>
          {question.text}
        </Text>
        <View style={styles.tags}>
          <Chip 
            mode="outlined" 
            style={[styles.chip, { borderColor: theme.colors.primary }]}
          >
            {question.difficulty}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={questions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  questionText: {
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 28,
  },
}); 