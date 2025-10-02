import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  BarChart3,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';
import { TreatmentRecord, ComplianceAlert } from '@/types';

interface RegionStats {
  region: string;
  totalFarms: number;
  activeFarms: number;
  complianceRate: number;
  violations: number;
  totalTreatments: number;
}

interface DrugUsageStats {
  drugName: string;
  usageCount: number;
  complianceRate: number;
  violations: number;
}

const RegulatorDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [regionStats, setRegionStats] = useState<RegionStats[]>([]);
  const [drugUsageStats, setDrugUsageStats] = useState<DrugUsageStats[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<ComplianceAlert[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    // Load mock data
    const mockRegionStats: RegionStats[] = [
      {
        region: 'Punjab',
        totalFarms: 145,
        activeFarms: 123,
        complianceRate: 89,
        violations: 12,
        totalTreatments: 1247,
      },
      {
        region: 'Haryana',
        totalFarms: 98,
        activeFarms: 87,
        complianceRate: 92,
        violations: 7,
        totalTreatments: 856,
      },
      {
        region: 'Uttar Pradesh',
        totalFarms: 234,
        activeFarms: 198,
        complianceRate: 85,
        violations: 23,
        totalTreatments: 2134,
      },
    ];

    const mockDrugStats: DrugUsageStats[] = [
      {
        drugName: 'Oxytetracycline',
        usageCount: 456,
        complianceRate: 88,
        violations: 8,
      },
      {
        drugName: 'Amoxicillin',
        usageCount: 324,
        complianceRate: 94,
        violations: 3,
      },
      {
        drugName: 'Enrofloxacin',
        usageCount: 189,
        complianceRate: 91,
        violations: 5,
      },
    ];

    const mockAlerts: ComplianceAlert[] = [
      {
        id: '1',
        type: 'mrl_violation',
        severity: 'high',
        title: t('regulator.complianceIssues'),
        message: t('app.description'),
        treatmentId: '1',
        farmId: 'FARM001',
        dueDate: '2024-01-20',
        acknowledged: false,
        createdAt: '2024-01-18T10:00:00Z',
      },
      {
        id: '2',
        type: 'missing_approval',
        severity: 'medium',
        title: t('vet.pendingApprovals'),
        message: t('common.awaitingVetApproval'),
        treatmentId: '3',
        farmId: 'FARM003',
        dueDate: '2024-01-19',
        acknowledged: false,
        createdAt: '2024-01-17T14:30:00Z',
      },
    ];

    setRegionStats(mockRegionStats);
    setDrugUsageStats(mockDrugStats);
    setRecentAlerts(mockAlerts);
  }, [language, t]);

  const totalFarms = regionStats.reduce((sum, region) => sum + region.totalFarms, 0);
  const totalActiveFarms = regionStats.reduce((sum, region) => sum + region.activeFarms, 0);
  const totalViolations = regionStats.reduce((sum, region) => sum + region.violations, 0);
  const totalTreatments = regionStats.reduce((sum, region) => sum + region.totalTreatments, 0);
  const overallComplianceRate = totalTreatments > 0 ? Math.round(((totalTreatments - totalViolations) / totalTreatments) * 100) : 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">{t('common.welcome')}, {user?.name}</h1>
        <p className="text-primary-foreground/90">{t('common.region')}: {user?.region}</p>
        <p className="mt-2 text-sm">{t('app.description')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7d</SelectItem>
            <SelectItem value="30d">30d</SelectItem>
            <SelectItem value="90d">90d</SelectItem>
            <SelectItem value="1y">1y</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('dashboard.overview')}</SelectItem>
            <SelectItem value="punjab">Punjab</SelectItem>
            <SelectItem value="haryana">Haryana</SelectItem>
            <SelectItem value="up">Uttar Pradesh</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t('regulator.generateReport')}
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('regulator.totalFarms')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFarms}</div>
            <p className="text-xs text-muted-foreground">
              {totalActiveFarms} {t('farmer.activeTreatments')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('farmer.activeTreatments')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTreatments}</div>
            <p className="text-xs text-muted-foreground">{t('common.thisPeriod')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('farmer.complianceScore')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{overallComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">{t('common.overallCompliance')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('regulator.complianceIssues')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalViolations}</div>
            <p className="text-xs text-muted-foreground">{t('common.requireAttention')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('layout.alerts')}</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{recentAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="regions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="regions">{t('dashboard.overview')}</TabsTrigger>
          <TabsTrigger value="drugs">{t('treatment.drug')}</TabsTrigger>
          <TabsTrigger value="alerts">{t('layout.alerts')}</TabsTrigger>
          <TabsTrigger value="compliance">{t('farmer.complianceScore')}</TabsTrigger>
        </TabsList>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.overview')}</CardTitle>
              <CardDescription>{t('app.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionStats.map((region) => (
                  <div key={region.region} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{region.region}</h3>
                      <Badge variant={region.complianceRate >= 90 ? 'default' : 'secondary'}>
                        {region.complianceRate}% Compliance
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('regulator.totalFarms')}</p>
                        <p className="font-semibold">{region.totalFarms}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('farmer.activeTreatments')}</p>
                        <p className="font-semibold">{region.activeFarms}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('treatment.add')}</p>
                        <p className="font-semibold">{region.totalTreatments}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('regulator.complianceIssues')}</p>
                        <p className="font-semibold text-destructive">{region.violations}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('farmer.complianceScore')}</p>
                        <p className="font-semibold text-success">{region.complianceRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drugs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('treatment.drug')}</CardTitle>
              <CardDescription>{t('app.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drugUsageStats.map((drug) => (
                  <div key={drug.drugName} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{drug.drugName}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{drug.usageCount}</Badge>
                        <Badge variant={drug.complianceRate >= 90 ? 'default' : 'secondary'}>
                          {drug.complianceRate}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('dashboard.recentActivity')}</p>
                        <p className="font-semibold">{drug.usageCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('regulator.complianceIssues')}</p>
                        <p className="font-semibold text-destructive">{drug.violations}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('farmer.complianceScore')}</p>
                        <p className="font-semibold text-success">{drug.complianceRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('layout.alerts')}</CardTitle>
              <CardDescription>{t('app.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Active Alerts</h3>
                  <p className="text-muted-foreground">All compliance issues are resolved</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={getSeverityColor(alert.severity) as any}>
                              {alert.severity}
                            </Badge>
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <h3 className="font-semibold">{alert.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{t('common.farmId')}: {alert.farmId}</span>
                            <span>{t('treatment.withdrawalPeriod')}: {alert.dueDate}</span>
                            <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            {t('common.viewDetails')}
                          </Button>
                          <Button size="sm">
                            {t('common.takeAction')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('farmer.complianceScore')}</CardTitle>
              <CardDescription>{t('app.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Compliance Score Distribution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('farmer.complianceScore')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-success">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">67%</div>
                          <p className="text-sm text-muted-foreground">90-100%</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-warning">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-warning">25%</div>
                          <p className="text-sm text-muted-foreground">70-89%</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-destructive">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">8%</div>
                          <p className="text-sm text-muted-foreground">{'<70%'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Enforcement Actions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('regulator.complianceIssues')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{t('regulator.complianceIssues')}</p>
                        <p className="text-sm text-muted-foreground">{t('app.description')}</p>
                      </div>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{t('dashboard.recentActivity')}</p>
                        <p className="text-sm text-muted-foreground">{t('app.description')}</p>
                      </div>
                      <Badge variant="default">Medium Priority</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegulatorDashboard;