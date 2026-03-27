import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import Welcome from './Welcome.jsx'
import Login from './Login.jsx'
import TestInstructions from './TestInstructions.jsx'
import CompatibilityCheck from './CompatibilityCheck.jsx'
import AptitudeTest from './AptitudeTest.jsx'
import ResultPortal from './ResultPortal.jsx'
import TechnicalTestRelaxation from './TechnicalTestRelaxation.jsx'
import TechnicalTest from './TechnicalTest.jsx'
import TechnicalResult from './TechnicalResult.jsx'
import CodingTestRelaxation from './CodingTestRelaxation.jsx'
import CodingRound from './CodingRound.jsx'
import CodingTest from './CodingTest.jsx'
import AllTestsCompleted from './AllTestsCompleted.jsx'
import AdminLogin from '../admin/AdminLogin.jsx'
import AdminDashboard from '../admin/AdminDashboard.jsx'
import AdminCodingQuestions from '../admin/AdminCodingQuestions.jsx'
import CodingResultPage from '../admin/CodingResultPage.jsx'

function BackToLoginRedirect() {
  const location = useLocation()

  React.useEffect(() => {
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      const shouldLogout = window.confirm(
        'Going back will log you out.\n\nDo you want to continue?'
      )

      if (shouldLogout) {
        localStorage.clear()
        window.location.replace('http://localhost:5175/login')
        return
      }

      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [location.pathname])

  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BackToLoginRedirect />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test-instructions" element={<TestInstructions />} />
        <Route path="/compatibility-check" element={<CompatibilityCheck />} />
        <Route path="/test" element={<AptitudeTest />} />
        <Route path="/result" element={<ResultPortal />} />
        <Route path="/result-portal" element={<ResultPortal />} />
        <Route path="/technical-test-relaxation" element={<TechnicalTestRelaxation />} />
        <Route path="/technical-test" element={<TechnicalTest />} />
        <Route path="/technical-result" element={<TechnicalResult />} />
        <Route path="/coding-test-relaxation" element={<CodingTestRelaxation />} />
        <Route path="/coding-round" element={<CodingRound />} />
        <Route path="/coding-test" element={<CodingTest />} />
        <Route path="/all-tests-completed" element={<AllTestsCompleted />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/coding-questions" element={<AdminCodingQuestions />} />
        <Route path="/admin/coding-results" element={<CodingResultPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
