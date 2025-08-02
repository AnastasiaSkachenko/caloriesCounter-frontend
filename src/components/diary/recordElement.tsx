import Button from "../../customComponents/Button"
import { usePopDiaryRecord } from "../../hooks/caloriesCounter"
import { DiaryRecord } from "../interfaces"

interface  RecordComponentProps {
  record: DiaryRecord,
  editRecord: (record: DiaryRecord) => void,
}


const RecordComponent: React.FC<RecordComponentProps> = ({record, editRecord}) => {
  const { popDiaryRecord } = usePopDiaryRecord()

  return (
    <div className="border border-secondary-light rounded p-3 me-2 mb-4" >
      <div className="d-flex  justify-content-between flex-wrap" >
        <div>
          <h5 className="record-text">{record.name}: </h5>
          <p className="record-text"> {(record.weight ? 'Weight:' : 'Portions:')} {record.weight ? record.weight + 'g' : record.portions} Calories: {record.calories} Protein: {record.protein}g Carbs: {record.carbs}g Fat: {record.fat}g Fiber: {record.fiber}g Sugars: {record.sugars}g Caffeine: {record.caffeine}g</p>
        </div>
        <div className='d-flex flex-wrap  justify-content-center align-items-end gap-2 flex-sm-column'>
          <div className="d-flex flex-row gap-2">
            <Button
              variant="edit"
              text="Edit"
              onClick={() => editRecord(record)}
              disabled={record.dish == null}
              data-bs-toggle='modal' 
              data-bs-target='#modalEdit'
            />
            <Button
              variant="delete"
              text="Delete"
              onClick={() => popDiaryRecord({id: record.id})}
            />
          </div>
          <p className="px-2">{record.date.split(' ')[1]}</p>
        </div>
      </div>
      {record.dish == null && (
        <p className="text-danger">This dish was deleted by its creator. You no longer can modify this record.</p>
      )}
    </div>

  )
}

export default RecordComponent