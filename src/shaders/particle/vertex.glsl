uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uPoints;


void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.);  

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  gl_PointSize = 2.;
}