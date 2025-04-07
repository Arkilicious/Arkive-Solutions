
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { CBTSession, Course, Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, TimerIcon, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CBTPage: React.FC = () => {
  const { user } = useAuth();
  const { courses, getQuestionsForCourse } = useData();
  const { toast } = useToast();
  
  const gssCourses = courses.filter(course => course.code.startsWith('GSS'));
  
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [cbtSession, setCbtSession] = useState<CBTSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (isTimerActive && timeRemaining === 0) {
      handleSubmitExam();
    }
  }, [timeRemaining, isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    if (!selectedCourse) {
      toast({
        title: "Course Required",
        description: "Please select a course to start the CBT",
        variant: "destructive",
      });
      return;
    }
    
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return;
    
    const allQuestions = getQuestionsForCourse(selectedCourse);
    // Randomly select 20 questions or all questions if less than 20
    const selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
    
    const newSession: CBTSession = {
      id: `cbt-${Date.now()}`,
      courseId: selectedCourse,
      courseName: `${course.code}: ${course.title}`,
      userId: user?.id || '',
      questions: selectedQuestions,
      answers: {},
      completed: false,
      startTime: new Date().toISOString(),
    };
    
    setCbtSession(newSession);
    setCurrentQuestionIndex(0);
    setTimeRemaining(30 * 60); // 30 minutes
    setIsTimerActive(true);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (!cbtSession) return;
    
    setCbtSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answer
        }
      };
    });
  };

  const handleSubmitExam = () => {
    if (!cbtSession) return;
    
    setIsTimerActive(false);
    
    // Calculate score
    let correctAnswers = 0;
    cbtSession.questions.forEach(question => {
      if (cbtSession.answers[question.id] === question.answer) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / cbtSession.questions.length) * 100;
    
    setCbtSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        completed: true,
        score,
        endTime: new Date().toISOString()
      };
    });
    
    setIsSubmitDialogOpen(false);
  };

  const handleNext = () => {
    if (!cbtSession) return;
    if (currentQuestionIndex < cbtSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetExam = () => {
    setCbtSession(null);
    setCurrentQuestionIndex(0);
    setTimeRemaining(30 * 60);
    setIsTimerActive(false);
  };

  // Determine how many questions have been answered
  const answeredQuestionsCount = cbtSession 
    ? Object.keys(cbtSession.answers).length 
    : 0;
  
  const renderExamStarter = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Computer-Based Test (CBT)</CardTitle>
        <CardDescription>
          Practice GSS exams with timed quizzes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course-select">Select a GSS Course</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger id="course-select">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {gssCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.code}: {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Exam Details:</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Duration: 30 Minutes</span>
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span>20 Multiple Choice Questions</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span>Instant Results After Submission</span>
            </li>
          </ul>
        </div>
        
        {!user?.isSubscribed && (
          <Alert className="bg-uniwise-gold/10 border-uniwise-gold">
            <AlertTriangle className="h-4 w-4 text-uniwise-gold" />
            <AlertDescription>
              <span className="font-medium">Free Plan Limitation:</span> You can take up to 3 CBT exams per day. Upgrade to Premium for unlimited practice tests.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={startExam}>Start Exam</Button>
      </CardFooter>
    </Card>
  );

  const renderExamSession = () => {
    if (!cbtSession) return null;
    
    const currentQuestion = cbtSession.questions[currentQuestionIndex];
    const selectedAnswer = cbtSession.answers[currentQuestion.id] || '';
    
    return (
      <div className="max-w-3xl mx-auto">
        {/* Exam Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{cbtSession.courseName}</h1>
            <p className="text-muted-foreground">CBT Practice Exam</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${
              timeRemaining < 300 ? 'bg-red-500/10 text-red-500' : 'bg-muted'
            }`}>
              <TimerIcon className="h-4 w-4" />
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit Exam
            </Button>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>Question {currentQuestionIndex + 1} of {cbtSession.questions.length}</span>
            <span>
              {answeredQuestionsCount}/{cbtSession.questions.length} answered
            </span>
          </div>
          <Progress 
            value={(answeredQuestionsCount / cbtSession.questions.length) * 100} 
          />
        </div>
        
        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-0.5">
                Question {currentQuestionIndex + 1}
              </Badge>
              {cbtSession.answers[currentQuestion.id] && (
                <Badge variant="secondary" className="px-2 py-0.5">
                  Answered
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl mt-2">{currentQuestion.content}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.options && (
              <RadioGroup
                value={selectedAnswer}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div 
                      key={key} 
                      className={`flex items-start p-3 rounded-md border ${
                        selectedAnswer === key ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <RadioGroupItem 
                        value={key} 
                        id={`option-${key}`} 
                        className="mt-1 mr-3"
                      />
                      <Label 
                        htmlFor={`option-${key}`} 
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium mr-2">
                          {key.toUpperCase()}.
                        </span>
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === cbtSession.questions.length - 1}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Question Navigator */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Question Navigator:</h3>
          <div className="grid grid-cols-10 gap-2">
            {cbtSession.questions.map((question, index) => (
              <div
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`
                  flex items-center justify-center w-full aspect-square rounded-md text-sm font-medium cursor-pointer
                  ${currentQuestionIndex === index 
                    ? 'bg-primary text-primary-foreground' 
                    : cbtSession.answers[question.id]
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }
                `}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!cbtSession || !cbtSession.completed) return null;
    
    // Group questions by correct/incorrect
    const correctQuestions = cbtSession.questions.filter(
      q => cbtSession.answers[q.id] === q.answer
    );
    
    const incorrectQuestions = cbtSession.questions.filter(
      q => cbtSession.answers[q.id] !== q.answer
    );
    
    // Get score percentage
    const scorePercent = cbtSession.score || 0;
    let scoreMessage = "";
    let scoreColor = "";
    
    if (scorePercent >= 70) {
      scoreMessage = "Excellent! You've mastered this subject.";
      scoreColor = "text-green-500";
    } else if (scorePercent >= 50) {
      scoreMessage = "Good job! You're on the right track.";
      scoreColor = "text-blue-500";
    } else {
      scoreMessage = "Keep practicing! You'll improve with more studying.";
      scoreColor = "text-yellow-500";
    }

    return (
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Exam Results</CardTitle>
            <CardDescription>{cbtSession.courseName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Overview */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20">
                <div className="text-3xl font-bold">{Math.round(scorePercent)}%</div>
              </div>
              <h3 className={`text-lg font-medium mt-4 ${scoreColor}`}>{scoreMessage}</h3>
              <p className="text-muted-foreground mt-1">
                You answered {correctQuestions.length} out of {cbtSession.questions.length} questions correctly
              </p>
            </div>
            
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Time Taken</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      {formatTime(30 * 60 - timeRemaining)} minutes
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Correct Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>
                      {correctQuestions.length} ({Math.round(correctQuestions.length / cbtSession.questions.length * 100)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Incorrect Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                    <span>
                      {incorrectQuestions.length} ({Math.round(incorrectQuestions.length / cbtSession.questions.length * 100)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={resetExam} variant="outline">
              Take Another Exam
            </Button>
            <Button onClick={() => {
              toast({
                title: "Feature Notice",
                description: "Detailed answer review will be available in the next update."
              });
            }}>
              Review Answers
            </Button>
          </CardFooter>
        </Card>
        
        {/* Sample Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Questions You Missed</span>
              <Badge variant="outline" className="ml-2">
                {incorrectQuestions.length} Questions
              </Badge>
            </CardTitle>
            <CardDescription>
              Review these questions to improve your understanding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {incorrectQuestions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 mb-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <span>{index + 1}</span>
                  </div>
                  <div className="font-medium">{question.content}</div>
                </div>
                
                {question.options && (
                  <div className="ml-9 space-y-2">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div 
                        key={key} 
                        className={`p-2 rounded-md text-sm ${
                          key === question.answer
                            ? 'bg-green-500/10 border border-green-500/20'
                            : key === cbtSession.answers[question.id]
                              ? 'bg-red-500/10 border border-red-500/20'
                              : ''
                        }`}
                      >
                        <span className="font-medium mr-1">{key.toUpperCase()}.</span>
                        {value}
                        {key === question.answer && (
                          <CheckCircle className="inline h-4 w-4 ml-2 text-green-500" />
                        )}
                        {key === cbtSession.answers[question.id] && key !== question.answer && (
                          <XCircle className="inline h-4 w-4 ml-2 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Explanation (only available for premium users) */}
                {user?.isSubscribed && question.explanation && (
                  <div className="ml-9 mt-2 p-3 bg-muted rounded-md text-sm">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </div>
                )}
              </div>
            ))}
            
            {incorrectQuestions.length > 3 && (
              <div className="text-center">
                <Button variant="link" onClick={() => {
                  toast({
                    title: "Feature Notice",
                    description: "Complete answer review will be available in the next update."
                  });
                }}>
                  See All Missed Questions
                </Button>
              </div>
            )}
            
            {incorrectQuestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Perfect Score!</h3>
                <p className="text-muted-foreground max-w-md">
                  Amazing job! You answered all questions correctly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">GSS Computer-Based Test</h1>
        <p className="text-muted-foreground mt-2">
          Practice for your GSS courses with timed quizzes and instant feedback
        </p>
      </header>
      
      {!cbtSession && renderExamStarter()}
      {cbtSession && !cbtSession.completed && renderExamSession()}
      {cbtSession && cbtSession.completed && renderResults()}
      
      {/* Submit Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span>Questions Answered:</span>
              <span className="font-medium">
                {answeredQuestionsCount}/{cbtSession?.questions.length || 0}
              </span>
            </div>
            <Progress 
              value={cbtSession 
                ? (answeredQuestionsCount / cbtSession.questions.length) * 100 
                : 0
              }
            />
            
            {cbtSession && answeredQuestionsCount < cbtSession.questions.length && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You haven't answered all questions. Unanswered questions will be marked as incorrect.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Continue Exam
            </Button>
            <Button onClick={handleSubmitExam}>
              Submit Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CBTPage;
