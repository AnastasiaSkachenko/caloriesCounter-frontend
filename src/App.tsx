
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dishes from "./components/dishes/dishes";
import CaloriesCounterProducts from "./components/products/products";
import CaloriesCounter from "./components/diary/main-page";
import RegisterPage from "./components/users/register";
import LoginPage from "./components/users/login";
import Profile from "./components/users/Profile";
import { AuthProvider } from "./context/AuthProvider";
import ResetPassword from "./components/users/changePassword";
import DishPage from "./components/dishes/DishPage";
import Activity from "./components/activity/activity";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes> 
          <Route path="/dishes" element={<Dishes/>}/>
          <Route path="/dish/:id" element={<DishPage />} />
          <Route path="/products" element={<CaloriesCounterProducts/>}/>
          <Route path="/activity" element={<Activity/>} />
          <Route path="/" element={<CaloriesCounter/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/change-password" element={<ResetPassword/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
