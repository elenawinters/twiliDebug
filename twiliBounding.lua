function DrawEntityBoundingBox(ent, color, origin)
    if origin ~= 'selection' and ent == SelectedEntity then
        return
    end
    -- if GAME == 'redm' and IsEntityInRangeOfPlayer(ent, 10) == false then
    --     return
    -- end
    box = GetEntityBoundingBox(ent);
    DrawBoundingBox(box, color);
    
end

function GetEntityBoundingBox(ent)
    min = vector3(0, 0, 0)
    max = vector3(0, 0, 0)

    min, max = GetModelDimensions(GetEntityModel(ent))

    pad = 0.001

    retval = {}
    -- Bottom
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, min.x - pad, min.y - pad, min.z - pad))
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, max.x + pad, min.y - pad, min.z - pad))
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, max.x + pad, max.y + pad, min.z - pad))
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, min.x - pad, max.y + pad, min.z - pad))

    -- Top
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, min.x - pad, min.y - pad, max.z + pad))
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, max.x + pad, min.y - pad, max.z + pad))
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, max.x + pad, max.y + pad, max.z + pad))
    table.insert(retval, GetOffsetFromEntityInWorldCoords(ent, min.x - pad, max.y + pad, max.z + pad))

    -- for i, thing in pairs(retval) do
    --     print(thing)
    -- end

    return retval

end

function DrawBoundingBox(box, color)
    polyMatrix = GetBoundingBoxPolyMatrix(box)
    edgeMatrix = GetBoundingBoxEdgeMatrix(box)

    DrawPolyMatrix(polyMatrix, color)
    DrawEdgeMatrix(edgeMatrix, {r=255, g=255, b=255, a=255});

end


function GetBoundingBoxPolyMatrix(box)
    return {
        {box[3], box[2], box[1]},
        {box[4], box[3], box[1]},

        {box[5], box[6], box[7]},
        {box[5], box[7], box[8]},

        {box[3], box[4], box[7]},
        {box[8], box[7], box[4]},

        {box[1], box[2], box[5]},
        {box[6], box[5], box[2]},

        {box[2], box[3], box[6]},
        {box[3], box[7], box[6]},

        {box[5], box[8], box[4]},
        {box[5], box[4], box[1]}
    }
end

function GetBoundingBoxEdgeMatrix(box)
    return {
        {box[1], box[2]},
        {box[2], box[3]},
        {box[3], box[4]},
        {box[4], box[1]},

        {box[5], box[6]},
        {box[6], box[7]},
        {box[7], box[8]},
        {box[8], box[5]},

        {box[1], box[5]},
        {box[2], box[6]},
        {box[3], box[7]},
        {box[4], box[8]}
    }
end

function DrawPolyMatrix(polyCollection, color)
    for i, poly in pairs(polyCollection) do
        if GAME == 'fivem' then
            DrawPoly(poly[1], poly[2], poly[3], color.r, color.g, color.b, color.a)
        else  -- while this works on RedM, it is buggy
            Citizen.InvokeNative(0xABD19253, poly[1], poly[2], poly[3], color.r, color.g, color.b, color.a)  -- DrawPoly
        end
        -- DrawPoly(x1, y1, z1, x2, y2, z2, x3, y3, z3, color.r, color.g, color.b, color.a)
        -- DrawPoly(x1, y1, z1, x2, y2, z2, x3, y3, z3, 255, 255, 255, 255)
        -- DrawPoly(0, 0, 0, 100, 100, 100, 1000, 1000, 1000, color.r, color.g, color.b, color.a)
        -- print(x1, y1, z1)
    end
end

function DrawEdgeMatrix(linesCollection, color)
    for i, line in pairs(linesCollection) do
        if GAME == 'fivem' then
            DrawLine(line[1], line[2], color.r, color.g, color.b, color.a)
        else  -- while this works on RedM, it is buggy
            Citizen.InvokeNative(0xB3426BCC, line[1], line[2], color.r, color.g, color.b, color.a)  -- DrawLine
        end
        -- DrawLine(x1, y1, z1, x2, y2, z2, color.r, color.g, color.b, color.a)
    end
end
