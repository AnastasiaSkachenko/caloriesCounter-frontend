import {  useState } from "react"; 
import { Dish } from "../interfaces";
import { useNavigate } from "react-router-dom";
import '../../style.css';
import '../../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import BoughtDishForm from "./PreMadeDishForm";
import OwnDishForm from "./CustomDishForm";
import Modal from "../Modal";
import DishGrid from "./dishesGrid";

const Dishes: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  
  const [editDish, setEditDish] = useState<Dish | undefined>(undefined)
  const navigate = useNavigate()



   return (
		<div className="bg-dark test-dark p-2  " > 
      <button className="btn btn-primary" onClick={() => navigate('/')}>Diary <i className="bi bi-journal"></i> </button>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Products <i className="bi bi-basket"></i> </button>
      <button onClick={() => navigate('/profile')} className="btn btn-primary">Profile <i className="bi bi-person"></i>
      </button>
      <h2 className="text-light ps-2">Dishes</h2>
      <button className="btn btn-primary"  data-bs-toggle='modal' data-bs-target='#modalDishBought'>Add Pre-made Dish</button>
      <button className="btn btn-primary"  data-bs-toggle='modal' data-bs-target='#modalDishOwn'>Add Custom Dish</button>


      <Modal id="modalDishBought" title="Add a Pre-made">
        <BoughtDishForm   />
      </Modal>

      <Modal id="modalDishOwn" title="Create a Custom Dish with Ingredients"  >
        <OwnDishForm   />
      </Modal>


      <Modal id="modalEditDish" title={ editDish?.type == 'custom' ? "Edit a Pre-made Dish" : 'Edit custom dish'}>
        {editDish?.type == 'pre_made' ? (
          <BoughtDishForm  onSuccess={() => setEditDish(undefined)}  onCancel={() => setEditDish(undefined)}  dishToEdit={editDish}/>
        ): editDish && (
          <OwnDishForm   dishToEdit={editDish} ingredientsData={editDish.ingredients} />
        )}
      </Modal>


      <div className="d-flex justify-content-center">
	  		<input className="form-control  my-3" style={{'maxWidth': '40em'}} type="text" placeholder="Search dishes..." 
						value={query} onChange={(e) => setQuery(e.target.value)}/>
			</div>

      <DishGrid query={query} setEditDish={(dish) => setEditDish(dish)} />
 		</div>

  );
}

export default Dishes;