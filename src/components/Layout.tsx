import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Tractor, Stethoscope, Shield, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'farmer':
        return <Tractor className="h-5 w-5" />;
      case 'veterinarian':
        return <Stethoscope className="h-5 w-5" />;
      case 'regulator':
        return <Shield className="h-5 w-5" />;
      default:
        return <Tractor className="h-5 w-5" />;
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'farmer':
        return 'किसान (Farmer)';
      case 'veterinarian':
        return 'पशु चिकित्सक (Veterinarian)';
      case 'regulator':
        return 'नियामक (Regulator)';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Tractor className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Farm AMU Portal</h1>
                  <p className="text-xs text-muted-foreground">डिजिटल कृषि प्रबंधन</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Alerts</span>
              </Button>

              <Card className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  {getRoleIcon()}
                  <div className="text-sm">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
                  </div>
                </div>
              </Card>

              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;