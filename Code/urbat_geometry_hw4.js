var numVertices  = 36;


//------------------------------------
//Materials parameters
// material properties

//Used to store materials so naming is easier. 
class Material {

    
    constructor(ambient, diffuse, specular, shininess) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess * 128.0;
    }
}

var obsidian = new Material (vec4(0.05375, 0.05, 0.06625, 1.0), vec4(0.18275, 0.17, 0.22525, 1.0), vec4(0.332741, 0.328634, 0.346435, 1.0), 0.3);
var gold = new Material (vec4(0.24725, 0.1995, 0.0745, 1.0), vec4(0.75164, 0.60648, 0.22648, 1.0), vec4(0.628281, 0.555802, 0.366065, 1.0), 0.4);
var ruby = new Material (vec4(0.1745, 0.01175, 0.01175, 1.0), vec4(0.61424, 0.04136, 0.04136, 1.0), vec4(0.727811, 0.626959, 0.626959, 1.0), 0.6);

//Created to allow easier access to materials.
var matericalList = [gold,obsidian, ruby];



var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];



function createInstanceCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


var textCoordsArray=[];
var normalsArray = [];
var pointsArray = [];


function quad(a, b, c, d) {

    var t1 = subtract(vertices[a], vertices[b]);
    var t2 = subtract(vertices[c], vertices[b]);

    var normal = cross(t2,t1);
    normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal); 
     textCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal); 
     textCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]);
     normalsArray.push(normal); 
     textCoordsArray.push(texCoord[2]); 
    
     pointsArray.push(vertices[a]);
     normalsArray.push(normal); 
     textCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]);
     normalsArray.push(normal); 
     textCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     textCoordsArray.push(texCoord[3]); 
}

//----------------------------Figure Code--------------------------------------------//
//Directions based on looking forward at mesh.
var headId = 0;
var noseId = 1;
var bodyId = 2;
var frontLeftLegID = 3;
var backLeftLegID = 4;
var frontRightLegID = 5;
var backRightLegID = 6;
var tailBaseID = 7;
var tailTipID = 8;
var leftEarID = 9;
var rightEarID = 10;


var headHeight = 1.5;
var headWidth = 1.5;
var noseHeight = 0.25;
var noseWidth = 0.25;
var bodyHeight = 1.0;
var bodyWidth = 1.0;

var legWidth = 0.25;
var legHeight = 1.5;

var tailBaseHeight = 1.5;
var tailBaseWidth = 0.25;
var tailTipHeight = 0.5;
var tailTipWidth = 0.25;




var numNodes = 10;
var numAngles = 11;
var theta = [0, 0, 0, 180, 180, 180, 180, 135, 45, 0, 0];
var stack = [];

var figure = [];

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

for(var i = 0; i < numNodes; i ++){
    figure[i] = createNode(null, null, null, null);
}

function initNodes(id){

    var m = mat4();

    switch(id){

        case bodyId:
            m = mat4();
            m = translate(currentPosition[0], currentPosition[1], currentPosition[2]);
            
            m = mult(m,rotate(theta[bodyId], 0, 1, 0));
            figure[bodyId] = createNode(m, body, null, headId);
            break;

        case headId:
            m = mat4();
            m = translate(0.0, bodyHeight, 0.0);
            m = mult(m, translate(0.0, 0.0, bodyWidth));
            m = mult(m, rotate(theta[headId], 0, 0, 1));
            figure[headId] = createNode(m, head, frontLeftLegID, null);
        
        case frontLeftLegID:
            m = mat4();
            m = translate(-(0.25*bodyWidth), 0.1*legHeight, 0.0);
            m = mult(m, translate(0.0, 0.0, -bodyWidth));
            m = mult(m, rotate(theta[frontLeftLegID], 1, 0, 0));
            figure[frontLeftLegID] = createNode(m, leftfrontleg, frontRightLegID, null);
        
        case frontRightLegID:
            m = mat4();
            m = translate((0.25*bodyWidth), 0.1*legHeight, 0.0);
            m = mult(m, translate(0.0, 0.0, -bodyWidth));
            m = mult(m, rotate(theta[frontRightLegID], 1, 0, 0));
            figure[frontRightLegID] = createNode(m, rightfrontleg, backLeftLegID, null);

        case backLeftLegID:
            m = mat4();
            m = translate(-(0.25*bodyWidth), 0.1*legHeight, 0.0);
            m = mult(m, translate(0.0, 0.0, bodyWidth));
            m = mult(m, rotate(theta[backLeftLegID], 1, 0, 0));
            figure[backLeftLegID] = createNode(m, leftbackleg, backRightLegID, null);
            
        case backRightLegID:
            m = mat4();
            m = translate((0.25*bodyWidth), 0.1*legHeight, 0.0);
            m = mult(m, translate(0.0, 0.0, bodyWidth));
            m = mult(m, rotate(theta[backRightLegID], 1, 0, 0));
            figure[backRightLegID] = createNode(m, rightbackleg, null, tailBaseID);

        case tailBaseID:
            m = mat4();
            m = translate(-0.25*bodyWidth, 0.5*-(legHeight), 2.15*bodyWidth);
            m = mult(m, rotate(135, 1, 0, 0));
            m = mult(m, rotate(theta[tailBaseID], 0, 0, 1));
            figure[tailBaseID] = createNode(m, basetail, null, tailTipID)
        case tailTipID:
            m = mat4();
            m = translate(0.0, tailBaseHeight, 0.0);
            m = mult(m, rotate(45, 1, 0, 0));
            m = mult(m, rotate(theta[tailTipID], 0, 0, 1));
            figure[tailTipID] = createNode(m, tiptail, null, null)
    }

}

function body() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*bodyHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( bodyWidth, bodyHeight, 2.5 * bodyWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*headHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( headWidth, headHeight,headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}

function leftfrontleg(){

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*legHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( legWidth, legHeight,legWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}

function rightfrontleg(){

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*legHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( legWidth, legHeight,legWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}

function leftbackleg(){

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*legHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( legWidth, legHeight,legWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}

function rightbackleg(){

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*legHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( legWidth, legHeight,legWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}

function basetail(){

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*tailBaseHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( tailBaseWidth, tailBaseHeight,tailBaseWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );

}

function tiptail(){

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*tailTipHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( tailTipWidth, tailTipHeight,tailBaseWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );



}




function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

