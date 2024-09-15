import { DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog'

import { X } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { RadioGroupIndicator, RadioGroupItem } from "./ui/radio-group"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Button } from "./ui/button"
import { Controller, useForm } from "react-hook-form"
import { string, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateExerciseHttp } from "../services/create-exercise.http"
import { useQueryClient } from "@tanstack/react-query"

const createExerciseForm = z.object({
    type: string().min(1, "Informe o tipo de exercício"),
    series: string().min(1, "Informe a série do exercício"),
    desiredWeeklyFrequency: z.string().min(1, "Informe a frequência do exercício").max(7).transform((v) => Number(v))
})

type CreateExerciseForm = z.infer<typeof createExerciseForm>

export function CreateExercise() {
    const tanstack = useQueryClient()

    const { register, control, handleSubmit, formState, reset } = useForm<CreateExerciseForm>({
        resolver: zodResolver(createExerciseForm)
    })

    async function handleCreateExercise(data: CreateExerciseForm) {
        await CreateExerciseHttp({
            type: data.type,
            desiredWeeklyFrequency: data.desiredWeeklyFrequency,
            series: data.series
        })

        tanstack.invalidateQueries({ queryKey: ["summary"] })
        tanstack.invalidateQueries({ queryKey: ["peding-exercises"] })

        reset()
    }

    return (
        <DialogContent >
            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <DialogTitle> Cadastrar Exercício</DialogTitle>
                        <DialogClose>
                            <X className="size-5" />
                        </DialogClose>
                    </div>
                    <DialogDescription>
                        Adicione exercícios que te deixam potênte
                        e que você quer continuar praticando toda semana.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit(handleCreateExercise)}
                    className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 text-sm ">
                            <Label htmlFor="type">Qual o exercício?</Label>
                            <Input
                                id="type"
                                autoFocus
                                placeholder="Flexão Arqueada, Abdominal, etc."
                                {...register("type")}
                            />
                            {formState.errors.type && (
                                <p className="text-red-400 text-sm">
                                    {formState.errors.type.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 text-sm">
                            <Label htmlFor="series"> Quantas séries? </Label>
                            <Input
                                id="series"
                                autoFocus
                                placeholder="4 séries de 20, 3 séries de 15"
                                {...register("series")}
                            />
                            {formState.errors.series && (
                                <p className="text-red-400 text-sm">{formState.errors.series.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            <Label htmlFor="type"> Quantas vezes na semana? </Label>
                            <Controller
                                control={control}
                                defaultValue={0}
                                name="desiredWeeklyFrequency"
                                render={({ field }) => {
                                    return (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                            className="flex flex-col gap-2 text-sm">
                                            <RadioGroupItem value="1">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    1x na semana</span>
                                                <span className="text-lg leading-none">😴</span>
                                            </RadioGroupItem>

                                            <RadioGroupItem value="2">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    2x na semana</span>
                                                <span className="text-lg leading-none">🙂</span>
                                            </RadioGroupItem>

                                            <RadioGroupItem value="3">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    3x na semana</span>
                                                <span className="text-lg leading-none">😎</span>
                                            </RadioGroupItem>

                                            <RadioGroupItem value="4">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    4x na semana</span>
                                                <span className="text-lg leading-none">😜</span>
                                            </RadioGroupItem>

                                            <RadioGroupItem value="5">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    5x na semana</span>
                                                <span className="text-lg leading-none">🤨</span>
                                            </RadioGroupItem>

                                            <RadioGroupItem value="6">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    6x na semana</span>
                                                <span className="text-lg leading-none">🤯</span>
                                            </RadioGroupItem>

                                            <RadioGroupItem value="7">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    7x na semana</span>
                                                <span className="text-lg leading-none">🔥</span>
                                            </RadioGroupItem>
                                        </RadioGroup >
                                    )
                                }}
                            />
                        </div>


                    </div>

                    <div className="flex items-center gap-3 ">
                        <DialogClose asChild>
                            <Button variant="secondary" className="flex-1">
                                Fechar
                            </Button>
                        </DialogClose>

                        <Button className="flex-1">Salvar</Button>
                    </div>
                </form>
            </div >

        </DialogContent >
    )
}