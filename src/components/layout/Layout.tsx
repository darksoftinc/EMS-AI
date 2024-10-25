import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  BookOpen, 
  Brain, 
  LineChart, 
  LogOut,
  Menu as MenuIcon
} from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { icon: BookOpen, label: 'Müfredat', path: '/curriculum' },
    { icon: Brain, label: 'Quiz', path: '/quiz' },
    { icon: LineChart, label: 'İlerleme', path: '/progress' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 bg-white shadow-lg lg:w-64 w-20 hidden lg:block">
        <div className="h-full px-3 py-4">
          <div className="mb-8 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center w-full px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-3 hidden lg:block">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3 hidden lg:block">Çıkış</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg"
        >
          <MenuIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="h-full px-3 py-4">
              <div className="mb-8 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Çıkış</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-64 ml-20 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;