// src/app/customers/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CustomerDetailClient } from './CustomerDetailClient';
import { notFound } from 'next/navigation'; // ADD THIS IMPORT


interface PageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createClient();

  try {
    // Check authentication with better error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.log('Auth error:', authError.message);
      // Redirect to login instead of notFound for auth errors
      redirect('/auth/login');
    }

    if (!user) {
      console.log('No user found');
      redirect('/auth/login');
    }

    // Fetch customer data
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (customerError) {
      console.log('Customer fetch error:', customerError);
      // Check if it's an auth error
      if (customerError.code === 'PGRST301' || customerError.message?.includes('JWT')) {
        redirect('/auth/login');
      }
      // Return notFound for non-auth errors
      return notFound();
    }

    if (!customer) {
      console.log('Customer not found');
      return notFound();
    }

    // Fetch contacts for this customer with error handling
    let contacts: any[] = [];
    try {
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('customer_id', id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (!contactsError) {
        contacts = contactsData || [];
      }
    } catch (contactsError) {
      console.log('Error fetching contacts:', contactsError);
      // Continue without contacts
    }

    return (
      <CustomerDetailClient
        customer={customer}
        contacts={contacts}
      />
    );

  } catch (error) {
    console.error('Unexpected error in customer detail:', error);
    // For unexpected errors, redirect to login to reset auth state
    redirect('/auth/login');
  }
}
