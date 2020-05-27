import React, { useRef, useState } from "react";
import { Line, Circle, Label, Text, Tag } from "react-konva";

export default function CustomLine({
  shapeProps,
  isSelected,
  selectShape,
  selectedShape,
  onChange,
  draggable,
  closed,
  type,
  mode,
  onPosChange,
}) {
  const shapeRef = useRef();
  const [anchorsVisible, setAnchorsVisible] = useState(true);
  return (
    <React.Fragment>
      <Line
        ref={shapeRef}
        fill={"#FF0000"}
        stroke={isSelected ? "#00ffff" : "#f3f613"}
        strokeWidth={2}
        hitStrokeWidth={20}
        lineJoin="round"
        closed={closed ? true : false}
        {...shapeProps}
        draggable={
          selectedShape.id === shapeProps.id && selectedShape.type === type
            ? draggable
            : false
        }
        onDragStart={(e) => {
          console.log("aa");

          setAnchorsVisible(false);
        }}
        onDragEnd={(e) => {
          setAnchorsVisible(true);
          onPosChange({
            id: e.target.attrs.id,
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          });
          shapeRef.current.x(0);
          shapeRef.current.y(0);
        }}
        onMouseDown={(e) => {
          if (mode === null) selectShape({ id: shapeProps.id, type: type });
        }}
      />
      {anchorsVisible ? (
        <Label
          x={shapeProps.points[0] + 5}
          y={shapeProps.points[1] + 5}
          draggable={draggable}
        >
          <Tag
            width={200}
            height={100}
            fill={isSelected ? "#00ffff" : "#f3f613"}
          />
          <Text
            x={0}
            y={0}
            text={`${Math.trunc(
              Math.sqrt(
                Math.pow(shapeRef.current?.width(), 2) +
                  Math.pow(shapeRef.current?.height(), 2)
              )
            )}px`}
            align="center"
            verticalAlign="middle"
          ></Text>
        </Label>
      ) : null}
      {anchorsVisible
        ? shapeProps.points
            .map((item, i, arr) =>
              i % 2 !== 0 ? null : { x: arr[i], y: arr[i + 1] }
            )
            .filter((item) => item !== null)
            .map((item, i) => {
              return (
                <Circle
                  key={`anchor_${i}`}
                  id={`anchor_${shapeProps.id}_${i}`}
                  x={item?.x}
                  y={item?.y}
                  fill={"#ff0000"}
                  radius={3.5}
                  hitStrokeWidth={10}
                  draggable={
                    selectedShape.id === shapeProps.id &&
                    selectedShape.type === type
                      ? draggable
                      : false
                  }
                  onDragMove={(e) => {
                    onChange({
                      id: e.target.attrs.id,
                      x: e.target.attrs.x,
                      y: e.target.attrs.y,
                    });
                  }}
                  onClick={(e) => {
                    if (mode === null)
                      selectShape({ id: shapeProps.id, type: type });
                  }}
                />
              );
            })
        : null}
    </React.Fragment>
  );
}
