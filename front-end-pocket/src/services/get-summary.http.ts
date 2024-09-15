type SummaryRequest = {
    completed: number,
    total: number,
    exercisesPerDay: Record<string,
        {
            id: string,
            type: string,
            series: string,
            createdAt: string
        }[]>
}


export async function getSummaryHttp(): Promise<SummaryRequest> {
    const res = await fetch("http://localhost:5000/summary")
    const data = await res.json()
    return data.summary
}