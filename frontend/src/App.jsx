import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from './components/LoginForm'
import Navbar from './components/Navbar'
import MainContent from './components/MainContent'
import ProtectRoute from './components/ProtectRoute'
import SignupForm from './components/SignupForm'
import OTPPage from './components/OTPPage'
import PasswordResetPage from './components/PasswordResetPage'
import { useDispatch } from 'react-redux';
import { getAuthState } from './features/auth/auth.thunk';

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAuthState());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        draggable
        hideProgressBar={true}
        newestOnTop
        limit={3}
      />
      <Navbar />
      <Routes>
        <Route path='/' element={<MainContent />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/verify' element={<OTPPage />} />
        <Route path='/reset-password' element={<PasswordResetPage />} />

        <Route element={<ProtectRoute />}>
        </Route>
      </Routes>
    </div>
  )
}

export default App