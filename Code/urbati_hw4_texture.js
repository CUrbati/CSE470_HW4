//Chester Urbati

var texture1, texture2, texture3;

var texSize = 256;
var numChecks = 8;

var image2 = new Uint8Array(4*texSize*texSize);
var image1 = new Uint8Array(4*texSize*texSize);
var image3 = new Uint8Array(4*texSize*texSize);

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


for ( var i = 0; i < texSize; i++ ) {

    for ( var j = 0; j <texSize; j++ ) {

        let point = j - texSize/2
        let y = texSize/2 + -0.0001 * (point*point*point);

        let dis = Math.abs(i - y);

        
        if(dis < 2)
        {
            value = 0;
        }
        else if(dis >= 2 && dis < 5)
        {
            value = 64;
        }
        else if(dis >= 5 && dis < 10)
        {
            value = 128;
        }
        else if(dis >= 10 && dis < 15)
        {
            value = 192;
        }
        else
        {
            value = 255;
        }


        
        image2[4*i*texSize+4*j] = value;
        image2[4*i*texSize+4*j+1] = value;
        image2[4*i*texSize+4*j+2] = value;
        image2[4*i*texSize+4*j+3] = 255;

    }
}


for ( var i = 0; i < texSize; i++ ) {

    for ( var j = 0; j <texSize; j++ ) {

        let point = j - texSize/2
        let y = texSize/2 + 0.0001 * (point*point*point);

        let dis = Math.abs(i - y);
        
        if(dis < 2)
        {
            value = 0;
        }
        else if(dis >= 2 && dis < 5)
        {
            value = 64;
        }
        else if(dis >= 5 && dis < 10)
        {
            value = 128;
        }
        else if(dis >= 10 && dis < 15)
        {
            value = 192;
        }
        else
        {
            value = 255;
        }
        
        image1[4*i*texSize+4*j] = value;
        image1[4*i*texSize+4*j+1] = value;
        image1[4*i*texSize+4*j+2] = value;
        image1[4*i*texSize+4*j+3] = 255;

    }
}


//Sets up the texture for the gpu.
function configureTexture() {
    texture1 = gl.createTexture();       
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture2 = gl.createTexture();       
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture3 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture3 );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1)

}

function loadTexture1(mat)
{

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1)


    //Set the light products to show the materials.
    ambientProduct = mult(lightAmbient, matericalList[mat].ambient);
    diffuseProduct = mult(lightDiffuse, matericalList[mat].diffuse);
    specularProduct = mult(lightSpecular, matericalList[mat].specular);

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
        "shininess"),matericalList[mat].shininess);

}

