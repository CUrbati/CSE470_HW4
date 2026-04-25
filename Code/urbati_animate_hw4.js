//Chester Urbati

function animation1()
{
        t = t - 0.01;
        if(t < -2*Math.PI)
        {
            t = 0;
        }
        //Will use this to influce the figure.
        currentPosition = vec3(100*Math.cos(t), 1, 100*Math.sin(t));

        let upVector = vec3(0, 1, 0);


        let directionOfPath = cross(upVector, normalize(currentPosition));
        currentAngle = Math.atan2(directionOfPath[0], directionOfPath[2]);

        //Because the world runs on radians but rotate needs degrees
        currentAngle = currentAngle * 180 / Math.PI;

        theta[bodyId] = currentAngle;

        if(backforth)
        {
            if(s > 195)
            {
                backforth = false;
            }
            s = s  + 1;
            z = z + 5;
            tailWag = tailWag + 1;
            headshake = headshake + 1;
        }
        else
        {
            if(s < 165)
            {
                backforth = true;
            }
            s = s  - 1;
            z = z - 5;
            tailWag = tailWag - 1;
            headshake = headshake - 1;
        }
        theta[frontLeftLegID] = s;
        theta[frontRightLegID] = s;
        theta[backLeftLegID] = s;
        theta[backRightLegID] = s;
        theta[tailTipID] = z;
        theta[tailBaseID] = tailWag;
        theta[headId] = headshake
}