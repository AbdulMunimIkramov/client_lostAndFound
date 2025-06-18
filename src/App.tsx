import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PublicationDetailsPage from "./pages/PublicationDetailsPage";
import ChatComponent from "./components/ChatComponent";
import AdminPage from "./pages/AdminPage";
import MyPublications from "./pages/MyPublication";
import AdminAdsPage from "./pages/AdminAdsPage";
import EditPublicationPage from "./components/EditPublicationPage";
// import AdManagementPage from "./pages/AdManagementPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/publications/:id" element={<PublicationDetailsPage />} />
        <Route path="/mypublication" element={<MyPublications />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePostPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatComponent />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/advertisements"
          element={
            <PrivateRoute>
              <AdminAdsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/publication/:id/edit"
          element={
            <PrivateRoute>
              <EditPublicationPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
