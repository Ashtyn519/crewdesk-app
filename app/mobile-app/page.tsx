import Link from 'next/link'

export default function MobileAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
          <span className="text-blue-400 text-sm font-medium">📱 Mobile App</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
          CrewDesk Mobile
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-4 max-w-2xl mx-auto">
          Manage your crew, projects, and invoices — right from your pocket.
        </p>
        <p className="text-slate-500 mb-12 max-w-xl mx-auto">
          The full power of CrewDesk, now on iOS and Android. Stay connected with your team wherever you are.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="#coming-soon" className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-colors">
            <div className="text-left">
              <div className="text-xs text-slate-500">Download on the</div>
              <div className="font-bold">App Store</div>
            </div>
          </a>
          <a href="#coming-soon" className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-colors">
            <div className="text-left">
              <div className="text-xs text-slate-500">Get it on</div>
              <div className="font-bold">Google Play</div>
            </div>
          </a>
        </div>
        <a href="https://snack.expo.dev/@crewdesk/crewdesk-app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors">
          <span>🚀</span>
          Try Live Demo in Browser
        </a>
        <p className="text-slate-500 text-sm mt-3">No download required — runs instantly in your browser</p>
      </div>
      <div id="coming-soon" className="bg-blue-600/20 border-y border-blue-500/30 py-6 text-center">
        <p className="text-blue-300 font-medium">
          📣 App Store and Google Play launch coming soon — <Link href="/signup" className="underline hover:text-white">Join the waitlist</Link>
        </p>
      </div>
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need, on the go</h2>
        <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
          All the powerful features of CrewDesk, optimized for mobile with a native feel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: 'Dashboard', desc: 'Get a real-time overview of your active projects, crew status, and pending invoices at a glance.' },
            { icon: '📁', title: 'Projects', desc: 'Create and manage projects on the go. Track milestones, deadlines, and team progress in real time.' },
            { icon: '👥', title: 'Crew Management', desc: 'Add crew members, assign roles, and manage availability from your phone.' },
            { icon: '🧾', title: 'Invoices', desc: 'Create, send, and track invoices instantly. Get notified when clients view or pay.' },
            { icon: '💬', title: 'Messages', desc: 'Stay connected with your team through built-in messaging. No third-party apps needed.' },
            { icon: '📝', title: 'Contracts', desc: 'Review and manage contracts on the fly. Keep your agreements organized and accessible.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
          {[
            { stat: '500+', label: 'Crew members managed' },
            { stat: '98%', label: 'Uptime reliability' },
            { stat: '4.9★', label: 'Average user rating' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{item.stat}</div>
              <div className="text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to run your crew smarter?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Start free today on web — the mobile app is coming soon to iOS and Android.
          </p>
          <Link href="/signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-colors">
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}
