import { useToast } from "@/hooks/use-toast";

export function ToastDestructive({ isError }: { isError: boolean }) {
  const { toast } = useToast();

  return (
    <>
      {isError && (
        <div
          variant="outline"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            });
          }}
        ></div>
      )}
    </>
  );
}
