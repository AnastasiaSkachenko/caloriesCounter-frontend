import { useUserContext } from "./context/UserContext";
import { useState } from "react";
import { User } from "./interfaces";
import { useModify } from "../utils/userUtils";

interface EditProfile  {
  onExit: () => void
}



const EditProfile: React.FC<EditProfile> = ({onExit}) => {
  const { user } = useUserContext()

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<User>(user??{
    id: 0, name: '', age: 18, weight: 0, height: 0, calories_d: 0, protein_d: 0,
    carbohydrate_d: 0, fat_d: 0, activity_level: 1, email: '', exp: 0, gender: 'female', goal: 'lose'
  });
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

  const calculateMacros = (data: User) => {
    const { age, weight, height, activity_level, gender, goal } = data;

    // Calculate BMR based on gender
    const bmr = gender === "female" 
        ? 10 * weight + 6.25 * height - 5 * age - 161  // BMR for women
        : 10 * weight + 6.25 * height - 5 * age + 5;   // BMR for men

    // Set activity multiplier
    const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const activityMultiplier = activityMultipliers[activity_level - 1] || 1.2;

    let totalCalories = Math.round(bmr * activityMultiplier);

    // Adjust calories based on goal
    if (goal === "lose") totalCalories = Math.round(totalCalories * 0.8);  // -20%
    if (goal === "gain") totalCalories = Math.round(totalCalories * 1.2); // +20%

    // Calculate macronutrients
    const protein_d = Math.round(totalCalories * 0.25 / 4); // 25% of calories from protein
    const carbohydrate_d = Math.round(totalCalories * 0.50 / 4); // 50% from carbs
    const fat_d = Math.round(totalCalories * 0.25 / 9); // 25% from fat

    console.log(age, weight, height, activity_level, gender, goal)

     return {
        ...formData,
        calories_d: totalCalories,
        protein_d,
        carbohydrate_d,
        fat_d,
    };
};

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const userData = calculateMacros(formData)
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
    await modify(formDataToSend);
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
        <a className="text-white" href="/">Click here to change password</a>
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