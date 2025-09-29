import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Stethoscope,
  TrendingUp,
  Users,
  ClipboardCheck,
} from 'lucide-react';
import { TreatmentRecord, COMMON_DRUGS, SPECIES_OPTIONS } from '@/types';
import { toast } from '@/hooks/use-toast';

const VeterinarianDashboard = () => {
  const { user } = useAuth();
  const [pendingTreatments, setPendingTreatments] = useState<TreatmentRecord[]>([]);
  const [approvedTreatments, setApprovedTreatments] = useState<TreatmentRecord[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentRecord | null>(null);
  const [veterinarianNotes, setVeterinarianNotes] = useState('');

  useEffect(() => {
    // Load mock data
    const mockPendingTreatments: TreatmentRecord[] = [
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
      {
        id: '2',
        farmId: 'FARM002',
        animalId: 'BUF_005',
        drugId: 'amoxicillin',
        dosage: 15,
        frequency: 3,
        duration: 5,
        purpose: 'Respiratory infection',
        startDate: '2024-01-16',
        endDate: '2024-01-21',
        withdrawalEndDate: '2024-02-04',
        status: 'active',
        complianceStatus: 'pending',
        veterinarianApproved: false,
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
      },
    ];

    setPendingTreatments(mockPendingTreatments);
  }, []);

  const handleApprove = (treatmentId: string) => {
    const treatment = pendingTreatments.find(t => t.id === treatmentId);
    if (!treatment) return;

    const approvedTreatment: TreatmentRecord = {
      ...treatment,
      veterinarianApproved: true,
      veterinarianId: user?.id,
      veterinarianNotes,
      complianceStatus: 'compliant',
      updatedAt: new Date().toISOString(),
    };

    setPendingTreatments(prev => prev.filter(t => t.id !== treatmentId));
    setApprovedTreatments(prev => [...prev, approvedTreatment]);
    setSelectedTreatment(null);
    setVeterinarianNotes('');

    toast({
      title: 'Treatment Approved',
      description: 'Treatment record has been approved successfully',
    });
  };

  const handleReject = (treatmentId: string) => {
    if (!veterinarianNotes.trim()) {
      toast({
        title: 'Notes Required',
        description: 'Please provide notes for rejection',
        variant: 'destructive',
      });
      return;
    }

    setPendingTreatments(prev => prev.filter(t => t.id !== treatmentId));
    setSelectedTreatment(null);
    setVeterinarianNotes('');

    toast({
      title: 'Treatment Rejected',
      description: 'Treatment record has been rejected and farmer has been notified',
    });
  };

  const renderTreatmentCard = (treatment: TreatmentRecord, showActions = true) => {
    const drug = COMMON_DRUGS.find(d => d.id === treatment.drugId);
    const startDate = new Date(treatment.startDate);
    const withdrawalEndDate = new Date(treatment.withdrawalEndDate);

    return (
      <Card key={treatment.id} className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Stethoscope className="h-4 w-4 mr-2" />
                {drug?.name || 'Unknown Drug'}
              </CardTitle>
              <CardDescription>
                Farm: {treatment.farmId} • Animal: {treatment.animalId}
              </CardDescription>
            </div>
            <Badge variant={treatment.veterinarianApproved ? 'default' : 'secondary'}>
              {treatment.veterinarianApproved ? 'Approved' : 'Pending Review'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Treatment Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Dosage</p>
              <p className="font-medium">{treatment.dosage} mg/kg</p>
            </div>
            <div>
              <p className="text-muted-foreground">Frequency</p>
              <p className="font-medium">{treatment.frequency}x daily</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{treatment.duration} days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{startDate.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Purpose */}
          {treatment.purpose && (
            <div>
              <p className="text-sm text-muted-foreground">Treatment Purpose</p>
              <p className="text-sm">{treatment.purpose}</p>
            </div>
          )}

          {/* Withdrawal Information */}
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Withdrawal Period</p>
            <p className="text-sm text-muted-foreground">
              Products safe for sale after: {withdrawalEndDate.toLocaleDateString()}
            </p>
          </div>

          {/* Veterinarian Notes */}
          {treatment.veterinarianNotes && (
            <div>
              <p className="text-sm text-muted-foreground">Veterinarian Notes</p>
              <p className="text-sm">{treatment.veterinarianNotes}</p>
            </div>
          )}

          {showActions && !treatment.veterinarianApproved && (
            <div className="flex space-x-2">
              <Button
                onClick={() => setSelectedTreatment(treatment)}
                variant="outline"
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Review & Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-primary-foreground/90">Practice ID: {user?.practiceId}</p>
        <p className="mt-2 text-sm">
          Review and approve antimicrobial treatment records from assigned farms
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingTreatments.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedTreatments.length}</div>
            <p className="text-xs text-muted-foreground">Completed reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Farms</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Under supervision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">94%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending Reviews ({pendingTreatments.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Approved ({approvedTreatments.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTreatments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Pending Reviews</h3>
                <p className="text-muted-foreground">All treatment records are up to date</p>
              </CardContent>
            </Card>
          ) : (
            pendingTreatments.map(treatment => renderTreatmentCard(treatment))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedTreatments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Approved Records</h3>
                <p className="text-muted-foreground">Approved treatments will appear here</p>
              </CardContent>
            </Card>
          ) : (
            approvedTreatments.map(treatment => renderTreatmentCard(treatment, false))
          )}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Review Treatment Record
              </CardTitle>
              <CardDescription>
                Approve or reject this antimicrobial treatment record
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTreatmentCard(selectedTreatment, false)}

              <div className="space-y-2">
                <label className="text-sm font-medium">Veterinarian Notes (Required for rejection)</label>
                <Textarea
                  placeholder="Add your professional notes about this treatment..."
                  value={veterinarianNotes}
                  onChange={(e) => setVeterinarianNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleApprove(selectedTreatment.id)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Treatment
                </Button>
                <Button
                  onClick={() => handleReject(selectedTreatment.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject Treatment
                </Button>
                <Button
                  onClick={() => {
                    setSelectedTreatment(null);
                    setVeterinarianNotes('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VeterinarianDashboard;