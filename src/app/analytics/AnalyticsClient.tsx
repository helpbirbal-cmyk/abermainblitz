// src/app/analytics/AnalyticsClient.tsx
'use client';

import { useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper
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
  Cell
} from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsClient({ leads, interactions }: AnalyticsClientProps) {
  // Process data for charts
  const statusData = useMemo(() => {
    const statusCount = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const timelineData = useMemo(() => {
    const timelineCount = leads.reduce((acc, lead) => {
      acc[lead.timeline] = (acc[lead.timeline] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(timelineCount).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const sourceData = useMemo(() => {
    const sourceCount = leads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCount).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const interactionData = useMemo(() => {
    const interactionCount = interactions.reduce((acc, interaction) => {
      acc[interaction.interaction_type] = (acc[interaction.interaction_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(interactionCount).map(([name, value]) => ({ name, value }));
  }, [interactions]);

  // Monthly lead growth
  const monthlyData = useMemo(() => {
    const monthlyCount = leads.reduce((acc, lead) => {
      const month = new Date(lead.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyCount)
      .map(([name, leads]) => ({ name, leads }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [leads]);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Lead Performance & Insights
      </Typography>

      <Grid container spacing={4}>
        {/* Key Metrics */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Leads
                  </Typography>
                  <Typography variant="h4" component="div">
                    {leads.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    New Leads
                  </Typography>
                  <Typography variant="h4" component="div">
                    {leads.filter(lead => lead.status === 'New').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Customers
                  </Typography>
                  <Typography variant="h4" component="div">
                    {leads.filter(lead => lead.status === 'Customer').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Interactions
                  </Typography>
                  <Typography variant="h4" component="div">
                    {interactions.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Lead Status Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Sources */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Sources
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
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
                    <Tooltip />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Lead Growth */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Lead Growth
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Interaction Types */}
        <Grid size={{ xs: 12 }}>
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
                    <Tooltip />
                    <Bar dataKey="value" fill="#FF8042" />
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
