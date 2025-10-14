"use client";

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
            <div>SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}</div>
            <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</div>
            <div>CLERK_SECRET_KEY: {process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Missing'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
          <h2 className="text-lg font-semibold mb-4">API Test</h2>
          <button 
            onClick={async () => {
              try {
                const res = await fetch('/api/properties');
                const data = await res.text();
                console.log('API Response:', data);
                alert(`API Response: ${data.substring(0, 200)}...`);
              } catch (error) {
                console.error('API Error:', error);
                alert(`API Error: ${error}`);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test API
          </button>
        </div>
      </div>
    </div>
  );
}