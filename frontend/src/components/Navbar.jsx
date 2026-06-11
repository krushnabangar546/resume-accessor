import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/upload', label: 'Upload Resume' },
  { to: '/jobs', label: 'Job Management' }
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-indigo-400 tracking-tight">
          ResumeAssessor
        </Link>
        <div className="flex gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
