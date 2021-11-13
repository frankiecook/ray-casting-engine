"use strict";

function drawRectMain(source, color, vertex1, vertex2) {
  var image = new Image();
  image.src = source;
  image.onload = function() {
    drawRect(image, color, vertex1, vertex2);
  }
}

function drawRect(image, color, vertex1, vertex2) {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  // attribute locations
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  setGeometry(gl, vertex1.x, vertex1.y, vertex2.x - vertex1.x, vertex2.y - vertex1.y);

  // provide texture coordinates for the rectangle
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    0.1, 0.0,
    0.0, 0.1,
    0.0, 0.1,
    0.1, 0.0,
    0.1, 0.1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // create a texture
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the parameters so we can render any size image
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // upload the image into the texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  var translation = [0, 0];
  var angleInRadians = 0;
  var scale = [1, 1];

  drawScene();

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texCoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texCoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Compute the matrices
    var translationMatrix = m3.translation(translation[0], translation[1]);
    var rotationMatrix = m3.rotation(angleInRadians);
    var scaleMatrix = m3.scaling(scale[0], scale[1]);

    // Multiply the matrices.
    var matrix = m3.multiply(scaleMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, translationMatrix);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;  // 6 triangles in the 'F', 3 points per triangle
    gl.drawArrays(primitiveType, offset, count);
  }
}

var m3 = {
  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl, x, y, width, height) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // ceiling
          x, y,
          x + width, y,
          x, y + height,
          x, y + height,
          x + width, y,
          x + width, y + height
      ]),
      gl.STATIC_DRAW);
}

function drawSegmentMain(source, color, brightness, vertices) {
  var image = new Image();
  image.src = source;
  image.onload = function() {
    drawSegment(image, color, brightness, vertices);
  }
}

function drawSegment(colors, brightness, vertices) {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d-rectangle", "fragment-shader-2d-rectangle"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  //var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  var vertex1;
  var vertex2;
  var x;
  var y;
  var width;
  var height;

  var array = new Float32Array(vertices.length * 3 * 2);
  for (var ii = 0; ii < vertices.length / 2; ii++) {

    vertex1 = vertices[ii];
    vertex2 = vertices[ii + vertices.length / 2];

    x = vertex1.x;
    y = vertex1.y;
    width = vertex2.x - vertex1.x;
    height = vertex2.y - vertex1.y;

    array[ii * 12] = x;
    array[ii * 12 + 1] = y;
    array[ii * 12 + 2] = x + width;
    array[ii * 12 + 3] = y;
    array[ii * 12 + 4] = x;
    array[ii * 12 + 5] = y + height;

    array[ii * 12 + 6] = x;
    array[ii * 12 + 7] = y + height;
    array[ii * 12 + 8] = x + width;
    array[ii * 12 + 9] = y;
    array[ii * 12 + 10] = x + width;
    array[ii * 12 + 11] = y + height;
  }

  setSegmentGeometry(gl, array);

  var translation = [0, 0];
  var angleInRadians = 0;
  var scale = [1, 1];

  // provide texture coordinates for the rectangle
  //var texCoordBuffer = gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  //  0.0, 0.0,
  //  1.0, 0.0,
  //  0.0, 1.0,
  //  0.0, 1.0,
  //  1.0, 0.0,
  //  1.0, 1.0]), gl.STATIC_DRAW);
  //gl.enableVertexAttribArray(texCoordLocation);
  //gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // create a texture
  //var texture = gl.createTexture();
  //gl.bindTexture(gl.TEXTURE_2D, texture);

  // set the parameters so we can render any size image
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // upload the image into the texture
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  drawScene();

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    //// set the resolution
    //gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    //// Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    //var size = 2;          // 2 components per iteration
    //var type = gl.FLOAT;   // the data is 32bit floats
    //var normalize = false; // don't normalize the data
    //var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    //var offset = 0;        // start at the beginning of the buffer
    //gl.vertexAttribPointer(
    //    texCoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    gl.uniform4fv(colorLocation, [1, 0, 0, 1]);

    // Compute the matrices
    var translationMatrix = m3.translation(translation[0], translation[1]);
    var rotationMatrix = m3.rotation(angleInRadians);
    var scaleMatrix = m3.scaling(scale[0], scale[1]);

    // Multiply the matrices.
    var matrix = m3.multiply(scaleMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, translationMatrix);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);



    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;  // 6 triangles in the 'F', 3 points per triangle
    for (var c = 0; c < vertices.length / 2; c++) {
      // upload the image into the texture
      //gl.vertexAttribPointer(texCoordLocation, size, type, normalize, stride, offset);
      //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // draw the current segment
      //gl.uniform4f(colorLocation, 1, 0, 0, 1);//colors[c][0], colors[c][1], colors[c][2], colors[c][3]);
      gl.drawArrays(primitiveType, offset, count);

      offset += 6;
    }
  }
}

var m3 = {
  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

// Fill the buffer with the values that define a letter 'F'.
function setSegmentGeometry(gl, array) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      array,
      gl.STATIC_DRAW);
}
