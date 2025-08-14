import Button from "../../customComponents/Button"

const Header = ({active}: {active:string}) =>{
  return (
    <div className="d-flex flex-row gap-2 border-bottom border-secondary-light p-2 mb-3">
        <Button
          variant={active == "diary" ? "activeLink" : "link"}
          text="Diary"
          link="/"
          icon="bi bi-journal"
          className={active == "diary" ? "text-secondary" : ""}
        />

        <Button
          variant={active == "activity" ? "activeLink" : "link"}
          text="Activities"
          link="/activity"
          icon="bi bi-person-run"
          className={active == "activity" ? "text-secondary" : ""}
        />

        <Button
          variant={active == "statistics" ? "activeLink" : "link"}
          text="Statistics"
          link="/statistics"
          icon="bi bi-person-run"
          className={active == "statistics" ? "text-secondary" : ""}
        />

        <Button
          variant={active == "products" ? "activeLink" : "link"}
          text="Products"
          link="/products"
          icon="bi bi-basket"
          className={active == "products" ? "text-secondary" : ""}

        />
        <Button
          variant={active == "dishes" ? "activeLink" : "link"}
          text="Dishes"
          link="/dishes"
          icon="fa fa-bowl-food"
          className={active == "dishes" ? "text-secondary" : ""}
        />


        <Button
          variant={active == "profile" ? "activeLink" : "link"}
          text="Profile"
          link="/profile"
          icon="bi bi-person"
          className={active == "profile" ? "text-secondary" : ""}
        />
    </div>
  )
}

export default Header
