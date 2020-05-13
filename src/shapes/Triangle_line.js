import React, { useEffect, useRef } from "react";
import { Line, Transformer, Circle } from "react-konva";

export default function Triangle({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  draggable
}) {
  const shapeRef = useRef();
  const trRef = useRef();
  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Line
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        fill={"#FF000010"}
        stroke="#000000"
        strokeWidth={0.5}
        closed
        {...shapeProps}
        onDragEnd={e => {
          onChange({
            points: e.target.points
          });
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            points: node.points()
          });
        }}
      />
      <Circle
        x={shapeProps.points?.[shapeProps.points.lenght - 2]}
        y={shapeProps.points?.[shapeProps.points.lenght - 1]}
        radius={10}
        fill="blue"
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
}
