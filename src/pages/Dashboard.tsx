
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookIcon, BookOpenIcon, CalendarIcon, ChevronRightIcon, MessageSquareIcon, TrendingUpIcon, UsersIcon, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { faculties, departments, courses, findStudyBuddies } = useData();

  const userFaculty = faculties.find(f => f.id === user?.faculty);
  const userDepartment = departments.find(d => d.id === user?.department);
  const availableCourses = courses.filter(c => 
    c.departmentId === user?.department && 
    c.level === user?.level
  );
  const enrolledCourses = courses.filter(c => user?.courses.includes(c.id));
  const studyBuddies = findStudyBuddies();
  const availableBuddies = studyBuddies.filter(b => b.status === 'available');

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">
              {userDepartment?.name}, {user?.level} Level • {userFaculty?.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/browse">
              <Button>
                Browse Past Questions
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {!user?.isSubscribed && (
              <Link to="/subscribe">
                <Button variant="outline">
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Semester</CardTitle>
            <CardDescription>Active courses and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{course.code}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{course.title}</span>
                    </div>
                    <Link to={`/course/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        Study <ChevronRightIcon className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={Math.floor(Math.random() * 100)} className="flex-1" />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {course.questionCount} questions
                    </span>
                  </div>
                </div>
              ))}

              {availableCourses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No courses available</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    We couldn't find any courses for your department and level
                  </p>
                  <Link to="/browse">
                    <Button>Browse All Courses</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {availableCourses.length} course{availableCourses.length !== 1 ? 's' : ''} available for your level
            </p>
            <Link to="/browse">
              <Button variant="link">View All</Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant={user?.isSubscribed ? "default" : "outline"}>
                  {user?.isSubscribed ? "Premium" : "Free Plan"}
                </Badge>
                {!user?.isSubscribed && (
                  <Link to="/subscribe">
                    <Button size="sm" variant="secondary">Upgrade</Button>
                  </Link>
                )}
              </div>

              {!user?.isSubscribed && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Premium Benefits:</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-2 text-uniwise-gold" />
                      Access to all answers
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-2 text-uniwise-gold" />
                      Download questions & answers
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-2 text-uniwise-gold" />
                      Unlimited CBT practice
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Study Buddies</CardTitle>
            </CardHeader>
            <CardContent>
              {availableBuddies.length > 0 ? (
                <div className="space-y-3">
                  {availableBuddies.slice(0, 2).map((buddy) => (
                    <div key={buddy.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{buddy.name}</span>
                      </div>
                      <Badge variant="outline">{buddy.department}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">No study buddies available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link to="/study-buddies" className="w-full">
                <Button variant="outline" className="w-full">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Find Study Buddies
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpenIcon className="mr-2 h-5 w-5" /> GSS Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courses
                .filter(c => c.code.startsWith('GSS'))
                .slice(0, 3)
                .map((course) => (
                  <div key={course.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{course.code}</span>
                      <span className="text-xs text-muted-foreground ml-2">{course.title}</span>
                    </div>
                    <Link to={`/cbt?course=${course.id}`}>
                      <Button variant="outline" size="sm">Practice</Button>
                    </Link>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/cbt" className="w-full">
              <Button variant="outline" className="w-full">
                Take a CBT Practice Test
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquareIcon className="mr-2 h-5 w-5" /> Chat Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Department Chat</span>
                <Link to="/chat">
                  <Button variant="ghost" size="sm">Join</Button>
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span>Faculty Chat</span>
                <Link to="/chat">
                  <Button variant="ghost" size="sm">Join</Button>
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span>{user?.level} Level Chat</span>
                <Link to="/chat">
                  <Button variant="ghost" size="sm">Join</Button>
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/chat" className="w-full">
              <Button variant="outline" className="w-full">
                View All Chat Rooms
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUpIcon className="mr-2 h-5 w-5" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4 items-start">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                </div>
              </div>
              <div className="flex space-x-4 items-start">
                <BookIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Questions Viewed</p>
                  <p className="text-xs text-muted-foreground">32 questions this week</p>
                </div>
              </div>
              <div className="flex space-x-4 items-start">
                <UsersIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Study Buddies</p>
                  <p className="text-xs text-muted-foreground">
                    {availableBuddies.length} buddies available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
