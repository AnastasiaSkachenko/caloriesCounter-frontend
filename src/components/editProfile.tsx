import useAuth  from "../hooks/useAuth";
import { useState } from "react";
import { User } from "./interfaces";
import { useModify } from "../utils/userUtils";

interface EditProfile  {
  onExit: () => void
}



const EditProfile: React.FC<EditProfile> = ({onExit}) => {
  const { auth } = useAuth()

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<User>(auth.user??{
    id: 0, name: '', age: 18, weight: 0, height: 0, calories_d: 0, protein_d: 0,
    carbohydrate_d: 0, fat_d: 0, activity_level: 1, email: '', exp: 0, gender: 'female', goal: 'lose'
  });
  const [recalculateMacros, setRecalculateMacros] = useState(true)
  const { modify } = useModify()



  // Handle change in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file)
      setFormData(prev => ({...prev, image: file}))

    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: 'activity_level' | 'gender' | 'goal') => {
    setFormData(prevData =>  {
      console.log(field, e.target.value)
      return {
        ...prevData,
        [field]: field == 'activity_level' ? Number(e.target.value) : e.target.value,
      };
  
      })
  };

 
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const userData = formData

    

    console.log(userData, 'userdata')
 

    const formDataToSend = new FormData();

    if (userData.image && typeof userData.image !== 'string') {
      formDataToSend.append('image', userData.image);
    }
    // Append other form data fields
    for (const key in userData) {
      const value = userData[key as keyof User];
      if (value !== undefined) {
        if (key !== 'image') {
          // Append all fields except image as string
          formDataToSend.append(key, String(value));
        }
      }
    }
    await modify(formDataToSend, recalculateMacros);
    setLoading(false);
    onExit()
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onExit();
  };
  
  
  return (
    <form onSubmit={handleSubmit} >
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h5 className="my-1">General info</h5>
      <div className='input-group m-2'>
        <div className='input-group-text'><i className="bi bi-person-fill"></i></div>
        <input className='form-control' placeholder='Name...' type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className='input-group m-2'>
        <div className='input-group-text'><i className="bi bi-envelope-fill"></i></div>
        <input className='form-control' placeholder='Email...' type="email" name="email" value={formData.email} onChange={handleChange}required />
      </div>

      <div className="d-flex justify-content-end">
        <a className="text-white" href="/change-password">Click here to change password</a>
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Image</label>
        <div className="input-group">
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>
      {(auth.user?.calories_d && auth.user?.calories_d > 0 ) ? (
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" onChange={(e) => setRecalculateMacros(e.target.checked)} role="switch" id="flexSwitchCheckDefault" checked={recalculateMacros}/>
          <label className="form-check-label">Calculate macros</label>
        </div>
      ): (<></>)}

      <h5 className="m-1">Body info</h5>

      <div className='input-group m-2'>
        <div className='input-group-text'><i className="fa-solid fa-weight-hanging"></i></div>
        <input className='form-control' placeholder='Weight...' type="number" name="weight" value={formData.weight} onChange={handleChange} required />
      </div>

      <div className='input-group m-2'>
        <div className='input-group-text'><i className=" fa-solid fa-ruler"></i></div>
        <input className='form-control' placeholder='Height...' type="number" name="height" value={formData.height} onChange={handleChange}required />
      </div>

      <div className='input-group m-2'>
        <div className='input-group-text'><i className="bi fa-solid fa-cake-candles"></i></div>
        <input className='form-control' placeholder='Age...' type="number" name="age" value={formData.age} onChange={handleChange}required />
      </div>

      <div className="input-group m-2" >
        <div className="input-group-text">
          <i className=" fa-solid fa-person-running"></i>
        </div>
        <select 
          className="form-control" 
          name="activity_level" 
          value={formData.activity_level} 
          onChange={(e) => handleSelectChange(e, 'activity_level')} 
          required
        >
          <option value="1">1 - Sedentary (Little or no exercise)</option>
          <option value="2">2 - Lightly active (Light exercise 1-3 days/week)</option>
          <option value="3">3 - Moderately active (Moderate exercise 3-5 days/week)</option>
          <option value="4">4 - Very active (Hard exercise 6-7 days/week)</option>
          <option value="5">5 - Super active (Very intense exercise, physical job)</option>
        </select>
      </div>

      <div className="input-group m-2" >
        <div className="input-group-text">
          <i className=" fa-solid fa-venus-mars"></i>
        </div>
        <select 
          className="form-control" 
          name="gender" 
          value={formData.gender} 
          onChange={(e) => handleSelectChange(e, 'gender')} 
          required
        >
          <option value="female">Woman</option>
          <option value="male">Man</option>
        </select>
      </div>


      <div className="input-group m-2" >
        <div className="input-group-text">
          <i className=" fa-solid fa-bullseye"></i>
        </div>
        <select 
          className="form-control" 
          name="goal" 
          value={formData.goal} 
          onChange={(e) => handleSelectChange(e, 'goal')} 
          required
        >                     
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Muscles</option>
        </select>
      </div>

      <div className='d-flex justify-content-center'>
        <button className='btn btn-dark' type="submit" disabled={loading}>
          {loading ? 'Saving info...' : 'Save info'}
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default EditProfile;