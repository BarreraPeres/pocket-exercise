import { Plus } from "lucide-react"
import { OutlineButton } from "./ui/outline-button"
import { getPeddingHttp } from "../services/get-pending-exercices.http"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createExerciseCompletionHttp } from "../services/create-exercise-completion.http"


export function PedingExercises() {
    const tanstack = useQueryClient()
    const { data } = useQuery({
        queryKey: ["peding-exercises"],
        queryFn: getPeddingHttp,
        staleTime: 1000 * 60 // 60 seconds
    })

    if (!data) {
        return null
    }

    async function handleCompleteExercise(exerciseId: string) {
        await createExerciseCompletionHttp(exerciseId)

        tanstack.invalidateQueries({ queryKey: ["summary"] })
        tanstack.invalidateQueries({ queryKey: ["peding-exercises"] })
    }

    return (
        <div className="flex flex-wrap gap-3">
            {data.map(e => {
                return (
                    <OutlineButton
                        key={e.id}
                        disabled={e.completionCount >= e.desiredWeeklyFrequency}
                        onClick={() => handleCompleteExercise(e.id)}>
                        <Plus className='size-4 text-zinc-400 ' />
                        {e.type} - {e.series}
                    </OutlineButton>
                )
            })}
        </div>
    )
}


