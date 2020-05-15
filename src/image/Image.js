import React, { useEffect, useRef } from "react";
import useImage from "use-image";
import Konva from "konva";
import { Image } from "react-konva";

export default function DicomImage() {
  const [image] = useImage("https://i.imgur.com/Bis4KmM.png", "Anonymous");
  const imageRef = useRef();
  useEffect(() => {
    if (image) {
      imageRef.current.cache();
      imageRef.current.getLayer().batchDraw();
    }
  }, [image]);
  return (
    <Image
      image={image}
      ref={imageRef}
      x={100}
      y={100}
      filters={[Konva.Filters.Brighten]}
      brightness={0.2}
    />
  );
}
