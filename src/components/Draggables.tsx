import { useRef, useState, useEffect } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export const Draggables = ({ data }: { data: string }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return draggable({
      element: el,
      getInitialData: () => data,
      onDragStart: () => {
        setDragging(true);
      },
      onDrop: () => {
        setDragging(false);
      },
    });
  }, [data]);

  console.log(typeof data, "DATA IN DRAGGABLES");

  return (
    <div className={"cards-section"} ref={ref}>
      <div className={"cards"} key={data}>
        {data}
      </div>
    </div>
  );
};
