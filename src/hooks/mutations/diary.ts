import { useQueryClient, useMutation } from "@tanstack/react-query"
import {  DiaryRecordInput } from "../../components/interfaces"
import useAxiosPrivate from "../useAxiosPrivate"
import { deleteDiaryRecord, editDiaryRecord } from "../../requests/diary"


export const useDiaryMutation = () => {
	const {saveDiaryRecord} = useAxiosPrivate()
	const queryClient = useQueryClient()

	const {mutateAsync: setDiaryRecord} = useMutation<void, Error, DiaryRecordInput>({
		mutationFn: saveDiaryRecord,
		onSuccess: () => {  
			queryClient.invalidateQueries({queryKey: ['diaryRecords']})
		}
	})

	const {mutateAsync: putDiaryRecord} = useMutation<void, Error, DiaryRecordInput>({
		mutationFn: editDiaryRecord,
		onSuccess: () => {  
			queryClient.invalidateQueries({queryKey: ['diaryRecords']})
		}
	})

	const {mutateAsync: popDiaryRecord} = useMutation<string | void, Error, {id:string}>({
		mutationFn: deleteDiaryRecord,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['diaryRecords']}) 
		}
	})

	return {setDiaryRecord, putDiaryRecord, popDiaryRecord}
}
