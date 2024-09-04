import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const state = true;

export default function Home() {
  return (
    <div className="">
      <p className='text-3xl font-bold text-indigo-500'>
        Hello Discord Clone
      </p>

      <Button className={cn(
        "bg-indigo-500",
        state && "bg-red-500"
      )} variant='test'>
        Click Me
      </Button>
    </div>

  )
}
