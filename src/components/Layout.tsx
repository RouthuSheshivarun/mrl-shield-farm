import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Tractor, Stethoscope, Shield, Bell, Globe, User, Home, Activity, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

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
        return t('role.farmer');
      case 'veterinarian':
        return t('role.veterinarian');
      case 'regulator':
        return t('role.regulator');
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tractor className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{t('app.title')}</h1>
                  <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Navigation Buttons */}
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Dashboard</span>
              </Button>
              
              <Button 
                variant={location.pathname === '/analytics' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => navigate('/analytics')}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Analytics</span>
              </Button>

              {/* Language Selector */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                </SelectContent>
              </Select>

              {/* Alerts Button */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">{t('layout.alerts')}</span>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse"></div>
              </Button>

              {/* User Info Card */}
              <Card className="px-4 py-2 bg-primary/5 border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-primary/20">
                    {getRoleIcon()}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <p className="font-medium">{user?.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>{getRoleLabel()}</span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Logout Button */}
              <Button variant="outline" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:border-destructive">
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">{t('layout.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          <span>{t('dashboard.overview')}</span>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;