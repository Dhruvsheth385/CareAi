import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Bell, Calendar, Users, MessageSquare, Menu, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { to: '/reminders', label: 'Reminders', icon: <Calendar className="h-5 w-5" /> },
    { to: '/social-activities', label: 'Social', icon: <Users className="h-5 w-5" /> },
    { to: '/ai-chat', label: 'AI Chat', icon: <MessageSquare className="h-5 w-5" /> },
    { to: '/emergency-contacts', label: 'Emergency', icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Bell className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">CareAi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-gray-100'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              {icon}
              <span className="ml-1">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-medium text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-gray-100'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              {icon}
              <span className="ml-2">{label}</span>
            </NavLink>
          ))}

          {user && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center px-4 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-medium">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
