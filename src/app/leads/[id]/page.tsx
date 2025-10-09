import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { InteractionForm } from './InteractionForm';

// Server-side only - uses service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  message: string;
  source: string;
  demoType: string;
  status: string;
  created_at: string;
}

interface Interaction {
  id: string;
  interaction_type: string;
  interaction_date: string;
  description: string;
  notes: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('lead_assessment_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (leadError || !lead) {
      console.log('Lead not found:', leadError);
      notFound();
    }

    // Fetch interactions for this lead
    let interactions: Interaction[] = [];
    try {
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', id)
        .order('interaction_date', { ascending: false });

      if (!interactionsError) {
        interactions = interactionsData || [];
      }
    } catch (interactionsError) {
      console.log('Interactions table might not exist yet:', interactionsError);
      // Continue without interactions
    }

    // Render the page with plain HTML - no MUI components
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <a
              href="/leads"
              className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Leads
            </a>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {lead.name?.charAt(0)?.toUpperCase() || 'L'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{lead.name || 'No Name'}</h1>
                  <p className="text-lg text-gray-600">{lead.company || 'No Company'}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start lg:items-end">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lead.status === 'New' ? 'bg-gray-100 text-gray-800' :
                  lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                  lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800' :
                  lead.status === 'Customer' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {lead.status || 'New'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lead.timeline?.toLowerCase() === 'urgent' ? 'bg-red-100 text-red-800 border border-red-200' :
                  lead.timeline?.toLowerCase() === 'soon' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  lead.timeline?.toLowerCase() === 'flexible' ? 'bg-green-100 text-green-800 border border-green-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {lead.timeline || 'No timeline'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Lead Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Contact Information
                </h2>
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{lead.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{lead.company || 'Not specified'}</p>
                    </div>
                  </div>

                  {lead.source && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Source</p>
                        <p className="font-medium">{lead.source}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Project Details
                </h2>
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Project Type</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                      {lead.projectType || 'Not specified'}
                    </span>
                  </div>

                  {lead.demoType && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Demo Type</p>
                        <p className="font-medium">{lead.demoType}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Timeline</p>
                      <p className="font-medium">{lead.timeline || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {lead.message && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Message
                  </h2>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interaction History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Interaction History
                </h2>
                <div className="border-t border-gray-200 pt-4">
                  {interactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No interactions yet. Use the form below to add your first interaction.</p>
                  ) : (
                    <div className="space-y-4">
                      {interactions.map((interaction) => (
                        <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                                  {interaction.interaction_type === 'call' ? 'Phone Call' :
                                   interaction.interaction_type === 'email' ? 'Email' :
                                   interaction.interaction_type === 'meeting' ? 'Meeting' :
                                   interaction.interaction_type === 'note' ? 'Note' : interaction.interaction_type}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(interaction.interaction_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="font-medium mb-2">{interaction.description}</p>
                              {interaction.notes && (
                                <p className="text-gray-600 text-sm">{interaction.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Interaction Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Interaction
                </h2>
                <div className="border-t border-gray-200 pt-4">
                  <InteractionForm leadId={lead.id} />
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Timeline
                </h3>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(lead.created_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <a
                    href={`mailto:${lead.email}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </a>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule Meeting
                  </button>
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
