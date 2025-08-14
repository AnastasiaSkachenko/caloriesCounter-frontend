import { ActivityRecordPayload } from "../components/interfaces";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const useActivity = () => {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchActivityRecords = async (date: string): Promise<ActivityRecordPayload[]> => {
    try {
      const response = await axiosPrivate.get(`/activityRecords/?date=${date}`);
      return response.data.activities as ActivityRecordPayload[];
    } catch (error) {
      console.error("Error fetching activity records:", error);
      return [];
    }
  };

  const saveActivityRecord = async ({ activity }: { activity: unknown }): Promise<{message :"Success" | "Error", calories_burned?: number}> => {
    try {
      const response = await axiosPrivate.post("/activityRecords/", activity);
      return {message:"Success", calories_burned: response.data.calories_burned}
    } catch (error) {
      console.error("Error saving activity:", error);
      return {message: 'Error'}
    }
  };

  const editActivityRecord = async ({ activity }: { activity: unknown }): Promise<{message :"Success" | "Error", calories_burned?: number}> => {
    try {
      const response = await axiosPrivate.put(`/activityRecords/`, activity);
      return {message:"Success", calories_burned: response.data.calories_burned}
    } catch (error) {
      console.error("Error editing activity:", error);
      return {message: 'Error'}
    }
  };

  const deleteActivityRecord = async ({ id }: {id: string}): Promise<string | void> => {
    try {
      const response = await axiosPrivate.delete(`/activityRecords/?id=${id}`);
      if (response.data?.error) {
        return response.data.error.message;
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return {
    fetchActivityRecords,
    saveActivityRecord,
    editActivityRecord,
    deleteActivityRecord,
  };
};
