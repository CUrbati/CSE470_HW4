//Chester Urbati

var canvas;
var gl;

var t = 0;
var backforth = false;
var s = 180;
var z = theta[tailTipID];
var tailWag = 0;
var headshake = 0;
var animate = true;

//-----------------------------------
//Lighting parameters
//White Light
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
//------------------------------------


var viewer = 
{
	eye: vec3(0.0, 0.0, 20.0),
	at:  vec3(0.0, 0.0, 0.0),  
	up:  vec3(0.0, 1.0, 0.0),
	
	// for moving around object; set vals so at origin
    radius: 20,
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

tempAngles = [];

// define geometry
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var instanceMatrix;
var program;
var floorTextureLoc;
var floor;

window.onload = init;

function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.53, 0.81, 0.92, 1.0 );
    
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

    modelViewMatrix = lookAt(viewer.eye, viewer.at, viewer.up);
    projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    //Set light position    
    lightPosition = vec4(viewer.eye[0], viewer.eye[1], viewer.eye[2], 1.0);

    floorTextureLoc = gl.getUniformLocation(program, "floor");

    configureTexture();
    
    //configureTexture();
    mouseControls();


    document.getElementById("materials").onchange = function(event) {
        materialNum = parseInt(event.target.value);
        console.log("selected material index: ", materialNum);
        document.getElementById("shininess").value = matericalList[materialNum].shininess;

        ambientProduct = mult(lightAmbient, matericalList[materialNum].ambient);
        diffuseProduct = mult(lightDiffuse, matericalList[materialNum].diffuse);
        specularProduct = mult(lightSpecular, matericalList[materialNum].specular);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
            flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
            flatten(diffuseProduct) );
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), 
            flatten(specularProduct) );	
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), 
            flatten(lightPosition) );

    }



    render();

}


var currentPosition = vec3(0, 0, 0);
var currentAngle = 0;

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    loadTexture1(materialNum);
    if(animate)
    {
        
        animation1();
        
    }


    //Send updated modelview matrix to GPU.
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
    "modelViewMatrix"), false, flatten(modelViewMatrix) ); 

    for(var i = 0; i < numNodes; i++)
    {
        initNodes(i);
    }

    traverse(bodyId);

    
    //Updated modelview matrix based on changes to viewer from mouse input.
    modelViewMatrix = lookAt(viewer.eye, viewer.at, viewer.up);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -1.45, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4( 10, 0.25, 10));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );


    requestAnimFrame(render);
}


function animateFig()
{
    if(animate)
    {
        animate = false;
    }
    else
    {
        animate = true;
    }
}



