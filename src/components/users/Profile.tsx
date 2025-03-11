import { useNavigate } from "react-router-dom";
import '../../style.css';
import { useEffect, useState } from "react";
import EditProfile from "./editProfile";
import { useLogout } from "../../utils/userUtils";
import useAuth from "../../hooks/useAuth";
import EditMacros from "./editMarcos";
import Modal from "../Modal";

const Profile = () => {
  const {auth} = useAuth()
  const user = auth.user
  const navigate = useNavigate()
  const { logout } = useLogout()

  const [editProfile, setEditProfile] = useState(false)

  useEffect(() => {
    if (!auth.user) {   
      const timeout = setTimeout(() => {
        localStorage.setItem("message", "You need to be logged in to visit Profile page.")
        navigate("/login");
      }, 2000);  

      return () => clearTimeout(timeout);
    }
  }, [auth.user, navigate]); // Add dependencies to prevent unnecessary re-renders
  


  return (
    <div className="bg-secondary p-3" style={{minHeight: '100vh'}}>
      {user && (
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Diary <i className="bi bi-journal"></i> </button>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Products <i className="bi bi-basket"></i> </button>
          <button onClick={() => navigate('/dishes')} className="btn btn-primary">Dishes <i className="fa fa-bowl-food"></i></button>

          <Modal id="editMacros" title="Edit Macros">
            <EditMacros />
          </Modal>


          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <div className="border rounded shadow px-2 px-md-5 py-4 " style={{minWidth: '45%', minHeight: '30em'}}>
              <h2 className="text-center">Profile <button className="btn bg-transparent p-2 m-0" onClick={() => setEditProfile(true)}><i className="fa fa-user-pen"></i></button></h2>
              <div className="d-flex justify-content-center">  
                <img style={{ height: '7em', borderRadius: '2em'}}  src={typeof user.image === "string" 
                  ? user.image // If `product.image` is a URL string, use it
                  : 'media/user/cat-user.jpeg'
                  }/>
              </div>
              {editProfile ? (
                <EditProfile onExit={() => setEditProfile(false)}/>
              ): (
                <div className="align-items-center pt-3">
                  <h5 className=" text-center">General info:</h5>
                  <div className="row">
                    <div className="col-6">
                      <p className="text-center">Height: {user.height}</p>
                      <p className="text-center">Gender: {user.gender}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-center">Weight: {user.weight}</p>
                      <p className="text-center">Goal: {user.goal}</p>
                    </div>
                    <p className="text-center">Activity level: {user?.activity_level}</p>
                  </div>

                  <h5 className="text-center">
                    Macros Info  for a day:
                    <button className="btn bg-transparent p-2 m-0" data-bs-toggle='modal' data-bs-target='#editMacros'>
                      <i className="fa fa-pen"></i>
                    </button>:
                  </h5>
                  <div className="row">
                    <div className="col-6">
                      <p className="text-center">Energy: {user.calories_d} ccal</p>
                      <p className="text-center">Carbs: {user.carbohydrate_d} g</p>
                    </div>
                    <div className="col-6">
                      <p className="text-center">Protein: {user.protein_d} g</p>
                      <p className="text-center">Fats: {user.fat_d} g</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-dark" onClick={() => logout()}>Log out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) }
    </div>
  );
};

export default Profile;
