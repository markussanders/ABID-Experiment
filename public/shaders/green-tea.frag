#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D u_texture;

uniform float u_bass;
uniform float u_time;
uniform float u_mid;

uniform vec2 u_resolution;
uniform vec2 u_tResolution;

varying vec2 vTexCoord;

mat2 scale(vec2 _scale){
  return mat2(_scale.x, 0.0, 0.0,_scale.y);
  // return mat2(0.0, _scale.x, 0.0,_scale.y); // moving diagonal stripes
}

void main() {

  vec2 ratio = vec2(
    min((u_resolution.x / u_resolution.y) / (u_tResolution.x / u_tResolution.y), 1.0),
    min((u_resolution.y / u_resolution.x) / (u_tResolution.y / u_tResolution.x), 1.0)
  );

  vec2 uv = vec2(
    vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  //     vTexCoord.x * (1.0 - ratio.x) * 0.5, // colorful horizontal morph

  uv = 1.0 - uv;

  uv -= vec2(0.5);
  uv = scale(vec2(0.9)) * uv;
  uv += vec2(0.5);

  float wave = sin(((uv.x * 2.0) - 1.0) * u_bass) * u_mid;
  vec2 _d = vec2(wave, 0.001);


  vec4 red = texture2D(u_texture, uv - _d);
  vec4 green = texture2D(u_texture, uv + _d);
  vec4 blue = texture2D(u_texture, uv - _d);

  vec4 color = vec4(red.r, green.g, blue.b, 0.5);

  gl_FragColor = color;
}