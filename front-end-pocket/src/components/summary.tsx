import { DialogTrigger } from "@radix-ui/react-dialog"
import { CheckCircle2, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Icon } from "./icon"
import { ProgressIndicator, Progress } from "./ui/progress-bar"
import { Separator } from "./ui/separator"
import { useQuery } from "@tanstack/react-query"
import { getSummaryHttp } from "../services/get-summary.http"

import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { PedingExercises } from "./pending-exercises"

dayjs.locale(ptBR)
export function Summary() {

    const { data } = useQuery({
        queryKey: ["summary"],
        queryFn: getSummaryHttp,
        staleTime: 1000 * 60 // 60 seconds
    })

    if (!data) {
        return null
    }

    const firstDayOfWeek = dayjs().startOf("week").format("D MMM")
    const endDayOfWeek = dayjs().endOf("week").format("D MMM")


    const completedPercentel = Math.round(data.completed * 100 / data.total)

    return (
        <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon />
                    <span className="text-xl font-semibold capitalize" >{firstDayOfWeek} - {endDayOfWeek}</span>
                </div>

                <DialogTrigger asChild>
                    <Button>
                        <Plus className="size-4" />
                        Cadastrar Exercício
                    </Button>
                </DialogTrigger>
            </div>

            <div className="flex flex-col gap-3">
                <Progress value={8} max={15}  >
                    <ProgressIndicator style={{ width: "50%" }} />
                </Progress>

                <div className="flex items-center text-xs text-zinc-400 justify-between">
                    <span> Você completou <span className="text-zinc-100">{data?.completed}
                    </span> de <span className="text-zinc-100">{data?.total}</span> metas nessa semana</span>
                    <span>{completedPercentel}%</span>
                </div>
            </div>

            <Separator />

            <PedingExercises />

            <div className=" flex flex-col gap-6">
                <span className="text-xl font-medium"> Sua Semana</span>

                {Object.entries(data.exercisesPerDay).map(([date, exercises]) => {
                    const weekDay = dayjs(date).format("dddd")
                    const parseDate = dayjs(date).format("D [ de ] MMMM")

                    return (
                        <div key={date} className="flex flex-col gap-4">
                            <h2 className="font-medium">
                                <span className="capitalize">{weekDay} </span>
                                <span className="text-zinc-400 text-xs"> {parseDate}</span>
                            </h2>
                            <ul className="flex flex-col gap-3">

                                {exercises.map(e => {
                                    return (
                                        <li key={e.id} className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-yellow-500" />
                                            <span className="text-sm text-zinc-400"> Você completou
                                                <span className="text-sm text-zinc-100"> {e.type} </span>
                                                <span className="text-sm text-zinc-100">- {e.series} </span> </span>
                                            <button className=" text-xs px-2 py-1.5 text-zinc-500"> Desfazer
                                                <Separator aria-orientation="vertical" className="text-zinc-300"
                                                />
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>

                        </div>
                    )
                })}



            </div>
        </div >
    )
}



