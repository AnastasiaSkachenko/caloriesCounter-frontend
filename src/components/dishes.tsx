import { useEffect, useState } from "react"; 
import { fetchDishes } from "../utils/caloriesCounter";
import { usePopDish} from "../hooks/caloriesCounter";
import { Dish, Ingredient } from "./interfaces";
import { useNavigate } from "react-router-dom";
import '../../styles/style.css';
import '../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import BoughtDishForm from "./PreMadeDishForm";
import OwnDishForm from "./CustomDishForm";
import Modal from "./Modal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";


const Dishes: React.FC = () => {
  const {
    status, error, data, fetchNextPage, refetch
  } = useInfiniteQuery({
    queryKey: ['dishes'],   
    queryFn: fetchDishes,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });

	const { ref, inView} = useInView()

	useEffect(() => {
		if (inView){
			fetchNextPage()
		}
	}, [inView, fetchNextPage])


	const dishes = data?.pages.flatMap((page) => page.dishes) || [];

 
 
  const dishNames: string[] = []
  dishes?.map((dish: Dish) => {
    dishNames.push(dish.name.toLowerCase())
  })
  
  
  const [searchQuery, setSearchQuery] = useState<string>('');  
  const [editDish, setEditDish] = useState<Dish | undefined>(undefined)
  const navigate = useNavigate()

  const { popDish } = usePopDish() 

 
	const filteredDishes = searchQuery
    ? dishes?.filter(dish =>
        dish.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : dishes;
 

  const handleDeleteDish = (id:number) => {
    const response = window.confirm('Are you sure you want to delete this dish?');
    if (response) {
      popDish({ id });
      refetch()
    }
  }
 
  if (status == 'pending') return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

   return (
		<div className="bg-dark test-dark p-2" > 
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Diary</button>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Products</button>
      <h2 className="text-light ps-2">Dishes</h2>
      <button className="btn btn-primary"  data-bs-toggle='modal' data-bs-target='#modalDishBought'>Add Pre-made Dish</button>
      <button className="btn btn-primary"  data-bs-toggle='modal' data-bs-target='#modalDishOwn'>Add Custom Dish</button>


      <Modal id="modalDishBought" title="Add a Pre-made">
        <BoughtDishForm dishNames={dishNames} />
      </Modal>

      <Modal id="modalDishOwn" title="Create a Custom Dish with Ingredients"  >
        <OwnDishForm dishNames={dishNames} />
      </Modal>


      <Modal id="modalEditDish" title={ editDish?.type == 'custom' ? "Edit a Pre-made Dish" : 'Edit custom dish'}>
        {editDish?.type == 'pre_made' ? (
          <BoughtDishForm  onSuccess={() => setEditDish(undefined)}  onCancel={() => setEditDish(undefined)} dishNames={dishNames} dishToEdit={editDish}/>
        ): editDish && (
          <OwnDishForm dishNames={dishNames} dishToEdit={editDish} ingredientsData={editDish.ingredients}/>
        )}
      </Modal>


      <div className="d-flex justify-content-center">
	  		<input className="form-control  my-3" style={{'maxWidth': '40em'}} type="text" placeholder="Search dishes..." 
						value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
			</div>


      <div className="row gy-4 p-5">
        {filteredDishes?.length === 0 && dishes?.length !=0 ? (
            <p>No dish match your search.</p>
        ) : (
          filteredDishes?.map((dish, index) => (
            <div className="col-md-12 col-sm-12 col-lg-4" key={index}>
              {dish.type === 'custom' ? (
                <div  className="card" style={{height: '35em'}}>
                  <div className=" d-flex justify-content-center py-2" style={{ height: '220px', overflow: 'hidden' }}>
                    <img
                      className="card-img" style={{width: '350px',  objectFit: 'cover'}}
                      src={typeof dish.image === "string" 
                        ? dish.image 
                        : 'media/dishes/food.jpg'
                      }
                      alt={dish.name} 
                    />
                  </div>
                  <div className="card-body py-2 bg-light" style={{height: '70%'}}>
                    <div style={{height: '85%'}}>
                      <h3 style={{height: '25%'}} className="text-center">{dish.name} ({ dish.portions + ((dish.portions > 1)? ' portions': ' portion')})</h3>
                      <div className=" d-flex align-items-center p-1"  style={{height: '60%'}}>
                      <div>
                        <p className="fw-bold my-0">Ingredients:</p>
                        <p className="ingredients my-0" >{dish.ingredients && dish.ingredients.map((ingredient: Ingredient) => `${ingredient.name}: ${ingredient.weight}g`).join(", ")}.</p>

                        <div className="mb-3">
                          <p className="fw-bold my-0">Total ({dish.weight}g):</p>
                          Calories: {dish.calories}, Protein: {dish.protein}, Carbs: {dish.carbohydrate}, Fats: {dish.fat}
                        </div>

                        <div>
                          <p className="fw-bold my-0">For 1 portion ({dish.portion} g): </p>
                          Calories: {Math.round(dish.calories_100*dish.portion/100)}, Protein: {Math.round(dish.protein_100*dish.portion/100)}, Carbs: {Math.round(dish.carbohydrate_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}
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
              ): (
                <div  className="card" style={{height: '35em'}}>
                  <div className=" d-flex justify-content-center py-2" style={{ height: '60%', overflow: 'hidden' }}>
                    <img
                      className="card-img mt-2" style={{width: '90%', objectFit: 'cover'}}
                      src={typeof dish.image === "string" 
                        ? dish.image 
                        : dish.drink
                        ? 'media/dishes/drink.jpeg'
                        : 'media/dishes/dish.jpeg'
                      }
                      alt={dish.name} 
                    />
                  </div>
                  <div className="card-body py-2 bg-light" style={{height: '70%'}}>
                    <div style={{height: '80%'}}>

                      <h3 style={{height: '25%'}} className="text-center">{dish.name} </h3>
                      
                      <div className=" d-flex align-items-center p-1"  style={{height: '60%'}}>

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

              )}

            </div>
          ))
        )}
      </div>
      <div ref={ref}></div>
 		</div>
  
  

  );
}

export default Dishes;