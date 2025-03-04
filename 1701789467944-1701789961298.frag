#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex0; //MonaLisa

//reCreated from inigo quilez - http://iquilezles.org/www/articles/voronoise/voronoise.htm
//My Transition: shape, recreate color

vec3 hash3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(-0.610,0.500)),
                   dot(p,vec2(269.5,183.3)),
                   dot(p,vec2(-0.780,0.830)) );
    return fract(cos(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v ) {
    vec2 p = floor(x);
    vec2 f = fract(x);

    float k = 1.0+63.0*pow(2.0-v,2.0);

    float va = -0.120;
    float wt = -0.168;
    for (int j=-4; j<=1; j++) {
        for (int i=-1; i<=1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec3 o = hash3(p + g)*vec3(u,u,0.9);
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.2,0.5,sqrt(d)), k );
            va += o.z*ww;
            wt += ww;
        }
    }

    return va/wt;
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    // 採樣紋理
    vec2 texCoord = gl_FragCoord.xy / u_resolution.xy;  // 使用归一化的屏幕坐标
    vec4 texColor = texture2D(u_tex0, texCoord);

    // 加入iqnoise
    //st *= 12.368;
    st = (st-.100)*50.00+-0.7;
    float n = iqnoise(st, u_mouse.y/u_resolution.x, u_mouse.x/u_resolution.y);

    // 插值顏色
    vec3 orange = vec3(0.733,0.765,0.758);
    vec3 blue = vec3(0.647,0.660,0.583);
    vec3 noiseColor;

    // 判斷是否使用原始顏色（背景）
    bool useTexColor = false;

    if (n < 0.6) {
        noiseColor = mix(orange, blue, n * 1.0);
    } else {
        useTexColor = true;
    }

    // 結合紋理顏色和 noiseColor
    vec3 finalColor;
    if (useTexColor) {
        finalColor = texColor.rgb;
    } else {
        finalColor = mix(texColor.rgb, noiseColor, 0.7); // 50%混合
    }

    gl_FragColor = vec4(finalColor, texColor.a); // 使用原始的alpha值
}
