import { useEffect } from "react";
import { activityTypes } from "../../assets/activityTypes";
import Button from "../../customComponents/Button";
import { useActivityMutations } from "../../hooks/mutations/activity";
import { ActivityRecordComponentProps } from "../props";


const RecordComponent: React.FC<ActivityRecordComponentProps> = ({ record, editRecord }) => {
  const { popActivityRecord, putActivityRecord } = useActivityMutations();

  const toggleDone = (value: boolean) => {
    putActivityRecord.mutateAsync({ activity: { ...record, done: value, timestamp: record.done ? new Date().toISOString() : record.timestamp } });
  };

  const isTodaysRecord = () => {
    const recordDate = new Date(record.timestamp.split("T")[0]);
    const today = new Date();
    const recordDateOnly = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (recordDateOnly >= todayDateOnly) {
      toggleDone(!record.done);
    } else {
      window.alert("You cannot modify records from past days.");
    }
  };

  useEffect(() => {
    if (record.done) return; 

    const now = new Date();
    const target = new Date(record.timestamp);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      toggleDone(true); 
      return;
    }

    if (target.getDate() === now.getDate()) {
      const timer = setTimeout(() => {
        toggleDone(true); // ✅ Auto-mark when time is reached
      }, diff);

      return () => clearTimeout(timer);
    }
  }, [record.timestamp, record.done]);
  
  return (
    <div className="bg-primary border-2 border-primary-dark rounded-4 p-3 my-4 gap-4  w-75 mx-auto">
      <div className="d-flex flex-row w-full py-1 gap-3 align-items-center justify-content-between">
        <h5 className="text-xl font-semibold max-w-[70%] text-white">
          {activityTypes.find((type) => type.type == record.activity_type)?.label}:
        </h5> 
        <Button
          text={record.done ? "Done" : "In Progress"}
          icon={record.done ? "fa fa-check" : "fa fa-spinner"}
          onClick={isTodaysRecord}
          disabled={new Date() > new Date(record.timestamp)}
        />
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div>
          <div>
            {record.duration_minutes > 0 && (
              <p className="text-white mb-1">Duration: {record.duration_minutes} minutes.</p>
            )}
            {record.calories_burned ? (
              <p className="text-white mb-1">Calories burned: {record.calories_burned}.</p>
            ) : (
              <p className="text-white mb-1">
                Calories burned: Connection to server is needed to calculate burned calories.
              </p>
            )}
            {record.intensity && (
              <p className="text-white mb-1">Intensity Level: {record.intensity}.</p>
            )}
            {record.activity_type == "walk_steps" && (
              <p className="text-white mb-1">Steps: {record.steps}.</p>
            )}
          </div>
          {record.description && (
            <p className="text-white">Notes: {record.description} </p>
          )}
          <div className="text-right text-white mb-3">
            {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="h-full d-flex flex row align-items-center gap-2 pe-2">
          <Button
            text="Edit"
            data-bs-target="#modalEdit"
            data-bs-toggle="modal"
            onClick={editRecord}
            size="sm"
            variant="edit"
          />
          <Button variant="delete" icon="fa fa-trash" onClick={() => popActivityRecord.mutateAsync({id:record.id})} />
        </div>

      </div>
    </div>
  );
};

export default RecordComponent;
