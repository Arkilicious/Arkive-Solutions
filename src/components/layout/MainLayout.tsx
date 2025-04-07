
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  BookOpenIcon,
  MessageSquareIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  BookIcon,
  UsersIcon,
  ClipboardCheckIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-uniwise-blue text-white" 
        : "hover:bg-uniwise-light text-foreground hover:text-uniwise-blue"
    )}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const routes = [
    { path: '/dashboard', icon: <HomeIcon size={18} />, text: 'Dashboard' },
    { path: '/browse', icon: <BookIcon size={18} />, text: 'Past Questions' },
    { path: '/chat', icon: <MessageSquareIcon size={18} />, text: 'Chat Rooms' },
    { path: '/study-buddies', icon: <UsersIcon size={18} />, text: 'Study Buddies' },
    { path: '/cbt', icon: <ClipboardCheckIcon size={18} />, text: 'GSS CBT' },
    { path: '/profile', icon: <UserIcon size={18} />, text: 'Profile' },
  ];

  if (!user) {
    return <Outlet />;
  }

  const userInitials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpenIcon size={24} className="text-uniwise-blue" />
            <span className="font-bold text-xl text-uniwise-blue">UniWise</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {routes.map((route) => (
            <NavItem
              key={route.path}
              to={route.path}
              icon={route.icon}
              text={route.text}
              isActive={location.pathname === route.path}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-uniwise-blue text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOutIcon size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-10 flex items-center justify-between p-4 bg-white border-b">
        <Link to="/dashboard" className="flex items-center gap-2">
          <BookOpenIcon size={24} className="text-uniwise-blue" />
          <span className="font-bold text-xl text-uniwise-blue">UniWise</span>
        </Link>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <BookOpenIcon size={24} className="text-uniwise-blue" />
                  <span className="font-bold text-xl text-uniwise-blue">UniWise</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <XIcon size={18} />
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {routes.map((route) => (
                <NavItem
                  key={route.path}
                  to={route.path}
                  icon={route.icon}
                  text={route.text}
                  isActive={location.pathname === route.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>
            
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-uniwise-blue text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Log out"
                >
                  <LogOutIcon size={18} />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
