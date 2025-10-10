import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { CustomerDetailClient } from './CustomerDetailClient';
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
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  created_at: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  // This will redirect to login if not authenticated
  await requireAuth();

  const { id } = await params;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch customer data
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !customer) {
      console.log('Customer not found:', error);
      notFound();
    }

    // Fetch contacts for this customer
    let contacts: Contact[] = [];
    try {
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (!contactsError) {
        contacts = contactsData || [];
      }
    } catch (contactsError) {
      console.log('Error fetching contacts:', contactsError);
      // Continue without contacts
    }

    return <CustomerDetailClient customer={customer} contacts={contacts} />;

  } catch (error) {
    console.error('Unexpected error:', error);
    notFound();
  }
}
