import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GlobalStyles } from './styles/GlobalStyles';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { PostPage } from './pages/PostPage';
import { LoginPage } from './pages/LoginPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { EditPostPage } from './pages/EditPostPage';
import { AdminPage } from './pages/AdminPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

export default function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas — alunos e visitantes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/acesso-negado" element={<AccessDeniedPage />} />

          {/* Rotas exclusivas para professores */}
          <Route
            path="/criar"
            element={
              <PrivateRoute requiredRole="professor">
                <CreatePostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar/:id"
            element={
              <PrivateRoute requiredRole="professor">
                <EditPostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="professor">
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
