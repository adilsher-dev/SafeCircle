import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/routes/ProtectedRoute';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import StartJourneyPage from '@/pages/journey/StartJourneyPage';
import JourneyHistoryPage from '@/pages/journey/JourneyHistoryPage';
import LiveTrackingPage from '@/pages/tracking/LiveTrackingPage';
import AIRiskPredictionPage from '@/pages/ai/AIRiskPredictionPage';
import SosCenterPage from '@/pages/sos/SosCenterPage';
import ContactsPage from '@/pages/contacts/ContactsPage';
import AlertsPage from '@/pages/alerts/AlertsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import SettingsPage from '@/pages/settings/SettingsPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import NotFoundPage from '@/pages/LiveTrackingPage';

export const router = createBrowserRouter([
  {
    element: (
      <PublicOnlyRoute>
        <AuthLayout />
      </PublicOnlyRoute>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/journey/start', element: <StartJourneyPage /> },
      { path: '/journey/history', element: <JourneyHistoryPage /> },
      { path: '/tracking', element: <LiveTrackingPage /> },
      { path: '/ai-risk', element: <AIRiskPredictionPage /> },
      { path: '/sos', element: <SosCenterPage /> },
      { path: '/contacts', element: <ContactsPage /> },
      { path: '/alerts', element: <AlertsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
