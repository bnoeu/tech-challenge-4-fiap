import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import type { AuthUser } from '../../types';

interface Props {
  children: React.ReactNode;
  requiredRole?: AuthUser['role'];
}

export function PrivateRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
}
