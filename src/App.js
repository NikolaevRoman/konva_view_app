import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Circle } from "react-konva";
import Line from "./shapes/Curve";
import Rect from "./shapes/rectangle";
import Image from "./image/Image";
import ToolButton from "./Buttons/ToolButton";
import "./styles.css";
import Ellipse from "./shapes/Ellipse";
import Triangle from "./shapes/Triangle_line";
import {handleOnWheel} from "./Methods/Scale"

export default function App() {
  const [draggable, setDraggable] = useState(true);
  const [lines, setLines] = useState([]);
  const [rects, setRects] = useState([]);
  const [ellipses, setEllipses] = useState([]);
  const [triangles, setTriangles] = useState([]);
  const [freeLines, setFreeLines] = useState([]);
  const [anchors, setAnchors] = useState([]);
  const [anchorsTriangle, setAnchorsTriangle] = useState([]);
  const [texts, setTexts] = useState([]);
  const [mode, setMode] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const stageRef = useRef(null);
  const textInputRef = useRef(null);
  const [selectedShape, selectShape] = useState({ id: null, type: null });
  const [closed, setClosed] = useState(false);

  const [textInputProps, setTextInputProps] = useState({
    visible: false,
    top: 0,
    left: 0
  });

  function getRelativePointerPosition(node) {
    var transform = node.getAbsoluteTransform().copy();
    transform.invert();
    var pos = node.getStage().getPointerPosition();
    return transform.point(pos);
  }

  const handleMouseDown = () => {
    if (draggable) return;
    if (mode === "line") return;
    setDrawing(true);
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);
    if (mode === "line") setLines([...lines, [point.x, point.y]]);
    else if (mode === "rect") {
      setRects([
        ...rects,
        {
          id: `rect${rects[rects.length - 1]?.id || 0}`,
          x: point.x,
          y: point.y
        }
      ]);
    } else if (mode === "ellipse") {
      setEllipses([
        ...ellipses,
        {
          id: `elli${ellipses[ellipses.length - 1]?.id || 0}`,
          x: point.x,
          y: point.y
        }
      ]);
    } else if (mode === "freeLine") {
      setFreeLines([...freeLines, [point.x, point.y]]);
    }
  };

  const handleMouseMove = e => {
    // no drawing - skipping
    if (draggable) return;
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);

    if (!drawing) return;
    if (mode === "rect") {
      let lastRect = rects[rects.length - 1];
      // add point
      lastRect.width = point.x - lastRect.x;
      lastRect.height = point.y - lastRect.y;
      let tempArr = [...rects];
      // replace last
      tempArr.splice(tempArr.length - 1, 1, lastRect);
      setRects(tempArr);
    } else if (mode === "ellipse") {
      let lastEllipse = ellipses[ellipses.length - 1];
      // add point
      lastEllipse.width = Math.abs((point.x - lastEllipse.x) * 2);
      lastEllipse.height = Math.abs((point.y - lastEllipse.y) * 2);
      let tempArr = [...ellipses];
      // replace last
      tempArr.splice(tempArr.length - 1, 1, lastEllipse);
      setEllipses(tempArr);
    } else if (mode === "freeLine") {
      let lastLine = freeLines[freeLines.length - 1];
      lastLine = lastLine.concat([point.x, point.y]);
      let tempArr = [...freeLines];
      // replace last
      tempArr.splice(tempArr.length - 1, 1, lastLine);
      setFreeLines(tempArr.concat());
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const checkDeselect = e => {
    // deselect when clicked on empty area
    const clickedOnEmpty =
      e.target.constructor.name === "Image" ||
      e.target.constructor.name === "Stage";
    if (clickedOnEmpty) {
      selectShape({ id: null, type: null });
    }
  };
  

  const handleOnClick = e => {
    if (mode !== "line" && mode !== "text" && mode !== "triangle") return;
    console.log(`condition true`);
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);
    if (mode === "line") {
      if (
        lines[lines.length - 1]?.length === 0 ||
        lines[lines.length - 1]?.length === undefined
      ) {
        setLines([...lines, [point.x, point.y]]);
        setAnchors([...anchors, [point.x, point.y]]);
        return;
      }
      let lastLine = lines[lines.length - 1];
      lastLine = lastLine.concat([point.x, point.y]);
      let localLines = [...lines];
      localLines.splice(localLines.length - 1, 1, lastLine);
      setLines(localLines);
      setAnchors([...anchors, [point.x, point.y]]);
      stage.batchDraw();
    } else if (mode === "text") {
      if (textInputRef.current?.value !== "") {
        SaveText();
        setTextInputProps({ ...textInputProps, visible: false });
      }
      const areaPosition = stage.getPointerPosition();
      setTextInputProps({
        visible: true,
        absoluteTop: areaPosition.y,
        absoluteLeft: areaPosition.x,
        top: point.y,
        left: point.x
      });
    } else if (mode === "triangle") {
      if (
        triangles[triangles.length - 1]?.points?.length === 0 ||
        triangles[triangles.length - 1]?.points?.length === undefined
      ) {
        console.log(triangles);

        setTriangles([
          ...triangles,
          { id: `triangles${0}`, points: [point.x, point.y] }
        ]);
        setAnchorsTriangle([...anchorsTriangle, [0, point.x, point.y]]);
        return;
      }
      let lastTriangle = triangles[triangles.length - 1];
      lastTriangle.points = lastTriangle.points.concat([point.x, point.y]);
      let localTriangles = [...triangles];
      localTriangles.splice(localTriangles.length - 1, 1, lastTriangle);
      if (lastTriangle.points.length === 6)
        setTriangles([...localTriangles, {}]);
      else setTriangles(localTriangles);
      setAnchorsTriangle([
        ...anchorsTriangle,
        [anchorsTriangle.length - 1, point.x, point.y]
      ]);
      stage.batchDraw();
    }
  };

  const handleDbClick = e => {
if(mode === "line"){
  
}
  };

  useEffect(() => {
    selectShape({ id: null, type: null });
    setTextInputProps({ visible: false });
    if (lines.length > 1) setLines([...lines, []]);
  }, [mode]);

  useEffect(() => {
    console.log(lines);
  }, [lines]);

  useEffect(() => {
    return textInputRef.current?.focus();
  }, [textInputProps.visible]);

  const SaveText = e => {
    setTextInputProps({ ...textInputProps, visible: false });
    setTexts([
      ...texts,
      {
        x: textInputProps.left,
        y: textInputProps.top,
        text: textInputRef.current?.value
      }
    ]);
  };

  return (
    <div className="container">
      <div className="buttons-container">
        <button
          className="tool-button"
          tabIndex="1"
          onClick={e => {
            setMode(null);
            setDraggable(true);
          }}
          style={{ background: mode === null ? "#12aaff" : null }}
        >
          Перемещение и редактирование
        </button>
        <ToolButton
          buttonMode="line"
          text="Прямая"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          selectShape={selectShape}
        />
        <ToolButton
          buttonMode="rect"
          text="Прямоугольник"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          selectShape={selectShape}
        />
        <ToolButton
          buttonMode="ellipse"
          text="Эллипс"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          selectShape={selectShape}
        />
        <ToolButton
          buttonMode="triangle"
          text="Треугольник"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          selectShape={selectShape}
        />
        <ToolButton
          buttonMode="freeLine"
          text="Кривая"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          selectShape={selectShape}
          extended={true}
          closed={closed}
          setClosed={setClosed}
        />
        <ToolButton
          buttonMode="text"
          text="Текст"
          setMode={setMode}
          setDraggable={setDraggable}
          mode={mode}
          selectShape={selectShape}
        />
        <button
          tabIndex="1"
          className="tool-button"
          onClick={e => {
            setRects([]);
            setLines([]);
            setEllipses([]);
            setTriangles([]);
            setTexts([]);
            setAnchors([]);
            setFreeLines([]);
            setAnchorsTriangle([]);
          }}
        >
          Удалить все элементы
        </button>

        {mode === null ? null : ( // <div className="text-tooltip">{`Активирован режим редактирования. Клик по фигуре выделяет её для редактирования. Для удаления нажмите Delete(только для Прямоугольника)`}</div>
          <div className="text-tooltip"> {`Активный инструмент: ${mode}`}</div>
        )}
      </div>
      <div
        id="stageWrapper"
        className="stage-wrapper"
        tabIndex="0"
        onKeyDown={e => {
          if (e.keyCode === 46 || e.keyCode === 68) {
            console.log(`Selected line index: ${selectedShape.id}`);
            if (selectedShape.id !== null) {
              switch (selectedShape.type) {
                case "line":
                  const localLine = [...lines];
                  localLine.splice(selectedShape.id, 1);
                  setLines(localLine);
                  selectShape({ id: null, type: null });
                  break;
                case "freeline":
                  const localFreeLines = [...freeLines];
                  localFreeLines.splice(selectedShape.id, 1);
                  setFreeLines(localFreeLines);
                  selectShape({ id: null, type: null });
                  break;
                default:
                  break;
              }
            }
            const stage = stageRef.current.getStage();
            stage.batchDraw();
          } else if (e.keyCode === 27) {
            setLines([...lines, []]);
          }
        }}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onContentMousedown={handleMouseDown}
          onContentMousemove={handleMouseMove}
          onContentMouseup={handleMouseUp}
          onClick={handleOnClick}
          onDblClick={handleDbClick}
          ref={stageRef}
          onMouseDown={checkDeselect}
          draggable={draggable}
          onWheel={handleOnWheel}
        >
          <Layer fill={"#000"}>
            <Image />
            {lines.map((line, i) => (
              <Line
                key={`line${i}`}
                closed={false}
                shapeProps={{ id: i, points: line }}
                draggable={draggable}
                isSelected={
                  selectedShape.id === i && selectedShape.type === "line"
                }
                selectShape={selectShape}
                selectedShape={selectedShape}
                type="line"
                mode={mode}
                onChange={newAttrs => {
                  let targetLineId = newAttrs.id.split("_")[1];
                  let targetId = newAttrs.id.split("_")[2];
                  const localLines = [...lines];
                  localLines[targetLineId][targetId * 2] = newAttrs.x;
                  localLines[targetLineId][targetId * 2 + 1] = newAttrs.y;
                  setLines(localLines);
                }}
                onPosChange={newAttrs => {
                  let targetLineId = newAttrs.id;
                  const localLines = [...lines];
                  console.log("Before");
                  console.log(localLines);
                  console.log(newAttrs);

                  let tempArr = localLines[targetLineId].map((item, i) => {
                    if (i % 2 !== 0) {
                      return item + newAttrs.y;
                    } else {
                      return item + newAttrs.x;
                    }
                  });

                  localLines[targetLineId] = tempArr;
                  console.log("After");

                  console.log(localLines);

                  setLines(localLines);
                }}
              />
            ))}
            {rects.map((rect, i) => (
              <Rect
                key={`rect${i}`}
                shapeProps={rect}
                draggable={draggable}
                onSelect={() => {
                  if (!draggable) return;
                }}
                onChange={newAttrs => {
                  const rectss = rects.slice();
                  rectss[i] = newAttrs;
                  setRects(rectss);
                }}
              />
            ))}
            {ellipses.map((elli, i) => (
              <Ellipse
                key={`elli${i}`}
                shapeProps={elli}
                draggable={draggable}
                //isSelected={elli.id === selectedId}
                onSelect={() => {
                  if (!draggable) return;
                  //selectShape(elli.id);
                }}
                onChange={newAttrs => {
                  const localEllipses = ellipses.slice();
                  localEllipses[i] = newAttrs;
                  setEllipses(localEllipses);
                }}
              />
            ))}
            {triangles.map((triangle, i) => (
              <Triangle
                key={`triangle${i}`}
                shapeProps={{
                  id: triangle.id,
                  points: triangle.points
                }}
                draggable={draggable}
                //isSelected={triangle.id === selectedId}
                onSelect={() => {
                  if (!draggable) return;
                  //selectShape(triangle.id);
                }}
                onChange={newAttrs => {
                  const shapes = triangles.slice();
                  shapes[i] = newAttrs.points;
                  setTriangles(shapes);
                }}
              />
            ))}
            {freeLines.map((line, i) => {
              return (
                <Line
                  key={`freeLine${i}`}
                  shapeProps={{ id: i, points: line }}
                  closed={closed}
                  draggable={draggable}
                  type="freeline"
                  isSelected={
                    selectedShape.id === i && selectedShape.type === "freeline"
                  }
                  selectShape={selectShape}
                  selectedShape={selectedShape}
                  mode={mode}
                  onChange={newAttrs => {
                    let targetLineId = newAttrs.id.split("_")[1];
                    let targetId = newAttrs.id.split("_")[2];
                    const localLines = [...freeLines];
                    localLines[targetLineId][targetId * 2] = newAttrs.x;
                    localLines[targetLineId][targetId * 2 + 1] = newAttrs.y;
                    setFreeLines(localLines);
                  }}
                  onPosChange={newAttrs => {
                    let targetLineId = newAttrs.id;
                    const localLines = [...freeLines];
                    let tempArr = localLines[targetLineId].map((item, i) => {
                      if (i % 2 !== 0) {
                        return item + newAttrs.y;
                      } else {
                        return item + newAttrs.x;
                      }
                    });
                    localLines[targetLineId] = tempArr;
                    setFreeLines(localLines);
                  }}
                />
              );
            })}
            {texts.map(text => (
              <Text x={text.x} y={text.y} text={text.text} />
            ))}
            {anchorsTriangle.map(item => (
              <Circle
                id={item[0]}
                x={item[1]}
                y={item[2]}
                fill="red"
                radius={2.5}
              />
            ))}
          </Layer>
        </Stage>
        {textInputProps.visible ? (
          <textarea
            id="inputText"
            ref={textInputRef}
            style={{
              position: "absolute",
              left: textInputProps.absoluteLeft,
              top: textInputProps.absoluteTop
            }}
            onKeyDown={e => (e.keyCode === 13 ? SaveText(e) : null)}
            onBlur={SaveText}
          />
        ) : null}
      </div>
    </div>
  );
}
