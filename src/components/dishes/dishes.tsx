import {  useEffect, useState } from "react"; 
import { Dish } from "../interfaces";
import '../../style.css';
import '../../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import BoughtDishForm from "./PreMadeDishForm";
import OwnDishForm from "./CustomDishForm";
import Modal from "../Modal";
import DishGrid from "./dishesGrid";
import NotLoggedIn from "../notLoggedIn";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import Header from "../header";
import Button from "../../customComponents/Button";

const Dishes: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [filter, setFilter] = useState<string[]>(["all"])
  const [editDish, setEditDish] = useState<Dish | undefined>(undefined)

  const categories = [
    {id: 'favorites', name: 'Favorites'},
    {id: 'all', name: 'All'},
    {id: 'custom', name: 'Custom'},
    {id: 'pre_made', name: 'Pre-made'},
    {id: 'own', name: 'Own'},
    //{id: 'suggestions', name: 'Suggestions'}, 
    {id: 'high_protein', name: 'High Protein ( >15g/100g )'}, 
    {id: 'low_carbs', name: 'Low carbs ( <10g/100g )'},
    {id: 'low_fat', name: 'Low fat ( <3g/100g )'}
  ]

  const { auth } = useAuth()

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
    console.log(value, 'value');
    
    setFilter((prevFilters) => {
      // If the "all" option is being changed, we handle it separately
      if (value === 'all') {
        // If "all" is checked, ensure it's checked and remove others
        if (e.target.checked) {
          return ['all']; // Only "all" is selected
        } else {
          return prevFilters.filter((filter) => filter !== 'all'); // Remove "all" if it's unchecked
        }
      }
  
      // If any other filter is being checked or unchecked
      const newFilters = e.target.checked
        ? [...prevFilters, value]  // Add value if checked
        : prevFilters.filter((filter) => filter !== value);  // Remove value if unchecked
  
      // If there is any other filter selected, remove "all" from the list
      if (newFilters.length > 0) {
        return newFilters.filter((filter) => filter !== 'all');
      } else {
        // If no other filter is selected, keep "all" in the list
        return ['all'];
      }
    });
  };
      


   return (
		<div className="bg-dark test-dark p-2 min-vh-100 " > 
      <Header active="dishes" />
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
        {/* 
      <div className="filter-dropdown">
      <label>
        Filters:
        <div className="checkbox-list">
          <div>
            <input
              type="checkbox"
              value="all"
              checked={filter.includes('all')}
              onChange={handleCheckboxChange}
            />
            <label>All</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="favorites"
              checked={filter.includes('favorites')}
              onChange={handleCheckboxChange}
              disabled={!auth.user}
            />
            <label>Favorites</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="custom"
              checked={filter.includes('custom')}
              onChange={handleCheckboxChange}
            />
            <label>Custom</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="pre_made"
              checked={filter.includes('pre_made')}
              onChange={handleCheckboxChange}
            />
            <label>Pre-made</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="own"
              checked={filter.includes('own')}
              onChange={handleCheckboxChange}
              disabled={!auth.user}
            />
            <label>Own</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="suggestions"
              checked={filter.includes('suggestions')}
              onChange={handleCheckboxChange}
            />
            <label>Suggestions</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="high_protein"
              checked={filter.includes('high_protein')}
              onChange={handleCheckboxChange}
            />
            <label>High Protein (&gt; 15g/100g)</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="low_carbs"
              checked={filter.includes('low_carbs')}
              onChange={handleCheckboxChange}
            />
            <label>Low carbs (&lt; 10g/100g)</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="low_fat"
              checked={filter.includes('low_fat')}
              onChange={handleCheckboxChange}
            />
            <label>Low fat (&lt; 3g/100g)</label>
          </div>
        </div>
      </label>
     </div>
*/}
 


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