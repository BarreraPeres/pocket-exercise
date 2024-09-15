interface CreateExerciseRequest {
    type: string
    series: string
    desiredWeeklyFrequency: number
}

export async function CreateExerciseHttp({
    desiredWeeklyFrequency,
    series,
    type }: CreateExerciseRequest) {
    await fetch("http://localhost:5000/exercice", {
        method: "POST",
        body: JSON.stringify({
            desiredWeeklyFrequency,
            series,
            type
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}