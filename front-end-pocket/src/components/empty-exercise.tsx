import { Button } from "./ui/button";
import { Plus } from "lucide-react"
// import logo_color from "../assets/exercise_color.png"
import logo from "../assets/tokyo.png"
import { DialogTrigger } from '@radix-ui/react-dialog'

export function EmptyExercise() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <img src={logo} alt="exercise" />
            <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
                Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
            </p>

            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-2" />
                    Cadastrar Exercício
                </Button>
            </DialogTrigger>

        </div>
    )
}