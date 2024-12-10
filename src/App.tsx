import "./App.css";
import { DropArea } from "./components/DropArea.tsx";
import { draggabledata } from "./draggableData.constants.ts";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <div>
        <DropArea data={draggabledata} />
        <Toaster />
      </div>
    </>
  );
}

export default App;
