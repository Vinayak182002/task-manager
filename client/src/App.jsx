import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuperAdminRegister from "./pages/registration/SuperAdminRegister";
import SuperAdminLogin from "./pages/login/superAdminLogin";
import AdminLogin from "./pages/login/AdminLogin";
import EmployeeLogin from "./pages/login/EmployeeLogin";
import Home from "./pages/dashboard/Home";
import SuperAdminDashboard from "./pages/dashboard/super-admin/SuperAdminDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import EmployeeDashboard from "./pages/dashboard/employee/EmployeeDashboard";

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
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/application-admin-dashboard" element={<AdminDashboard department="application"/>} />
          <Route path="/design-admin-dashboard" element={<AdminDashboard department="design"/>} />
          <Route path="/production-admin-dashboard3" element={<AdminDashboard department="production"/>} />
          <Route path="/store-admin-dashboard4" element={<AdminDashboard department="store"/>} />
          <Route path="/quality-admin-dashboard5" element={<AdminDashboard department="quality"/>} />
          <Route path="/purchase-admin-dashboard6" element={<AdminDashboard department="purchase"/>} />
          <Route path="/application-employee-dashboard" element={<EmployeeDashboard department="application" />} />
          <Route path="/design-employee-dashboard" element={<EmployeeDashboard department="design" />} />
          <Route path="/production-employee-dashboard" element={<EmployeeDashboard department="production" />} />
          <Route path="/store-employee-dashboard" element={<EmployeeDashboard department="store" />} />
          <Route path="/quality-employee-dashboard" element={<EmployeeDashboard department="quality" />} />
          <Route path="/purchase-employee-dashboard" element={<EmployeeDashboard department="purchase" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
