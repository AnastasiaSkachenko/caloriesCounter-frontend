import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dishes from "./components/dishes";
import CaloriesCounterProducts from "./components/products";
import CaloriesCounter from "./components/main-page";


function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/dishes" element={<Dishes/>}/>
        <Route path="/products" element={<CaloriesCounterProducts/>}/>
        <Route path="/" element={<CaloriesCounter/>}/>
       </Routes>
    </Router>
  );
}

export default App;
