// src/app/customers/page.tsx
import { createClient } from '@supabase/supabase-js';
import { CustomersClient } from './CustomersClient';
import { requireAuth } from '@/lib/auth';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: string;
  customer_type: string;
  created_at: string;
  contacts_count?: number;
}

export default async function CustomersPage() {

   // This will redirect to login if not authenticated
  await requireAuth();

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: customers, error } = await supabase
    .from('customers')
    .select(`
      *,
      contacts:contacts(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }

  // Transform data to include contacts count
  const customersWithCount = customers?.map(customer => ({
    ...customer,
    contacts_count: customer.contacts?.[0]?.count || 0
  })) || [];

  return <CustomersClient customers={customersWithCount} />;
}
