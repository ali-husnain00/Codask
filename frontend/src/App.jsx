import React, { useContext } from 'react'
import { Toaster } from "sonner"
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import { Context } from './components/context/context'
import Loader from './components/Loader/Loader'
import ProtectedRoute from './components/ProtectedRoute'
import Editor from './pages/Editor/Editor'
import ProjectDetails from './pages/ProjectDetails/ProjectDetails'
import Landing from './pages/Landing/Landing'

const App = () => {

  const { user , loading } = useContext(Context)

  if(loading){
    return <Loader/>
  }

  return (
    <div className='min-h-dvh w-full bg-[var(--background)]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/editor/:id' element = {<Editor/>}/>
          <Route path='/projectDetail/:id' element = {<ProjectDetails/>} />
        </Route>
        <Route path='*' element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
      <Toaster position='top-center' richColors />
    </div>
  )
}

export default App