import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActivity } from "../utils/activity";
import { ActivityRecordPayload } from "../components/interfaces";

export const useActivityMutations = () => {
  const queryClient = useQueryClient();
  const { saveActivityRecord, editActivityRecord, deleteActivityRecord } = useActivity();

  const setActivityRecord = useMutation<{ message: "Success" | "Error"; calories_burned?: number | undefined; }, Error, { activity: ActivityRecordPayload }>({
    mutationFn: saveActivityRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityRecords"] });
    },
  });

  const putActivityRecord = useMutation<{ message: "Success" | "Error"; calories_burned?: number | undefined; }, Error, { activity: ActivityRecordPayload }>({
    mutationFn: editActivityRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityRecords"] });
    },
  });

  const popActivityRecord = useMutation<void | string, Error, { id: string }>({
    mutationFn: deleteActivityRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activityRecords"] });
    },
  });

  return { setActivityRecord, putActivityRecord, popActivityRecord };
};
