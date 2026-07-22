// src/components/leads/PipelineHeader.tsx
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Slider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
  Stack,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewKanban as ViewKanbanIcon,
  ClearAll as ClearAllIcon,
  Save as SaveIcon,
  UploadFile as UploadFileIcon,
 } from '@mui/icons-material';

 import AddCircleIcon from '@mui/icons-material/AddCircle';

 import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
 import ChevronRightIcon from '@mui/icons-material/ChevronRight';

 import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
 import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';


import { Business as BusinessIcon } from '@mui/icons-material';
import { useState , useEffect} from 'react';
import { OrganizationSwitcher } from '@/components/common/OrganizationSwitcher';
import { FiltersDialog } from '@/components/leads/FiltersDialog';
import Grid from '@mui/material/Grid'; //     use as        <Grid size={{ xs: 12, sm: 6 }}>
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import type { TeamMember , PipelineStage as IPipelineStage} from '@/types';



type Filters = {
  search: string;
  source: string;
  leadType: string;
  scoreMin: number;
  scoreMax: number;
  dateRange: string;
  assignedTo: string;
  startDate: string | null;
  endDate: string | null;
};


interface PipelineHeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  filters: any;
  setFilters: (f: any) => void;
  defaultFilters: any;
  leads: any[];
  selectedLeads: Set<string>;
  teamMembers: any[];
  onAddLead: () => void;
  onExport: (format: 'csv' | 'xlsx') => void;
  onApplyPreset: (preset: any) => void;
  savedPresets: { name: string; filters: any }[];
  setSavedPresets: (presets: { name: string; filters: any }[]) => void;
  onImportCSV: () => void;
  stage: IPipelineStage; // ✅ required for collapse toggle
  isCollapsed: boolean;
  toggleCollapse: (stageId: string) => void;
  collapseAllStages: () => void;
expandAllStages: () => void;
}

export const PipelineHeader = ({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  defaultFilters,
  leads,
  selectedLeads,
  teamMembers,
  onAddLead,
  onExport,
  onApplyPreset,
  savedPresets,
  setSavedPresets,
  onImportCSV,
  stage,
  isCollapsed,
  toggleCollapse,
  collapseAllStages,
  expandAllStages
}: PipelineHeaderProps) => {
  const [showPresets, setShowPresets] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showImport, setShowImport] = useState(false);


  console.log('🧪 stage in header:', stage);

  // User display functions that work without detailed user data
  const getUserDisplayName = (member: TeamMember | null): string => {
    if (!member) return 'Unassigned';

    // If we have user data, use it
    if (member.users) {
      const userData = Array.isArray(member.users) ? member.users[0] : member.users;
      return userData.user_metadata?.full_name ||
             userData.user_metadata?.name ||
             userData.email ||
             `User ${member.user_id.substring(0, 8)}`;
    }

    // Fallback: create friendly names based on user_id and role
    const roleDisplay = member.role.charAt(0).toUpperCase() + member.role.slice(1);
    return `${roleDisplay} (${member.user_id.substring(0, 8)}...)`;
  };

  useEffect(() => {
    const stored = localStorage.getItem('lead_filter_presets');
    if (stored) setSavedPresets(JSON.parse(stored));
  }, []);



  return (
    <Box sx={{ mb: 2 }}>
    {/* Top Bar */}
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ mb: 2 }}
    >
  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
    <Typography variant="h5" fontWeight="bold">Pipeline</Typography>

    <OrganizationSwitcher />

    <Tooltip title="Pipeline View" placement="top-start">
  <IconButton
    size="small"
    onClick={() => setActiveTab(0)}
    sx={{
      backgroundColor: activeTab === 0 ? 'primary.main' : 'transparent',
      color: activeTab === 0 ? 'primary.contrastText' : 'text.secondary',
      border: '1px solid',
      borderColor: activeTab === 0 ? 'primary.main' : 'divider',
      '&:hover': {
        backgroundColor: activeTab === 0 ? 'primary.dark' : 'action.hover'
      }
    }}
  >
    <ViewKanbanIcon fontSize="small" />
  </IconButton>
</Tooltip>

<Tooltip title="List View" placement="top-start">
  <IconButton
    size="small"
    onClick={() => setActiveTab(1)}
    sx={{
      backgroundColor: activeTab === 1 ? 'primary.main' : 'transparent',
      color: activeTab === 1 ? 'primary.contrastText' : 'text.secondary',
      border: '1px solid',
      borderColor: activeTab === 1 ? 'primary.main' : 'divider',
      '&:hover': {
        backgroundColor: activeTab === 1 ? 'primary.dark' : 'action.hover'
      }
    }}
  >
    <ViewListIcon fontSize="small" />
  </IconButton>
