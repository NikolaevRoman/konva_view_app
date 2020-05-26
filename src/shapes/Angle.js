import React, { useRef, useState, useEffect } from "react";
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
	const [angle, setAngle] = useState();
	useEffect(() => {
		if (shapeProps.points.length !== 6) return;
		let sideA = Math.sqrt(
			Math.pow(shapeProps.points[2] - shapeProps.points[0], 2) +
				Math.pow(shapeProps.points[3] - shapeProps.points[1], 2)
		);
		let sideB = Math.sqrt(
			Math.pow(shapeProps.points[4] - shapeProps.points[2], 2) +
				Math.pow(shapeProps.points[5] - shapeProps.points[3], 2)
		);
		let sideC = Math.sqrt(
			Math.pow(shapeProps.points[0] - shapeProps.points[4], 2) +
				Math.pow(shapeProps.points[1] - shapeProps.points[5], 2)
		);
		let cosC =
			(Math.pow(sideA, 2) + Math.pow(sideB, 2) - Math.pow(sideC, 2)) /
			(2 * sideA * sideB);
		let angle = Math.acos(cosC) * (180 / Math.PI);
		setAngle(Math.trunc(angle));
	});
	return (
		<React.Fragment>
			<Line
				ref={shapeRef}
				fill={"#FF0000"}
				stroke={isSelected ? "#00ffff" : "#f3f613"}
				strokeWidth={0.5}
				hitStrokeWidth={20}
				lineJoin="round"
				strokeWidth={2}
				closed={closed ? true : false}
				{...shapeProps}
				draggable={
					selectedShape.id === shapeProps.id && selectedShape.type === type
						? draggable
						: false
				}
				onDragStart={(e) => {
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
				onClick={(e) => {
					console.log(e.target.width);

					if (mode === null) selectShape({ id: shapeProps.id, type: type });
				}}
			/>
			{anchorsVisible && shapeProps.points.length === 6 ? (
				<Label
					x={shapeProps.points[2] + 5}
					y={shapeProps.points[3] + 5}
					draggable={draggable}
				>
					<Tag
						width={200}
						height={100}
						fill={isSelected ? "#00ffff" : "#f3f613"}
					/>
					<Text
						text={angle ? `${angle}\u00B0` : null}
						width={30}
						height={20}
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
									// fill={isSelected ? "#0000ff30" : "#ff0000"}
									fill={"#ff0000"}
									radius={3.5}
									hitStrokeWidth={10}
									//strokeWidth={1}
									//stroke={isSelected ? "#0000ff" : "#000000"}
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
