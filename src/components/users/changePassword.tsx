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
    <div className="max-w-md mx-auto p-6 bg-secondary shadow-md rounded-lg vh-100 d-flex justify-content-center align-items-center">
      <div className="border rounded p-4">
        {step === 1 && (
          <>
            <h3 className="form-label ">Enter Your Email</h3>
            <div className="d-flex justify-content-center align-items-center gap-2" style={{width: '30em'}}>
              <input  type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control  form-control-sm my-3" placeholder="Enter your email"/>
              <button  onClick={handleSendCode} className="btn btn-dark flex-shrink-0">Send Code</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="form-label">Enter Verification Code</h2>
            <div className="d-flex justify-content-center align-items-center gap-2" style={{width: '30em'}}>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="form-control  form-control-sm" placeholder="Enter the 6-digit code"/>
              <button onClick={handleVerifyCode} className="btn btn-dark flex-shrink-0">Verify Code</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="form-label">Reset Password</h2>
            <div className="d-flex justify-content-center align-items-center gap-2" style={{width: '30em'}}>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control  form-control-sm" placeholder="Enter new password"/>
              <button onClick={handleResetPassword} className="btn btn-dark flex-shrink-0">Reset Password</button>
            </div>
          </>
        )}

        {message && <p className="mt-3 text-red-500">{message}</p>}
      </div>

    </div>
  );
};

export default ResetPassword;