</Tooltip>

  </Stack>


  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
    <Tooltip title="Advanced Filters" placement="top-start">
      <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
        <FilterListIcon color={showFilters ? 'primary' : 'inherit'} />
      </IconButton>
    </Tooltip>

    <Tooltip title={isCollapsed ? 'Expand All Stages' : 'Collapse All Stages'} placement="top-start">
    <IconButton
      size="large"
      onClick={isCollapsed ? expandAllStages : collapseAllStages}
      sx={{ fontSize: 28 }} // ✅ controls icon size
    >
      {isCollapsed ? <UnfoldLessIcon fontSize="inherit" /> : <UnfoldMoreIcon fontSize="inherit" />}
    </IconButton>
  </Tooltip>



    <Tooltip title="Export CSV" placement="top-start">
      <IconButton size="small" onClick={() => onExport('csv')}>
        <Badge badgeContent="CSV" color="info" sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.6rem',
            height: 16,
            minWidth: 16,
            padding: '0 4px'
          }
        }}>
          <InsertChartIcon />
        </Badge>
      </IconButton>
    </Tooltip>

    <Tooltip title="Export XLSX" placement="top-start">
      <IconButton size="small" onClick={() => onExport('xlsx')}>
        <Badge badgeContent="XLS" color="info" sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 16,
                minWidth: 16,
                padding: '0 4px'
              }
            }}>
          <TableChartIcon />
        </Badge>
      </IconButton>
    </Tooltip>



    <Tooltip title="Add a New Lead" placement="top-start">
      <IconButton size="small" onClick={onAddLead} >
        <Badge badgeContent="Lead" color="info" sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 16,
                minWidth: 16,
                padding: '0 4px'
              }
            }}>
          <AddCircleIcon />
        </Badge>
      </IconButton>
    </Tooltip>

    <Tooltip title="Import" placement="top-start">
      <IconButton size="small"   onClick={() => {  onImportCSV(); }} >
        <Badge badgeContent="CSV" color="info" sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 16,
                minWidth: 16,
                padding: '0 4px'
              }
            }}>
          <UploadFileIcon />
        </Badge>
      </IconButton>
    </Tooltip>

  </Stack>
</Stack>



    <Collapse in={showFilters}>
      <Divider />
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, p: 2 }}>
        {/* Quick Filter Chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip label="New Today" size="small"    onClick={() => setFilters((f: Filters) => ({ ...f, dateRange: 'today' }))} />
          <Chip label="Unassigned" size="small"   onClick={() => setFilters((f: Filters) => ({ ...f, assignedTo: 'today' }))}/>
          <Chip label="High Score" size="small"   onClick={() => setFilters((f: Filters) => ({ ...f, scoreMin: 70 }))} />
        </Stack>

        {/* Filter Controls */}
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" alignItems="center">
          {/* Search */}
          <Box sx={{ minWidth: 100, flexGrow: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search.."
              value={filters.search}
              onChange={(e) => setFilters((f: Filters) => ({ ...f, search: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          {/* Score Range */}
          <Box sx={{ minWidth: 150 }}>
            <Typography variant="caption">Score Range</Typography>
            <Slider
              size="small"
              value={[filters.scoreMin, filters.scoreMax]}
              onChange={(_, val) => setFilters((f: Filters)=> ({ ...f, scoreMin: val[0], scoreMax: val[1] }))}
              valueLabelDisplay="auto"
              step={5}
              min={0}
              max={100}
            />
          </Box>
          {/* Source */}
          <Box sx={{ minWidth: 160 }}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Source</InputLabel>
              <Select  label="Source" value={filters.source} onChange={(e) => setFilters((f: Filters) => ({ ...f, source: e.target.value }))}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="website_modal">Website Modal</MenuItem>
                <MenuItem value="calculator">Calculator</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Type */}
          <Box sx={{ minWidth: 160 }}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select  label="Type" value={filters.leadType} onChange={(e) => setFilters((f: Filters) => ({ ...f, leadType: e.target.value }))}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="assessment">Assessment</MenuItem>
                <MenuItem value="calculator">Calculator</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Assigned */}
          <Box sx={{ minWidth: 160 }}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Assigned</InputLabel>
              <Select label="Assigned" value={filters.assignedTo} onChange={(e) => setFilters((f: Filters) => ({ ...f, assignedTo: e.target.value }))}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="unassigned">Unassigned</MenuItem>
                {teamMembers.map(tm => (
                  <MenuItem key={tm.user_id} value={tm.user_id}>{tm.name || tm.user_id}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>




          {/* Actions */}
          <Tooltip title="Clear Filters">
            <IconButton size="small" onClick={() => setFilters(defaultFilters)}>
              <ClearAllIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save Filters">
            <IconButton size="small" onClick={() => localStorage.setItem('lead_filters', JSON.stringify(filters))}>
              <SaveIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save as Preset">
            <IconButton
              size="small"
              onClick={() => {
                const name = prompt('Name this filter preset:');
                if (!name) return;
                const newPresets = [...savedPresets, { name, filters }];
                setSavedPresets(newPresets);
                localStorage.setItem('lead_filter_presets', JSON.stringify(newPresets));
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

    </Collapse>

    {/* Filter Summary */}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 1 }}>
      <Chip label={`Filtered: ${leads.length}`} size="small" color="info" />
      {selectedLeads.size > 0 && (
        <Chip label={`Selected: ${selectedLeads.size}`} size="small" color="primary" />
      )}
      {filters.dateRange !== 'all' && (
        <Chip label={`Date: ${filters.dateRange}`} onDelete={() => setFilters((f: Filters) => ({ ...f, dateRange: 'all' }))} />
      )}
      {filters.assignedTo !== 'all' && (
        <Chip
          label={`Assigned: ${filters.assignedTo === 'unassigned' ? 'Unassigned' : getUserDisplayName(teamMembers.find(m => m.user_id === filters.assignedTo) || null)}`}
          onDelete={() => setFilters((f: Filters) => ({ ...f, assignedTo: 'all' }))}
        />
      )}
      {/* Add more chips as needed */}
    </Box>

    {/* Filters Dialog */}
    <FiltersDialog
      open={showFiltersDialog}
      onClose={() => setShowFiltersDialog(false)}
      filters={filters}
      onFiltersChange={setFilters}
      teamMembers={teamMembers}
    />

  </Box>



  );
};
