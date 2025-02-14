import { useState } from "react";
import { sendVerificationCode, verifyCode, resetPassword } from "../../utils/userUtils";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate()
    const { auth } = useAuth()

    const handleSendCode = async () => {
        try {
            await sendVerificationCode(email);
            setMessage("A verification code has been sent to your email.");
            setStep(2);
        } catch  {
            setMessage("Failed to send code. Please try again.");
        }
    };

    const handleVerifyCode = async () => {
        try {
            await verifyCode(email, code);
            setMessage("Email verified! Now you can reset your password.");
            setStep(3);
        } catch  {
            setMessage("Invalid code. Please try again.");
        }
    };

    const handleResetPassword = async () => {
        try {
            await resetPassword(email, newPassword);
            setMessage("Password reset successful! You can now log in.");
            if (auth.user) {
              navigate('/profile')
            } else {
              navigate('/login')
            }
        } catch  {
            setMessage("Failed to reset password. Try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            {step === 1 && (
                <>
                    <h2 className="text-lg font-bold mb-4">Enter Your Email</h2>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your email"
                    />
                    <button
                        onClick={handleSendCode}
                        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md"
                    >
                        Send Code
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 className="text-lg font-bold mb-4">Enter Verification Code</h2>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter the 6-digit code"
                    />
                    <button
                        onClick={handleVerifyCode}
                        className="mt-3 w-full bg-green-500 text-white py-2 rounded-md"
                    >
                        Verify Code
                    </button>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 className="text-lg font-bold mb-4">Reset Password</h2>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter new password"
                    />
                    <button
                        onClick={handleResetPassword}
                        className="mt-3 w-full bg-purple-500 text-white py-2 rounded-md"
                    >
                        Reset Password
                    </button>
                </>
            )}


            {message && <p className="mt-3 text-red-500">{message}</p>}
        </div>
    );
};

export default ResetPassword;
