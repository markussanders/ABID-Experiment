#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D d_map;
uniform sampler2D img;

uniform float u_bass;
uniform float u_lowmid;
uniform float u_mid;
uniform float u_time;

uniform vec2 u_resolution;
uniform vec2 texRes;

varying vec2 vTexCoord;

mat2 scale(vec2 _scale){
    return mat2(_scale.x, 0.0, 0.0, _scale.y);
}

void main() {

  vec2 ratio = vec2(
    min((u_resolution.x / u_resolution.y) / (texRes.x / texRes.y), 1.0),
    min((u_resolution.y / u_resolution.x) / (texRes.y / texRes.x), 1.0)
  );

  vec2 uv = vec2(
    vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.7,
    vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.7
  );

  uv.y = 1.0 - uv.y;

  vec2 uvt = uv;

  vec2 translate = vec2(cos(u_mid),sin(u_mid));
  uvt += translate * .05;

  vec4 t = texture2D(d_map, uvt);

  float _disp = dot(t.rgb, vec3(u_time)) * u_bass;

  uv -= vec2(0.5);
  uv = scale(2.0 + vec2(sin(_disp)-1.0)) * uv;
  uv += vec2(0.5);

  vec2 mir = uv;

  vec4 _image = texture2D(img, mir);
  gl_FragColor = _image;
}