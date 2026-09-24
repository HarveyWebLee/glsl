/**
 * 极简 WebGL2 引导工具（各课 demo 共用）
 * 负责：加载 .glsl、编译链接、全屏四边形、画布缩放、错误展示
 */
(function (global) {
  'use strict';

  /** 在页面上显示错误信息 */
  function showError(message) {
    var el = document.getElementById('error');
    if (!el) {
      el = document.createElement('pre');
      el.id = 'error';
      document.body.appendChild(el);
    }
    el.hidden = false;
    el.textContent = message;
  }

  /** fetch 文本文件 */
  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('加载失败: ' + url + ' (HTTP ' + res.status + ')');
      }
      return res.text();
    });
  }

  /** 编译单个着色器 */
  function compileShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(shader) || '未知编译错误';
      gl.deleteShader(shader);
      var kind = type === gl.VERTEX_SHADER ? '顶点' : '片元';
      throw new Error(kind + '着色器编译失败:\n' + log);
    }
    return shader;
  }

  /** 链接着色器程序 */
  function linkProgram(gl, vertShader, fragShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(program) || '未知链接错误';
      gl.deleteProgram(program);
      throw new Error('着色器程序链接失败:\n' + log);
    }
    return program;
  }

  /**
   * 从 URL 加载顶点/片元着色器并创建程序
   * @param {WebGL2RenderingContext} gl
   * @param {string} vertUrl
   * @param {string} fragUrl
   */
  function createProgramFromUrls(gl, vertUrl, fragUrl) {
    return Promise.all([fetchText(vertUrl), fetchText(fragUrl)]).then(function (sources) {
      var vertShader = compileShader(gl, sources[0], gl.VERTEX_SHADER);
      var fragShader = compileShader(gl, sources[1], gl.FRAGMENT_SHADER);
      var program = linkProgram(gl, vertShader, fragShader);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      return program;
    });
  }

  /** 按 CSS 尺寸与 devicePixelRatio 调整画布 */
  function resizeCanvasToDisplaySize(canvas, gl) {
    var dpr = window.devicePixelRatio || 1;
    var width = Math.floor(canvas.clientWidth * dpr);
    var height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  /**
   * 创建覆盖裁剪空间的全屏四边形（两个三角形，6 顶点）
   * aPosition 在 location = 0，vec3，z = 0
   */
  function createFullscreenQuad(gl) {
    var positions = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
      -1,  1, 0,
       1, -1, 0,
       1,  1, 0,
      -1,  1, 0
    ]);

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // layout(location = 0) in vec3 aPosition
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    return { vao: vao, buffer: buffer };
  }

  /**
   * 创建带 UV 属性的全屏四边形（两个三角形，6 顶点）
   * aPosition 在 location = 0（vec3），aUv 在 location = 1（vec2）
   * UV 范围 (0,0)–(1,1)，与 OpenGL 纹理坐标系一致（左下为原点）
   */
  function createFullscreenQuadWithUv(gl) {
    // 交错布局：x, y, z, u, v
    var interleaved = new Float32Array([
      -1, -1, 0, 0, 0,
       1, -1, 0, 1, 0,
      -1,  1, 0, 0, 1,
       1, -1, 0, 1, 0,
       1,  1, 0, 1, 1,
      -1,  1, 0, 0, 1
    ]);

    var stride = 5 * 4; // 5 个 float，每个 4 字节

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);

    // layout(location = 0) in vec3 aPosition
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);

    // layout(location = 1) in vec2 aUv
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 3 * 4);

    gl.bindVertexArray(null);

    return { vao: vao, buffer: buffer };
  }

  /**
   * 创建以原点为中心的单位四边形（边长约 1，范围约 [-0.5, 0.5]）
   * aPosition 在 location = 0（vec3），aUv 在 location = 1（vec2）
   */
  function createUnitQuadWithUv(gl) {
    var interleaved = new Float32Array([
      -0.5, -0.5, 0, 0, 0,
       0.5, -0.5, 0, 1, 0,
      -0.5,  0.5, 0, 0, 1,
       0.5, -0.5, 0, 1, 0,
       0.5,  0.5, 0, 1, 1,
      -0.5,  0.5, 0, 0, 1
    ]);

    var stride = 5 * 4;
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 3 * 4);

    gl.bindVertexArray(null);
    return { vao: vao, buffer: buffer };
  }

  /**
   * 构造 2D 仿射变换 mat3（列主序，供 gl.uniformMatrix3fv 使用）
   * 对应 GLSL：vec3 world = uModel * vec3(aPosition.xy, 1.0);
   * @param {number} tx 平移 x
   * @param {number} ty 平移 y
   * @param {number} rotationRad 旋转角（弧度）
   * @param {number} scaleX 缩放 x
   * @param {number} scaleY 缩放 y
   * @returns {Float32Array}
   */
  function mat3FromTRS(tx, ty, rotationRad, scaleX, scaleY) {
    var c = Math.cos(rotationRad);
    var s = Math.sin(rotationRad);
    return new Float32Array([
      scaleX * c, scaleX * s, 0,
      -scaleY * s, scaleY * c, 0,
      tx, ty, 1
    ]);
  }

  /**
   * 初始化 WebGL2 上下文与基础 GL 状态
   * @param {HTMLCanvasElement} canvas
   */
  function initWebGL2(canvas) {
    var gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('无法创建 WebGL2 上下文。请使用支持 WebGL2 的现代浏览器。');
    }
    gl.clearColor(0.08, 0.08, 0.1, 1.0);
    return gl;
  }

  /**
   * 用 requestAnimationFrame 持续调用 renderFn
   * @param {(timeMs: number) => void} renderFn 参数为 performance.now() 毫秒时间戳
   * @returns {() => void} 调用返回的函数可停止循环
   */
  function startRenderLoop(renderFn) {
    var rafId = 0;

    function frame(timeMs) {
      renderFn(timeMs);
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return function stopRenderLoop() {
      cancelAnimationFrame(rafId);
    };
  }

  global.WebGL2Bootstrap = {
    showError: showError,
    createProgramFromUrls: createProgramFromUrls,
    resizeCanvasToDisplaySize: resizeCanvasToDisplaySize,
    createFullscreenQuad: createFullscreenQuad,
    createFullscreenQuadWithUv: createFullscreenQuadWithUv,
    createUnitQuadWithUv: createUnitQuadWithUv,
    mat3FromTRS: mat3FromTRS,
    initWebGL2: initWebGL2,
    startRenderLoop: startRenderLoop
  };
})(window);
