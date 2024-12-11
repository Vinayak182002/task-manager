import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuperAdminRegister from "./pages/registration/SuperAdminRegister";
import SuperAdminLogin from "./pages/login/superAdminLogin";
import Home from "./pages/dashboard/Home";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* Add ToastContainer here */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition:Bounce
        />
        <Routes>
          <Route
            path="/super-admin-register"
            element={<SuperAdminRegister />}
          />
          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
