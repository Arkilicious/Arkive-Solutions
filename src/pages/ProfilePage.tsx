
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Settings, ChevronRight, Bell, User, Edit, Upload, Info, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { faculties, departments, levels } = useData();
  const { toast } = useToast();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    faculty: user?.faculty || '',
    department: user?.department || '',
    level: user?.level || ''
  });
  
  const userInitials = user?.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const userFaculty = faculties.find(f => f.id === user?.faculty);
  const userDepartment = departments.find(d => d.id === user?.department);
  
  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
    setIsEditingProfile(false);
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated."
    });
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and settings
        </p>
      </header>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your personal and academic details
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-xl bg-uniwise-blue text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="mt-2">
                  {user?.isSubscribed ? (
                    <Badge className="bg-uniwise-gold text-uniwise-blue">
                      Premium Member
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Free Plan
                    </Badge>
                  )}
                </div>
                <div className="w-full mt-6 space-y-2 text-left">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Faculty</span>
                    <span className="font-medium">{userFaculty?.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium">{userDepartment?.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{user?.level || "Not set"} Level</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">
                      {new Date(user?.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button 
                  onClick={() => setIsEditingProfile(true)} 
                  variant="outline" 
                  className="w-full gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-1 border-red-200 text-red-500 hover:text-red-500 hover:bg-red-50">
                      Logout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Logout</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to logout from your account?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            {/* Main Content Area - Right Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Subscription Status */}
              <Card className="bg-gradient-to-br from-uniwise-blue to-uniwise-dark text-white">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Subscription Status</span>
                    {user?.isSubscribed && (
                      <Badge className="bg-uniwise-gold text-uniwise-blue">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.isSubscribed ? (
                    <div>
                      <p className="mb-4">
                        You are currently on the <strong>Premium Plan</strong> with full access to all features.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm opacity-80">Next billing date</div>
                          <div className="font-medium">June 15, 2023</div>
                        </div>
                        <Button variant="secondary">
                          Manage Subscription
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4">
                        You are currently on the <strong>Free Plan</strong>. Upgrade to Premium for full access to all answers and features.
                      </p>
                      <Link to="/subscribe">
                        <Button>
                          Upgrade to Premium
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest interactions with UniWise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <BookOpen className="h-5 w-5 text-uniwise-blue" />
                        </div>
                        <div>
                          <div className="font-medium">Viewed questions in CSC301</div>
                          <div className="text-sm text-muted-foreground">2 days ago</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <BookOpen className="h-5 w-5 text-uniwise-blue" />
                        </div>
                        <div>
                          <div className="font-medium">Completed GSS102 CBT Practice</div>
                          <div className="text-sm text-muted-foreground">3 days ago</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <BookOpen className="h-5 w-5 text-uniwise-blue" />
                        </div>
                        <div>
                          <div className="font-medium">Joined Computer Science chat room</div>
                          <div className="text-sm text-muted-foreground">1 week ago</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Enrolled Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>
                    Courses you're actively studying
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.courses && user.courses.length > 0 ? (
                    <div className="grid gap-2">
                      {user.courses.map(courseId => (
                        <div key={courseId} className="flex justify-between items-center p-3 rounded-md border">
                          <div>
                            <div className="font-medium">CSC301</div>
                            <div className="text-sm text-muted-foreground">Database Systems</div>
                          </div>
                          <Link to={`/course/${courseId}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't enrolled in any courses yet
                      </p>
                      <Link to="/browse">
                        <Button>Browse Courses</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifs">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates and announcements via email
                      </p>
                    </div>
                    <Switch id="email-notifs" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="study-reminders">Study Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get daily reminders to continue your study sessions
                      </p>
                    </div>
                    <Switch id="study-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="chat-notifs">Chat Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when someone messages you
                      </p>
                    </div>
                    <Switch id="chat-notifs" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="buddy-notifs">Study Buddy Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new study buddy matches and requests
                      </p>
                    </div>
                    <Switch id="buddy-notifs" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifs">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive news about promotions and updates
                      </p>
                    </div>
                    <Switch id="marketing-notifs" />
                  </div>
                </div>
                
                <div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Reminder frequency and quiet hours can be customized in the mobile app.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Preferences</Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-language">Application Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="app-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme-preference">Theme Preference</Label>
                  <Select defaultValue="light">
                    <SelectTrigger id="theme-preference">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Alert className="bg-red-500/10 border-red-500/20">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-500">
                      <div className="font-medium">Danger Zone</div>
                      <p className="font-normal">These actions can't be undone</p>
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-red-200 text-red-500 hover:text-red-500 hover:bg-red-50">
                        Reset Study Progress
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Study Progress</DialogTitle>
                        <DialogDescription>
                          This will clear all your study progress, including viewed questions and CBT results. This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            toast({
                              title: "Progress Reset",
                              description: "Your study progress has been reset."
                            });
                          }}
                        >
                          Reset Progress
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-red-200 text-red-500 hover:text-red-500 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          This will permanently delete your account and all associated data. This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            toast({
                              title: "Account Deleted",
                              description: "Your account has been deleted."
                            });
                            logout();
                          }}
                        >
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your security credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Password Updated",
                      description: "Your password has been successfully changed."
                    });
                  }}
                >
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal and academic information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email}
                onChange={e => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select 
                value={profileData.faculty}
                onValueChange={value => setProfileData({...profileData, faculty: value})}
              >
                <SelectTrigger id="faculty">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={profileData.department}
                onValueChange={value => setProfileData({...profileData, department: value})}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments
                    .filter(dept => profileData.faculty ? dept.facultyId === profileData.faculty : true)
                    .map(department => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select 
                value={profileData.level}
                onValueChange={value => setProfileData({...profileData, level: value})}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level.id} value={level.value}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-uniwise-blue text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
