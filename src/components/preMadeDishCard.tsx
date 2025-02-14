import { usePopDish } from "../hooks/caloriesCounter";
import { Dish } from "./interfaces";

interface PreMadeDishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}



const PreMadeDishCard: React.FC<PreMadeDishProps> = ({dish, setEditDish}) => {
  const { popDish } = usePopDish()

  const handleDeleteDish = (id:number) => {
    const response = window.confirm('Are you sure you want to delete this dish?');
    if (response) {
      popDish({ id });
    }
  }

  
  return (
    <div  className="card bg-light" style={{height: '35em', width: '100%'}}>
          <div className="d-flex justify-content-center m-3" style={{ height: "12em", overflow: "hidden" }}>
            <img className="border rounded"
              src={
                typeof dish.image === "string"
                  ? dish.image
                  : "media/dishes/food.jpg"
              }
              alt={dish.name}
              style={{ width: "15em", height: "100%", objectFit: "cover" }}
            />
          </div>
      <div className="card-body py-2 bg-light" style={{height: ''}}>
        <div  >

          <h3 style={{height:'2.2em'}} className="text-center">{dish.name} </h3>
          
          <div className=" d-flex align-items-center p-1"  style={{height: '12em'}}>

            <div>   
                <div className="mb-4">
                  <p className="fw-bold my-0">For 1 portion ({dish.portion} g): </p>
                  Calories: {Math.round(dish.calories_100*dish.portion /100)}, Protein: {Math.round(dish.protein*dish.portion/100)}, Carbs: {Math.round(dish.carbohydrate_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}
                </div>
                <div>
                  <p className="fw-bold my-0">For 100 g:</p>
                  Calories: {dish.calories_100}, Protein: {dish.protein_100}, Carbs: {dish.carbohydrate_100}, Fats: {dish.fat_100}  
                </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button onClick={() => setEditDish(dish)} data-bs-toggle='modal' data-bs-target='#modalEditDish'>Edit dish</button>
          <button onClick={() => handleDeleteDish(dish.id?? 0)}>Delete Dish</button>
        </div>
      </div>
    </div>

  )
}

export default PreMadeDishCard