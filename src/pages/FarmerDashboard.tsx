import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Pill,
  Activity,
} from 'lucide-react';
import { TreatmentRecord, ComplianceAlert } from '@/types';
import AddTreatmentDialog from '@/components/AddTreatmentDialog';
import TreatmentCard from '@/components/TreatmentCard';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [complianceScore, setComplianceScore] = useState(85);

  useEffect(() => {
    // Load mock data
    const mockTreatments: TreatmentRecord[] = [
      {
        id: '1',
        farmId: 'FARM001',
        animalId: 'COW_001',
        drugId: 'oxytetracycline',
        dosage: 10,
        frequency: 2,
        duration: 7,
        purpose: 'Mastitis treatment',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        withdrawalEndDate: '2024-02-13',
        status: 'active',
        complianceStatus: 'pending',
        veterinarianApproved: false,
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
      },
    ];

    const mockAlerts: ComplianceAlert[] = [
      {
        id: '1',
        type: 'withdrawal_reminder',
        severity: 'medium',
        title: 'Withdrawal Period Ending Soon',
        message: 'Milk from Cow #001 will be safe for sale in 2 days',
        treatmentId: '1',
        farmId: 'FARM001',
        dueDate: '2024-02-11',
        acknowledged: false,
        createdAt: '2024-01-15T08:00:00Z',
      },
    ];

    setTreatments(mockTreatments);
    setAlerts(mockAlerts);
  }, []);

  const activeTreatments = treatments.filter(t => t.status === 'active');
  const pendingApprovals = treatments.filter(t => !t.veterinarianApproved);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-primary-foreground/90">Farm ID: {user?.farmId}</p>
        <p className="mt-2 text-sm">
          Track your antimicrobial usage and ensure compliance with withdrawal periods
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments.length}</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting vet approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{complianceScore}%</div>
            <Progress value={complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button onClick={() => setShowAddDialog(true)} size="lg" className="flex-1 sm:flex-none">
          <Plus className="h-4 w-4 mr-2" />
          Add Treatment / उपचार जोड़ें
        </Button>
        <Button variant="outline" size="lg">
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Active Alerts / सक्रिय अलर्ट
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 border rounded-md">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                      {alert.severity}
                    </Badge>
                    <h4 className="font-medium">{alert.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {alert.dueDate}</p>
                </div>
                <Button variant="outline" size="sm">
                  Acknowledge
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Treatments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="h-5 w-5 mr-2 text-primary" />
            Active Treatments / सक्रिय उपचार
          </CardTitle>
          <CardDescription>
            Monitor withdrawal periods and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTreatments.length === 0 ? (
            <div className="text-center py-6">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Active Treatments</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first treatment record</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Treatment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTreatments.map((treatment) => (
                <TreatmentCard key={treatment.id} treatment={treatment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Treatment Dialog */}
      <AddTreatmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onTreatmentAdded={(treatment) => {
          setTreatments([...treatments, treatment]);
          setShowAddDialog(false);
        }}
      />
    </div>
  );
};

export default FarmerDashboard;