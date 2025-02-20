import { usePopDiaryRecord } from "../../hooks/caloriesCounter"
import { DiaryRecord } from "../interfaces"

interface  RecordComponentProps {
  record: DiaryRecord,
  editRecord: (record: DiaryRecord) => void,
}


const RecordComponent: React.FC<RecordComponentProps> = ({record, editRecord}) => {
  const { popDiaryRecord } = usePopDiaryRecord()

  return (
    <div className="bg-secondary border rounded p-3 m-2" >
      <div className="d-flex gap-2 profile-info">
        <div>
          <h5>{record.name}: </h5>
          <p>{(record.weight ? 'Weight:' : 'Portions:')} {record.weight ? record.weight + 'g' : record.portions} Calories: {record.calories} Protein: {record.protein}g Carbs: {record.carbohydrate}g Fat: {record.fat}g</p>
        </div>
        <div className='d-flex  justify-content-around justify-content-sm-center align-items-center gap-2 flex-sm-column'>
          <div>
            <button className="btn btn-dark" onClick={() => editRecord(record)} data-bs-toggle='modal' data-bs-target='#modalEdit' disabled={record.dish == null}>Edit</button>
            <button className="btn btn-danger" onClick={() => popDiaryRecord({ id: record.id })}>Delete</button>
          </div>
          <p className="text-end  mb-0">{record.date}</p>

        </div>
      </div>
      <p className="text-danger">{record.dish == null && 'This dish was deleted by its creator. You no longer can modify this record.'}</p>
    </div>

  )
}

export default RecordComponent