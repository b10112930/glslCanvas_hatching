// Author: @patriciogv - 2015
// Title: Metaballs

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0; //picture

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.048,0.464,0.795);

    // Scale
    st *= 30.;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 1.0;  // minimum distance
    for (int j= -1; j <= 1; j++ ) {
        for (int i= -1; i <= 1; i++ ) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(i),float(j));

            // Random position from current + neighbor place in the grid
            vec2 offset = random2(i_st + neighbor);

            // Animate the offset
            offset = 0.5 + 0.5*cos(u_time + 6.*offset);

            // Position of the cell
            vec2 pos = neighbor + offset - f_st;

            // Cell distance
            float dist = length(pos);

            // Metaball it!
            m_dist = min(m_dist, m_dist*dist);
        }
    }

    // Draw cells
    color += step(0.060, m_dist);

    // Sample the texture
    vec4 texColor = texture2D(u_tex0, st);

    // Blend Metaballs color with texture color
    // You can adjust the blending factor as needed
    color = mix(color, texColor.rgb, 0.5);

    gl_FragColor = vec4(color, 1.0);
}
