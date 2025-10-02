import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Target,
} from 'lucide-react';
import { TreatmentRecord, COMMON_DRUGS } from '@/types';

// Color palette for charts
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
};

const PIE_COLORS = [COLORS.success, COLORS.warning, COLORS.danger, COLORS.info, COLORS.purple];

const PowerBIDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');

  useEffect(() => {
    // Generate comprehensive mock data for analytics
    const generateMockTreatments = (): TreatmentRecord[] => {
      const mockData: TreatmentRecord[] = [];
      const statuses = ['active', 'completed', 'withdrawn'] as const;
      const complianceStatuses = ['compliant', 'pending', 'violation'] as const;
      const farms = ['FARM001', 'FARM002', 'FARM003', 'FARM004', 'FARM005'];
      
      for (let i = 1; i <= 150; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 3);
        
        const withdrawalEndDate = new Date(endDate);
        withdrawalEndDate.setDate(withdrawalEndDate.getDate() + Math.floor(Math.random() * 30) + 7);

        mockData.push({
          id: `treatment_${i}`,
          farmId: farms[Math.floor(Math.random() * farms.length)],
          animalId: `ANIMAL_${String(i).padStart(3, '0')}`,
          drugId: COMMON_DRUGS[Math.floor(Math.random() * COMMON_DRUGS.length)].id,
          dosage: Math.floor(Math.random() * 20) + 5,
          frequency: Math.floor(Math.random() * 3) + 1,
          duration: Math.floor(Math.random() * 10) + 3,
          purpose: ['Mastitis treatment', 'Respiratory infection', 'Digestive disorder', 'Wound care', 'Preventive care'][Math.floor(Math.random() * 5)],
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          withdrawalEndDate: withdrawalEndDate.toISOString().split('T')[0],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          complianceStatus: complianceStatuses[Math.floor(Math.random() * complianceStatuses.length)],
          veterinarianApproved: Math.random() > 0.3,
          veterinarianId: Math.random() > 0.5 ? 'VET001' : undefined,
          createdAt: startDate.toISOString(),
          updatedAt: startDate.toISOString(),
        });
      }
      
      return mockData;
    };

    setTreatments(generateMockTreatments());
  }, []);

  // Analytics calculations
  const analytics = React.useMemo(() => {
    const total = treatments.length;
    const active = treatments.filter(t => t.status === 'active').length;
    const completed = treatments.filter(t => t.status === 'completed').length;
    const withdrawn = treatments.filter(t => t.status === 'withdrawn').length;
    const pending = treatments.filter(t => t.complianceStatus === 'pending').length;
    const compliant = treatments.filter(t => t.complianceStatus === 'compliant').length;
    const violations = treatments.filter(t => t.complianceStatus === 'violation').length;
    const approved = treatments.filter(t => t.veterinarianApproved).length;
    
    return {
      total,
      active,
      completed,
      withdrawn,
      pending,
      compliant,
      violations,
      approved,
      complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    };
  }, [treatments]);

  // Pie chart data for medicine status
  const medicineStatusData = [
    { name: 'Active Treatments', value: analytics.active, color: COLORS.info },
    { name: 'Completed', value: analytics.completed, color: COLORS.success },
    { name: 'Withdrawn', value: analytics.withdrawn, color: COLORS.warning },
  ];

  // Compliance status pie chart
  const complianceStatusData = [
    { name: 'Compliant', value: analytics.compliant, color: COLORS.success },
    { name: 'Pending Review', value: analytics.pending, color: COLORS.warning },
    { name: 'Violations', value: analytics.violations, color: COLORS.danger },
  ];

  // Drug usage analysis
  const drugUsageData = React.useMemo(() => {
    const drugCounts = treatments.reduce((acc, treatment) => {
      const drug = COMMON_DRUGS.find(d => d.id === treatment.drugId);
      const drugName = drug?.name || 'Unknown';
      acc[drugName] = (acc[drugName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(drugCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / treatments.length) * 100),
    }));
  }, [treatments]);

  // Monthly trends data
  const monthlyTrendsData = React.useMemo(() => {
    const monthlyData = treatments.reduce((acc, treatment) => {
      const month = new Date(treatment.startDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { month, treatments: 0, compliant: 0, violations: 0 };
      }
      acc[month].treatments += 1;
      if (treatment.complianceStatus === 'compliant') acc[month].compliant += 1;
      if (treatment.complianceStatus === 'violation') acc[month].violations += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [treatments]);

  // Farm performance data
  const farmPerformanceData = React.useMemo(() => {
    const farmData = treatments.reduce((acc, treatment) => {
      if (!acc[treatment.farmId]) {
        acc[treatment.farmId] = { 
          farmId: treatment.farmId, 
          total: 0, 
          compliant: 0, 
          violations: 0,
          complianceRate: 0 
        };
      }
      acc[treatment.farmId].total += 1;
      if (treatment.complianceStatus === 'compliant') acc[treatment.farmId].compliant += 1;
      if (treatment.complianceStatus === 'violation') acc[treatment.farmId].violations += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(farmData).map((farm: any) => ({
      ...farm,
      complianceRate: Math.round((farm.compliant / farm.total) * 100),
    }));
  }, [treatments]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart3 className="h-8 w-8 mr-3" />
              Power BI Analytics Dashboard
            </h1>
            <p className="text-primary-foreground/90 mt-2">
              Comprehensive analysis of antimicrobial usage and compliance metrics
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-foreground/80">Last Updated</p>
            <p className="font-medium">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Treatments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.total}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.complianceRate}%</div>
            <Progress value={analytics.complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting veterinarian approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.violations}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medicine-status">Medicine Status</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="farms">Farm Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Medicine Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Treatment Status Distribution
                </CardTitle>
                <CardDescription>Current status of all treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={medicineStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {medicineStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {medicineStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Compliance Status
                </CardTitle>
                <CardDescription>Regulatory compliance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complianceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {complianceStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drug Usage Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-primary" />
                Drug Usage Analysis
              </CardTitle>
              <CardDescription>Most commonly used antimicrobial drugs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={drugUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicine-status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Detailed Medicine Status Cards */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">Active Treatments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analytics.active}</div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Currently ongoing</p>
                <Progress value={(analytics.active / analytics.total) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{analytics.completed}</div>
                <p className="text-sm text-green-600 dark:text-green-400">Successfully finished</p>
                <Progress value={(analytics.completed / analytics.total) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardHeader>
                <CardTitle className="text-orange-700 dark:text-orange-300">Withdrawn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analytics.withdrawn}</div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Discontinued early</p>
                <Progress value={(analytics.withdrawn / analytics.total) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Interactive Medicine Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Medicine Status Analysis</CardTitle>
              <CardDescription>Click on chart segments for detailed breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={medicineStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {medicineStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status Breakdown</h3>
                  {medicineStatusData.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.name}</span>
                        <Badge style={{ backgroundColor: item.color, color: 'white' }}>
                          {item.value}
                        </Badge>
                      </div>
                      <Progress 
                        value={(item.value / analytics.total) * 100} 
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {((item.value / analytics.total) * 100).toFixed(1)}% of total treatments
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Monthly Treatment Trends
              </CardTitle>
              <CardDescription>Treatment volume and compliance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="treatments" 
                    stackId="1" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary} 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="compliant" 
                    stackId="2" 
                    stroke={COLORS.success} 
                    fill={COLORS.success} 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="violations" 
                    stackId="3" 
                    stroke={COLORS.danger} 
                    fill={COLORS.danger} 
                    fillOpacity={0.6}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Compliance Trend Line */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Rate Trend</CardTitle>
              <CardDescription>Monthly compliance percentage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value: any) => [`${value}%`, 'Compliance Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={(data: any) => Math.round((data.compliant / data.treatments) * 100)}
                    stroke={COLORS.success} 
                    strokeWidth={3}
                    dot={{ fill: COLORS.success, strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farms" className="space-y-4">
          {/* Farm Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Farm Performance Analysis
              </CardTitle>
              <CardDescription>Compliance rates across different farms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={farmPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="farmId" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill={COLORS.primary} name="Total Treatments" />
                  <Bar dataKey="compliant" fill={COLORS.success} name="Compliant" />
                  <Bar dataKey="violations" fill={COLORS.danger} name="Violations" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Farm Compliance Scores */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {farmPerformanceData.map((farm: any, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">{farm.farmId}</CardTitle>
                  <CardDescription>Compliance Performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{farm.complianceRate}%</div>
                  <Progress value={farm.complianceRate} className="mb-4" />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">{farm.total}</div>
                      <div className="text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{farm.compliant}</div>
                      <div className="text-muted-foreground">Compliant</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-600">{farm.violations}</div>
                      <div className="text-muted-foreground">Violations</div>
                    </div>
                  </div>
                </CardContent>
                <div 
                  className="absolute top-0 right-0 w-1 h-full"
                  style={{ 
                    backgroundColor: farm.complianceRate >= 90 ? COLORS.success : 
                                   farm.complianceRate >= 70 ? COLORS.warning : COLORS.danger 
                  }}
                />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
};

export default PowerBIDashboard;
