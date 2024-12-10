import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { z } from "zod";
import { Draggables } from "./Draggables.tsx";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import moveIcon from "../assets/move-svgrepo-com.svg";
import backendIcon from "../assets/db-copy-svgrepo-com.svg";
import frontendIcon from "../assets/com-laptop-code-svgrepo-com.svg";
import styleIcon from "../assets/pencil-svgrepo-com.svg";

import { useToast } from "@/hooks/use-toast";

const DraggableItemsSchema = z.record(
  z.enum(["style", "backend", "frameworks"]),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DataSchema = z.object({
  frameworks: z.array(z.string()),
  backend: z.array(z.string()),
  styles: z.array(z.string()),
  draggableItems: DraggableItemsSchema,
});

export type DropAreaPropsSchema = z.infer<typeof DataSchema>;

export const DropArea = ({ data }: { data: DropAreaPropsSchema }) => {
  const ref = useRef(null);
  const [, setEntered] = useState(false);
  const frameworksRef = useRef<HTMLDivElement>(null);
  const backendRef = useRef<HTMLDivElement>(null);
  const stylesRef = useRef<HTMLDivElement>(null);
  const [sectionPositions, setSectionPositions] = useState<{
    frameworks: DOMRect | null;
    backend: DOMRect | null;
    styles: DOMRect | null;
  }>({ frameworks: null, backend: null, styles: null });
  const [updatedItems, setUpdatedItems] = useState<DropAreaPropsSchema>(data);
  const { toast } = useToast();

  const getSectionPositions = () => {
    const frameworksPosition = frameworksRef.current?.getBoundingClientRect();
    const backendPosition = backendRef.current?.getBoundingClientRect();
    const stylesPosition = stylesRef.current?.getBoundingClientRect();
    console.log(frameworksPosition, backendPosition, stylesPosition);
    setSectionPositions({
      frameworks: frameworksPosition || null,
      backend: backendPosition || null,
      styles: stylesPosition || null,
    });
  };

  useLayoutEffect(() => {
    getSectionPositions();
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,

      getData: () => ({ location }),
      onDragEnter: () => {
        setEntered(false);
      },
      onDragLeave: () => {
        setEntered(false);
      },
      onDrop: () => {
        setEntered(false);
      },
    });
  }, []);

  useEffect(() => {
    return monitorForElements({
      onDrop({ location, source }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const locationX = location.current.input.clientX;
        const locationY = location.current.input.clientY;

        console.log(locationX, locationY);

        const { frameworks, backend, styles } = sectionPositions;

        console.log(frameworks, backend, styles);
        if (
          frameworks &&
          locationX >= frameworks.left &&
          locationX <= frameworks.right &&
          locationY >= frameworks.top &&
          locationY <= frameworks.bottom
        ) {
          console.log("Dropped on Frameworks section", source.data);

          if (
            updatedItems.draggableItems[source.data as unknown as string] !==
            "frameworks"
          ) {
            return toast({
              title: "Incorrect column",
              description: "Please find the correct column to drop this item!",
              variant: "destructive",
            });
          }

          setUpdatedItems((prevState) => {
            const updatedDraggableItems = Object.fromEntries(
              Object.entries(prevState.draggableItems).filter(
                ([item]) => item !== (source.data as unknown as string),
              ),
            );

            return {
              ...prevState,
              frameworks: [
                ...prevState.frameworks,
                source.data as unknown as string,
              ],
              draggableItems: updatedDraggableItems,
            };
          });
        } else if (
          backend &&
          locationX >= backend.left &&
          locationX <= backend.right &&
          locationY >= backend.top &&
          locationY <= backend.bottom
        ) {
          console.log("Dropped on Backend section");

          if (
            updatedItems.draggableItems[source.data as unknown as string] !==
            "backend"
          ) {
            return toast({
              title: "Incorrect column",
              description: "Please find the correct column to drop this item!",
              variant: "destructive",
            });
          }

          setUpdatedItems((prevState) => {
            const updatedDraggableItems = Object.fromEntries(
              Object.entries(prevState.draggableItems).filter(
                ([item]) => item !== (source.data as unknown as string),
              ),
            );

            return {
              ...prevState,
              backend: [...prevState.backend, source.data as unknown as string],
              draggableItems: updatedDraggableItems,
            };
          });
        } else if (
          styles &&
          locationX >= styles.left &&
          locationX <= styles.right &&
          locationY >= styles.top &&
          locationY <= styles.bottom
        ) {
          console.log("Dropped on Styles section");
          if (
            updatedItems.draggableItems[source.data as unknown as string] !==
            "style"
          ) {
            return toast({
              title: "Incorrect column",
              description: "Please find the correct column to drop this item!",
              variant: "destructive",
            });
          }

          setUpdatedItems((prevState) => {
            const updatedDraggableItems = Object.fromEntries(
              Object.entries(prevState.draggableItems).filter(
                ([item]) => item !== (source.data as unknown as string),
              ),
            );

            return {
              ...prevState,
              styles: [...prevState.styles, source.data as unknown as string],
              draggableItems: updatedDraggableItems,
            };
          });

          console.log("Dropped on Styles section");
        } else {
          console.log("Dropped outside the sections");
        }
      },
    });
  }, [sectionPositions, updatedItems.draggableItems]);

  return (
    <div className={"drag-section"} ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div className={"cards-section"}>
          <div className={"header-text"}>
            <img
              src={moveIcon}
              style={{ width: "16px", height: "16px", margin: "0 5px" }}
              alt={"MoveIcon"}
            />
            Options to drag
          </div>
          {Object.keys(updatedItems.draggableItems).map((item) => (
            <Draggables data={item} key={`item-${item}`} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <div className={"cards-section"} ref={frameworksRef}>
            <div className={"header-text"}>
              <img
                src={frontendIcon}
                style={{ width: "16px", height: "16px", margin: "0 5px" }}
                alt={"frontendIcon"}
              />
              Frameworks
            </div>
            {updatedItems.frameworks.map((framework: string) => (
              <div className={"cards"} key={framework}>
                {framework}
              </div>
            ))}
          </div>
          <div className={"cards-section"} ref={backendRef}>
            <div className={"header-text"}>
              <img
                src={backendIcon}
                style={{ width: "16px", height: "16px", margin: "0 5px" }}
                alt={"backendIcon"}
              />
              Backend
            </div>
            {updatedItems.backend.map((be: string) => (
              <div className={"cards"} key={be}>
                {be}
              </div>
            ))}
          </div>
          <div className={"cards-section"} ref={stylesRef}>
            <div className={"header-text"}>
              <img
                src={styleIcon}
                style={{ width: "16px", height: "16px", margin: "0 5px" }}
                alt={"styleIcon"}
              />
              Styling
            </div>
            {updatedItems.styles.map((styles: string) => (
              <div className={"cards"} key={styles}>
                {styles}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
