import React from 'react'
import Navbar from './components/Navbar'
import { Routes ,Route} from 'react-router-dom'
import UserAuthForm from './pages/UserAuthForm'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type="signin" />} />
          <Route path="signup" element={<UserAuthForm type="signup" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App