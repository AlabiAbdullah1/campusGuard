// pages/VerifyPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/auth/user/verify/${token}`);
                toast.success(res.data.message);
                navigate("/signin");
            } catch (err) {
                toast.error(err.response?.data?.error || "Verification failed.");
            }
        };
        verify();
    }, [token]);

    return <div className="loading-container">Verifying...</div>;
};

export default VerifyPage;
