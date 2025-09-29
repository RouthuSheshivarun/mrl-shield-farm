import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Pill,
  User,
  MapPin,
} from 'lucide-react';
import { TreatmentRecord, COMMON_DRUGS, SPECIES_OPTIONS } from '@/types';

interface TreatmentCardProps {
  treatment: TreatmentRecord;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const drug = COMMON_DRUGS.find(d => d.id === treatment.drugId);
  const species = SPECIES_OPTIONS.find(s => 
    treatment.animalId.toLowerCase().includes('cow') ? s.value === 'cattle' : 
    treatment.animalId.toLowerCase().includes('buf') ? s.value === 'buffalo' :
    treatment.animalId.toLowerCase().includes('goat') ? s.value === 'goat' :
    s.value === 'cattle'
  );

  const startDate = new Date(treatment.startDate);
  const endDate = new Date(treatment.endDate);
  const withdrawalEndDate = new Date(treatment.withdrawalEndDate);
  const today = new Date();

  const treatmentDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const withdrawalDays = Math.ceil((withdrawalEndDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilWithdrawalEnd = Math.ceil((withdrawalEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    switch (treatment.complianceStatus) {
      case 'compliant':
        return 'success';
      case 'violation':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (treatment.complianceStatus) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'violation':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const withdrawalProgress = Math.max(0, Math.min(100, ((withdrawalDays - daysUntilWithdrawalEnd) / withdrawalDays) * 100));

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">{drug?.name || 'Unknown Drug'}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Animal: {treatment.animalId}</span>
                {species && (
                  <>
                    <span>•</span>
                    <span>{species.icon} {species.label.split(' /')[0]}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor() as any} className="flex items-center space-x-1">
              {getStatusIcon()}
              <span>{treatment.complianceStatus}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Treatment Details */}
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
            <p className="text-muted-foreground">Started</p>
            <p className="font-medium">{startDate.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Purpose */}
        {treatment.purpose && (
          <div>
            <p className="text-sm text-muted-foreground">Purpose</p>
            <p className="text-sm">{treatment.purpose}</p>
          </div>
        )}

        {/* Withdrawal Period Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Withdrawal Period</p>
            <Badge variant="outline" className="text-xs">
              {daysUntilWithdrawalEnd > 0 ? `${daysUntilWithdrawalEnd} days left` : 'Complete'}
            </Badge>
          </div>
          <Progress value={withdrawalProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Started: {endDate.toLocaleDateString()}</span>
            <span>Safe: {withdrawalEndDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Veterinary Approval Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${treatment.veterinarianApproved ? 'bg-success' : 'bg-warning'}`} />
            <span className="text-sm">
              {treatment.veterinarianApproved ? 'Veterinarian Approved' : 'Pending Vet Approval'}
            </span>
          </div>
          {!treatment.veterinarianApproved && (
            <Badge variant="outline" className="text-xs">
              Action Required
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {daysUntilWithdrawalEnd <= 0 && treatment.veterinarianApproved && (
            <Button size="sm" className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Safe for Sale
            </Button>
          )}
        </div>

        {/* Alerts */}
        {daysUntilWithdrawalEnd <= 2 && daysUntilWithdrawalEnd > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <div className="text-sm">
              <p className="font-medium text-warning">Withdrawal Period Ending Soon</p>
              <p className="text-muted-foreground">
                Products will be safe for sale in {daysUntilWithdrawalEnd} days
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TreatmentCard;