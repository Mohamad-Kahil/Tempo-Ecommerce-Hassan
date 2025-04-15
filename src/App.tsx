import React, { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import CartPage from "./components/cart/CartPage";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import ProfilePage from "./components/profile/ProfilePage";
import AdminDashboard from "./components/admin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import routes from "tempo-routes";
import ProductPage from "./pages/product/[id]";
import CategoryPage from "./pages/category/[id]";
import SearchPage from "./pages/search";
import NotFoundPage from "./pages/404";

// Lazy load the supplier page
const SupplierPage = React.lazy(() => import("./pages/supplier/[id]"));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

function AppRoutes() {
  // Use the tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* Render tempo routes outside of the Routes component */}
      {tempoRoutes}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/supplier/:id" element={<SupplierPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/categories" element={<Home />} />
        <Route path="/products" element={<Home />} />
        <Route path="/suppliers" element={<Home />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
