import {  useMemo,useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getCurrentDate } from '../../utils/utils';
import { useQuery } from '@tanstack/react-query';
import { useActivity } from '../../requests/activity';
import Modal from '../general/Modal';
import ActivityForm from './ActivityForm';
import Button from '../../customComponents/Button';
import RecordComponent from './Record';
import { Values } from '../interfaces';
import Header from '../general/header';


const Activity = () => {
  const { auth } = useAuth()
  const [editActivity, setEditActivity] = useState< Values | undefined>(undefined)
  const { fetchActivityRecords } = useActivity()
  const [date, setDate] = useState(getCurrentDate);

  const {
    status: status, error: error, isLoading,data: records,  
  } = useQuery({
    queryKey: ['activityRecords', date], 
    queryFn: () =>  fetchActivityRecords(date), 
  });
  
  const filteredRecords = useMemo(() => {
    if (!records || !date) return [];
    return records.filter((record) =>
      record.timestamp?.split("T")[0] === date
    );
  }, [records, date]);

  if (!auth.user ) {
    return <p>Loading...</p>
  }

  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  return (
    <div className='bg-dark p-3' style={{minHeight: "100vh"}}>
        <Header active='activity' />
        <h2 className='text-white font-bold text-3xl mb-3'>Activity Diary</h2>

        <Modal id="modalAdd" title="Add Activity">
            <ActivityForm
              onExit={() => {}}
            />
        </Modal>

        <Modal id="modalEdit" title="Edit Activity">
          {editActivity &&
            <ActivityForm
              onExit={() => setEditActivity(undefined)}
              activityData={editActivity}
            />
          }
        </Modal>

        <div className="d-flex justify-content-between align-items-center ">
          <Button
            text="Add Record"
            variant="submit"
            data-bs-target="#modalAdd"
            data-bs-toggle="modal"
            size="lg"
          />          
          <label className="text-white form-label d-block">
            Date:
            <input className='border border-light rounded p-1 mx-2' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <div className="py-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center bg-dark" style={{ height: "100px" }}>
              <h3 className="text-white">
                <i className="fa fa-spinner fa-spin me-2"></i>
                Loading...
              </h3>
            </div>
          ) : records && records.length > 0 ? (
            records.map((item, index) => (
              <RecordComponent key={index} record={item} editRecord={() => setEditActivity(item)} />
            ))
          ) : (
            <p className="text-white text-center">No records match your search.</p>
          )}
        </div>
        <h5 className='position-fixed bottom-0 pb-3 text-white text-lg mt-4'>
          Calories burned on {date}: {
            filteredRecords?.reduce((acc, record) => acc + (record.calories_burned || 0), 0) || 0
          }
        </h5>
    </div>
  );
};

export default Activity;
