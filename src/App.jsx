import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Feed from "./pages/Feed";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
          <div>
            <Helmet>
             <title>X</title>
            </Helmet>
            <AuthPage />
          </div>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/feed"
            element={
              <div>
                <Helmet>
                  <title>Anasayfa / X</title>
                </Helmet>
                <Feed />
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
