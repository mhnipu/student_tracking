'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Mark {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  type: 'exam' | 'assignment' | 'quiz' | 'project';
  date: string;
}

export function useMarks() {
  const [marks, setMarks] = useState<Mark[]>([
    {
      id: '1',
      subject: 'Mathematics',
      score: 85,
      maxScore: 100,
      type: 'exam',
      date: new Date(2023, 10, 1).toISOString().split('T')[0],
    },
    {
      id: '2',
      subject: 'Physics',
      score: 92,
      maxScore: 100,
      type: 'assignment',
      date: new Date(2023, 10, 5).toISOString().split('T')[0],
    },
    {
      id: '3',
      subject: 'Chemistry',
      score: 78,
      maxScore: 100,
      type: 'quiz',
      date: new Date(2023, 10, 10).toISOString().split('T')[0],
    },
    {
      id: '4',
      subject: 'Biology',
      score: 88,
      maxScore: 100,
      type: 'project',
      date: new Date(2023, 10, 15).toISOString().split('T')[0],
    },
    {
      id: '5',
      subject: 'English',
      score: 95,
      maxScore: 100,
      type: 'exam',
      date: new Date(2023, 10, 20).toISOString().split('T')[0],
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return {
    marks,
    isLoading
  };
}

export function useAddMark() {
  const [isPending, setIsPending] = useState(false);
  
  const mutateAsync = async (mark: Omit<Mark, 'id'>) => {
    setIsPending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call to add the mark
      const newMark = {
        ...mark,
        id: Math.random().toString(36).substring(2, 9),
      };
      
      // This is just for simulation, in a real app we'd update the cache or refetch
      return newMark;
    } finally {
      setIsPending(false);
    }
  };
  
  return {
    mutateAsync,
    isPending
  };
}