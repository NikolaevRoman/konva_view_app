import React, { useRef, useState } from "react";
import { Line, Circle } from "react-konva";

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
  onPosChange
}) {
  const shapeRef = useRef();
const [anchorsVisible, setAnchorsVisible] = useState(true);
  return (
    <React.Fragment>
      <Line
        ref={shapeRef}
        fill={"#FF000010"}
        stroke={isSelected ? "#0000ff" : "#000000"}
        strokeWidth={0.5}
        hitStrokeWidth={20}
        lineJoin="round"
        closed={closed ? true : false}
        {...shapeProps}
        draggable={selectedShape.id === shapeProps.id && selectedShape.type === type ? draggable : false}
        onDragStart ={e => {
          setAnchorsVisible(false);
        }}
        onDragEnd={e => {
          setAnchorsVisible(true);
          onPosChange({id: e.target.attrs.id, x: e.target.attrs.x, y: e.target.attrs.y});
          shapeRef.current.x(0);
          shapeRef.current.y(0);
            
      }}
        onClick={e=>{
          if(mode === null)
          selectShape({id: shapeProps.id, type: type});
        }}
      />
      {anchorsVisible ? shapeProps.points
        .map((item, i, arr) =>
          i % 2 !== 0 ? null : { x: arr[i], y: arr[i + 1] }
        )
        .filter(item => item !== null)
        .map((item, i) => {
          return (
            <Circle
              key={`anchor_${i}`}
              id={`anchor_${shapeProps.id}_${i}`}
              x={item?.x}
              y={item?.y}
              fill={isSelected ? "#0000ff30" : "#ff0000"}
              radius={2.5}
              hitStrokeWidth={10}
              strokeWidth={1}
              stroke={isSelected ? "#0000ff" : "#000000"}
              draggable={selectedShape.id === shapeProps.id && selectedShape.type === type ? draggable : false}

              onDragMove={e => {
                  onChange({id: e.target.attrs.id, x: e.target.attrs.x, y: e.target.attrs.y});
              }}
              onClick={e=>{
                if(mode === null)
                selectShape({id: shapeProps.id, type: type});
              }}
            />
          );
        }): null}
    </React.Fragment>
  );
}
