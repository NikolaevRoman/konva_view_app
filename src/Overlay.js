import React, { useState, useRef, useEffect } from "react";
import { Layer, Text, Circle, Ellipse, Rect as Rectangle } from "react-konva";
import Line from "./shapes/Curve";
import Rect from "./shapes/Rectangle";
import "./styles.css";
//import Ellipse from "./shapes/Ellipse";
import Triangle from "./shapes/Triangle_line";
import Segment from "./shapes/Segment";
import { getRelativePointerPosition } from "./Methods/Paint";

export default function Overlay({
  stageRef,
  draggable,
  setDraggable,
  mode,
  setMode,
}) {
  const [lines, setLines] = useState([]);
  const [rects, setRects] = useState([]);
  const [ellipses, setEllipses] = useState([]);
  const [triangles, setTriangles] = useState([]);
  const [freeLines, setFreeLines] = useState([]);
  const [anchorsTriangle, setAnchorsTriangle] = useState([]);
  const [texts, setTexts] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const textInputRef = useRef(null);
  const [selectedShape, selectShape] = useState({ id: null, type: null });
  const [closed, setClosed] = useState(false);
  const [segment, setSegment] = useState([]);
  const [textInputProps, setTextInputProps] = useState({
    visible: false,
    top: 0,
    left: 0,
  });

  const handleMouseDown = () => {
    if (draggable) return;
    if (mode === "line") return;
    setDrawing(true);
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);
    switch (mode) {
      case "rect":
        setRects([...rects, [point.x, point.y]]);
        break;
      case "ellipse":
        setEllipses([
          ...ellipses,
          {
            id: `elli${ellipses[ellipses.length - 1]?.id || 0}`,
            x: point.x,
            y: point.y,
          },
        ]);
        break;
      case "freeLine":
        setFreeLines([...freeLines, [point.x, point.y]]);
        break;
      case "segment":
        if (segment[segment.length - 1]?.length === 4) {
          setSegment([...segment, []]);
        } else {
          setSegment([...segment, [point.x, point.y]]);
        }
        break;
      default:
        break;
    }
  };

  const handleMouseMove = () => {
    if (draggable) return;
    if (!drawing) return;
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);
    if (mode === "rect") {
      let lastRect = rects[rects.length - 1];
      lastRect[2] = point.x;
      lastRect[3] = point.y;
      let tempArr = [...rects];
      tempArr[tempArr.length - 1] = lastRect;
      setRects(tempArr.concat());
    } else if (mode === "ellipse") {
      let lastEllipse = ellipses[ellipses.length - 1];
      lastEllipse.width = Math.abs((point.x - lastEllipse.x) * 2);
      lastEllipse.height = Math.abs((point.y - lastEllipse.y) * 2);
      let tempArr = [...ellipses];
      tempArr.splice(tempArr.length - 1, 1, lastEllipse);
      setEllipses(tempArr);
    } else if (mode === "freeLine") {
      let lastLine = freeLines[freeLines.length - 1];
      lastLine = lastLine.concat([point.x, point.y]);
      let tempArr = [...freeLines];
      tempArr.splice(tempArr.length - 1, 1, lastLine);
      setFreeLines(tempArr.concat());
    } else if (mode === "segment") {
      let lastSegment = segment[segment.length - 1];
      lastSegment[2] = point.x;
      lastSegment[3] = point.y;
      let tempArr = [...segment];
      tempArr[tempArr.length - 1] = lastSegment;
      setSegment(tempArr.concat());
    }
  };

  const handleMouseUp = () => {
    if (mode === "segment") return;
    setDrawing(false);
    setMode(null);
    setDraggable(true);
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty =
      e.target.constructor.name === "Image" ||
      e.target.constructor.name === "Stage";
    if (clickedOnEmpty) {
      selectShape({ id: null, type: null });
    }
  };

  const handleOnClick = (e) => {
    if (
      mode !== "line" &&
      mode !== "text" &&
      mode !== "triangle" &&
      mode !== "segment"
    )
      return;
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);
    if (mode === "line") {
      if (
        lines[lines.length - 1]?.length === 0 ||
        lines[lines.length - 1]?.length === undefined
      ) {
        setLines([...lines, [point.x, point.y]]);
        return;
      }

      let lastLine = lines[lines.length - 1];
      lastLine = lastLine.concat([point.x, point.y]);
      let localLines = [...lines];
      localLines.splice(localLines.length - 1, 1, lastLine);
      setLines(localLines);
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
        left: point.x,
      });
    } else if (mode === "triangle") {
      if (
        triangles[triangles.length - 1]?.points?.length === 0 ||
        triangles[triangles.length - 1]?.points?.length === undefined
      ) {
        console.log(triangles);

        setTriangles([
          ...triangles,
          { id: `triangles${0}`, points: [point.x, point.y] },
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
        [anchorsTriangle.length - 1, point.x, point.y],
      ]);
      stage.batchDraw();
    } else if (mode === "segment") {
      setDrawing(false);
    }
  };

  const handleDbClick = (e) => {
    if (mode === "line") {
    }
  };

  useEffect(() => {
    selectShape({ id: null, type: null });
    setTextInputProps({ visible: false });
    (() => {
      if (lines.length > 1) setLines([...lines, []]);
    })();
  }, [mode]);

  useEffect(() => {
    return textInputRef.current?.focus();
  }, [textInputProps.visible]);

  useEffect(() => {
    const stage = stageRef.current.getStage();
    stage.batchDraw();
  }, [freeLines]);

  const SaveText = (e) => {
    setTextInputProps({ ...textInputProps, visible: false });
    setTexts([
      ...texts,
      {
        x: textInputProps.left,
        y: textInputProps.top,
        text: textInputRef.current?.value,
      },
    ]);
  };

  return (
    <Layer
      onMousedown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onClick={handleOnClick}
      onDblClick={handleDbClick}
    >
      <Rectangle
        width={stageRef.current.width()}
        height={stageRef.current.height()}
      />
      {lines.map((line, i) => (
        <Line
          key={`line${i}`}
          closed={false}
          shapeProps={{ id: i, points: line }}
          draggable={draggable}
          isSelected={selectedShape.id === i && selectedShape.type === "line"}
          selectShape={selectShape}
          selectedShape={selectedShape}
          type="line"
          mode={mode}
          onChange={(newAttrs) => {
            let targetLineId = newAttrs.id.split("_")[1];
            let targetId = newAttrs.id.split("_")[2];
            const localLines = [...lines];
            localLines[targetLineId][targetId * 2] = newAttrs.x;
            localLines[targetLineId][targetId * 2 + 1] = newAttrs.y;
            setLines(localLines);
          }}
          onPosChange={(newAttrs) => {
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
      {rects.map((rect, i) => {
        return (
          <Rect
            key={`rect${i}`}
            shapeProps={rect}
            draggable={draggable}
            onSelect={() => {
              if (!draggable) return;
            }}
            onChange={(newAttrs) => {
              const rectss = rects.slice();
              rectss[i] = newAttrs;
              setRects(rectss);
            }}
          />
        );
      })}
      {ellipses.map((elli, i) => {
        console.log(elli);
        return (
          <Ellipse
            key={i}
            //shapeProps={elli}
            x={elli.x}
            y={elli.y}
            width={elli.width}
            height={elli.height}
            stroke={"#000"}
            //draggable={draggable}
            // onSelect={() => {
            //   if (!draggable) return;
            // }}
            // onChange={(newAttrs) => {
            //   const localEllipses = ellipses.slice();
            //   localEllipses[i] = newAttrs;
            //   setEllipses(localEllipses);
            // }}
          />
        );
      })}
      {triangles.map((triangle, i) => (
        <Triangle
          key={`triangle${i}`}
          shapeProps={{
            id: triangle.id,
            points: triangle.points,
          }}
          draggable={draggable}
          //isSelected={triangle.id === selectedId}
          onSelect={() => {
            if (!draggable) return;
            //selectShape(triangle.id);
          }}
          onChange={(newAttrs) => {
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
            onChange={(newAttrs) => {
              let targetLineId = newAttrs.id.split("_")[1];
              let targetId = newAttrs.id.split("_")[2];
              const localLines = [...freeLines];
              localLines[targetLineId][targetId * 2] = newAttrs.x;
              localLines[targetLineId][targetId * 2 + 1] = newAttrs.y;
              setFreeLines(localLines);
            }}
            onPosChange={(newAttrs) => {
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
      {segment.map((line, i) => {
        return (
          <Segment
            key={`segment${i}`}
            shapeProps={{ id: i, points: line }}
            closed={closed}
            draggable={draggable}
            type="segment"
            isSelected={
              selectedShape.id === i && selectedShape.type === "segment"
            }
            selectShape={selectShape}
            selectedShape={selectedShape}
            mode={mode}
            onChange={(newAttrs) => {
              let targetLineId = newAttrs.id.split("_")[1];
              let targetId = newAttrs.id.split("_")[2];
              const localLines = [...freeLines];
              localLines[targetLineId][targetId * 2] = newAttrs.x;
              localLines[targetLineId][targetId * 2 + 1] = newAttrs.y;
              setFreeLines(localLines);
            }}
            onPosChange={(newAttrs) => {
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
      {texts.map((text) => (
        <Text x={text.x} y={text.y} text={text.text} />
      ))}
      {anchorsTriangle.map((item) => (
        <Circle id={item[0]} x={item[1]} y={item[2]} fill="red" radius={2.5} />
      ))}
    </Layer>
  );
}
