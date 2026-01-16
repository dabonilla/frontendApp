import './App.css'

import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { StudentForm } from '@/components/StudentForm';
import { GradesForm } from '@/components/GradesForm';
import { SubjectForm } from '@/components/SubjectForm';
import { Panel } from './components/Panel';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/grades-form" element={<GradesForm />} />
        <Route path="/subject-form" element={<SubjectForm />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </>
  )
}

export default App
