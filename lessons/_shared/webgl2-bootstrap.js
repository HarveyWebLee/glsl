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

  global.WebGL2Bootstrap = {
    showError: showError,
    createProgramFromUrls: createProgramFromUrls,
    resizeCanvasToDisplaySize: resizeCanvasToDisplaySize,
    createFullscreenQuad: createFullscreenQuad,
    initWebGL2: initWebGL2
  };
})(window);
