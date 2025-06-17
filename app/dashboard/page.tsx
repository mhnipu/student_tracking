'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { PredictiveAnalytics } from '@/components/analytics/PredictiveAnalytics';
import { RecommendationEngine } from '@/components/analytics/RecommendationEngine';
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Trophy, 
  Plus, 
  LogOut,
  BarChart3,
  Target,
  Calendar,
  Star,
  User,
  ArrowUpDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useMarks, useAddMark, Mark } from '@/hooks/useMarks';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useNotifications } from '@/hooks/useNotifications';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const SUBJECTS = [
  { name: 'Mathematics', code: 'MATH101', credits: 3, color: '#3B82F6' },
  { name: 'Physics', code: 'PHYS101', credits: 4, color: '#10B981' },
  { name: 'Chemistry', code: 'CHEM101', credits: 3, color: '#F59E0B' },
  { name: 'Computer Science', code: 'CS101', credits: 4, color: '#8B5CF6' },
  { name: 'English', code: 'ENG101', credits: 2, color: '#EF4444' },
  { name: 'History', code: 'HIST101', credits: 2, color: '#06B6D4' },
];

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

// Table columns definition
const columns: ColumnDef<Mark>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize">
          {row.getValue('type')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'score',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const mark = row.original;
      return `${mark.score}/${mark.maxScore}`;
    },
  },
  {
    accessorKey: 'percentage',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const mark = row.original;
      const percentage = Math.round((mark.score / mark.maxScore) * 100);
      return `${percentage}%`;
    },
  },
  {
    accessorKey: 'grade',
    header: 'Grade',
    cell: ({ row }) => {
      const mark = row.original;
      const percentage = (mark.score / mark.maxScore) * 100;
      const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
      return (
        <Badge variant={grade === 'A' || grade === 'B' ? 'default' : grade === 'C' ? 'secondary' : 'destructive'}>
          {grade}
        </Badge>
      );
    },
  },
];

function DashboardContent() {
  const { user, logout } = useAuth();
  const { marks, isLoading: marksLoading } = useMarks();
  const analytics = useAnalytics(marks);
  const { addNotification } = useNotifications();
  const addMarkMutation = useAddMark();
  const router = useRouter();

  const [newMark, setNewMark] = useState({
    subject: '',
    score: '',
    maxScore: '',
    type: 'exam' as const,
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, router]);

  const handleAddMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMark.subject && newMark.score && newMark.maxScore) {
      try {
        await addMarkMutation.mutateAsync({
          subject: newMark.subject,
          score: parseInt(newMark.score),
          maxScore: parseInt(newMark.maxScore),
          date: new Date().toISOString().split('T')[0],
          type: newMark.type,
        });
        
        setNewMark({ subject: '', score: '', maxScore: '', type: 'exam' });
        
        // Add notification
        const percentage = Math.round((parseInt(newMark.score) / parseInt(newMark.maxScore)) * 100);
        addNotification({
          title: 'New Grade Added',
          message: `${newMark.subject} ${newMark.type}: ${percentage}% (${newMark.score}/${newMark.maxScore})`,
          type: percentage >= 80 ? 'success' : percentage >= 60 ? 'info' : 'warning'
        });
      } catch (error) {
        console.error('Failed to add mark:', error);
      }
    }
  };

  const getPerformanceTrend = () => {
    const last6Marks = marks.slice(-6).map((mark, index) => ({
      name: `Test ${index + 1}`,
      score: (mark.score / mark.maxScore) * 100,
      subject: mark.subject
    }));
    
    return last6Marks;
  };

  const getSubjectDistribution = () => {
    return SUBJECTS.map((subject, index) => {
      const subjectMarks = marks.filter(mark => mark.subject === subject.name);
      return {
        name: subject.name,
        value: subjectMarks.length,
        color: CHART_COLORS[index % CHART_COLORS.length]
      };
    });
  };

  if (!user) {
    return null;
  }

  if (marksLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const performanceTrend = getPerformanceTrend();
  const subjectDistribution = getSubjectDistribution();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Smart Student Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <ThemeToggle />
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </Button>
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current GPA</p>
                  <p className="text-2xl font-bold">{analytics.gpa.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold">{marks.length}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{analytics.averageScore}%</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Performance Trend</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-bold capitalize">{analytics.trend}</p>
                    <Badge variant={analytics.trend === 'improving' ? 'default' : analytics.trend === 'declining' ? 'destructive' : 'secondary'}>
                      {analytics.trendPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <TrendingUp className={`h-6 w-6 ${
                    analytics.trend === 'improving' ? 'text-green-600 dark:text-green-400' : 
                    analytics.trend === 'declining' ? 'text-red-600 dark:text-red-400' : 
                    'text-purple-600 dark:text-purple-400'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="predictions">AI Insights</TabsTrigger>
            <TabsTrigger value="add-marks">Add Marks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance Trend</span>
                  </CardTitle>
                  <CardDescription>Your recent assessment scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Distribution</CardTitle>
                  <CardDescription>Number of assessments by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Assessments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>Your latest test scores and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marks.slice(-5).reverse().map((mark) => (
                    <div key={mark.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium">{mark.subject}</p>
                          <p className="text-sm text-muted-foreground capitalize">{mark.type} • {mark.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">{mark.score}/{mark.maxScore}</p>
                          <p className="text-sm text-muted-foreground">{Math.round((mark.score / mark.maxScore) * 100)}%</p>
                        </div>
                        <Badge variant={mark.score / mark.maxScore >= 0.8 ? 'default' : mark.score / mark.maxScore >= 0.6 ? 'secondary' : 'destructive'}>
                          {mark.score / mark.maxScore >= 0.8 ? 'Excellent' : mark.score / mark.maxScore >= 0.6 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.subjectPerformance.map((subject) => (
                <Card key={subject.subject}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{subject.subject}</CardTitle>
                        <CardDescription>{subject.totalAssessments} assessments</CardDescription>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                        <span className="text-muted-foreground">Improvement</span>
                        <Badge variant={subject.improvement > 0 ? 'default' : subject.improvement < 0 ? 'destructive' : 'secondary'}>
                          {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Comparison</CardTitle>
                  <CardDescription>Average scores across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Breakdown of your performance levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.gradeDistribution.map((item) => (
                      <div key={item.grade} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded`} style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium">{item.grade}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: item.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Log</CardTitle>
                <CardDescription>Complete history of all your assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={columns} 
                  data={marks} 
                  searchKey="subject"
                  searchPlaceholder="Search by subject..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictiveAnalytics predictions={analytics.predictions} />
              <RecommendationEngine recommendations={analytics.recommendations} />
            </div>
          </TabsContent>

          <TabsContent value="add-marks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Assessment</span>
                </CardTitle>
                <CardDescription>Record a new test score, assignment, or quiz result</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMark} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={newMark.subject} onValueChange={(value) => setNewMark({ ...newMark, subject: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject.code} value={subject.name}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Assessment Type</Label>
                      <Select value={newMark.type} onValueChange={(value: any) => setNewMark({ ...newMark, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assessment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="score">Score Obtained</Label>
                      <Input
                        id="score"
                        type="number"
                        placeholder="Enter your score"
                        value={newMark.score}
                        onChange={(e) => setNewMark({ ...newMark, score: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxScore">Maximum Score</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        placeholder="Enter maximum possible score"
                        value={newMark.maxScore}
                        onChange={(e) => setNewMark({ ...newMark, maxScore: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="flex items-center space-x-2"
                      disabled={addMarkMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                      <span>{addMarkMutation.isPending ? 'Adding...' : 'Add Assessment'}</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}