import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'

import Login from './pages/user/Login'
import Register from './pages/user/Register'
import Dashboard from './pages/user/Dashboard'
import ResetPassword from './pages/user/ResetPassword'
import ForgotPassword from './pages/user/ForgotPassword'
import Profile from './pages/user/Profile'
import Lessons from './pages/lessons/Lessons'
import LessonDetail from './pages/lessons/LessonDetail'
import Achievements from './pages/achievements/Achievements'
import Progress from './pages/progress/Progress'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
