import { useNavigate } from "react-router-dom";
import '../../style.css';
import { useEffect, useState } from "react";
import EditProfile from "./editProfile";
import { useLogout } from "../../utils/userUtils";
import useAuth from "../../hooks/useAuth";
import EditMacros from "./editMarcos";
import Modal from "../Modal";
import Header from "../header";
import MediaScroller from "../products/MediaScroller";
import { MacroNitrientUser } from "../interfaces";
import Button from "../../customComponents/Button";
import EditCaloriesBalance from "./editCaloriesBalance";

const nutritions: { title: string; value: MacroNitrientUser }[] = [
  {title: "Calories", value: "calories_d"},
  {title: "Protein", value: "protein_d"},
  {title: "Carbs", value: "carbs_d"},
  {title: "Fat", value: "fat_d"},
  {title: "Fiber", value: "fiber_d"},
  {title: "Sugars", value: "sugars_d"},
  {title: "Caffeine", value: "caffeine_d"}
]


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
    <div className="bg-dark p-3" style={{minHeight: '100vh'}}>
      {user && (
        <div>
          <Header active="profile" />

          <Modal id="editMacros" title="Edit Macros">
            <EditMacros />
          </Modal>

          <Modal id="editCaloriesBalance" title="Edit Calories Balance">
            <EditCaloriesBalance caloriesBalanceInitial={user.balance} />
          </Modal>

          <div className="d-flex justify-content-center align-items-center w-50 mx-auto" style={{minHeight: '70vh'}}>
            <div className="border rounded shadow px-2 px-md-5 py-4 " style={{minWidth: '45%', minHeight: '30em'}}>
              <h2 className="text-center text-white">Profile <button className="btn bg-transparent p-1 m-0" onClick={() => setEditProfile(true)}><i className="fa fa-user-pen text-white"></i></button></h2>
              {editProfile ? (
                <EditProfile onExit={() => setEditProfile(false)}/>
              ): (
                <div className="align-items-center justify-content-center mt-5">
                  <MediaScroller media={[user.image ?? 'media/cat-user.jpeg']} name="user" width={600} height={200} bg="transparent" className="rounded-full" /> 
                  <h5 className="text-center text-white">Calories balance: {user.balance} <button className="btn bg-transparent p-1 m-0" data-bs-toggle='modal' data-bs-target='#editCaloriesBalance'><i className="fa fa-pen text-white"></i></button></h5>
                  <p className="text-white text-center" >Think of your calories like a bank account—if you save some, you'll have more to use later. 
                    The same principle applies here: if you overeat one day, simply reduce your intake over the following 
                    days to balance it out and stay on track with your goal.  
                  </p>
                  <h5 className="text-white text-center">General info:</h5>
                  <div className="row">
                    <div className="col-6">
                      <p className="text-center text-white">Height: {user.height}</p>
                      <p className="text-center text-white">Gender: {user.gender}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-center text-white">Weight: {user.weight}</p>
                      <p className="text-center text-white">Goal: {user.goal}</p>
                    </div>
                    <p className="text-center text-white">Activity level: {user?.activity_level}</p>
                  </div>

                  <div className="text-center d-flex flex-row justify-content-center align-items-center gap-1">
                    <h4 className="text-white">Macros Info  for a day</h4>
                    <button className="btn bg-transparent p-1 pe-0 m-0" data-bs-toggle='modal' data-bs-target='#editMacros'>
                      <i className="fa fa-pen text-white"></i>
                    </button><span className="text-white">:</span>
                  </div>
                  <div className="d-flex flex-wrap">
                    {nutritions.map((nutrition, index) => (
                      <p key={index} className={`${index + 1 == nutritions.length ? "w-100" : "w-50"} text-center text-white mb-1`}>{nutrition.title}: {user[nutrition.value]}</p>
                    ))}
                  </div>
                  <div className="d-flex justify-content-center">
                    <Button text="Log out" className="px-5 mt-3" variant="delete" onClick={() => logout()}/>
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
