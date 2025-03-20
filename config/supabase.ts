import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use environment variables with the EXPO_PUBLIC prefix
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a custom storage adapter for mobile environments
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Create the Supabase client with platform-specific configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export other database-related types and functions
export interface Question {
  id: number;
  text: string;
  explanation?: string;
  difficulty: string;
  category_id: number;
}

export interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
  question_id: number;
}

// Add a helper function to check connection
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('questions').select('count()', { count: 'exact', head: true });
    if (error) throw error;
    return { success: true, count: data };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { success: false, error };
  }
};

// Export database interface with helper methods
export const db = {
  questions: {
    getAll: async () => {
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
      
      if (error) throw error;
      return data || [];
    },
    // Add other methods as needed
  },
  translations: {
    getQuestionWithTranslation: async (questionId: number, language: string) => {
      // Implementation for translations
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          explanation,
          difficulty,
          category_id,
          answers (
            id,
            text,
            is_correct
          ),
          translations (
            text,
            explanation,
            language
          )
        `)
        .eq('id', questionId)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Find translation for the requested language
      const translation = data.translations?.find(t => t.language === language);
      
      return {
        ...data,
        translatedText: translation?.text,
        translatedExplanation: translation?.explanation,
      };
    }
  }
}; 