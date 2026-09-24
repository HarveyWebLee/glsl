/**
 * WebGL2 3D 数学与网格工具（第 11–15 课共用）
 * 列主序 mat4、透视/lookAt、法线矩阵、程序化网格
 */
(function (global) {
  'use strict';

  /** @returns {Float32Array} */
  function mat4Identity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * 列主序 mat4 乘法：out = a * b
   * @param {Float32Array} a
   * @param {Float32Array} b
   * @returns {Float32Array}
   */
  function mat4Multiply(a, b) {
    var out = new Float32Array(16);
    for (var col = 0; col < 4; col++) {
      for (var row = 0; row < 4; row++) {
        var sum = 0;
        for (var k = 0; k < 4; k++) {
          sum += a[k * 4 + row] * b[col * 4 + k];
        }
        out[col * 4 + row] = sum;
      }
    }
    return out;
  }

  /**
   * OpenGL/WebGL 透视投影（视场角为 y 方向弧度）
   * @param {number} fovyRad
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  function mat4Perspective(fovyRad, aspect, near, far) {
    var f = 1.0 / Math.tan(fovyRad * 0.5);
    var rangeInv = 1.0 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * rangeInv, -1,
      0, 0, (2 * far * near) * rangeInv, 0
    ]);
  }

  /**
   * 视图矩阵 lookAt（右手系，相机看向 -Z）
   * @param {number[]} eye [x,y,z]
   * @param {number[]} center [x,y,z]
   * @param {number[]} up [x,y,z]
   */
  function mat4LookAt(eye, center, up) {
    var ex = eye[0];
    var ey = eye[1];
    var ez = eye[2];
    var zx = ex - center[0];
    var zy = ey - center[1];
    var zz = ez - center[2];
    var zLen = Math.hypot(zx, zy, zz) || 1;
    zx /= zLen;
    zy /= zLen;
    zz /= zLen;

    var xx = up[1] * zz - up[2] * zy;
    var xy = up[2] * zx - up[0] * zz;
    var xz = up[0] * zy - up[1] * zx;
    var xLen = Math.hypot(xx, xy, xz) || 1;
    xx /= xLen;
    xy /= xLen;
    xz /= xLen;

    var yx = zy * xz - zz * xy;
    var yy = zz * xx - zx * xz;
    var yz = zx * xy - zy * xx;

    return new Float32Array([
      xx, yx, zx, 0,
      xy, yy, zy, 0,
      xz, yz, zz, 0,
      -(xx * ex + xy * ey + xz * ez),
      -(yx * ex + yy * ey + yz * ez),
      -(zx * ex + zy * ey + zz * ez),
      1
    ]);
  }

  /** @returns {Float32Array} */
  function mat4Translate(tx, ty, tz) {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    ]);
  }

  /** @returns {Float32Array} */
  function mat4RotateY(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return new Float32Array([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  /** @returns {Float32Array} */
  function mat4RotateX(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    return new Float32Array([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]);
  }

  /** @returns {Float32Array} */
  function mat4Scale(sx, sy, sz) {
    return new Float32Array([
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * 从 mat4 提取左上 3×3
   * @param {Float32Array} m
   */
  function mat3FromMat4(m) {
    return new Float32Array([
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10]
    ]);
  }

  /**
   * 3×3 矩阵求逆（列主序）
   * @param {Float32Array} a 9 元素
   */
  function mat3Inverse(a) {
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a10 = a[3];
    var a11 = a[4];
    var a12 = a[5];
    var a20 = a[6];
    var a21 = a[7];
    var a22 = a[8];

    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    var det = a00 * b01 + a01 * b11 + a02 * b21;
    if (Math.abs(det) < 1e-8) {
      return mat3FromMat4(mat4Identity());
    }
    var invDet = 1.0 / det;

    return new Float32Array([
      b01 * invDet,
      (-a22 * a01 + a02 * a21) * invDet,
      (a12 * a01 - a02 * a11) * invDet,
      b11 * invDet,
      (a22 * a00 - a02 * a20) * invDet,
      (-a12 * a00 + a02 * a10) * invDet,
      b21 * invDet,
      (-a21 * a00 + a01 * a20) * invDet,
      (a11 * a00 - a01 * a10) * invDet
    ]);
  }

  /** 法线矩阵：模型矩阵左上 3×3 的逆转置 */
  function mat3NormalFromMat4(model) {
    var m = mat3FromMat4(model);
    var inv = mat3Inverse(m);
    return new Float32Array([
      inv[0], inv[3], inv[6],
      inv[1], inv[4], inv[7],
      inv[2], inv[5], inv[8]
    ]);
  }

  /**
   * 轨道相机 eye 位置
   * @param {number} timeSeconds
   * @param {number} radius
   * @param {number} height
   * @param {number[]} target
   */
  function orbitEye(timeSeconds, radius, height, target) {
    var cx = target ? target[0] : 0;
    var cy = target ? target[1] : 0;
    var cz = target ? target[2] : 0;
    return [
      cx + Math.cos(timeSeconds * 0.6) * radius,
      cy + height,
      cz + Math.sin(timeSeconds * 0.6) * radius
    ];
  }

  /**
   * 创建交错顶点 + 索引的 VAO
   * @param {WebGL2RenderingContext} gl
   * @param {Float32Array} interleaved
   * @param {number} strideFloats 每顶点 float 数
   * @param {{location:number, size:number, offsetFloats:number}[]} attribs
   * @param {Uint16Array|Uint32Array} indices
   */
  function createIndexedMesh(gl, interleaved, strideFloats, attribs, indices) {
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);

    var strideBytes = strideFloats * 4;
    for (var i = 0; i < attribs.length; i++) {
      var attr = attribs[i];
      gl.enableVertexAttribArray(attr.location);
      gl.vertexAttribPointer(
        attr.location,
        attr.size,
        gl.FLOAT,
        false,
        strideBytes,
        attr.offsetFloats * 4
      );
    }

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);

    return {
      vao: vao,
      vbo: vbo,
      ibo: ibo,
      indexCount: indices.length,
      indexType: indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT
    };
  }

  /**
   * 单位立方体：每面独立法线与颜色
   * 交错：position(3) + normal(3) + color(3) = 9 floats
   */
  function createCubeMesh(gl) {
    var faces = [
      { n: [0, 1, 0], c: [0.9, 0.25, 0.25], verts: [[-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]] },
      { n: [0, -1, 0], c: [0.25, 0.9, 0.35], verts: [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5]] },
      { n: [1, 0, 0], c: [0.3, 0.45, 0.95], verts: [[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]] },
      { n: [-1, 0, 0], c: [0.95, 0.75, 0.2], verts: [[-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5]] },
      { n: [0, 0, 1], c: [0.85, 0.35, 0.9], verts: [[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5]] },
      { n: [0, 0, -1], c: [0.35, 0.85, 0.95], verts: [[0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5]] }
    ];

    var interleaved = [];
    var indices = [];
    var base = 0;

    for (var f = 0; f < faces.length; f++) {
      var face = faces[f];
      for (var v = 0; v < 4; v++) {
        var p = face.verts[v];
        interleaved.push(p[0], p[1], p[2], face.n[0], face.n[1], face.n[2], face.c[0], face.c[1], face.c[2]);
      }
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
      base += 4;
    }

    return createIndexedMesh(
      gl,
      new Float32Array(interleaved),
      9,
      [
        { location: 0, size: 3, offsetFloats: 0 },
        { location: 1, size: 3, offsetFloats: 3 },
        { location: 2, size: 3, offsetFloats: 6 }
      ],
      new Uint16Array(indices)
    );
  }

  /**
   * UV 球体（经纬线细分）
   * @param {WebGL2RenderingContext} gl
   * @param {number} segments 纬向分段（≥ 8）
   */
  function createSphereMesh(gl, segments) {
    var seg = Math.max(8, segments | 0);
    var rings = seg;
    var slices = seg * 2;
    var interleaved = [];
    var indices = [];

    for (var ring = 0; ring <= rings; ring++) {
      var v = ring / rings;
      var phi = v * Math.PI;
      var y = Math.cos(phi);
      var ringRadius = Math.sin(phi);

      for (var slice = 0; slice <= slices; slice++) {
        var u = slice / slices;
        var theta = u * Math.PI * 2;
        var x = ringRadius * Math.cos(theta);
        var z = ringRadius * Math.sin(theta);
        var nx = x;
        var ny = y;
        var nz = z;
        var len = Math.hypot(nx, ny, nz) || 1;
        interleaved.push(x * 0.5, y * 0.5, z * 0.5, nx / len, ny / len, nz / len);
      }
    }

    var row = slices + 1;
    for (var r = 0; r < rings; r++) {
      for (var s = 0; s < slices; s++) {
        var i0 = r * row + s;
        var i1 = i0 + 1;
        var i2 = i0 + row;
        var i3 = i2 + 1;
        indices.push(i0, i2, i1, i1, i2, i3);
      }
    }

    return createIndexedMesh(
      gl,
      new Float32Array(interleaved),
      6,
      [
        { location: 0, size: 3, offsetFloats: 0 },
        { location: 1, size: 3, offsetFloats: 3 }
      ],
      new Uint16Array(indices)
    );
  }

  /**
   * XZ 平面（法线 +Y）
   * @param {number} widthX
   * @param {number} depthZ
   */
  function createPlaneMesh(gl, widthX, depthZ) {
    var hx = widthX * 0.5;
    var hz = depthZ * 0.5;
    var interleaved = new Float32Array([
      -hx, 0, -hz, 0, 1, 0,
       hx, 0, -hz, 0, 1, 0,
       hx, 0,  hz, 0, 1, 0,
      -hx, 0,  hz, 0, 1, 0
    ]);
    var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    return createIndexedMesh(
      gl,
      interleaved,
      6,
      [
        { location: 0, size: 3, offsetFloats: 0 },
        { location: 1, size: 3, offsetFloats: 3 }
      ],
      indices
    );
  }

  /**
   * 地面网格线（LINE_LIST）
   * @param {number} extent 半边长
   * @param {number} divisions
   */
  function createGridLineMesh(gl, extent, divisions) {
    var verts = [];
    var step = (extent * 2) / divisions;
    for (var i = 0; i <= divisions; i++) {
      var pos = -extent + i * step;
      verts.push(-extent, 0, pos, extent, 0, pos);
      verts.push(pos, 0, -extent, pos, 0, extent);
    }

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    return { vao: vao, vbo: vbo, vertexCount: verts.length / 3, mode: gl.LINES };
  }

  /**
   * 视锥体线框（相机位于原点，看向 -Z）
   * @param {number} fovyRad
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  function createFrustumLineMesh(gl, fovyRad, aspect, near, far) {
    var nh = Math.tan(fovyRad * 0.5) * near;
    var nw = nh * aspect;
    var fh = Math.tan(fovyRad * 0.5) * far;
    var fw = fh * aspect;

    var n0 = [-nw, -nh, -near];
    var n1 = [nw, -nh, -near];
    var n2 = [nw, nh, -near];
    var n3 = [-nw, nh, -near];
    var f0 = [-fw, -fh, -far];
    var f1 = [fw, -fh, -far];
    var f2 = [fw, fh, -far];
    var f3 = [-fw, fh, -far];
    var eye = [0, 0, 0];

    var segments = [
      eye, n0, eye, n1, eye, n2, eye, n3,
      n0, n1, n1, n2, n2, n3, n3, n0,
      f0, f1, f1, f2, f2, f3, f3, f0,
      n0, f0, n1, f1, n2, f2, n3, f3
    ];

    var flat = [];
    for (var i = 0; i < segments.length; i++) {
      flat.push(segments[i][0], segments[i][1], segments[i][2]);
    }

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    return { vao: vao, vbo: vbo, vertexCount: flat.length / 3, mode: gl.LINES };
  }

  /** 更新视锥线框顶点（near/far/fov 变化时） */
  function updateFrustumLineMesh(gl, mesh, fovyRad, aspect, near, far) {
    var nh = Math.tan(fovyRad * 0.5) * near;
    var nw = nh * aspect;
    var fh = Math.tan(fovyRad * 0.5) * far;
    var fw = fh * aspect;

    var n0 = [-nw, -nh, -near];
    var n1 = [nw, -nh, -near];
    var n2 = [nw, nh, -near];
    var n3 = [-nw, nh, -near];
    var f0 = [-fw, -fh, -far];
    var f1 = [fw, -fh, -far];
    var f2 = [fw, fh, -far];
    var f3 = [-fw, fh, -far];
    var eye = [0, 0, 0];

    var segments = [
      eye, n0, eye, n1, eye, n2, eye, n3,
      n0, n1, n1, n2, n2, n3, n3, n0,
      f0, f1, f1, f2, f2, f3, f3, f0,
      n0, f0, n1, f1, n2, f2, n3, f3
    ];

    var flat = [];
    for (var i = 0; i < segments.length; i++) {
      flat.push(segments[i][0], segments[i][1], segments[i][2]);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(flat));
  }

  global.WebGL2Math = {
    mat4Identity: mat4Identity,
    mat4Multiply: mat4Multiply,
    mat4Perspective: mat4Perspective,
    mat4LookAt: mat4LookAt,
    mat4Translate: mat4Translate,
    mat4RotateX: mat4RotateX,
    mat4RotateY: mat4RotateY,
    mat4Scale: mat4Scale,
    mat3FromMat4: mat3FromMat4,
    mat3NormalFromMat4: mat3NormalFromMat4,
    orbitEye: orbitEye,
    createIndexedMesh: createIndexedMesh,
    createCubeMesh: createCubeMesh,
    createSphereMesh: createSphereMesh,
    createPlaneMesh: createPlaneMesh,
    createGridLineMesh: createGridLineMesh,
    createFrustumLineMesh: createFrustumLineMesh,
    updateFrustumLineMesh: updateFrustumLineMesh
  };
})(window);
