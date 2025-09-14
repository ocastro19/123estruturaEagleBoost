import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../utils/authService';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota
  return <Outlet />;
};