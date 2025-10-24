import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { CourseProvider } from './contexts/CourseContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import RoleSelection from './components/auth/RoleSelection';
import CandidatRegister from './components/auth/CandidatRegister';
import RecruteurRegister from './components/auth/RecruteurRegister';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import UserManagement from './components/admin/UserManagement';
import Unauthorized from './components/Unauthorized';
import FormationsList from './components/courses/FormationsList';
import FormationDetail from './components/courses/FormationDetail';
import FormationForm from './components/courses/FormationForm';
import CategoriesPage from './components/categories/CategoriesPage';
import EditCategory from './components/categories/EditCategory';
import QuizList from './components/quizzes/QuizList';
import QuizForm from './components/quizzes/QuizForm';
import QuizDetail from './components/quizzes/QuizDetail';
import ApplicationsList from './components/applications/ApplicationsList';
import NotificationsPage from './components/notifications/NotificationsPage';
import Contact from './components/contact/Contact';
import Home from './components/home/Home';

// Pages mot de passe oublié / réinitialisation
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPasswordConfirm from './components/auth/ResetPasswordConfirm';

// 🆕 Composants Entretiens (Google Calendar)
import CandidatList from './components/interviews/CandidatList';
import InterviewList from './components/interviews/InterviewList';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <CourseProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* ✅ Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RoleSelection />} />
                <Route path="/register/candidat" element={<CandidatRegister />} />
                <Route path="/register/recruteur" element={<RecruteurRegister />} />
                <Route path="/register/general" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* 🆕 Mot de passe oublié / réinitialisation */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />

                {/* ✅ Protected routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/formations" element={<FormationsList />} />
                  <Route path="/formations/new" element={<FormationForm />} />
                  <Route path="/formations/:id" element={<FormationDetail />} />
                  <Route path="/formations/:id/edit" element={<FormationForm />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/:id/edit" element={<EditCategory />} />
                  <Route path="/quizzes" element={<QuizList />} />
                  <Route path="/quizzes/new" element={<QuizForm />} />
                  <Route path="/quizzes/:id" element={<QuizDetail />} />
                  <Route path="/quizzes/:id/edit" element={<QuizForm />} />
                  <Route path="/applications" element={<ApplicationsList />} />
                  <Route path="/notifications" element={<NotificationsPage />} />

                  {/* 👑 Admin-only routes */}
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <div className="text-center py-12">
                          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                          <p className="mt-2 text-gray-600">Coming soon...</p>
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  {/* 🧑‍💼 Recruiter-only routes - Entretiens */}
                  <Route
                    path="/recruiter/jobs"
                    element={
                      <ProtectedRoute requiredRole="Recruteur">
                        <div className="text-center py-12">
                          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
                          <p className="mt-2 text-gray-600">Coming soon...</p>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* 🆕 Routes pour la gestion des entretiens (Recruteurs uniquement) */}
                  <Route
                    path="/recruiter/candidats"
                    element={
                      <ProtectedRoute requiredRole="Recruteur">
                        <CandidatList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recruiter/entretiens"
                    element={
                      <ProtectedRoute requiredRole="Recruteur">
                        <InterviewList />
                      </ProtectedRoute>
                    }
                  />

                  {/* 🆕 Routes alternatives (Admin peut aussi accéder) */}
                  <Route
                    path="/candidats"
                    element={
                      <ProtectedRoute>
                        <CandidatList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/entretiens"
                    element={
                      <ProtectedRoute requiredRole="Recruteur">
                        <InterviewList />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* 🚧 Catch-all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>

          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CourseProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;