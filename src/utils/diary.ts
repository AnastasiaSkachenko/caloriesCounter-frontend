import {  DiaryRecordInput, Goal } from "../components/interfaces";
import Cookies from "universal-cookie"; 
import { axiosPrivate } from "./axios";

const cookies = new Cookies();


export const fetchDailyGoal = async (date: string)  => { 
  const response = await axiosPrivate.get(`dailyGoals/?date=${date}`);     
  const data = await response.data
  const dailyGoal: Goal = data.goals
  return dailyGoal ?? {}
};



   
export const editDiaryRecord = async ({diaryRecord}: DiaryRecordInput): Promise<void> => {
  await axiosPrivate.put(`diary-record/?id=${diaryRecord.id}`,diaryRecord);

}
  
export const deleteDiaryRecord = async ({id}: {id:string}): Promise<string | void> => {
  const response = await axiosPrivate.delete(`diary-record/?id=${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    }, 
  });

  if (response.data.error) {
    const errorData = await response.data.error  
    return errorData.message;  
  }
}


