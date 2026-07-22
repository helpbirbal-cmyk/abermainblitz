// src/types/index.ts
import type { Dayjs } from 'dayjs';

// src/types/index.ts
export interface Organization {
    id: string;
    name: string;
    // add other fields your app uses
}


export interface OrgMemberProfile {
    id: string;        // membership PK
    user_id: string;
    role: 'owner' | 'admin' | 'manager' | 'member';
    email: string;
    full_name: string;
}


export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationMemberWithProfile {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'owner' | 'admin' | 'manager' | 'member';
  created_at: string;
  updated_at: string;
  user_profiles: UserProfile; // ✅ single profile object
}


import { PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    activeButton: {
      background: string;
      text: string;
    };
  }

  interface PaletteOptions {
    activeButton?: {
      background: string;
      text: string;
    };
  }
}

export interface Brief {
  email?: string;
  phone?: string;
  domain?: string;
  snapshot?: string;
  firmographics?: string;
  technographics?: string;
  technology_stack?: string;
  partnerships_suppliers?: string;
  persona?: string;
  intent?: string;
  advisor_summary: string; // required
  summary?: string;        // fallback if parsing fails
}


export type Customer = {
    id: string;
    name: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    status: 'active' | 'inactive' | 'prospect' | 'lead' | null;
    customer_type: 'enterprise' | 'sme' | 'startup' | 'individual' | null;
    industry: string | null;
    created_at: string | null;
    updated_at: string | null;
    converted_from_lead?: string | null; // link to lead if applicable

    // ✅ now references organization_members.id (membership PK)
    assigned_to?: string | null;

    leads?: LeadData[];
    opportunities?: Opportunity[];

    assigned_member?: {
        id: string;
        user_id: string;
        full_name?: string | null;
        email?: string | null;
        role?: string | null;
    } | null;

};


export interface Opportunity {
  id: string;
  name: string;
  stage: string;
  value?: number;
  probability?: number;
  created_at: string;
  created_by: string;
  customer_id: string;
  assigned_to?: string;
}

export interface OrganizationMember {
  id: string;                // PK from organization_members
  user_id: string;           // FK to auth.users
  organization_id: string;   // FK to organizations
  role: 'owner' | 'admin' | 'manager' | 'member';
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}


export interface LeadData {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  title?:string;
  domain?:string;
  project_type?:string;
  timeline?:string;
  pipeline_stage: string;
  lead_score: number;
  probability: number;
  assigned_to?: string;
  created_at: string;
  created_by: string;
  interactions_count?: number;
  lead_type?: 'assessment' | 'calculator';
  source?: string;
  calculator_results_data?: any;
  website_id?: string;
  form_id?: string;
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  converted_to_customer_id?: string;
  converted_at?: string;
  website_name?: string;
  form_name?: string;
  organization_id?: string; // ✅ Add this
  organization_name?: string;
  interactions?: {
  id: string;
  type: string;
  summary: string;
  timestamp: string;
  created_by?: string;
  user_name?: string;
}[];
  stage_changes?: {
    from: string;
    to: string;
    changed_at: string;
    changed_by?: string;
}[];
}

export interface PipelineStage {
  id: string;
  name: string;
  stage_order: number;
  probability: number;
  color: string;
  organization_id: string | null;
  leads: LeadData[];
    slug: string; // ✅ Add this
}

export interface TeamMember {
  user_id: string;
  role: string;
  users: {
    email: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  };
}

export interface FilterState {
  search: string;
  source: string;
  leadType: string;
  scoreMin: number;
  scoreMax: number;
  dateRange: string;
  assignedTo: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

/** export interface LeadData {
  id: string;
  name: string;
  lead_type: 'calculator' | 'assessment';
  pipeline_stage: string;
  source?: string;
  created_at?: string;
  [key: string]: any;
  email?:string;
}

export interface PipelineStage {
  id: string;
  name: string;
  leads: LeadData[];
}

export interface TeamMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  created_at: string;
  name?: string; // optional if you join with auth.users later
}

export interface FilterState {
  query?: string;
  type?: string; // ✅ Allow any string
  source?: string;
  date?: string;
  assignedTo?: string; // 👈 add this
  lead_type?: string; //optional
  status?: string;
} **/

export interface PipelineActionsBarProps {
  filter: FilterState | null; // ✅ Add this
  onFilterChange: (filter: FilterState | null) => void; // ✅ Update this
  onBulkMove: (stage: PipelineStage) => void;
  onAddLead: () => void;
  selectedCount: number;
  teamMembers: TeamMember[];
}


export interface Stage {
  id: string;
  name: string;
  leads: LeadData[];
}
