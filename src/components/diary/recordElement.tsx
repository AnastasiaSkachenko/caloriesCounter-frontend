import { usePopDiaryRecord } from "../../hooks/caloriesCounter"
import { DiaryRecord } from "../interfaces"

interface  RecordComponentProps {
  record: DiaryRecord,
  editRecord: (record: DiaryRecord) => void,
}


const RecordComponent: React.FC<RecordComponentProps> = ({record, editRecord}) => {
  const { popDiaryRecord } = usePopDiaryRecord()

  return (
    <div className="bg-secondary border rounded p-3 pb-1 m-2" >
      <div className="d-flex  justify-content-between flex-wrap" >
        <div style={{  maxWidth: '30em'}}>
          <h5 className="record-text">{record.name}: </h5>
          <p className="record-text"> {(record.weight ? 'Weight:' : 'Portions:')} {record.weight ? record.weight + 'g' : record.portions} Calories: {record.calories} Protein: {record.protein}g Carbs: {record.carbs}g Fat: {record.fat}g Fiber: {record.fiber}g Sugars: {record.sugars}g Caffeine: {record.caffeine}g</p>
        </div>
        <div className='d-flex flex-wrap  justify-content-center align-items-center gap-2 flex-sm-column'>
          <div>
            <button className="btn btn-dark" onClick={() => editRecord(record)} data-bs-toggle='modal' data-bs-target='#modalEdit' disabled={record.dish == null}>Edit</button>
            <button className="btn btn-danger" onClick={() => popDiaryRecord({ id: record.id })}>Delete</button>
          </div>
          <p className="text-end  mb-0">{record.date.split(' ')[1]}</p>

        </div>
      </div>
      <p className="text-danger">{record.dish == null && 'This dish was deleted by its creator. You no longer can modify this record.'}</p>
    </div>

  )
}

export default RecordComponent