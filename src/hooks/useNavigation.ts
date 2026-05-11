/**
 * Custom hook for managing application navigation
 */

import { useState, useCallback } from 'react';
import { Topic } from '../types';

export type Page = 'home' | 'simulator' | 'molecular-shape' | 'dashboard' | 'quiz' | 'topic';

interface NavigationState {
  currentPage: Page;
  selectedTopic: Topic | null;
}

export const useNavigation = () => {
  const [state, setState] = useState<NavigationState>({
    currentPage: 'home',
    selectedTopic: null,
  });

  const navigateTo = useCallback((page: Page, topic?: Topic) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      selectedTopic: topic || prev.selectedTopic,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setSelectedTopic = useCallback((topic: Topic | null) => {
    setState(prev => ({
      ...prev,
      selectedTopic: topic,
    }));
  }, []);

  return {
    currentPage: state.currentPage,
    selectedTopic: state.selectedTopic,
    navigateTo,
    setSelectedTopic,
  };
};
