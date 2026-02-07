import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clover, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Clover className="text-primary text-2xl" />
              <span className="font-serif font-bold text-xl">Spiritual Academy</span>
            </Link>
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-8 ml-8">
                <Link 
                  href="/courses" 
                  className={`text-muted-foreground hover:text-foreground transition-colors ${
                    location === '/courses' ? 'text-foreground font-medium' : ''
                  }`}
                  data-testid="nav-courses"
                >
                  Courses
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`text-muted-foreground hover:text-foreground transition-colors ${
                    location === '/dashboard' ? 'text-foreground font-medium' : ''
                  }`}
                  data-testid="nav-dashboard"
                >
                  Dashboard
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center bg-muted rounded-full px-4 py-2 min-w-64">
                <Search className="text-muted-foreground mr-2 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="bg-transparent border-none outline-none text-sm flex-1 p-0 h-auto"
                  data-testid="search-input"
                />
              </div>
            )}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="user-menu">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={(user as any)?.profileImageUrl || ''} alt={(user as any)?.email || ''} />
                      <AvatarFallback>
                        {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center" data-testid="menu-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center" data-testid="menu-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium">
                <Link href="/student-login" data-testid="sign-in-button">
                  Student Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
