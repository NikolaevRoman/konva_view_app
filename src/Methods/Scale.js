
const scaleBy = 1.3;
export const handleOnWheel = e => {
    e.evt.preventDefault();
    var oldScale = e.currentTarget.scaleX();
    var mousePointTo = {
      x:
        e.currentTarget.getPointerPosition().x / oldScale -
        e.currentTarget.x() / oldScale,
      y:
        e.currentTarget.getPointerPosition().y / oldScale -
        e.currentTarget.y() / oldScale
    };
    var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    e.currentTarget.scale({ x: newScale, y: newScale });
    var newPos = {
      x:
        -(mousePointTo.x - e.currentTarget.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - e.currentTarget.getPointerPosition().y / newScale) *
        newScale
    };
    e.currentTarget.position(newPos);
    e.currentTarget.batchDraw();
  };