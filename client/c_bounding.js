// This is a port of my lua port of vMenu's bounding box rendering
// Although this will work in RedM, it is buggy, laggy, and not recommended.
// Not tested yet, hopefully it works (update: it didn't, fixed now tho)

function DrawEntityBoundingBox(ent, color, origin) {
    if (origin != 'selection' && ent == SelectedEntity) { return; }
    if (color.a == null) { color = {r:color[0], g:color[1], b:color[2], a:color[3]}; }
    box = GetEntityBoundingBox(ent);
    // console.log(box)
    DrawBoundingBox(box, color);
}

function GetEntityBoundingBox(ent) {
    let [min, max] = GetModelDimensions(GetEntityModel(ent))
    const pad = 0.001

    let retval = []
    // Bottom
    retval.push(GetOffsetFromEntityInWorldCoords(ent, min[0] - pad, min[1] - pad, min[2] - pad))
    retval.push(GetOffsetFromEntityInWorldCoords(ent, max[0] + pad, min[1] - pad, min[2] - pad))
    retval.push(GetOffsetFromEntityInWorldCoords(ent, max[0] + pad, max[1] + pad, min[2] - pad))
    retval.push(GetOffsetFromEntityInWorldCoords(ent, min[0] - pad, max[1] + pad, min[2] - pad))

    // Top
    retval.push(GetOffsetFromEntityInWorldCoords(ent, min[0] - pad, min[1] - pad, max[2] + pad))
    retval.push(GetOffsetFromEntityInWorldCoords(ent, max[0] + pad, min[1] - pad, max[2] + pad))
    retval.push(GetOffsetFromEntityInWorldCoords(ent, max[0] + pad, max[1] + pad, max[2] + pad))
    retval.push(GetOffsetFromEntityInWorldCoords(ent, min[0] - pad, max[1] + pad, max[2] + pad))

    return retval
}

function DrawBoundingBox(box, color) {
    const polyMatrix = GetBoundingBoxPolyMatrix(box)
    const edgeMatrix = GetBoundingBoxEdgeMatrix(box)

    DrawPolyMatrix(polyMatrix, color);
    DrawEdgeMatrix(edgeMatrix, {r:255, g:255, b:255, a:255});
}


function GetBoundingBoxPolyMatrix(box) {
    return [
        [box[2], box[1], box[0]],
        [box[3], box[2], box[0]],

        [box[4], box[5], box[6]],
        [box[4], box[6], box[7]],

        [box[2], box[3], box[6]],
        [box[7], box[6], box[3]],

        [box[0], box[1], box[4]],
        [box[5], box[4], box[1]],

        [box[1], box[2], box[5]],
        [box[2], box[6], box[5]],

        [box[4], box[7], box[3]],
        [box[4], box[3], box[0]]
    ]
}

function GetBoundingBoxEdgeMatrix(box) {
    return [
        [box[0], box[1]],
        [box[1], box[2]],
        [box[2], box[3]],
        [box[3], box[0]],

        [box[4], box[5]],
        [box[5], box[6]],
        [box[6], box[7]],
        [box[7], box[4]],

        [box[0], box[4]],
        [box[1], box[5]],
        [box[2], box[6]],
        [box[3], box[7]]
    ]
}

function DrawPolyMatrix(polyCollection, color) {
    polyCollection.forEach((poly, i) => {
        switch(GAME) {
            case FIVEM:
                DrawPoly(
                    poly[0][0], poly[0][1], poly[0][2],
                    poly[1][0], poly[1][1], poly[1][2], 
                    poly[2][0], poly[2][1], poly[2][2],
                    color.r, color.g, color.b, color.a
                )
                break;
            default:
                Citizen.invokeNative('0xABD19253', 
                    poly[0][0], poly[0][1], poly[0][2],
                    poly[1][0], poly[1][1], poly[1][2], 
                    poly[2][0], poly[2][1], poly[2][2],
                    color.r, color.g, color.b, color.a
                )  // DrawPoly
        }
    })
}

function DrawEdgeMatrix(linesCollection, color) {
    linesCollection.forEach((line, i) => {
        switch(GAME) {
            case FIVEM:
                DrawLine(
                    line[0][0], line[0][1], line[0][2],
                    line[1][0], line[1][1], line[1][2],
                    color.r, color.g, color.b, color.a
                )
                break;
            default:
                Citizen.invokeNative('0xB3426BCC', 
                    line[0][0], line[0][1], line[0][2],
                    line[1][0], line[1][1], line[1][2],
                    color.r, color.g, color.b, color.a
                )  // DrawLine
        }
    })
}
