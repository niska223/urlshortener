import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Admindashboard from './pages/Admindashboard';
import ProtectedRoute from './Components/ProtectedRoute';

const RedirectToLongUrl = ({ urlList }) => {
  const { id } = useParams();
  const foundUrl = urlList.find((url) => url.id === id);

  if (foundUrl) {
    window.location.href = foundUrl.longUrl;
    return null; // Preventing rendering anything
  }

  return <h2>URL not found</h2>;
};

function App() {
  const [urlList, setUrlList] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/short/:id" element={<RedirectToLongUrl urlList={urlList} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard urlList={urlList} setUrlList={setUrlList} />} />
          <Route path="/admindashboard" element={<Admindashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
