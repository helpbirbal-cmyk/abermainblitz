// src/components/Calculators/ROICalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import DetailedAnalysisModal from './DetailedROIAnalysisModal';
import {
  CalculatorInputs,
  UserInfo,
  ImpactMetric,
  ROICalculatorProps
} from './types/ROITypes';
import { INDUSTRY_BENCHMARKS } from './data/industryBenchmarks';
import { SavingsPieChart } from './components/SavingsPieChart';
import { Gauge } from './components/Gauge';
import { IndustryInfo } from './components/IndustryInfo';
import { useROICalculations } from './hooks/useROICalculations';
import { useFormSubmission } from './hooks/useFormSubmission';
import SendIcon from '@mui/icons-material/Send';


// Define valid MUI color names
type MuiColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

// Custom Knob component replacement using MUI
interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  size?: 'small' | 'medium';
  label: string;
  color?: MuiColor;
}

function CustomKnob({ value, onChange, min, max, step = 1, label, color = 'primary', size = 'medium' }: KnobProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const knobSize = size === 'small' ? 60 : 80;
  const fontSize = size === 'small' ? '1rem' : '1.25rem';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  // Get the color from theme palette
  const colorValue = theme.palette[color].main;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          position: 'relative',
          width: knobSize,
          height: knobSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `conic-gradient(${colorValue} 0% ${percentage}%, ${
            isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          } ${percentage}% 100%)`,
          borderRadius: '50%',
          border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}
      >
        <Typography
          sx={{
            fontSize,
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : 'text.primary'
          }}
        >
          {value}
        </Typography>
      </Box>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          marginTop: 8
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: isDarkMode ? 'grey.300' : 'grey.600',
          textAlign: 'center'
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function ROICalculator({ onRequestDemo }: ROICalculatorProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [inputs, setInputs] = useState<CalculatorInputs>({
    manualTesters: 5,
    weeklyTestingHours: 40,
    monthlyTestCycles: 20,
    devicesUsed: 10,
    testerSalary: 75000,
    releaseFrequency: 4,
    industry: 'general',
  });

  const {
    isModalOpen,
    isSubmitting,
    submitError,
    formSubmitted,
    showDetailedAnalysis,
    openModal,
    closeModal,
    handleFormSubmission
  } = useFormSubmission();

  const {
    results,
    testCycleCapacity,
    currentBenchmark
  } = useROICalculations(inputs);

  // Auto-update monthlyTestCycles when relevant inputs change
  useEffect(() => {
    const newCapacity = Math.round(testCycleCapacity);
    setInputs(prev => ({
      ...prev,
      monthlyTestCycles: newCapacity
    }));
  }, [inputs.manualTesters, inputs.weeklyTestingHours, inputs.releaseFrequency, inputs.industry, testCycleCapacity]);

  const handleIndustryChange = (industry: string) => {
    const benchmark = INDUSTRY_BENCHMARKS[industry];
    const averageTesters = Math.round((benchmark.typicalTesters[0] + benchmark.typicalTesters[1]) / 2);
    const averageSalary = Math.round((benchmark.typicalSalary[0] + benchmark.typicalSalary[1]) / 2);
    const averageReleases = Math.round((benchmark.typicalReleases[0] + benchmark.typicalReleases[1]) / 2);

    setInputs(prev => ({
      ...prev,
      industry,
      manualTesters: averageTesters,
      testerSalary: averageSalary,
      releaseFrequency: averageReleases,
    }));
  };

  const handleInputChange = (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModalSubmit = async (modalUserInfo: UserInfo) => {
    await handleFormSubmission(modalUserInfo, results, inputs);
  };

  const formatImpactMetrics = (): ImpactMetric[] => {
    if (!results || !inputs || !currentBenchmark) {
      return [];
    }

    const formatCurrency = (amount: number) => {
      if (!amount && amount !== 0) return '$0';
      if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
      }
      return `$${amount}`;
    };

    try {
      return [
        {
          label: "Annual Savings",
          value: formatCurrency(results.totalAnnualSavings),
          change: results.totalAnnualSavings / (inputs.testerSalary * inputs.manualTesters) * 100,
          isPositive: true,
          description: "Total estimated annual cost savings"
        },
        {
          label: "Manual Effort Reduction",
          value: `${results.reductionManualEffort}%`,
          change: results.reductionManualEffort,
          isPositive: true,
          description: "Reduction in manual testing time"
        },
        {
          label: "Testing Efficiency",
          value: `${results.efficiencyIncrease}%`,
          change: results.efficiencyIncrease,
          isPositive: true,
          description: "Increase in testing productivity"
        },
        {
          label: "Release Speed",
          value: `${results.releaseCycleImprovement}%`,
          change: results.releaseCycleImprovement,
          isPositive: true,
          description: "Faster release cycles"
        },
        {
          label: "Test Coverage",
          value: `${results.testingCoverageImprovement}%`,
          change: results.testingCoverageImprovement,
          isPositive: true,
          description: "Improved test coverage"
        },
        {
          label: "Device Cost Savings",
          value: formatCurrency(results.deviceCostSavings),
          change: results.deviceCostSavings / (inputs.devicesUsed * currentBenchmark.deviceCost) * 100,
          isPositive: true,
          description: "Savings from reduced device maintenance"
        }
      ];
    } catch (error) {
      console.error('Error formatting impact metrics:', error);
      return [];
    }
  };

  const impactMetrics = formatImpactMetrics();

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Form with Clean Layout */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          p: 3,
          backgroundColor: isDarkMode ? 'black' : 'white',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : 'text.primary',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Financial Modelling
        </Typography>

        // Replace the entire Grid container section with this optimized version:
    <Grid container spacing={2} justifyContent="center" alignItems="stretch"> {/* Added alignItems stretch */}
      {/* Column 1: Inputs */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          {/* Industry Selection - Fixed height */}
          <Card sx={{
            backgroundColor: isDarkMode ? 'grey.900' : 'grey.50',
            height: 'fit-content'
          }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Industry Settings
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Industry Type</InputLabel>
                <Select
                  value={inputs.industry}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  label="Industry Type"
                >
                  {Object.entries(INDUSTRY_BENCHMARKS).map(([key, benchmark]) => (
                    <MenuItem key={key} value={key}>{benchmark.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IndustryInfo benchmark={currentBenchmark} />
            </CardContent>
          </Card>

          {/* Resource Metrics - Fixed height */}
          <Card sx={{
            backgroundColor: isDarkMode ? 'grey.800' : 'grey.50',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Resource Metrics
              </Typography>
              <Grid container spacing={1} sx={{ flex: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <CustomKnob
                    value={inputs.manualTesters}
                    onChange={(value) => handleInputChange('manualTesters', value)}
                    min={currentBenchmark.typicalTesters[0]}
                    max={currentBenchmark.typicalTesters[1]}
                    label="Testers"
                    color="primary"
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <CustomKnob
                    value={inputs.weeklyTestingHours}
                    onChange={(value) => handleInputChange('weeklyTestingHours', value)}
                    min={10}
                    max={80}
                    label="Hours/Week"
                    color="success"
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                  <CustomKnob
                    value={inputs.testerSalary}
                    onChange={(value) => handleInputChange('testerSalary', value)}
                    min={currentBenchmark.typicalSalary[0]}
                    max={currentBenchmark.typicalSalary[1]}
                    step={5000}
                    label="Salary"
                    color="warning"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                Capacity: {Math.round(testCycleCapacity)} cycles
              </Typography>
            </CardContent>
          </Card>

          {/* Testing Metrics - Fixed height */}
          <Card sx={{
            backgroundColor: isDarkMode ? 'grey.800' : 'grey.50',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Testing Metrics
              </Typography>
              <Grid container spacing={1} sx={{ flex: 1 }}>
                <Grid size={{ xs: 4 }}>
                  <CustomKnob
                    value={inputs.monthlyTestCycles}
                    onChange={(value) => handleInputChange('monthlyTestCycles', value)}
                    min={currentBenchmark.typicalTestCycles[0]}
                    max={currentBenchmark.typicalTestCycles[1]}
                    label="Cycles"
                    color="secondary"
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <CustomKnob
                    value={inputs.devicesUsed}
                    onChange={(value) => handleInputChange('devicesUsed', value)}
                    min={currentBenchmark.typicalDevices[0]}
                    max={currentBenchmark.typicalDevices[1]}
                    label="Devices"
                    color="error"
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <CustomKnob
                    value={inputs.releaseFrequency}
                    onChange={(value) => handleInputChange('releaseFrequency', value)}
                    min={currentBenchmark.typicalReleases[0]}
                    max={currentBenchmark.typicalReleases[1]}
                    label="Releases"
                    color="info"
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>

      {/* Column 2: Integrated Performance & Savings */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          {/* Combined Performance & Savings Card */}
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                Performance & Savings Summary
              </Typography>

              {/* Performance Metrics Grid */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                  Key Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <Gauge
                        value={results.reductionManualEffort}
                        label="Effort Reduction"
                        color="#3b82f6"
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <Gauge
                        value={results.efficiencyIncrease}
                        label="Efficiency"
                        color="#10b981"
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <Gauge
                        value={results.releaseCycleImprovement}
                        label="Release Speed"
                        color="#8b5cf6"
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <Gauge
                        value={results.testingCoverageImprovement}
                        label="Coverage"
                        color="#f59e0b"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Savings Visualization */}
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                  Savings Breakdown
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SavingsPieChart
                    salarySavings={results.annualSalarySavings}
                    deviceSavings={results.deviceCostSavings}
                    totalSavings={results.totalAnnualSavings}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* How it works - Moved here for better balance */}
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                How this Financial Modelling works:
              </Typography>
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Capacity auto-calculates"
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Market-driven device needs"
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Industry benchmarks"
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem' } }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Grid>

      {/* Column 3: Impact & Actions */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          {/* Total Impact - More prominent */}
          <Card sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{
              p: 3,
              textAlign: 'center',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', opacity: 0.9, mb: 1 }}>
                ANNUAL SAVINGS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>
                {formatCurrency(results.totalAnnualSavings)}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Year 1 with automation
              </Typography>
            </CardContent>
          </Card>

          {/* Key Achievements - More compact */}
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Key Achievements
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                      {results.reductionManualEffort}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDarkMode ? 'grey.300' : 'grey.600' }}>
                      Manual Effort Reduced
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 0.5 }}>
                      {results.testingCoverageImprovement}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDarkMode ? 'grey.300' : 'grey.600' }}>
                      Test Coverage Improved
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons - Better spacing */}
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Next Steps
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={openModal}
                  endIcon={<SendIcon />}
                  sx={{ borderRadius: 1, fontWeight: 'bold' }}
                >
                  Get Detailed Analysis
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={onRequestDemo}
                  endIcon={<SendIcon />}
                  sx={{ borderRadius: 1, fontWeight: 'bold' }}
                >
                  Request Demo
                </Button>
              </Box>

              {submitError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {submitError}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
      </Paper>

      {/* Detailed Analysis Modal */}
      {isModalOpen && (
        <DetailedAnalysisModal
          isOpen={isModalOpen}
          onClose={closeModal}
          impactMetrics={impactMetrics}
          onFormSubmit={handleModalSubmit}
        />
      )}

      {/* Detailed Results Display (After submission) */}
      {showDetailedAnalysis && formSubmitted && (
        <Alert
          severity="success"
          sx={{
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Analysis Sent!
          </Typography>
          <Typography variant="body2">
            Check your email for the detailed ROI report.
          </Typography>
        </Alert>
      )}


    </Box>
  );
}
