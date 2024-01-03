// Author @patriciogv - 2015
// Title: Interactive Ikeda Test patterns

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float randomSerie(float x, float freq, float t) {
    return step(.1,random( floor(x*freq)-floor(t) ));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec3 color = vec3(0.146,0.510,0.233);

    float cols = 500.;
    float freq = random(floor(u_time))+abs(atan(u_time)*0.1);
    float t = 90.+u_time*(0.344-freq)*10.;

    if (fract(st.y*cols* 0.5) < 0.5){
        t *= -1.0;
    }

    freq += random(floor(st.y));

    float offset = 0.525;

    // 使用滑鼠位置來改變紋理的位置
    float mouseOffset = u_mouse.x / u_resolution.x;
    color = vec3(randomSerie(st.x + mouseOffset, freq*100., t+offset),
                 randomSerie(st.x + mouseOffset, freq*100., t),
                 randomSerie(st.x + mouseOffset, freq*100., t-offset));

    vec3 texColor = texture2D(u_tex0, st).rgb;
    
    // 合併紋理與原本的效果
    color = mix(color, texColor, 0.5);

    gl_FragColor = vec4(1.0-color, 1.0);
}
