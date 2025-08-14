import {  useEffect, useState } from "react"; 
import { Dish } from "../interfaces";
import '../../style.css';
import '../../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import BoughtDishForm from "./PreMadeDishForm";
import OwnDishForm from "./CustomDishForm";
import Modal from "../general/Modal";
import DishGrid from "./dishesGrid";
import NotLoggedIn from "../general/notLoggedIn";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import Button from "../../customComponents/Button";
import Header from "../general/header";
import { categories } from "../../assets/constants/dishCategories";

const Dishes: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [filter, setFilter] = useState<string[]>(["all"])
  const [editDish, setEditDish] = useState<Dish | undefined>(undefined)
  const { auth } = useAuth()


  // if user is not authenticated create popover element that warns that some functionality is unavailable for anonymous users
  useEffect(() => {
    if (!auth.user) {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      popoverTriggerList.forEach((popoverTriggerEl) => {
        new Popover(popoverTriggerEl);
      });
    }
  }, [auth.user]);
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    setFilter((prevFilters) => {
      if (value === 'all') {
        if (e.target.checked) {
          return ['all']; 
        } else {
          return prevFilters.filter((filter) => filter !== 'all'); 
        }
      }
  
      const newFilters = e.target.checked
        ? [...prevFilters, value]  
        : prevFilters.filter((filter) => filter !== value); 
  
      if (newFilters.length > 0) {
        return newFilters.filter((filter) => filter !== 'all');
      } else {
        return ['all'];
      }
    });
  };

  return (
		<div className="bg-dark test-dark p-3 min-vh-100"> 
      <Header active="dishes"/>

      <h2 className="text-white ps-2">Dishes</h2>

      {auth.user ? (
        <div className="d-flex flex-row gap-2">
          <Button variant="submit" text="Add Pre-made Dish" data-bs-toggle='modal' data-bs-target='#modalDishBought'/>
          <Button variant="submit" text="Add Custom Dish" data-bs-toggle='modal' data-bs-target='#modalDishOwn'/>
        </div>
      ): (
        <span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="bottom" data-bs-content="You need to log in to create a dish." data-bs-custom-class="custom-popover">
          <Button text="Add Pre-made Dish" disabled/>
          <Button text="Add Custom Dish" disabled/>
        </span>
      )}


      <Modal id="modalDishBought" title="Add a Pre-made">
        <BoughtDishForm   />
      </Modal>

      <Modal id="modalDishOwn" title="Create a Custom Dish with Ingredients"  >
        <OwnDishForm   />
      </Modal>

      <Modal id="notLoggedIn" title="You are not logged in">
        <NotLoggedIn message="You need to be logged in to save this dish." />
      </Modal>


      <Modal id="modalEditDish" title={ editDish?.type == 'custom' ? "Edit a Pre-made Dish" : 'Edit custom dish'}>
        {editDish?.type == 'pre_made' ? (
          <BoughtDishForm  onSuccess={() => setEditDish(undefined)}  onCancel={() => setEditDish(undefined)}  dishToEdit={editDish}/>
        ): editDish && (
          <OwnDishForm onSuccess={() => setEditDish(undefined)}  onCancel={() => setEditDish(undefined)}   dishToEdit={editDish} ingredientsData={editDish.ingredients} />
        )}
      </Modal>

      <div className="d-flex justify-content-center">
	  		<input className="form-control  mb-3" style={{'maxWidth': '40em'}} type="text" placeholder="Search dishes..." 
						value={query} onChange={(e) => setQuery(e.target.value)}/>
			</div>

      <div className="d-block">
        <div className="d-flex justify-content-around">
          {categories.map( category => (
            <div key={category.id}>
              <input type="checkbox" className="btn-check" id={category.id} value={category.id} checked={filter.includes(category.id)} onChange={handleCheckboxChange}/>
              <label className="btn filter text-secondary" htmlFor={category.id}>{category.name}</label>    
            </div>
          ) )}
        </div>
      </div>

      <DishGrid query={query} filter={filter} setEditDish={(dish) => setEditDish(dish)} />
 		</div>
  );
}

export default Dishes;