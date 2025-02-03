import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dishes from "./components/dishes";
import CaloriesCounterProducts from "./components/products";
import CaloriesCounter from "./components/main-page";
import RegisterPage from "./components/register";
import LoginPage from "./components/login";
import Profile from "./components/Profile";
import { UserProvider } from "./components/context/provider";


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes> 
          <Route path="/dishes" element={<Dishes/>}/>
          <Route path="/products" element={<CaloriesCounterProducts/>}/>
          <Route path="/" element={<CaloriesCounter/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
