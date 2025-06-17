'use client';

import { useState, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMarks } from '@/hooks/useMarks';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Settings, 
  Trophy, 
  Calendar, 
  TrendingUp,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const { marks } = useMarks();
  const analytics = useAnalytics(marks);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) return null;

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Generate historical performance data
  const getHistoricalData = () => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date()
    });

    return months.map(month => {
      const monthMarks = marks.filter(mark => {
        const markDate = new Date(mark.date);
        return markDate.getMonth() === month.getMonth() && 
               markDate.getFullYear() === month.getFullYear();
      });

      const average = monthMarks.length > 0 
        ? monthMarks.reduce((sum, mark) => sum + (mark.score / mark.maxScore) * 100, 0) / monthMarks.length
        : 0;

      return {
        month: format(month, 'MMM yyyy'),
        average: Math.round(average),
        assessments: monthMarks.length
      };
    });
  };

  const historicalData = getHistoricalData();
  const joinDate = new Date(user.joinDate);
  const daysSinceJoined = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{user.name}</h1>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Member since {format(joinDate, 'MMMM yyyy')} • {daysSinceJoined} days
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ThemeToggle />
                      <Button
                        variant={isEditing ? 'default' : 'outline'}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current GPA</p>
                  <p className="text-2xl font-bold">{analytics.gpa.toFixed(2)}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold">{marks.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{analytics.averageScore}%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Performance Trend</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold capitalize">{analytics.trend}</p>
                    <Badge variant={analytics.trend === 'improving' ? 'default' : analytics.trend === 'declining' ? 'destructive' : 'secondary'}>
                      {analytics.trendPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <TrendingUp className={`h-8 w-8 ${
                  analytics.trend === 'improving' ? 'text-green-600' : 
                  analytics.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance History</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>12-Month Performance Trend</CardTitle>
                <CardDescription>Your academic performance over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Activity</CardTitle>
                <CardDescription>Number of assessments completed each month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="assessments" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analytics.subjectPerformance.map((subject) => (
                <Card key={subject.subject}>
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.subject}</CardTitle>
                    <CardDescription>{subject.totalAssessments} assessments completed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Average Score</span>
                        <span className="text-sm font-bold">{subject.average}%</span>
                      </div>
                      <Progress value={subject.average} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Last Score</span>
                      <span className="font-medium">{subject.lastScore}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Overall Improvement</span>
                      <Badge variant={subject.improvement > 0 ? 'default' : subject.improvement < 0 ? 'destructive' : 'secondary'}>
                        {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Academic Achievements */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">High Achiever</h3>
                      <p className="text-sm text-muted-foreground">GPA above 3.5</p>
                      <Badge variant={analytics.gpa >= 3.5 ? 'default' : 'secondary'}>
                        {analytics.gpa >= 3.5 ? 'Earned' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Consistent Performer</h3>
                      <p className="text-sm text-muted-foreground">10+ assessments completed</p>
                      <Badge variant={marks.length >= 10 ? 'default' : 'secondary'}>
                        {marks.length >= 10 ? 'Earned' : `${marks.length}/10`}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Improvement Master</h3>
                      <p className="text-sm text-muted-foreground">Showing improvement trend</p>
                      <Badge variant={analytics.trend === 'improving' ? 'default' : 'secondary'}>
                        {analytics.trend === 'improving' ? 'Earned' : 'Keep Going'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Perfect Score</h3>
                      <p className="text-sm text-muted-foreground">Achieved 100% on an assessment</p>
                      <Badge variant={marks.some(m => (m.score / m.maxScore) === 1) ? 'default' : 'secondary'}>
                        {marks.some(m => (m.score / m.maxScore) === 1) ? 'Earned' : 'Not Yet'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Long-term Commitment</h3>
                      <p className="text-sm text-muted-foreground">Active for 30+ days</p>
                      <Badge variant={daysSinceJoined >= 30 ? 'default' : 'secondary'}>
                        {daysSinceJoined >= 30 ? 'Earned' : `${daysSinceJoined}/30 days`}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Target className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Subject Master</h3>
                      <p className="text-sm text-muted-foreground">90%+ average in any subject</p>
                      <Badge variant={analytics.subjectPerformance.some(s => s.average >= 90) ? 'default' : 'secondary'}>
                        {analytics.subjectPerformance.some(s => s.average >= 90) ? 'Earned' : 'Keep Studying'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}