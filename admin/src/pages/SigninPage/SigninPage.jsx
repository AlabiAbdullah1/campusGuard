import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiReq from "../../lib/apiReq";
import { AdminAuthContext } from "../../context/AuthContext";

import AdminPanelIcon from "@mui/icons-material/AdminPanelSettings";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const SigninPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updateAdmin } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      toast.error("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiReq.post("/auth/admin/signin", {
        username,
        password,
      });

      updateAdmin(res.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signinPage">
      <div className="overlay"></div>
      <div className="container">
        <div className="header-section">
          <div className="header">
            <img src="/campusguard.png" className="logo" />
          </div>
        </div>

        <div className="form-section">
          <h3>Welcome Back!</h3>
          <form onSubmit={handleSubmit} className="form">
            <div className="single-input">
              <label htmlFor="username">Username</label>
              <div className="input">
                <AdminPanelIcon className="icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Admin Username"
                />
              </div>
            </div>

            <div className="single-input">
              <label htmlFor="password">Password</label>
              <div className="input" style={{ position: "relative" }}>
                <LockIcon className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#999",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="signin-btn">
              <span>Sign in</span>
              <LoginIcon className="icon" />
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
