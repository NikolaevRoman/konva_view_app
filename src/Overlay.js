import React, { useState, useRef, useEffect } from "react";
import { Layer, Text, Circle, Ellipse, Rect as Rectangle } from "react-konva";
import Line from "./shapes/Curve";
import Rect from "./shapes/Rectangle";
//import Ellipse from "./shapes/Ellipse";
import Angle from "./shapes/Angle";
import Triangle from "./shapes/Triangle_line";
import Segment from "./shapes/Segment";
import { getRelativePointerPosition } from "./Methods/Paint";

export default function Overlay({
  stageRef,
  draggable,
  setDraggable,
  mode,
  setMode,
  labels,
  ...props
}) {
  const [lines, setLines] = useState([]);
  const [newLineFlag, setNewLineFlag] = useState(true);
  const [rects, setRects] = useState([]);
  const [ellipses, setEllipses] = useState([]);
  const [triangles, setTriangles] = useState([]);
  const [freeLines, setFreeLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [drawingSegment, setDrawingSegment] = useState(false);
  const textInputRef = useRef(null);
  const [selectedShape, selectShape] = useState({ id: null, type: null });
  const [closed, setClosed] = useState(false);
  const [segment, setSegment] = useState([]);
  const [angles, setAngles] = useState([]);
  const [angleStep, setAngleStep] = useState(0);
  const [textInputProps, setTextInputProps] = useState({
    visible: false,
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setLines([]);
    setRects([]);
    setEllipses([]);
    setTriangles([]);
    setTexts([]);
    setFreeLines([]);
    setSegment([]);
    setAngles([]);
    setAngleStep(0);
    // props.setLabels((prev) => {
    //   let res = { ...prev };
    //   res.L.visible = false;
    //   res.R.visible = false;
    //   return res;
    // });
    setMode(null);
  }, [props.deleteAllShapesFlag]);

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
        {
          console.log("segment start");
          if (drawingSegment) {
            setDrawingSegment(false);
            setMode(null);
            return;
          }
          setSegment([...segment, [point.x, point.y]]);
          setDrawingSegment(true);
        }
        break;
      case "angle":
        if (angleStep === 0) {
          setAngles([...angles, [point.x, point.y]]);
          setAngleStep(1);
        } else if (angleStep === 1) {
          setAngleStep(3);
        } else if (angleStep === 3) {
          setAngleStep(0);
        }
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
      setRects(tempArr);
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
      setFreeLines(tempArr);
    } else if (mode === "segment" && drawingSegment) {
      let lastSegment = segment[segment.length - 1];
      lastSegment[2] = point.x;
      lastSegment[3] = point.y;
      let tempArr = [...segment];
      tempArr[tempArr.length - 1] = lastSegment;
      setSegment(tempArr);
    } else if (mode === "angle" && angleStep !== 0) {
      let lastAngle = angles[angles.length - 1];
      lastAngle[angleStep + 1] = point.x;
      lastAngle[angleStep + 2] = point.y;
      let tempArr = [...angles];
      tempArr[tempArr.length - 1] = lastAngle;
      setAngles(tempArr);
    }
  };

  const handleMouseUp = () => {
    if (
      mode === "segment" ||
      mode === "angle" ||
      mode === "line" ||
      mode === "triangle" ||
      mode === "text"
    )
      return;
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
    if (mode == null) {
      const clickedOnEmpty = e.target.attrs.id === "baseRect";

      if (clickedOnEmpty) {
        selectShape({ id: null, type: null });
      }
    }
    if (
      mode !== "line" &&
      mode !== "text" &&
      mode !== "triangle" &&
      mode !== "segment"
    )
      return;
    const stage = stageRef.current.getStage();
    const point = getRelativePointerPosition(stage);
    console.log(`Mode = ${mode}`);

    if (mode === "line") {
      if (newLineFlag) {
        setLines([...lines, [point.x, point.y]]);
        setNewLineFlag(false);
        return;
      }

      let lastLine = lines[lines.length - 1];
      lastLine = lastLine.concat([point.x, point.y]);
      let localLines = [...lines];
      localLines.splice(localLines.length - 1, 1, lastLine);
      setLines(localLines);
      stage.batchDraw();
    } else if (mode === "text") {
      var textPosition = stage.getPointerPosition();
      var stageBox = stage.container().getBoundingClientRect();
      var areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
      };

      var textarea = document.createElement("input");
      document.body.appendChild(textarea);

      textarea.value = "";
      textarea.style.position = "absolute";
      textarea.style.top = areaPosition.y + "px";
      textarea.style.left = areaPosition.x + "px";
      textarea.style.width = 100;

      textarea.focus();

      textarea.addEventListener("keydown", function (e) {
        // hide on enter
        if (e.keyCode !== 13) return;
        SaveText(textarea.value, point.x, point.y);
        try {
          textarea.blur();
        } catch {
          console.log("error then try to blur()");
        }
      });
      textarea.addEventListener("blur", function (e) {
        document.body.removeChild(textarea);
      });
    } else if (mode === "triangle") {
      if (
        triangles[triangles.length - 1]?.length === 6 ||
        triangles[triangles.length - 1]?.length === undefined
      ) {
        setTriangles([...triangles, [point.x, point.y]]);

        return;
      }
      let lastTriangle = triangles[triangles.length - 1];
      lastTriangle = lastTriangle.concat([point.x, point.y]);
      let localTriangles = [...triangles];
      localTriangles.splice(localTriangles.length - 1, 1, lastTriangle);
      setTriangles(localTriangles);
      stage.batchDraw();
      if (lastTriangle.length === 6) setMode(null);
    } else if (mode === "segment") {
      setDrawing(false);
    }
    setDrawing(false);
  };

  const handleDbClick = (e) => {
    console.log("dbClick");

    if (mode === "line") {
      setMode(null);
      setDraggable(true);
    }
  };

  useEffect(() => {
    selectShape({ id: null, type: null });
    setTextInputProps({ visible: false });
    setNewLineFlag(true);
    if (mode === "magnifier") {
      let stage = stageRef.current.getStage();
      let clip = stage.clip({ x: 20, y: 20, width: 100, height: 100 });
      console.log("clip");
      console.log(clip);
    }
  }, [mode]);

  useEffect(() => {
    return textInputRef.current?.focus();
  }, [textInputProps.visible]);

  useEffect(() => {
    const stage = stageRef.current.getStage();
    stage.batchDraw();
  }, [freeLines]);

  useEffect(() => {
    console.log(texts);
  }, [texts]);

  const SaveText = (text, x, y) => {
    //setTextInputProps({ ...textInputProps, visible: false });
    setTexts([
      ...texts,
      {
        x: x,
        y: y,
        text: text,
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
      onD
    >
      <Rectangle
        id={"baseRect"}
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
            let tempArr = localLines[targetLineId].map((item, i) => {
              if (i % 2 !== 0) {
                return item + newAttrs.y;
              } else {
                return item + newAttrs.x;
              }
            });
            localLines[targetLineId] = tempArr;
            setLines(localLines);
          }}
        />
      ))}
      {rects.map((rect, i) => {
        return (
          <Rect
            key={`rect${i}`}
            shapeProps={rect}
            selectedShape={selectedShape}
            type={"rect"}
            id={i}
            isSelected={
              i === selectedShape.id && selectedShape.type === "rect"
                ? true
                : false
            }
            draggable={draggable}
            onSelect={() => {
              if (!draggable) return;
              selectShape({ id: i, type: "rect" });
            }}
            onChange={(newAttrs) => {
              const localRects = rects.slice();
              localRects[i] = newAttrs;
              setRects(localRects);
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
            draggable={draggable}
            onSelect={() => {
              if (!draggable) return;
            }}
            onChange={(newAttrs) => {
              const localEllipses = ellipses.slice();
              localEllipses[i] = newAttrs;
              setEllipses(localEllipses);
            }}
          />
        );
      })}
      {triangles.map((triangle, i) => (
        <Triangle
          key={`triangle${i}`}
          shapeProps={{ id: i, points: triangle }}
          draggable={draggable}
          type={"triangle"}
          mode={mode}
          selectShape={selectShape}
          selectedShape={selectedShape}
          isSelected={
            selectedShape.id === i && selectedShape.type === "triangle"
          }
          onChange={(newAttrs) => {
            let targetLineId = newAttrs.id.split("_")[1];
            let targetId = newAttrs.id.split("_")[2];
            const localTriangles = [...triangles];
            localTriangles[targetLineId][targetId * 2] = newAttrs.x;
            localTriangles[targetLineId][targetId * 2 + 1] = newAttrs.y;
            setLines(localTriangles);
          }}
          onPosChange={(newAttrs) => {
            let targetLineId = newAttrs.id;
            const localTriangles = [...triangles];

            let tempArr = localTriangles[targetLineId].map((item, i) => {
              if (i % 2 !== 0) {
                return item + newAttrs.y;
              } else {
                return item + newAttrs.x;
              }
            });

            localTriangles[targetLineId] = tempArr;

            setTriangles(localTriangles);
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
              let targetSegmentId = newAttrs.id.split("_")[1];
              let targetId = newAttrs.id.split("_")[2];
              const localSegments = [...segment];
              localSegments[targetSegmentId][targetId * 2] = newAttrs.x;
              localSegments[targetSegmentId][targetId * 2 + 1] = newAttrs.y;
              setSegment(localSegments);
            }}
            onPosChange={(newAttrs) => {
              let targetSegmentId = newAttrs.id;
              const localSegments = [...segment];
              let tempArr = localSegments[targetSegmentId].map((item, i) => {
                if (i % 2 !== 0) {
                  return item + newAttrs.y;
                } else {
                  return item + newAttrs.x;
                }
              });
              localSegments[targetSegmentId] = tempArr;
              setSegment(localSegments);
            }}
          />
        );
      })}
      {angles.map((line, i) => {
        return (
          <Angle
            key={`angle${i}`}
            shapeProps={{ id: i, points: line }}
            closed={closed}
            draggable={draggable}
            type="angle"
            isSelected={
              selectedShape.id === i && selectedShape.type === "angle"
            }
            selectShape={selectShape}
            selectedShape={selectedShape}
            mode={mode}
            onChange={(newAttrs) => {
              let targetLineId = newAttrs.id.split("_")[1];
              let targetId = newAttrs.id.split("_")[2];
              const localAngles = [...angles];
              localAngles[targetLineId][targetId * 2] = newAttrs.x;
              localAngles[targetLineId][targetId * 2 + 1] = newAttrs.y;
              setAngles(localAngles);
            }}
            onPosChange={(newAttrs) => {
              let targetAngleId = newAttrs.id;
              const localAngles = [...angles];
              let tempArr = localAngles[targetAngleId].map((item, i) => {
                if (i % 2 !== 0) {
                  return item + newAttrs.y;
                } else {
                  return item + newAttrs.x;
                }
              });
              localAngles[targetAngleId] = tempArr;
              setAngles(localAngles);
            }}
          />
        );
      })}
      {texts.map((text, i) => (
        <Text key={i} x={text.x} y={text.y} text={text.text} />
      ))}
      {/* {anchorsTriangle.map((item) => (
				<Circle id={item[0]} x={item[1]} y={item[2]} fill="red" radius={2.5} />
			))} */}
      {/* {labels.L.visible ? (
        <Text
          x={labels.L.x}
          y={labels.L.y}
          text={"L"}
          draggable={true}
          fontSize={50}
          stroke={"#ffffff"}
        />
      ) : null}
      {labels.R.visible ? (
        <Text
          x={labels.R.x}
          y={labels.R.y}
          text={"R"}
          draggable={true}
          fontSize={50}
          stroke={"#ffffff"}
        />
      ) : null} */}
    </Layer>
  );
}
