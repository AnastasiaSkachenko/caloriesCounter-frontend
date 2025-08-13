import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useActivityMutations } from '../../hooks/activity';
import { v4 as uuidv4 } from 'uuid';
import { ActivityType, buildActivityPayload, Values } from '../interfaces';
import { activitySchema } from '../../utils/validation schemes';
import { activityTypes } from '../../assets/activityTypes';
import { descriptions } from '../../assets/activityIntencity';
import Button from '../../customComponents/Button';
import Input from '../Input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ActivityForm = ({ onExit, activityData }: { onExit: () => void, activityData?: Values }) => {
  const { auth } = useAuth()
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const { setActivityRecord, putActivityRecord } = useActivityMutations()
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    id: activityData?.id || uuidv4(),
    activity_type: activityData?.activity_type || 'workout',
    duration_minutes: activityData?.duration_minutes || 20,
    steps: activityData?.steps ||  undefined,
    distance_km: activityData?.distance_km || undefined,
    intensity: activityData?.intensity ?? 3,
    name: undefined,
    done: activityData?.done ? true : false,
    weight_kg: auth.user?.weight ?? 53,
    timestamp: activityData?.timestamp ? new Date(activityData?.timestamp).toISOString() : new Date().toISOString(),
    description: activityData?.description
  })

  const inputFields = [
    {
      show: formState.activity_type !== 'walk_steps',
      title: 'Duration (minutes):',
      type: "number",
      name: 'duration_minutes',
      value: formState.duration_minutes,
    },
    {
      show: formState.activity_type === 'walk_steps',
      title: 'Steps:',
      type: "number",
      name: 'steps',
      value: formState.steps ?? 0,
    },
    {
      show: ['walk_time', 'run', 'interval_run'].includes(formState.activity_type),
      title: 'Distance (km):',
      type: "number",
      name: 'distance_km',
      value: formState.distance_km ?? 0,
    },
    {
      show: true,
      title: "Notes: ",
      type: "textarea",
      name: "description",
      value: formState.description ?? "",
      labelClassName: "d-block"
    },
  ];

  const validationSchema = activitySchema


  useEffect(() => {
    validationSchema.validate(formState)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [formState, validationSchema]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormState({
      ...formState,
      [name]: checked,
    });
  };
  
  const handleSubmit = async () => {
    setLoading(true)
    const activityRecord = buildActivityPayload(formState, auth.user?.weight ?? 53, auth.user?.id ?? 2);

    if (new Date() > new Date(formState.timestamp)) { 
      formState.done = true
    }


    if (activityData) {
      await putActivityRecord.mutateAsync({activity: activityRecord})
    } else {
      await setActivityRecord.mutateAsync({activity: activityRecord})
    }
    onExit(); 
    setLoading(false)
  }

  return (
    <div className='bg-mainBG rounded-xl'>
      <div className="p-4 gap-3">
        <Input
          type='select'
          title='Activity Type:'
          name='activity_type'
          value={formState.activity_type}
          onChange={handleChange}
          isRequired
        >
          {activityTypes.map((type) => (
            <option key={type.type} label={type.label} value={type.type} />
          ))}     
        </Input>

        {inputFields.map(({ show, ...props }) =>
          show && (
            <Input
              key={props.name}
              {...props}
              onChange={ handleChange}
            />
          )
        )}

        <Input
          title={`Intensity: ${formState.intensity}`}
          type='select'
          onChange={handleChange}
          value={formState.intensity}
          name='intensity'
        >
          {[1,2,3,4,5].map((intensity) => (
            <option key={intensity} label={intensity.toString()} value={intensity} />
          ))}     

        </Input>

        {formState.activity_type in descriptions && (
          <p>
            {descriptions[formState.activity_type as ActivityType]?.[formState.intensity as 1 | 2 | 3 | 4 | 5]}
          </p>
        )}

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="doneSwitch"
            name="done"
            checked={formState.done}
            onChange={handleCheckboxChange}
            style={{ transform: "scale(1.5)", marginRight: "20px", cursor: "pointer" }} 
          />
          <label className="form-check-label" htmlFor="doneSwitch">
            {formState.done ? "Activity completed" : "Plan Activity"}
          </label>
        </div>

      

        {!formState.done && (
          <DatePicker
            selected={formState.timestamp ? new Date(formState.timestamp) : null}
            onChange={(date) => date && setFormState( prev =>  ({...prev, timestamp:date.toISOString()}))}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            className="form-control my-2 mb-3"
          />        
        )}

        {!validation.valid && (
          <p className='text-danger'>{validation.message}</p>
        )}

        <div className='d-flex justify-content-center gap-2'>
          <Button
            text='Submit'
            variant='submit'
            type='button'
            data-bs-dismiss="modal"
            data-bs-target={activityData ? "#modalEdit" : "#modalAdd"}

            onClick={handleSubmit}
            pending={loading}
            disabled={!validation.valid}
          />
          <Button
            text='Cancel'
            variant='cancel'
            type='button'
            data-bs-dismiss="modal"
            data-bs-target={activityData ? "#modalEdit" : "#modalAdd"}
            onClick={onExit}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;
