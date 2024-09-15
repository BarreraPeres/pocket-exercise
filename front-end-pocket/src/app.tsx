import { Dialog } from "./components/ui/dialog"
import { CreateExercise } from "./components/create-exercise"
import { Summary } from "./components/summary"
import { EmptyExercise } from "./components/empty-exercise"
import { useQuery } from "@tanstack/react-query"
import { getSummaryHttp } from "./services/get-summary.http"


export function App() {

  const { data } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummaryHttp,
    staleTime: 1000 * 60 //60 seconds
  })



  return (
    <Dialog>
      {data?.total && data?.total > 0 ? <Summary /> : <EmptyExercise />}

      <CreateExercise />
    </Dialog >

  )
}

