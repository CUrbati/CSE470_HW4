var canvas;
var gl;

var t = 0;

//-----------------------------------
//Lighting parameters
//White Light
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
//------------------------------------


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
	fov: 40,
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
var instanceMatrix;
var program;

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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(textCoordsArray), gl.STATIC_DRAW );
    //Texture Positions
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    //set up camera
    viewer.eye = vec3(0, 0, 0 + 20);
    viewer.at = vec3(0, 0, 0);
    viewer.up = vec3(0, 1, 0);

    modelViewMatrix = lookAt(viewer.eye, viewer.at, viewer.up);
    projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    
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
    
    configureTexture();
    
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1)
    


    for(var i = 0; i < numNodes; i++)
    {
        initNodes(i);
    }

    mouseControls();
    render();

}


var currentPosition = vec3(1, 1, 1);
var currentAngle = 0;

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    t = t + 0.01;
    if(t > 2*Math.PI)
    {
        t = 0;
    }
    //Will use this to influce the figure.
    currentPosition = vec3(3*Math.cos(t), 1, 3*Math.sin(t));

    let upVector = vec3(0, 1, 0);


    let directionOfPath = cross(upVector, normalize(currentPosition));
    currentAngle = Math.atan2(directionOfPath[2], directionOfPath[0]);
    
    //Because the world runs on radians but rotate needs degrees
    currentAngle = currentAngle * 180 / Math.PI;

    //Updaed modelview matrix based on changes to viewer from mouse input.
    modelViewMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
	
    instanceMatrix = mult(modelViewMatrix, scale4( 0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    //Send updated modelview matrix to GPU.
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelViewMatrix) ); 



    traverse(bodyId);

    

    requestAnimFrame(render);
}

