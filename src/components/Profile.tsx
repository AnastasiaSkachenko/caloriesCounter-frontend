import { useNavigate } from "react-router-dom";
import { useUserContext } from "./context/UserContext";
import '../../styles/style.css';
import RegisterPage from "./register";
import { useState } from "react";
import EditProfile from "./editProfile";

const Profile = () => {
  const { user } = useUserContext()
  const navigate = useNavigate()

  const [editProfile, setEditProfile] = useState(false)


  return (
    <div className="bg-secondary p-3" style={{minHeight: '100vh'}}>
      {user ? (
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Diary <i className="bi bi-journal"></i> </button>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Products <i className="bi bi-basket"></i> </button>
          <button onClick={() => navigate('/dishes')} className="btn btn-primary">Dishes <i className="fa fa-bowl-food"></i></button>
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <div className="border rounded shadow px-5 py-4 " style={{minWidth: '45%', minHeight: '30em'}}>
              <h2 className="text-center">Profile <button className="btn bg-transparent p-2 m-0" onClick={() => setEditProfile(true)}><i className="fa fa-user-pen"></i></button></h2>
              {editProfile ? (
                <EditProfile onExit={() => setEditProfile(false)}/>
              ): (
                <div className="row align-items-center pt-5">
                  <div className="col d-flex flex-column">
                    <h5 className="my-3" >General info:</h5>
                    <p>Height: {user.height}</p>
                    <p>Weight: {user.weight}</p>
                    <p>Gender: {user.gender}</p>
                    <p>goal: {user.goal}</p>
                    <p>Activity level: {user.activity_level}</p>
                  </div>
                  <div className="col d-flex flex-column">
                    <h5 className="my-3">Macros Info:</h5>
                    <p>Energy for one day: {user.calories_d} ccal</p>
                    <p>Protein for one day: {user.protein_d} g</p>
                    <p>Carbs for one day: {user.carbohydrate_d} g</p>
                    <p>Fats for one day: {user.fat_d} g</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <RegisterPage/>
      )}
    </div>
  );
};

export default Profile;
