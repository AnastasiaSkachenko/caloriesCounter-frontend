import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordForm from "./recordForm";
import { useQuery } from "@tanstack/react-query";
import { fetchDiaryRecords } from "../utils/caloriesCounter";
import { usePopDiaryRecord } from "../hooks/caloriesCounter";
import '../../styles/style.css';
import '../index.css'
import { DiaryRecord } from "./interfaces";
import Modal from "./Modal";



const CaloriesCounter: React.FC = () => {
  const {
    status: status, error: error, isLoading,data: records,  
  } = useQuery({
    queryKey: ['diaryRecords'], 
    queryFn: () =>  fetchDiaryRecords(), 
  });

  records?.forEach((record) => {
    record.date = record.date?.slice(0, 16).replace('T', ' ');
  })

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const [date, setDate] = useState(getCurrentDate)
  const navigate = useNavigate()
  const [editRecord, setEditRecord] = useState<DiaryRecord | null>()
  const { popDiaryRecord } = usePopDiaryRecord()

  const filteredRecords = date
  ? records?.filter((record) => record.date.slice(0,10) === date) // Exact match
  : records



  if (isLoading) return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  return (
    <div className="p-3 bg-dark ">
      <button className="btn btn-primary" onClick={() => navigate('/dishes')}>Dishes</button>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Products</button>
      <h3 className="text-white">Food Diary</h3>

      <Modal id="modal" title="Add Record" >
        <RecordForm />
      </Modal>

      <Modal id="modalEdit" title="Edit Record" >
        {editRecord && <RecordForm  recordData={editRecord} onSuccess={() => setEditRecord(null)} onCancel={() => setEditRecord(null)}  />}
      </Modal>

      <div className="d-flex justify-content-between px-2">
        <button className="btn btn-primary btn-lg" data-bs-toggle='modal' data-bs-target='#modal' >Add Record</button>
        <label className="text-white form-label d-block">
          Date:
          <input className='border border-light rounded p-1 mx-2' type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
        </label>
      </div>


      {filteredRecords?.length === 0 && records?.length !== 0 && <p>No records match your search.</p>}
      {filteredRecords?.slice(0).reverse().map((record, index) => (
        <div key={index} className="bg-secondary border rounded p-3 m-2">
          <div className="d-flex justify-content-between">
            <div>
              <h5>{record.name}: </h5>
              <p>{(record.weight? 'Weight:': 'Portions:')} {record.weight ? record.weight + 'g': record.portions} Calories: {record.calories} Protein: {record.protein}g Carbs: {record.carbohydrate}g Fat: {record.fat}g</p>
            </div>
            <div className='d-flex justify-content-center align-items-center gap-2'>
              <button className="btn btn-dark" onClick={() => setEditRecord(record)} data-bs-toggle='modal' data-bs-target='#modalEdit'>Edit</button>
              <button className="btn btn-danger" onClick={() => popDiaryRecord({id: record.id})}>Delete</button>
            </div>
          </div>
          <p className="text-end my-1">{record.date}</p>
        </div>
      ))}
      {filteredRecords?.length !==0 && (
        <div className=" text-white border rounded p-3 m-2">
          <h5>Summary for {date}:</h5>
          <hr></hr>
          <div className="d-flex justify-content-around">
            <p>Total Calories: {filteredRecords?.reduce((acc, record) => acc + record.calories, 0)}</p>
            <p>Total Protein: {filteredRecords?.reduce((acc, record) => acc + record.protein, 0)} g</p>
            <p>Total Carbs: {filteredRecords?.reduce((acc, record) => acc + record.carbohydrate, 0)} g</p>
            <p>Total Fat: {filteredRecords?.reduce((acc, record) => acc + record.fat, 0)} g</p>
          </div>
        </div>
      )}
 
      
    </div>
  )
}

export default CaloriesCounter