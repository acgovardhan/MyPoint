import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Components/Home/Home'
import SubmissionPage from './Components/Student/SubmissionPage'
import ViewSubmissions from './Components/Admin/ViewSubmissions'
import MySubmissions from './Components/Student/MySubmissions'
import Login from './Components/Login/Login'
import SignUp from './Components/SignUp/SignUp'
import Onboarding from './Components/Onboarding/Onboarding'
import Notifications from './Components/HomeNav/Notifications'
import ErrorPage from './Components/Error/ErrorPage'
import AboutPage from './Components/About/AboutPage'
import AdminProfile from './Components/Admin/AdminProfile'
import StudentProfile from './Components/Student/StudentProfile'
import ExportBatchPoints from './Components/Admin/ExportBatchPoints'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Onboarding/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path="/home" element={<Home userRole="student" />} />
        <Route path="/admin/home" element={<Home userRole="admin" />} />
        <Route path='/home/profile' element={<StudentProfile/>}/>
        <Route path='/admin/home/profile' element={<AdminProfile/>}/>
        <Route path='/home/submission' element={<SubmissionPage/>}/>
        <Route path='/home/allsubmissions' element={<MySubmissions/>}/>
        <Route path='/admin/home/viewSubmission' element={<ViewSubmissions/>}/>
        <Route path='/home/notifications' element={<Notifications/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/admin/home/exportdata' element={<ExportBatchPoints/>}/>
        <Route path='*' element={<ErrorPage/>}/>

      </Routes>
    </>
  )
}

export default App
