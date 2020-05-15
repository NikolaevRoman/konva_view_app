import React, { useEffect, useRef } from "react";
import { Ellipse, Transformer } from "react-konva";

export default function Elli({ shapeProps, isSelected, onSelect, draggable }) {
  const shapeRef = useRef();
  const trRef = useRef();

  return (
    <React.Fragment>
      <Ellipse
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        stroke="#000000"
        {...shapeProps}
        draggable={draggable}
        // onDragEnd={(e) => {
        //   // onChange({
        //   //   ...shapeProps,
        //   //   x: e.target.x(),
        //   //   y: e.target.y(),
        //   // });
        // }}
      />
    </React.Fragment>
  );
}
