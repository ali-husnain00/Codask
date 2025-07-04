import React, { useContext } from 'react'
import "./App.css"
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

const App = () => {

  const { user , loading } = useContext(Context)

  if(loading){
    return <Loader/>
  }

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route
          path="/"element={loading ? (<Loader />) : user ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />
            )
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/editor/:id' element = {<Editor/>}/>
          <Route path='/projectDetail/:id' element = {<ProjectDetails/>} />
          </Route>
      </Routes>
      <Toaster position='top-center' richColors />
    </div>
  )
}

export default App