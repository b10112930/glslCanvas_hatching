// Author @patriciogv - 2015
// Title: Interactive Ikeda Test patterns

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex1;

float random(in float x) {
    return fract(sin(x) * 1e4);
}

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float randomSerie(float x, float freq, float t) {
    return step(.1, random(floor(x * freq) - floor(t)));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    vec3 color = vec3(0.0, 0.0, 0.0);

    float cols = 5.;
    float freq = random(floor(u_time)) + abs(atan(u_time) * 0.1);
    float t = 60. + u_time * (0.344 - freq) * 10.;

    if (fract(st.y * cols * 0.5) < 0.5) {
        t *= -1.0;
    }

    freq += random(floor(st.y));

    float offset = 0.025;

    // 使用滑鼠位置來改變紋理的位置
    float mouseOffset = u_mouse.x / u_resolution.x;

    // 在每个通道中使用 random 函数生成随机颜色
    vec3 modifiedColor = vec3(randomSerie(st.x + mouseOffset, freq * 200., t + offset),
                              randomSerie(st.x + mouseOffset, freq * 100., t),
                              randomSerie(st.x + mouseOffset, freq * 100., t - offset));

    // 合併紋理與原本的效果
    color = mix(color, modifiedColor, 0.5);

    // 使用 u_tex0 的颜色和计算得到的颜色进行混合
    gl_FragColor = vec4(mix(texture2D(u_tex1, st).rgb, color, 0.6), 1.0);
}