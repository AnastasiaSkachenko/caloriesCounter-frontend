import { useState } from "react"
import Button from "../../customComponents/Button"
import { useModify } from "../../utils/userUtils"



const EditCaloriesBalance = ({caloriesBalanceInitial}: {caloriesBalanceInitial: number}) => {
  const [caloriesBalance, setCaloriesBalance] = useState(caloriesBalanceInitial)
  const { modify} = useModify()

  const handleSave = () => {
    const formData = new FormData()

    formData.append('balance', caloriesBalance.toString())

    modify(formData, false)
  }
  
  return (
    <div className="p-3">
      <label className='d-flex justify-content-between align-items-center' >Calories Balance:
        <input className='input' type="number" step="1" name="caloriesBalance" value={caloriesBalance} onFocus={(e) => e.target.select()}
          onChange={(e) => setCaloriesBalance(Number(e.target.value))}
        />
      </label>
      <Button text="Save" variant="submit" className="  px-4 mx-auto" onClick={handleSave} data-bs-dismiss= 'modal' data-bs-target={'#editCaloriesBalance'}  />
    </div>
  )
}

export default EditCaloriesBalance
