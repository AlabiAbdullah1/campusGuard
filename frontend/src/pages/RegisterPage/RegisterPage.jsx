import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import apiReq from "../../lib/apiReq";
import fireVideo from '../../assets/fire.mp4';
import LockIcon from '@mui/icons-material/Lock';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LoginIcon from '@mui/icons-material/Login';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew';
import UploadWidget from '../../components/UploadWidget/UploadWidget';

export const RegisterPage = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [avatar, setAvatar] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState(false);
  const [fnameError, setFnameError] = useState(false);
  const [lnameError, setLnameError] = useState(false);

  const navigate = useNavigate();

  // Email Validation onChange
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (!validateEmail(newEmail)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  // Validating Input fields
  const handleFnameChange = (e) => {
    setFname(e.target.value);
    setFnameError(false); 
  };

  const handleLnameChange = (e) => {
    setLname(e.target.value);
    setLnameError(false); 
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    setMobileError(false); // reset validation on change
  };

  // Password Validation
  const validatePasswordMatch = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  // State to track the current step
  const [step, setStep] = useState(1);

  const validateStepOne = () => {
    const requiredFields = {
      fname,
      lname,
      mobile,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        toast.error(`Please fill out all the details.`);
        return false;
      }
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    const isMobileValid = mobile.length >= 10 && mobile.length <= 12;
    const isFnameValid = nameRegex.test(fname);
    const isLnameValid = nameRegex.test(lname);

    if (!isMobileValid || !isFnameValid || !isLnameValid) {
      if (!isMobileValid) {
        toast.error('Mobile Number should be 10-12 characters long.');
        setMobileError(true);
      }
      if (!isFnameValid) {
        toast.error('First name should not contain numbers.');
        setFnameError(true);
      }
      if (!isLnameValid) {
        toast.error('Last name should not contain numbers.');
        setLnameError(true);
      }
      return false;
    }

    return true;
  };

  // Handlers for Next and Previous buttons
  const nextStep = () => {
    if (validateStepOne()) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  //Passing data to the backend 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const fname = formData.get('fname');
    const lname = formData.get('lname');
    const email = formData.get('email');
    const password = formData.get('password');
    const mobile = formData.get('mobile');
    const uploadedAvatar = avatar[0];

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !fname ||
      !lname ||
      !mobile
    ) {
      toast.error('Please fill out all fields.');
      setIsLoading(false);
      return;
    }

    if (emailError) {
      toast.error('Enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      toast.error('Password do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiReq.post('/auth/user/register', {
        fname,
        lname,
        email,
        password,
        mobile,
        uploadedAvatar,
      });

      navigate('/signin', { state: { message: 'Registration successful!' } });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage scrollbar">
      <ToastContainer />

      <div className="container">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="form">
            {/* First Step */}
            <div className={`form-step ${step === 1 ? 'active' : ''}`}>
              <div className="header">
                <img src="/shake.png" className="logo" />
                <h3>Tell us about yourself!</h3>
              </div>
              <div className="multi-input-2">
                <div className="single-input">
                  <label htmlFor="fname">First Name</label>
                  <div className={`input ${fnameError ? 'input-error' : ''}`}>
                    <PersonIcon className="icon" />
                    <input
                      type="text"
                      name="fname"
                      placeholder="Enter First Name"
                      value={fname}
                      onChange={handleFnameChange}
                    />
                  </div>
                  {fnameError && (
                    <p className="error-text">Invalid First Name</p>
                  )}
                </div>
                <div className="single-input">
                  <label htmlFor="lname">Last Name</label>
                  <div className={`input ${lnameError ? 'input-error' : ''}`}>
                    <PersonIcon className="icon" />
                    <input
                      type="text"
                      name="lname"
                      placeholder="Enter Last Name"
                      value={lname}
                      onChange={handleLnameChange}
                    />
                  </div>
                  {lnameError && (
                    <p className="error-text">Invalid Last Name</p>
                  )}
                </div>
              </div>

              <div className="single-input">
                <label htmlFor="email">Email</label>
                <div className={`input ${emailError ? 'input-error' : ''}`}>
                  <MailIcon className="icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && <p className="error-text">{emailError}</p>}
              </div>

              <div className="multi-input-2">
                <div className="single-input">
                  <label htmlFor="mobile">Mobile Number</label>
                  <div className={`input ${mobileError ? 'input-error' : ''}`}>
                    <PhoneIcon className="icon" />
                    <input
                      type="number"
                      name="mobile"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                  {mobileError && (
                    <p className="error-text">Enter a valid Mobile</p>
                  )}
                </div>
              </div>

              <div className="multi-input-2">
                <div className="single-input">
                  <label htmlFor="password">Password</label>
                  <div className={`input ${passwordError ? 'input-error' : ''}`}>
                    <LockIcon className="icon" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validatePasswordMatch}
                    />
                  </div>
                </div>
                <div className="single-input">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={`input ${passwordError ? 'input-error' : ''}`}>
                    <LockIcon className="icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={validatePasswordMatch}
                    />
                  </div>
                  {passwordError && (
                    <p className="error-text">{passwordError}</p>
                  )}
                </div>
              </div>

              <div className="btns">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next <NavigateNextIcon />
                </button>
              </div>
            </div>

            {/* Second Step */}
            {/* <div className={`form-step ${step === 2 ? 'active' : ''}`}>
              <div className="header">
                <ArrowBackIcon
                  className="icon-back"
                  onClick={prevStep}
                  style={{ cursor: "pointer" }}
                />
                <h3>Upload your avatar</h3>
              </div>

              <UploadWidget avatar={avatar} setAvatar={setAvatar} />

              <div className="btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : (
                    <>
                      Register <LoginIcon />
                    </>
                  )}
                </button>
              </div>
            </div> */}
             <div className={`form-step ${step === 2 ? 'active' : ''}`}>
              <div className="profileImage">
                <img src={avatar[0] || '/no-avatar.png'} alt="profile-pic" />
                <span>
                  <UploadWidget
                    uwConfig={{
                      cloudName: 'WarmHands',
                      uploadPreset: 'WarmHands',
                      multiple: false,
                      maxImageFileSize: 2000000,
                      folder: 'avatars',
                    }}
                    setState={setAvatar}
                  />
                </span>
              </div>
                 <div className="btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : (
                    <>
                      Register <LoginIcon />
                    </>
                  )}
                </button>
              </div>
              </div>
          </form>
        </div>

        <div className="video-section">
          <video autoPlay loop muted playsInline>
            <source src={fireVideo} type="video/mp4" />
          </video>
          <div className="form-info">
            <h2>Welcome to WarmHands</h2>
            <p>
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
