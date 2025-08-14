import { useEffect } from "react"; 
import '../../style.css';
import '../../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useInView } from "react-intersection-observer";
import DishCard from "./DishCard";
import { DishGridProps } from "../props";
import { useDishes } from "../../hooks/mutations/dishes";


const DishGrid: React.FC<DishGridProps> = ({query, setEditDish, filter}) => {
  const { status, dishes, fetchNextPage } = useDishes({
    searchQuery: query, filter
  });

	const { ref, inView} = useInView()

	useEffect(() => {
		if (inView){
			fetchNextPage()
		}
	}, [inView, fetchNextPage])

  if (status == 'pending') return <div className="d-flex justify-content-center text-white pt-4"><h3><i className="fa fa-spinner"></i>Loading...</h3></div>;

  return (
    <div className="row  gy-4 p-0 px-sm-5 py-sm-4">
      {dishes.length === 0  ? (
          <p className="text-center text-white">No dish match your search.</p>
      ) : (
        dishes.map((dish, index) => (
          <div className="col-md-6 col-sm-12 col-lg-4 d-flex justify-content-center d-sm-block" key={index}>
            <DishCard dish={dish} setEditDish={(dish) => setEditDish(dish)}/>
          </div>
        ))
      )}
    <div ref={ref}></div>
    </div>
  );
}

export default DishGrid;