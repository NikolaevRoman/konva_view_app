import React, { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Image from "./image/Image";
import ToolButton from "./Buttons/ToolButton";
import "./styles.css";
import { handleOnWheel } from "./Methods/Scale";
import Overlay from "./Overlay";

export default function App() {
  const [draggable, setDraggable] = useState(true);
  const [mode, setMode] = useState(null);
  const stageRef = useRef(null);

  return (
    <div className="container">
      <div className="buttons-container">
        <button
          className="tool-button"
          tabIndex="1"
          onClick={(e) => {
            setMode(null);
            setDraggable(true);
          }}
          style={{ background: mode === null ? "#12aaff" : null }}
        >
          Перемещение и редактирование
        </button>
        <ToolButton
          buttonMode="line"
          text="Кривая"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="rect"
          text="Прямоугольник"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="ellipse"
          text="Эллипс"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="triangle"
          text="Треугольник"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="segment"
          text="Линейка"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="angle"
          text="Угол"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="freeLine"
          text="Произвольная"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          // extended={true}
          // closed={closed}
          // setClosed={setClosed}
        />
        <ToolButton
          buttonMode="text"
          text="Текст"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        <ToolButton
          buttonMode="segment"
          text="Линейка"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
        />
        {mode === null ? null : (
          <div className="text-tooltip"> {`Активный инструмент: ${mode}`}</div>
        )}
      </div>
      <div
        id="stageWrapper"
        className="stage-wrapper"
        tabIndex="0"
        onKeyDown={(e) => {
          // if (e.keyCode === 46 || e.keyCode === 68) {
          //   console.log(`Selected line index: ${selectedShape.id}`);
          //   if (selectedShape.id !== null) {
          //     switch (selectedShape.type) {
          //       case "line":
          //         const localLine = [...lines];
          //         localLine.splice(selectedShape.id, 1);
          //         setLines(localLine);
          //         selectShape({ id: null, type: null });
          //         break;
          //       case "freeline":
          //         const localFreeLines = [...freeLines];
          //         localFreeLines.splice(selectedShape.id, 1);
          //         setFreeLines(localFreeLines);
          //         selectShape({ id: null, type: null });
          //         break;
          //       default:
          //         break;
          //     }
          //   }
          //   const stage = stageRef.current.getStage();
          //   stage.batchDraw();
          // } else if (e.keyCode === 27) {
          //   setLines([...lines, []]);
          // }
        }}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
          draggable={draggable}
          onWheel={handleOnWheel}
        >
          <Layer>
            <Image />
          </Layer>
          <Overlay
            stageRef={stageRef}
            draggable={draggable}
            setDraggable={setDraggable}
            mode={mode}
            setMode={setMode}
          />
        </Stage>
      </div>
    </div>
  );
}
