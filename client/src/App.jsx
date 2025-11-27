import { Route, Routes } from 'react-router-dom'
import './App.css'

import { Home, Login, Register, Profile, Footer } from './components/General'

import { HomeAdmin } from './components/Admin'

import { HomeRector } from './components/Rector'

import { HomeStudent, LoginStudent } from './components/Student'

import { SeeStudents, AddNotes, ModNotes, HomeTeacher } from './components/Teacher'

function App() {
  return (
    <>
      <main className="contenido-principal">
        <Routes>
          {/* RUTAS GENERALES */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />

          {/* ADMIN */}
          <Route path='/admin/home' element={<HomeAdmin />} />

          {/* RECTOR */}
          <Route path='/rector/home' element={<HomeRector />} />

          {/* STUDENT */}
          <Route path='/student/home' element={<HomeStudent />} />
          <Route path='/student/login' element={<LoginStudent />} />

          {/* TEACHER */}
          <Route path='/teacher/home' element={<HomeTeacher />} />
          <Route path='/teacher/alumns/:ClassSection_id' element={<SeeStudents />} />
          <Route path='/teacher/notes/add' element={<AddNotes />} />
          <Route path='/teacher/notes/mod' element={<ModNotes />} />

          {/* 404 */}
          <Route path='*' element={<div><h1>404 Not found</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App