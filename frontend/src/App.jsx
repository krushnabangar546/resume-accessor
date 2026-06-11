import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadResume from './pages/UploadResume.jsx';
import JobManagement from './pages/JobManagement.jsx';
import AssessmentResults from './pages/AssessmentResults.jsx';
import CandidateDetails from './pages/CandidateDetails.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadResume />} />
            <Route path="/jobs" element={<JobManagement />} />
            <Route path="/assessments/:resumeId" element={<AssessmentResults />} />
            <Route path="/candidates/:resumeId" element={<CandidateDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
