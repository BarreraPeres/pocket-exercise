type PendingExercisesRequest = {
    id: string;
    type: string;
    series: string;
    desiredWeeklyFrequency: number;
    completionCount: number;
}[]

export async function getPeddingHttp(): Promise<PendingExercisesRequest> {
    const res = await fetch("http://localhost:5000/pending")
    const data = await res.json()
    return data.pendingExercise
}