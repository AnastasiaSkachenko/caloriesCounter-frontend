import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecordForm from "./recordForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery } from "@tanstack/react-query";
import { fetchDiaryRecords } from "../utils/caloriesCounter";
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePopDiaryRecord } from "../hooks/caloriesCounter";
import '../../styles/style.css';
import '../index.css'



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

  const navigate = useNavigate()
  const [addRecord, setAddRecord] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(new Date().getDate().toString());
	const [selectedMonth, setSelectedMonth] = useState<string | null>(new Date().getMonth() + 1 + '');
	const [selectedYear, setSelectedYear] = useState<string | null>(new Date().getFullYear().toString());
  const [editRecord, setEditRecord] = useState<number | null>()
  const { popDiaryRecord } = usePopDiaryRecord()

  const filteredRecords = records?.filter(record => {
    
    const date = new Date(record.date);
    const matchesDay = selectedDay ? date.getDate() === parseInt(selectedDay) : true;
    const matchesMonth = selectedMonth ? date.getMonth() + 1 === parseInt(selectedMonth) : true;
    const matchesYear = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;

    return matchesDay && matchesMonth && matchesYear;
  });



  if (isLoading) return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  return (
    <div className="vh-100">
      <button className="btn btn-primary" onClick={() => navigate('/dishes')}>Dishes</button>
      <button onClick={() => navigate('/products')}>Products</button>
      <h3>Food Diary</h3>

      {addRecord ? (
        <div className='d-flex justify-content-center w-100'>
          <RecordForm onSuccess={() => setAddRecord(false)} onCancel={() => setAddRecord(false)}/>
        </div>
      ): (
        <button onClick={() => setAddRecord(true)}>Add Record</button>
      )}

      <select value={selectedDay || ''} onChange={(e) => setSelectedDay(e.target.value)}>
        {[...Array(31)].map((_, i) => (
          <option key={i} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select value={selectedMonth || ''} onChange={(e) => setSelectedMonth(e.target.value)}>
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
        ))}
      </select>
      <select value={selectedYear || ''} onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option> 
      </select>

      {filteredRecords?.length === 0 && records?.length !== 0 && <p>No records match your search.</p>}
      {filteredRecords?.slice(0).reverse().map((record, index) => (
        <div key={index} className="bg-light border rounded p-3">
          <p>{record.name}:  {(record.weight? 'Weight:': 'Portions:')} {record.weight ? record.weight + 'g': record.portions} </p>
          <p>Calories: {record.calories} Protein: {record.protein}g Carbohydrates: {record.carbohydrate}g Fat: {record.fat}g</p>
          <p>{record.date}</p>
          {editRecord == record.id ? (
            <RecordForm onSuccess={() => setEditRecord(null)} onCancel={() => setEditRecord(null)} recordData={record}/>
          ):(
            <button onClick={() => setEditRecord(record.id)}>Edit</button>
          )}
          <button onClick={() => popDiaryRecord({id: record.id})}>Delete</button>
        </div>
      ))}
      <br/>
      {filteredRecords?.length !==0 && (
        <div className="bg-light">
          <hr></hr>
          <p>Info for this period of time:</p>
          <p>Total Calories: {filteredRecords?.reduce((acc, record) => acc + record.calories, 0)}.</p>
          <p>Total Protein: {filteredRecords?.reduce((acc, record) => acc + record.protein, 0)} g</p>
          <p>Total Carbohydrates: {filteredRecords?.reduce((acc, record) => acc + record.carbohydrate, 0)} g</p>
          <p>Total Fat: {filteredRecords?.reduce((acc, record) => acc + record.fat, 0)} g</p>
        </div>
      )}
 
      
    </div>
  )
}

export default CaloriesCounter