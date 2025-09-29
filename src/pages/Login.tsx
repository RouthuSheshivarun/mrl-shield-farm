import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tractor, Stethoscope, Shield, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const { login, isLoading } = useAuth();

  const roles = [
    {
      id: 'farmer' as UserRole,
      title: 'किसान (Farmer)',
      description: 'दवा का रिकॉर्ड रखें',
      icon: Tractor,
    },
    {
      id: 'veterinarian' as UserRole,
      title: 'पशु चिकित्सक (Veterinarian)',
      description: 'उपचार की पुष्टि करें',
      icon: Stethoscope,
    },
    {
      id: 'regulator' as UserRole,
      title: 'नियामक (Regulator)',
      description: 'अनुपालन की निगरानी करें',
      icon: Shield,
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
      description: 'Enter 1234 as OTP for demo (Use 1234 for all logins)',
    });
  };

  const handleLogin = async () => {
    if (!selectedRole) return;

    const success = await login(phone, otp, selectedRole);
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome to Farm AMU Portal',
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Tractor className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Farm AMU Portal</h1>
          <p className="text-muted-foreground mt-2">डिजिटल कृषि प्रबंधन पोर्टल</p>
          <p className="text-sm text-muted-foreground">Antimicrobial Usage Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login / लॉगिन करें</CardTitle>
            <CardDescription>
              Select your role and login with mobile OTP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role Selection */}
            {!selectedRole && (
              <div className="space-y-3">
                <Label>Select Your Role / अपनी भूमिका चुनें</Label>
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Card
                      key={role.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-semibold">{role.title}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Phone Input */}
            {selectedRole && !otpSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number / मोबाइल नंबर</Label>
                  <div className="flex">
                    <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">+91</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <Button onClick={sendOtp} className="w-full" disabled={isLoading}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Send OTP / ओटीपी भेजें
                </Button>
              </div>
            )}

            {/* OTP Input */}
            {otpSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP / ओटीपी दर्ज करें</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit OTP (Use 1234 for demo)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    OTP sent to +91 {phone}
                  </p>
                </div>
                <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full"
                >
                  Change Number
                </Button>
              </div>
            )}

            {selectedRole && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Selected Role:</p>
                <p className="text-sm text-muted-foreground">
                  {roles.find((r) => r.id === selectedRole)?.title}
                </p>
                {!otpSent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="mt-2"
                  >
                    Change Role
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Any mobile number + OTP: 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;