
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, BookOpen, Lock, Check, Download, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { getCourse, getFaculty, getDepartment, getQuestionsForCourse } = useData();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  
  const course = getCourse(courseId || '');
  const faculty = course ? getFaculty(getDepartment(course.departmentId)?.facultyId || '') : undefined;
  const department = course ? getDepartment(course.departmentId) : undefined;
  const questions = courseId ? getQuestionsForCourse(courseId) : [];
  
  // Group questions by year
  const questionsByYear = questions.reduce<Record<string, typeof questions>>(
    (acc, question) => {
      if (!acc[question.year]) {
        acc[question.year] = [];
      }
      acc[question.year].push(question);
      return acc;
    },
    {}
  );
  
  const years = Object.keys(questionsByYear).sort().reverse();
  
  if (!course) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Course not found</h1>
        <p className="text-muted-foreground mb-6">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/browse">
          <Button>Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Link to="/browse" className="flex items-center text-muted-foreground mb-4 hover:text-primary">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Browse
      </Link>
      
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{course.code}</h1>
              <Badge variant="outline">{course.level} Level</Badge>
            </div>
            <h2 className="text-xl">{course.title}</h2>
            <p className="text-muted-foreground mt-1">
              {faculty?.name} • {department?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!user?.isSubscribed && (
              <Link to="/subscribe">
                <Button variant="outline" className="gap-1">
                  <Lock className="h-4 w-4 mr-1" />
                  Upgrade to Access Answers
                </Button>
              </Link>
            )}
            <Button disabled={!user?.isSubscribed} variant="secondary" className="gap-1">
              <Download className="h-4 w-4 mr-1" />
              Download All
            </Button>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Past Year Papers</CardTitle>
            <CardDescription>
              Select a year to view questions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {years.map(year => (
                <div
                  key={year}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between ${
                    selectedYear === year ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedYear(year)}
                >
                  <span>{year} Exam</span>
                  <span className="text-muted-foreground text-sm">
                    {questionsByYear[year].length} questions
                  </span>
                </div>
              ))}
              
              {years.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-muted-foreground">No past papers available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          {selectedYear ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.code} - {selectedYear} Questions</CardTitle>
                    <CardDescription>
                      {questionsByYear[selectedYear].length} questions from the {selectedYear} exam
                    </CardDescription>
                  </div>
                  <Button disabled={!user?.isSubscribed} variant="outline" size="sm" className="gap-1">
                    <Download className="h-3 w-3 mr-1" />
                    Download {selectedYear}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {questionsByYear[selectedYear].map((question, index) => (
                  <div key={question.id} className="mb-6 last:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="whitespace-pre-line">{question.content}</p>
                        </div>
                        
                        {question.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {Object.entries(question.options).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 p-3 rounded border">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                  <span className="font-medium uppercase">{key}</span>
                                </div>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <Tabs defaultValue="answer">
                          <TabsList>
                            <TabsTrigger value="answer">Answer</TabsTrigger>
                            <TabsTrigger value="explanation">Explanation</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="answer">
                            {user?.isSubscribed ? (
                              <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <div>
                                  <div className="font-medium">Correct Answer: {question.answer.toUpperCase()}</div>
                                  {question.options && (
                                    <div className="text-muted-foreground">
                                      {question.options[question.answer]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">Answer Locked</div>
                                  <div className="text-muted-foreground">
                                    Upgrade to premium to view answers
                                  </div>
                                </div>
                                <Link to="/subscribe" className="ml-auto">
                                  <Button size="sm">Upgrade</Button>
                                </Link>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="explanation">
                            {user?.isSubscribed ? (
                              question.explanation ? (
                                <div className="p-4 bg-muted rounded-md">
                                  <p>{question.explanation}</p>
                                </div>
                              ) : (
                                <div className="p-4 bg-muted rounded-md text-muted-foreground">
                                  No explanation available for this question.
                                </div>
                              )
                            ) : (
                              <div className="p-4 bg-muted rounded-md flex items-center gap-3">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">Explanation Locked</div>
                                  <div className="text-muted-foreground">
                                    Upgrade to premium to view explanations
                                  </div>
                                </div>
                                <Link to="/subscribe" className="ml-auto">
                                  <Button size="sm">Upgrade</Button>
                                </Link>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                    
                    {index < questionsByYear[selectedYear].length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a Year</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Choose a year from the left panel to view past questions for this course
              </p>
              {years.length > 0 && (
                <Button onClick={() => setSelectedYear(years[0])}>
                  View {years[0]} Questions
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!user?.isSubscribed && (
        <Alert className="mt-8 border-uniwise-gold bg-uniwise-gold/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <span className="font-medium">You're using the free plan. </span>
                Upgrade to UniWise Premium to access all answers, explanations, and download options.
              </div>
              <Link to="/subscribe">
                <Button>Upgrade to Premium</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CoursePage;
