import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tractor, Stethoscope, Shield, Smartphone, Globe, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const { login, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const roles = [
    {
      id: 'farmer' as UserRole,
      title: t('role.farmer'),
      description: t('role.farmer.description'),
      icon: Tractor,
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100',
      border: 'border-green-200 hover:border-green-300'
    },
    {
      id: 'veterinarian' as UserRole,
      title: t('role.veterinarian'),
      description: t('role.veterinarian.description'),
      icon: Stethoscope,
      color: 'text-blue-600',
      bg: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'regulator' as UserRole,
      title: t('role.regulator'),
      description: t('role.regulator.description'),
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100',
      border: 'border-purple-200 hover:border-purple-300'
    },
  ];

  const sendOtp = () => {
    if (!phone || !selectedRole) {
      toast({
        title: 'Error',
        description: 'Please select your role and enter phone number',
        variant: 'destructive',
      });
      return;
    }

    // Simulate OTP sending
    setOtpSent(true);
    toast({
      title: 'OTP Sent',
      description: t('login.anyMobile'),
    });
  };

  const handleLogin = async () => {
    if (!selectedRole) return;

    const success = await login(phone, otp, selectedRole);
    if (success) {
      toast({
        title: 'Login Successful',
        description: `Welcome to ${t('app.title')}`,
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32 bg-white shadow-sm">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="te">తెలుగు</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="p-4 rounded-full bg-primary shadow-lg">
              <Tractor className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('app.title')}</h1>
          <p className="text-muted-foreground">{t('app.subtitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('app.description')}</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{t('login.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('login.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            {!selectedRole && (
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('login.selectRole')}</Label>
                <div className="grid gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <Card
                        key={role.id}
                        className={`cursor-pointer transition-all duration-200 ${role.bg} ${role.border} border-2 hover:shadow-md`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full bg-white shadow-sm`}>
                              <Icon className={`h-8 w-8 ${role.color}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-lg">{role.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phone Input */}
            {selectedRole && !otpSent && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base font-medium">{t('login.mobileNumber')}</Label>
                  <div className="flex">
                    <span className="flex items-center px-4 border border-r-0 rounded-l-md bg-muted text-sm font-medium">+91</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-l-none h-11"
                    />
                  </div>
                </div>
                <Button onClick={sendOtp} className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                  <Smartphone className="h-5 w-5 mr-2" />
                  {t('login.sendOtp')}
                </Button>
              </div>
            )}

            {/* OTP Input */}
            {otpSent && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-base font-medium">{t('login.enterOtp')}</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit OTP (Use 1234 for demo)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    className="h-11 text-center text-lg tracking-widest"
                  />
                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>OTP sent to +91 {phone}</span>
                  </div>
                </div>
                <Button onClick={handleLogin} className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isLoading ? 'Verifying...' : t('login.verifyLogin')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full h-11"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {t('login.changeNumber')}
                </Button>
              </div>
            )}

            {selectedRole && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium text-primary">{t('login.selectedRole')}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {(() => {
                    const role = roles.find((r) => r.id === selectedRole);
                    const Icon = role?.icon;
                    return (
                      <>
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="text-sm font-medium">{role?.title}</span>
                      </>
                    );
                  })()}
                </div>
                {!otpSent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="mt-3 h-8"
                  >
                    {t('login.changeRole')}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">{t('login.demoCredentials')}</p>
            <p className="text-xs text-blue-600">{t('login.anyMobile')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;