
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, Users, CheckCircle, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const StudyBuddiesPage: React.FC = () => {
  const { user } = useAuth();
  const { findStudyBuddies, faculties, departments, levels } = useData();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  
  const studyBuddies = findStudyBuddies();
  
  // Filter study buddies based on search and filters
  const filteredBuddies = studyBuddies.filter(buddy => {
    const matchesSearch = searchQuery 
      ? buddy.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesFaculty = selectedFaculty === 'all' 
      ? true
      : buddy.faculty === selectedFaculty;
    
    const matchesDepartment = selectedDepartment === 'all' 
      ? true
      : buddy.department === selectedDepartment;
    
    const matchesLevel = selectedLevel === 'all' 
      ? true
      : buddy.level === selectedLevel;
    
    return matchesSearch && matchesFaculty && matchesDepartment && matchesLevel;
  });
  
  const availableBuddies = filteredBuddies.filter(b => b.status === 'available');
  const busyBuddies = filteredBuddies.filter(b => b.status === 'busy');
  const offlineBuddies = filteredBuddies.filter(b => b.status === 'offline');

  const handleMatchRequest = () => {
    setModalOpen(false);
    
    toast({
      title: "Study Buddy Request Sent!",
      description: "We'll notify you when we find a suitable match."
    });
  };

  const handleConnect = (buddyName: string) => {
    toast({
      title: "Connection Request Sent",
      description: `You've requested to connect with ${buddyName}. They'll be notified shortly.`
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Study Buddies</h1>
            <p className="text-muted-foreground mt-2">
              Connect with other students and find a study partner
            </p>
          </div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Find a Study Buddy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Match with a Study Buddy</DialogTitle>
                <DialogDescription>
                  Tell us about your preferences to find the perfect study partner
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Preferred Study Location</Label>
                  <RadioGroup defaultValue="both">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person">In-person</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Study Time Preference</Label>
                  <RadioGroup defaultValue="evening">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="morning" id="morning" />
                      <Label htmlFor="morning">Morning (6am - 12pm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="afternoon" id="afternoon" />
                      <Label htmlFor="afternoon">Afternoon (12pm - 6pm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evening" id="evening" />
                      <Label htmlFor="evening">Evening (6pm - 12am)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Areas of Interest</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interest-programming" />
                      <Label htmlFor="interest-programming">Programming</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interest-math" />
                      <Label htmlFor="interest-math">Math</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interest-theory" />
                      <Label htmlFor="interest-theory">Theory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interest-practical" />
                      <Label htmlFor="interest-practical">Practical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interest-research" />
                      <Label htmlFor="interest-research">Research</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interest-gss" />
                      <Label htmlFor="interest-gss">GSS Courses</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Study Style</Label>
                  <RadioGroup defaultValue="balanced">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intensive" id="intensive" />
                      <Label htmlFor="intensive">Intensive (long focused sessions)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pomodoro" id="pomodoro" />
                      <Label htmlFor="pomodoro">Pomodoro (short focused bursts)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balanced" id="balanced" />
                      <Label htmlFor="balanced">Balanced (mix of focus and breaks)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleMatchRequest}>Find My Match</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find Study Buddies</CardTitle>
          <CardDescription>
            Filter and search for potential study partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Faculties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(department => (
                    <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level.id} value={level.value}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="available" className="mb-8">
        <TabsList>
          <TabsTrigger value="available" className="gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Available ({availableBuddies.length})
          </TabsTrigger>
          <TabsTrigger value="busy" className="gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Busy ({busyBuddies.length})
          </TabsTrigger>
          <TabsTrigger value="offline" className="gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            Offline ({offlineBuddies.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableBuddies.length > 0 ? (
              availableBuddies.map(buddy => (
                <Card key={buddy.userId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getInitials(buddy.name)}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusClass(buddy.status)}`}></span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{buddy.name}</CardTitle>
                          <CardDescription>{buddy.level} Level • {departments.find(d => d.id === buddy.department)?.name}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {buddy.interests && buddy.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {buddy.interests.map(interest => (
                          <Badge key={interest} variant="outline">{interest}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 gap-1"
                      onClick={() => handleConnect(buddy.name)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-1"
                      onClick={() => {
                        toast({
                          title: "Message Feature",
                          description: "Direct messaging will be available in the next update."
                        });
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No available study buddies</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedFaculty('all');
                  setSelectedDepartment('all');
                  setSelectedLevel('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="busy">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {busyBuddies.length > 0 ? (
              busyBuddies.map(buddy => (
                <Card key={buddy.userId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getInitials(buddy.name)}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusClass(buddy.status)}`}></span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{buddy.name}</CardTitle>
                          <CardDescription>{buddy.level} Level • {departments.find(d => d.id === buddy.department)?.name}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {buddy.interests && buddy.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {buddy.interests.map(interest => (
                          <Badge key={interest} variant="outline">{interest}</Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-yellow-500">Currently busy studying</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 gap-1"
                      onClick={() => handleConnect(buddy.name)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-1"
                      onClick={() => {
                        toast({
                          title: "Message Feature",
                          description: "Direct messaging will be available in the next update."
                        });
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No busy study buddies</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="offline">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offlineBuddies.length > 0 ? (
              offlineBuddies.map(buddy => (
                <Card key={buddy.userId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getInitials(buddy.name)}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusClass(buddy.status)}`}></span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{buddy.name}</CardTitle>
                          <CardDescription>{buddy.level} Level • {departments.find(d => d.id === buddy.department)?.name}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {buddy.interests && buddy.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {buddy.interests.map(interest => (
                          <Badge key={interest} variant="outline">{interest}</Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">Currently offline</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 gap-1"
                      onClick={() => handleConnect(buddy.name)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-1"
                      onClick={() => {
                        toast({
                          title: "Message Feature",
                          description: "Direct messaging will be available in the next update."
                        });
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No offline study buddies</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Study Buddy Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-medium mb-2">Before Connecting</h3>
              <ul className="text-sm space-y-1">
                <li>• Review their profile and interests</li>
                <li>• Check if they're in similar courses</li>
                <li>• Consider your compatible study styles</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">First Meeting</h3>
              <ul className="text-sm space-y-1">
                <li>• Meet in a public place like the library</li>
                <li>• Set clear goals for your study session</li>
                <li>• Exchange contact information</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Effective Partnering</h3>
              <ul className="text-sm space-y-1">
                <li>• Create a regular study schedule</li>
                <li>• Share resources and notes</li>
                <li>• Quiz each other on difficult topics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyBuddiesPage;
