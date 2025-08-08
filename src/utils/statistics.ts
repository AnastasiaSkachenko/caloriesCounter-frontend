import { Feedback, Goal, Suggestion } from "../components/interfaces";
import useAxiosPrivate from "../hooks/useAxiosPrivate";



export const useStatisticsRequests = () => {
	const { axiosPrivate } = useAxiosPrivate()

	//gets statistics for a giver month 
	const getStatistics = async ({month, year}: {month: number, year:number}): Promise<{ 
		goals: Goal[], 
		feedback?: Feedback, 
		suggested_dishes: Suggestion[]}> => {
		try {
			const response = await axiosPrivate.get(`/statistics/?month=${month}&&year=${year}`);
			return { goals:response.data.goals || [], feedback: response.data.feedback || {}, suggested_dishes: response.data.suggested_dishes};
		} catch  {
			console.error("Failed to load statistics. Please try again.");
			return {goals: [],suggested_dishes: []}
		}
	};

	return {getStatistics}
}
