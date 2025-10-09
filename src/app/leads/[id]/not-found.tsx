import Link from 'next/link';

export default function LeadNotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#d32f2f',
          marginBottom: '16px'
        }}>
          Lead Not Found
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#666',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          The lead you're looking for doesn't exist or may have been deleted.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link
            href="/leads"
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Leads
          </Link>
        </div>
      </div>
    </div>
  );
}
