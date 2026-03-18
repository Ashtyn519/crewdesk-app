import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-amber-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/dashboard"
          className="bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-amber-300 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
