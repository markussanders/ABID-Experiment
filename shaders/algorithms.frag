#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D u_texture;
uniform sampler2D d_map;
uniform sampler2D img;

uniform float u_bass;
uniform float u_time;
uniform float u_mid;
uniform float u_lowmid;

uniform vec2 u_resolution;
uniform vec2 texRes;

varying vec2 vTexCoord;

mat2 scale(vec2 _scale){
  return mat2(_scale.x, 0.0, 0.0,_scale.y);
  // return mat2(0.0, _scale.x, 0.0,_scale.y); // moving diagonal stripes
}

void main() {

  vec2 ratio = vec2(
    min((u_resolution.x / u_resolution.y) / (texRes.x / texRes.y), 1.0),
    min((u_resolution.y / u_resolution.x) / (texRes.y / texRes.x), 1.0)
  );

  vec2 uv = vec2(
    vTexCoord.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vTexCoord.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  //     vTexCoord.x * (1.0 - ratio.x) * 0.5, // colorful horizontal morph

  uv = 1.0 - uv;

  vec2 uvt = uv; 

  vec2 translate = vec2(cos(u_mid),sin(u_bass));
  uvt += translate * 0.5;

  vec4 t = texture2D(d_map, uvt);

  float d = dot(t.rgb, vec3(u_time));
  float disp = d * u_mid;
  float disp_2 = d * (u_time / u_bass);

  uv -= vec2(0.5);
  uv = scale(2.0 - vec2(sin(disp) +1.0)) * uv;
  uv += vec2(0.5);

  float wave = sin(((uv.x * 2.0) - 1.0) * u_bass) * u_mid;
  vec2 _d = vec2(wave, 0.001);


  vec4 red = texture2D(u_texture, uv + _d);
  vec4 green = texture2D(u_texture, uv - _d);
  vec4 blue = texture2D(u_texture, uv - _d);

  vec4 color = vec4(red.r, green.g, blue.b, 0.5);

  gl_FragColor = color;
}