export function getRelativePointerPosition(node) {
  var transform = node.getAbsoluteTransform().copy();
  transform.invert();
  var pos = node.getStage().getPointerPosition();
  return transform.point(pos);
}
