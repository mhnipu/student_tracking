'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Prediction {
  subject: string;
  predictedScore: number;
  confidence: number;
  trend: string;
}

interface PredictiveAnalyticsProps {
  predictions: Prediction[];
}

export function PredictiveAnalytics({ predictions }: PredictiveAnalyticsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'upward':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'downward':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Predictions</CardTitle>
        <CardDescription>AI-powered forecasts for your future assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictions.map((prediction) => (
            <div key={prediction.subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{getTrendIcon(prediction.trend)}</span>
                  <span className="font-medium">{prediction.subject}</span>
                </div>
                <Badge variant={prediction.trend === 'upward' ? 'default' : prediction.trend === 'downward' ? 'destructive' : 'outline'}>
                  {prediction.predictedScore}%
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <span className="text-xs font-medium">{prediction.confidence}%</span>
                  </div>
                  <Progress 
                    value={prediction.confidence} 
                    className="h-1.5" 
                    indicatorClassName={getConfidenceColor(prediction.confidence)}
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {prediction.trend === 'upward' 
                  ? 'Your performance is improving in this subject.'
                  : prediction.trend === 'downward'
                    ? 'Your performance is declining in this subject.'
                    : 'Your performance is stable in this subject.'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}