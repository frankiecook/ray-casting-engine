/*

*/

// draw a rectangle
// (x, y) is the top left corner of the rectangle
function rectMain(x, y, width, height, color = [0, 0, 0, 1], positions_colors = null, id = "#canvas") {
  if (positions_colors == null) {
    var positions_colors = new Array(2);
    positions_colors[0] = [x, y, width, height];
    positions_colors[1] = color;
  }

  rectWGL(positions_colors, id);
}

function rectWGL(positions_colors, id = "#canvas") {
  // Get a WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d-rectangle", "fragment-shader-2d-rectangle"]);

  // look up attributes
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // look up uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  drawScene();

  // make a function to re-draw everything
  // draw the scene
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // setup a rectangle
    var array = new Float32Array(positions_colors.length * 6);
    var pos;
    var x;
    var y;
    var width;
    var height;
    for (var i = 0; i < positions_colors.length / 2; i++) {
      pos = i * 2;
      x = positions_colors[pos][0];
      y = positions_colors[pos][1];
      width = positions_colors[pos][2];
      height = positions_colors[pos][3];

      array[i * 12] = x;
      array[i * 12 + 1] = y;
      array[i * 12 + 2] = x + width;
      array[i * 12 + 3] = y;
      array[i * 12 + 4] = x;
      array[i * 12 + 5] = y + height;

      array[i * 12 + 6] = x;
      array[i * 12 + 7] = y + height;
      array[i * 12 + 8] = x + width;
      array[i * 12 + 9] = y;
      array[i * 12 + 10] = x + width;
      array[i * 12 + 11] = y + height;
    }

    setRectangle(gl, array);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // set the resolution of the image
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    var color = [Math.random(), Math.random(), Math.random(), 1];
    gl.uniform4fv(colorLocation, color);

    // finally draw the result to the canvas.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;

    for (var i = 0; i < positions_colors.length / 2; i++) {
      // set the color
      gl.uniform4fv(colorLocation, positions_colors[i * 2 + 1]);
      gl.drawArrays(primitiveType, offset, count);
      offset += 6;
    }
  }

  function setRectangle(gl, array) {
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  }
}




function rectEdgeff(x1, y1, x2, y2, color = "black", id = "canvas") {
  return
  var canvas = document.getElementById(id);
  var canvastx = canvas.getContext("2d");

  canvastx.beginPath();
  canvastx.lineWidth = "1";
  canvastx.strokeStyle = color;
  canvastx.rect(x1, y1, x2, y2);
  canvastx.stroke();
}

// draw a circle
function circleMain(pos_x, pos_y, r, color = [0, 0, 0, 1], positions_colors, id = "canvas") {
  if (positions_colors == null) {
    var positions_colors = new Array(2);
    positions_colors[0] = [pos_x, pos_y, r];
    positions_colors[1] = color;
  }

  circleWGL(positions_colors, id);
}

function circleWGL(positions_colors, id = "#canvas") {
  // Get a WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d-rectangle", "fragment-shader-2d-rectangle"]);

  // look up attributes
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // look up uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  drawScene();

  // make a function to re-draw everything
  // draw the scene
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // setup all circles
    setCircle(gl, positions_colors);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // set the resolution of the image
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    var color = [Math.random(), Math.random(), Math.random(), 1];
    gl.uniform4fv(colorLocation, color);

    // finally draw the result to the canvas.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;

    for (var i = 0; i < positions_colors.length / 2; i++) {
      // set the color
      gl.uniform4fv(colorLocation, positions_colors[i * 2 + 1]);

      for (var i = 0; i < 4; i++) {
        gl.drawArrays(primitiveType, offset, count);
      }
    }
  }

  function setCircle(gl, positions_colors) {
    var array = new Float32Array(positions_colors.length * 6);
    var pos;
    var x;
    var y;
    var r;
    var width;
    var height;
    for (var i = 0; i < positions_colors.length / 2; i++) {
      pos = i * 2;
      r = positions_colors[pos][2];
      width = r / 4;
      height = r * 2;
      x = positions_colors[pos][0] - width / 2;
      y = positions_colors[pos][1] - r;

      array[i * 12] = x;
      array[i * 12 + 1] = y;
      array[i * 12 + 2] = x + width;
      array[i * 12 + 3] = y;
      array[i * 12 + 4] = x;
      array[i * 12 + 5] = y + height;

      array[i * 12 + 6] = x;
      array[i * 12 + 7] = y + height;
      array[i * 12 + 8] = x + width;
      array[i * 12 + 9] = y;
      array[i * 12 + 10] = x + width;
      array[i * 12 + 11] = y + height;
    }

    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  }
}

// draw a line
function lineMain(pos_x1, pos_y1, pos_x2, pos_y2, color = null, positions_colors = null, id = "canvas") {
  if (positions_colors == null) {
    var positions_colors = new Array(2);
    positions_colors[0] = [pos_x1, pos_y1, pos_x2, pos_y2];
    positions_colors[1] = color;
  }

  lineWGL(positions_colors, id);
}

function lineWGL(positions_colors, id) {
  // Get a WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d-rectangle", "fragment-shader-2d-rectangle"]);

  // look up attributes
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // look up uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  drawScene();

  // make a function to re-draw everything
  // draw the scene
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // setup a rectangle
    var array = new Float32Array(positions_colors.length * 2);
    var pos;
    var pos_x1;
    var pos_y1;
    var pos_x2;
    var pos_y2;
    for (var i = 0; i < positions_colors.length / 2; i++) {
      pos = i * 2;
      pos_x1 = positions_colors[pos][0];
      pos_y1 = positions_colors[pos][1];
      pos_x2 = positions_colors[pos][2];
      pos_y2 = positions_colors[pos][3];

      array[i * 4] = pos_x1;
      array[i * 4 + 1] = pos_y1;
      array[i * 4 + 2] = pos_x2;
      array[i * 4 + 3] = pos_y2;
    }

    setLine(gl, array);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // set the resolution of the image
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // finally draw the result to the canvas.
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = 2;

    for (var i = 0; i < positions_colors.length / 2; i++) {
      // set the color
      gl.uniform4fv(colorLocation, positions_colors[i * 2 + 1]);

      // draw
      gl.drawArrays(primitiveType, offset, count);
      offset += 2;
    }
  }

  function setLine(gl, array) {
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  }
}
