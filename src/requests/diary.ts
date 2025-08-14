import { DiaryRecord, Goal } from "../components/interfaces";
import { axiosPrivate } from "../utils/axios";


export const fetchDailyGoal = async (date: string)  => { 
  const response = await axiosPrivate.get(`dailyGoals/?date=${date}`);     
  const data = await response.data
  const dailyGoal: Goal = data.goals
  return dailyGoal ?? {}
};
   
export const editDiaryRecord = async ({diaryRecord}: { diaryRecord: DiaryRecord}): Promise<void> => {
  await axiosPrivate.put(`diary-record/?id=${diaryRecord.id}`,diaryRecord);
}
  
export const deleteDiaryRecord = async ({id}: {id:string}): Promise<string | void> => {
  const response = await axiosPrivate.delete(`diary-record/?id=${id}`);

  if (response.data.error) {
    const errorData = await response.data.error  
    return errorData.message;  
  }
}