export async function createExerciseCompletionHttp(exerciseId: string) {
    await fetch("http://localhost:5000/completion", {
        method: "POST",
        body: JSON.stringify({
            exerciseId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

}