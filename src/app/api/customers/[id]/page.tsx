import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  status: string;
  customer_type: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  job_title: string;
  department: string;
  is_primary: boolean;
  notes: string;
  created_at: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch customer data
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (customerError || !customer) {
      notFound();
    }

    // Fetch contacts for this customer
    let contacts: Contact[] = [];
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
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/customers"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Customers
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                  <p className="text-lg text-gray-600">{customer.company}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/customers/${customer.id}/edit`}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Edit Customer
                </Link>
                <Link
                  href={`/customers/${customer.id}/contacts/new`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Contact
                </Link>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                customer.status === 'active' ? 'bg-green-100 text-green-800' :
                customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {customer.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                customer.customer_type === 'business'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {customer.customer_type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  )}
                  {customer.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  )}
                  {customer.website && (
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={customer.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800">
                        {customer.website}
                      </a>
                    </div>
                  )}
                  {customer.industry && (
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{customer.industry}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {(customer.address || customer.city || customer.state || customer.country) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                  <div className="space-y-2">
                    {customer.address && <p className="font-medium">{customer.address}</p>}
                    <div className="flex gap-2 text-gray-600">
                      {customer.city && <span>{customer.city}</span>}
                      {customer.state && <span>{customer.state}</span>}
                      {customer.postal_code && <span>{customer.postal_code}</span>}
                    </div>
                    {customer.country && <p className="text-gray-600">{customer.country}</p>}
                  </div>
                </div>
              )}

              {/* Notes */}
              {customer.notes && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Notes</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Meta Information */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(customer.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(customer.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {customer.email && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Send Email
                    </a>
                  )}
                  <Link
                    href={`/customers/${customer.id}/contacts`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    View Contacts ({contacts.length})
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    notFound();
  }
}
