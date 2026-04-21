var canvas;
var gl;


//-----------------------------------
//Lighting parameters
//White Light
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);


var viewer = 
{
	eye: vec3(0.0, 0.0, 3.0),
	at:  vec3(0.0, 0.0, 0.0),  
	up:  vec3(0.0, 1.0, 0.0),
	
	// for moving around object; set vals so at origin
    radius: 4,
    theta: 0,
    phi: 0
};

// Create better params that suit your geometry
var perspProj = 
 {
	fov: 60,
	aspect: 1,
	near: 0.1,
	far:  100
 }

 // mouse interaction
 
var mouse =
{
    prevX: 0,
    prevY: 0,

    leftDown: false,
    rightDown: false,
};


// define geometry
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;


window.onload = init;

function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 0.0 );
    
    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //Causes the quad function to get normals and create the geometry. 
    createInstanceCube();

    //Normal Buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    //Normals
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    //Vertex Buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    //Vertex Positions
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //Texture Buffer
    //var tBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(textCoordsArray), gl.STATIC_DRAW );
    //Texture Positions
    //var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    //gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(vTexCoord);

    //set up camera
    viewer.eye = vec3(0, 0, 0 + 4);
    viewer.at = vec3(0, 0, 0);
    viewer.up = vec3(0, 1, 0);

    modelViewMatrix = lookAt(viewer.eye, viewer.at, viewer.up);
    projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);

    var modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    var projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    //Set light position    
    lightPosition = vec4(0.0, 0.0, 0.0, 1.0);

    //Set the light products to show the materials.
    ambientProduct = mult(lightAmbient, matericalList[0].ambient);
    diffuseProduct = mult(lightDiffuse, matericalList[0].diffuse);
    specularProduct = mult(lightSpecular, matericalList[0].specular);

    //Send material information to gpu.
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
        flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
        flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program, 
        "shininess"),matericalList[0].shininess);
    

    render();

}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}

