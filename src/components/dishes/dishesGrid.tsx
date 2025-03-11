import { useEffect } from "react"; 
import { fetchDishes } from "../../utils/dish";
import { Dish } from "../interfaces";
import '../../style.css';
import '../../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CustomDishCard from "./customDishCard";
import PreMadeDishCard from "./preMadeDishCard";


interface DishGridQuery {
  query: string,
  setEditDish: (dish: Dish) => void,
  filter: string[]
}

const DishGrid: React.FC<DishGridQuery> = ({query, setEditDish, filter}) => {
  console.log(filter, 'filter in grid')

  const {
    status, error, data, fetchNextPage
  } = useInfiniteQuery({
    queryKey: ["dishes", query, true, filter],
    queryFn: ({ pageParam }) => fetchDishes({ pageParam, query, onlyNoProduct: true, filterKey: filter }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
        return lastPage.has_more ? allPages.length + 1 : undefined;
    },
});

	const { ref, inView} = useInView()

	useEffect(() => {
		if (inView){
			fetchNextPage()
		}
	}, [inView, fetchNextPage])


	const dishes = data?.pages.flatMap((page) => page.dishes) || [];

 
 /// !!!!!!!!!!!!!!!!!!!!!!! will not work from now on
 
  const dishNames: string[] = []
  dishes?.map((dish: Dish) => {
    dishNames.push(dish.name.toLowerCase())
  })
  

 
  if (status == 'pending') return <div className="d-flex justify-content-center text-white pt-4"><h3><i className="fa fa-spinner"></i>Loading...</h3></div>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

   return (
    <div className="row  gy-4 p-0 px-sm-5 py-sm-4">
      {dishes.length === 0  ? (
          <p className="text-center text-white">No dish match your search.</p>
      ) : (
        dishes.map((dish, index) => (
          <div className="col-md-6 col-sm-12 col-lg-4 d-flex justify-content-center d-sm-block" key={index}>
            {dish.type === 'custom' ? (
              <CustomDishCard dish={dish} setEditDish={(dish) => setEditDish(dish)}/>
            ): (
              <PreMadeDishCard dish={dish} setEditDish={(dish) => setEditDish(dish)} />
            )}

          </div>
        ))
      )}
    <div ref={ref}></div>
    </div>
  
  );
}

export default DishGrid;