export interface CustomerFilters {
  search: string;
  status: string;
  customerType: string;
  industry: string;
  assignedTo: string;
  dateRange: string;
  startDate: string | null;
  endDate: string | null;
}

export const defaultCustomerFilters: CustomerFilters = {
  search: '',
  status: 'all',
  customerType: 'all',
  industry: 'all',
  assignedTo: 'all',
  dateRange: 'all',
  startDate: null,
  endDate: null,
};
