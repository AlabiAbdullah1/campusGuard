import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import apiReq from "../../lib/apiReq";
import { AuthContext } from "../../context/AuthContext";
import floodVideo from "../../assets/flood.mp4";
import MailLockIcon from "@mui/icons-material/MailLock";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

export const SigninPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      toast.error("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiReq.post("/auth/user/signin", {
        email,
        password,
      });


      updateUser(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signinPage">
      <div className="container">
        <div className="video-section">
          <video src={floodVideo} autoPlay muted loop></video>
          <div className="video-overlay"></div>

          <div className="text">
            <h2 className="title">
              <span>Safety</span> <span>Through Unity</span>
            </h2>
            <p>Your Campus, Your Protection</p>
          </div>

          <div className="button-section">
            <span className="text">Don&apos;t have an account?</span>
            <Link to={"/register"}>
              <button className="btn">Register</button>
            </Link>
          </div>
        </div>

        <div className="form-section">
          <div className="header">
            <img src="/shake.png" className="logo" />
            <h3>Welcome Back!</h3>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="single-input">
              <label htmlFor="email">Email</label>
              <div className="input">
                <MailLockIcon className="icon" />
                <input type="email" name="email" placeholder="Enter Email" />
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
