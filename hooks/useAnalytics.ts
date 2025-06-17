'use client';

import { useMemo } from 'react';
import { Mark } from './useMarks';
import { SLR } from 'ml-regression';

export interface PerformanceAnalytics {
  gpa: number;
  averageScore: number;
  trend: 'improving' | 'declining' | 'stable';
  trendPercentage: number;
  subjectPerformance: SubjectAnalytics[];
  predictions: PredictionData[];
  recommendations: string[];
  gradeDistribution: GradeDistribution[];
}

export interface SubjectAnalytics {
  subject: string;
  average: number;
  trend: number;
  totalAssessments: number;
  lastScore: number;
  improvement: number;
}

export interface PredictionData {
  subject: string;
  predictedScore: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

const SUBJECTS = [
  { name: 'Mathematics', credits: 3 },
  { name: 'Physics', credits: 4 },
  { name: 'Chemistry', credits: 3 },
  { name: 'Computer Science', credits: 4 },
  { name: 'English', credits: 2 },
  { name: 'History', credits: 2 },
];

export function useAnalytics(marks: Mark[]) {
  return useMemo(() => {
    // Calculate GPA (assuming marks are out of 100)
    const gpa = marks.length > 0
      ? marks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 4.0, 0) / marks.length
      : 0;

    // Calculate average score
    const averageScore = marks.length > 0
      ? Math.round(marks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 100, 0) / marks.length)
      : 0;

    // Calculate trend
    const sortedMarks = [...marks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let trend = 'stable';
    let trendPercentage = 0;

    if (sortedMarks.length >= 2) {
      const firstHalf = sortedMarks.slice(0, Math.floor(sortedMarks.length / 2));
      const secondHalf = sortedMarks.slice(Math.floor(sortedMarks.length / 2));

      const firstAvg = firstHalf.reduce((sum, mark) => sum + (mark.score / mark.maxScore), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, mark) => sum + (mark.score / mark.maxScore), 0) / secondHalf.length;

      trendPercentage = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      if (trendPercentage > 1) {
        trend = 'improving';
      } else if (trendPercentage < -1) {
        trend = 'declining';
      }
    }

    // Calculate subject performance
    const subjects = Array.from(new Set(marks.map(mark => mark.subject)));
    const subjectPerformance = subjects.map(subject => {
      const subjectMarks = marks.filter(mark => mark.subject === subject);
      const average = Math.round(subjectMarks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 100, 0) / subjectMarks.length);
      
      // Calculate improvement
      const sortedSubjectMarks = [...subjectMarks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let improvement = 0;
      
      if (sortedSubjectMarks.length >= 2) {
        const first = sortedSubjectMarks[0].score / sortedSubjectMarks[0].maxScore;
        const last = sortedSubjectMarks[sortedSubjectMarks.length - 1].score / sortedSubjectMarks[sortedSubjectMarks.length - 1].maxScore;
        improvement = Math.round((last - first) * 100);
      }
      
      return {
        subject,
        average,
        totalAssessments: subjectMarks.length,
        lastScore: Math.round((sortedSubjectMarks[sortedSubjectMarks.length - 1]?.score / sortedSubjectMarks[sortedSubjectMarks.length - 1]?.maxScore) * 100) || 0,
        improvement
      };
    });

    // Grade distribution
    const gradeDistribution = [
      { grade: 'A', count: 0, percentage: 0, color: '#10B981' },
      { grade: 'B', count: 0, percentage: 0, color: '#3B82F6' },
      { grade: 'C', count: 0, percentage: 0, color: '#F59E0B' },
      { grade: 'D', count: 0, percentage: 0, color: '#EF4444' },
      { grade: 'F', count: 0, percentage: 0, color: '#6B7280' },
    ];

    marks.forEach(mark => {
      const percentage = (mark.score / mark.maxScore) * 100;
      if (percentage >= 90) gradeDistribution[0].count++;
      else if (percentage >= 80) gradeDistribution[1].count++;
      else if (percentage >= 70) gradeDistribution[2].count++;
      else if (percentage >= 60) gradeDistribution[3].count++;
      else gradeDistribution[4].count++;
    });

    gradeDistribution.forEach(grade => {
      grade.percentage = marks.length > 0 ? (grade.count / marks.length) * 100 : 0;
    });

    // Mock predictions and recommendations
    const predictions = [
      {
        subject: 'Mathematics',
        predictedScore: Math.min(100, averageScore + 5),
        confidence: 85,
        trend: 'upward'
      },
      {
        subject: 'Physics',
        predictedScore: Math.min(100, averageScore + 2),
        confidence: 75,
        trend: 'stable'
      },
      {
        subject: 'Chemistry',
        predictedScore: Math.max(60, averageScore - 3),
        confidence: 65,
        trend: 'downward'
      }
    ];

    const recommendations = [
      {
        id: '1',
        title: 'Focus on Chemistry',
        description: 'Your Chemistry scores are below average. Consider allocating more study time to this subject.',
        priority: 'high',
        actionable: true
      },
      {
        id: '2',
        title: 'Maintain Mathematics Performance',
        description: 'You\'re doing well in Mathematics. Keep up the good work!',
        priority: 'medium',
        actionable: false
      },
      {
        id: '3',
        title: 'Review Previous Assessments',
        description: 'Analyze your mistakes in past assessments to identify patterns and areas for improvement.',
        priority: 'medium',
        actionable: true
      }
    ];

    return {
      gpa,
      averageScore,
      trend,
      trendPercentage,
      subjectPerformance,
      gradeDistribution,
      predictions,
      recommendations
    };
  }, [marks]);
}