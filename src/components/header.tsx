import Button from "../customComponents/Button"

function Header({active}: {active:string}) {
  return (
    <div className="d-flex flex-row gap-2 border-bottom border-secondary-light p-2 mb-3">
      {active != "diary" && (
        <Button 
          variant="link"
          text="Diary"
          link="/"
          icon="bi bi-journal"
        />
      )}

      {active != "products" && (
        <Button
          variant="link"
          text="Products"
          link="/products"
          icon="bi bi-basket"
        />
      )}
      {active != "dishes" && (
        <Button
          variant="link"
          text="Dishes"
          link="/dishes"
          icon="fa fa-bowl-food"
        />
      )}

      {active != "profile" && (
        <Button
          variant="link"
          text="Profile"
          link="/profile"
          icon="bi bi-person"
        />
      )}
    </div>
  )
}

export default Header
