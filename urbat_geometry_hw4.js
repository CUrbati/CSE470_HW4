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

var textCoordsArray=[];
var normalsArray = [];



function quad(a, b, c, d) {

    var t1 = subtract(vertices[a], vertices[b]);
    var t2 = subtract(vertices[c], vertices[b]);

    var normal = cross(t1,t2);
    normal = normalize(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal); 
     //texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal); 
     //texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]);
     normalsArray.push(normal); 
     //texCoordsArray.push(texCoord[2]); 
    
     pointsArray.push(vertices[a]);
     normalsArray.push(normal); 
     //texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]);
     normalsArray.push(normal); 
     //texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     //texCoordsArray.push(texCoord[3]); 
}

window.onload = init;

function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


}