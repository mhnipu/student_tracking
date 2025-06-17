'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface RecommendationEngineProps {
  recommendations: Recommendation[];
}

export function RecommendationEngine({ recommendations }: RecommendationEngineProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Priority</Badge>;
      default:
        return <Badge variant="outline">Low Priority</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          <span>Smart Recommendations</span>
        </CardTitle>
        <CardDescription>Personalized suggestions to improve your academic performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div 
              key={recommendation.id} 
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  {recommendation.actionable ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                  )}
                  {recommendation.title}
                </h4>
                {getPriorityBadge(recommendation.priority)}
              </div>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}