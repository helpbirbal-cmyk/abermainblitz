// src/app/analytics/AnalyticsClient.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  People,
  Schedule,
  Source,
  Analytics as AnalyticsIcon,
  CalendarMonth
} from '@mui/icons-material';

interface Lead {
  status: string;
  timeline: string;
  source: string;
  created_at: string;
}

interface Interaction {
  interaction_type: string;
  interaction_date: string;
}

interface AnalyticsClientProps {
  leads: Lead[];
  interactions: Interaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ff6b6b', '#a05195'];

export function AnalyticsClient({ leads, interactions }: AnalyticsClientProps) {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState('all');
  const [chartView, setChartView] = useState('overview');

  const handleDateRangeChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
  };

  const handleChartViewChange = (event: React.MouseEvent<HTMLElement>, newView: string) => {
    if (newView !== null) {
      setChartView(newView);
    }
  };

  // Filter data based on date range
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (dateRange) {
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        return leads;
    }

    return leads.filter(lead => new Date(lead.created_at) >= filterDate);
  }, [leads, dateRange]);

  // Enhanced metrics calculations
  const metrics = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const newLeads = filteredLeads.filter(lead => lead.status === 'New').length;
    const customers = filteredLeads.filter(lead => lead.status === 'Customer').length;
    const totalInteractions = interactions.length;

    // Conversion rate
    const conversionRate = totalLeads > 0 ? (customers / totalLeads) * 100 : 0;

    // Average lead value (estimated based on status)
    const getEstimatedValue = (status: string) => {
      switch (status) {
        case 'Customer': return 10;
        case 'Qualified': return 4;
        case 'New': return 1;
        default: return 2;
      }
    };

    const averageLeadValue = totalLeads > 0
      ? filteredLeads.reduce((sum, lead) => sum + getEstimatedValue(lead.status), 0) / totalLeads
      : 0;

    // Interaction rate
    const interactionRate = totalLeads > 0 ? (totalInteractions / totalLeads) : 0;

    return {
      totalLeads,
      newLeads,
      customers,
      totalInteractions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageLeadValue: Math.round(averageLeadValue),
      interactionRate: Math.round(interactionRate * 100) / 100
    };
  }, [filteredLeads, interactions]);

  // Process data for charts
  const statusData = useMemo(() => {
    const statusCount = filteredLeads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [filteredLeads]);

  const timelineData = useMemo(() => {
    const timelineCount = filteredLeads.reduce((acc, lead) => {
      acc[lead.timeline] = (acc[lead.timeline] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(timelineCount).map(([name, value]) => ({ name, value }));
  }, [filteredLeads]);

  const sourceData = useMemo(() => {
    const sourceCount = filteredLeads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCount)
      .map(([name, value]) => ({ name, value, percentage: (value / filteredLeads.length) * 100 }))
      .sort((a, b) => b.value - a.value);
  }, [filteredLeads]);

  const interactionData = useMemo(() => {
    const interactionCount = interactions.reduce((acc, interaction) => {
      acc[interaction.interaction_type] = (acc[interaction.interaction_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(interactionCount).map(([name, value]) => ({ name, value }));
  }, [interactions]);

  // Enhanced monthly lead growth with trends
  const monthlyData = useMemo(() => {
    const monthlyCount = filteredLeads.reduce((acc, lead) => {
      const month = new Date(lead.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(monthlyCount)
      .map(([name, leads]) => ({
        name,
        leads,
        // Estimated revenue based on lead count and average value
        revenue: leads * metrics.averageLeadValue
      }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // Return last 6 months for better visibility
    return data.slice(-6);
  }, [filteredLeads, metrics.averageLeadValue]);

  // Weekly performance data
  const weeklyPerformance = useMemo(() => {
    const weeklyData: { week: string; leads: number; interactions: number }[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const weekLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dayLeads = filteredLeads.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate.toDateString() === date.toDateString();
      }).length;

      const dayInteractions = interactions.filter(interaction => {
        const interactionDate = new Date(interaction.interaction_date);
        return interactionDate.toDateString() === date.toDateString();
      }).length;

      weeklyData.push({
        week: weekLabel,
        leads: dayLeads,
        interactions: dayInteractions
      });
    }

    return weeklyData;
  }, [filteredLeads, interactions]);

  // Source effectiveness (based on conversion potential)
  const sourceEffectiveness = useMemo(() => {
    return sourceData.map(source => {
      // Estimate effectiveness based on source (you can customize this logic)
      const getSourceEfficiency = (sourceName: string) => {
        const efficiencyMap: Record<string, number> = {
          'Website': 85,
          'Referral': 90,
          'Social Media': 70,
          'Email': 75,
          'Organic': 80,
          'Paid Ads': 65,
          'Unknown': 50
        };
        return efficiencyMap[sourceName] || 60;
      };

      return {
        subject: source.name,
        efficiency: getSourceEfficiency(source.name),
        fullMark: 100,
      };
    });
  }, [sourceData]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold">
              Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Lead & Business Insights
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} label="Date Range" onChange={handleDateRangeChange}>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={chartView}
            exclusive
            onChange={handleChartViewChange}
            size="small"
          >
            <ToggleButton value="overview">Overview</ToggleButton>
            <ToggleButton value="detailed">Detailed</ToggleButton>
            <ToggleButton value="performance">Performance</ToggleButton>
          </ToggleButtonGroup>

          <Typography
            variant="body2"
            sx={{
              ml: 2,
              p: 1,
              backgroundColor: metrics.conversionRate > 10 ? 'success.light' : 'warning.light',
              color: 'white',
              borderRadius: 1
            }}
          >
            Conversion: {metrics.conversionRate}%
          </Typography>
        </Box>
      </Box>

      {/* Key Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`, color: 'white' }}>
            <CardContent>
              <People sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metrics.totalLeads}
              </Typography>
              <Typography variant="body2">
                Total Leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 2.4 }}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`, color: 'white' }}>
            <CardContent>
              <TrendingUp sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metrics.newLeads}
              </Typography>
              <Typography variant="body2">
                New Leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 2.4 }}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${alpha(theme.palette.warning.main, 0.8)} 100%)`, color: 'white' }}>
            <CardContent>
              <People sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metrics.customers}
              </Typography>
              <Typography variant="body2">
                Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 2.4 }}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.8)} 100%)`, color: 'white' }}>
            <CardContent>
              <Schedule sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metrics.totalInteractions}
              </Typography>
              <Typography variant="body2">
                Interactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, md: 2.4 }}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`, color: 'white' }}>
            <CardContent>
              <AnalyticsIcon sx={{ mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {metrics.averageLeadValue} X
              </Typography>
              <Typography variant="body2">
                Avg Lead Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Lead Status Distribution */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 1, fontSize: 20 }} />
                Lead Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Sources Performance */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Source sx={{ mr: 1, fontSize: 20 }} />
                Lead Sources Performance
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={sourceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Performance */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarMonth sx={{ mr: 1, fontSize: 20 }} />
                Weekly Performance
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={weeklyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="leads" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="interactions" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Lead Growth */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Lead Growth & Revenue Trend
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'leads' ? `${value} leads` : `$${value}`,
                        name === 'leads' ? 'Leads' : 'Revenue'
                      ]}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="leads"
                      stroke="#8884d8"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Source Effectiveness Radar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Source Effectiveness
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <RadarChart data={sourceEffectiveness}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Efficiency" dataKey="efficiency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => [`${Math.round(Number(value))}%`, 'Efficiency']} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timeline Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                    <Bar dataKey="value" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Interaction Types */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interaction Types
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={interactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} interactions`, 'Count']} />
                    <Bar dataKey="value" fill="#FF8042" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
