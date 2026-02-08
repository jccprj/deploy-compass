import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { ViewToggle } from './ViewToggle';
import { GlobalSearch } from './GlobalSearch';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = location.pathname.startsWith('/promote')
    ? 'promote'
    : location.pathname.startsWith('/services')
      ? 'services'
      : 'jira';

  const handleViewChange = (view: 'jira' | 'services' | 'promote') => {
    const routes = { jira: '/jira', services: '/services', promote: '/promote' };
    navigate(routes[view]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Deploy Visibility</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <ViewToggle value={currentView} onChange={handleViewChange} />
            <GlobalSearch />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
