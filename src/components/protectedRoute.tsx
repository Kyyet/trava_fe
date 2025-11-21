import { Navigate } from 'react-router-dom';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const isAuth = localStorage.getItem('isAuth');

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}