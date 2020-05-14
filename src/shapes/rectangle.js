import React, { useState, useEffect, useRef } from "react";
import { Rect, Transformer, Line, Circle } from "react-konva";

export default function Rectangle({
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

  useEffect(() => {
    console.log(shapeProps);
    
  }, [shapeProps]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        stroke="#000000"
        {...shapeProps}
        draggable={draggable}
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          });
        }}
      />
      <Line
        fill={"#FF000010"}
        stroke={"#ff0000"}
        hitStrokeWidth={20}
        x={shapeProps.x}
        y={shapeProps.y}
        points={[-3,3,-3,-3,3,-3]}
        fill="#ff0000"
        
      />
      <Line
        fill={"#FF000010"}
        stroke={"#ff0000"}
        hitStrokeWidth={20}
        x={shapeProps.x + shapeProps.width}
        y={shapeProps.y}
        points={[-3,-3,3,-3,3,3]}
        fill="#ff0000"
        
      />
      
      <Line
        fill={"#FF000010"}
        stroke={"#ff0000"}
        hitStrokeWidth={20}
        x={shapeProps.x}
        y={shapeProps.y + shapeProps.height}
        points={[-3,-3,-3,3,3,3]}
        fill="#ff0000"
        
      />
      <Line
        fill={"#FF000010"}
        stroke={"#ff0000"}
        hitStrokeWidth={20}
        x={shapeProps.x + shapeProps.width}
        y={shapeProps.y + shapeProps.height}
        points={[3,-3,3,3,-3,3]}
        fill="#ff0000"
        
      />
      
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
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
