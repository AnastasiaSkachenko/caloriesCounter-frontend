import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // If you're using react-router
import { User } from './interfaces';
import { useRegister } from '../utils/userUtils';

const RegisterPage = () => {
  const [formData, setFormData] = useState<User>({
    id: 0, name: '', age: 18, weight: 0, height: 0, calories_d: 0, protein_d: 0,
    carbohydrate_d: 0, fat_d: 0, activity_level: 1, email: '', exp: 0, gender: 'female', goal: 'lose'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useRegister();
  const navigate = useNavigate(); // Redirect user after successful registration

  // Handle change in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    const userData = {
      ...formData,
      password, // Send password to backend for registration
    };

    const formDataToSend = new FormData();

    // Append form data for image and other fields
    for (const key in userData) {
      const value = userData[key as keyof User];
      if (value !== undefined) {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, String(value)); // Convert value to string for all other types
        }
      }
    }

    await register(formDataToSend);
    navigate('/login');
    setLoading(false);
  };

  return (
    <div className='d-flex flex-column justify-content-center align-items-center bg-secondary' style={{minHeight: '90vh'}}>

      <div className='border rounded px-5 py-4 shadow'>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h2 className='text-center mb-2'>Register</h2>

        <form onSubmit={handleSubmit} >

          <div className='input-group m-2'>
            <div className='input-group-text'><i className="bi bi-person-fill"></i></div>
            <input className='form-control' placeholder='Name...' type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className='input-group m-2'>
            <div className='input-group-text'><i className="bi bi-envelope-fill"></i></div>
            <input className='form-control' placeholder='Email...' type="email" name="email" value={formData.email} onChange={handleChange}required />
          </div>


          <div className='input-group m-2'>
            <div className='input-group-text'><i className="bi bi-lock-fill"></i></div>
            <input className='form-control' placeholder='Password...' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <div className='input-group m-2'>
            <div className='input-group-text'><i className="bi bi-lock-fill"></i></div>
            <input className='form-control' placeholder='Confirm password...' type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}required/>
          </div>
          <div className='d-flex justify-content-center'>
            <button className='btn btn-dark' type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;
