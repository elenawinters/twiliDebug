GAME = GetGameName()

function RaycastFromPlayer()
    -- Results of the raycast
    local hit = false
    local endCoords = nil
    local surfaceNormal = nil
    local entityHit = nil

    local playerPed = PlayerPedId()
    local camCoord = GetGameplayCamCoord()
    local camRot = GetGameplayCamRot(0)

    local rayHandle = StartShapeTestLosProbe(camCoord, camCoord + RotationToDirection(camRot) * 1000, -1, playerPed)
    local status, hit, endCoords, surfaceNormal, entityHit = GetShapeTestResult(rayHandle)

    return endCoords, entityHit, hit

    -- return hit, endCoords, surfaceNormal, entityHit
end

function GetEntityLosFromPlayer(entity)
    if not Settings['render_los'] then
        return true
    end

    local entity_pos = GetEntityCoords(entity)
    local camera_pos = GetGameplayCamCoord()
    local handle = StartShapeTestLosProbe(camera_pos.x, camera_pos.y, camera_pos.z, entity_pos.x, entity_pos.y, entity_pos.z, 4294967295, entity, 4)

    local status, hit, end_pos, normal, entity_hit = GetShapeTestResult(handle)

    return hit
end

function IsEntityInRangeOfPlayer(entity, distance)
    if not Settings['render_text_local'] then
        return true
    end

    local entity_pos = GetEntityCoords(entity)
    local camera_pos = GetGameplayCamCoord()
    local dist = #(camera_pos - entity_pos)  -- there is a GTA native for this but this is quicker than the native

    if dist < 100 then
        return true
    else
        return false
    end
    
end



function DrawTextOnScreen(text, xPosition, yPosition, color, size)
    if color == nil then
        color = {r=0, g=255, b=0, a=255}
    end
    if size == nil then
        size = 0.3
    end
    if GAME == 'fivem' then
        SetTextFont(0)
        -- SetTextScale(1.0, 0.4)
        SetTextScale(0.0, size)
        SetTextColour(color.r, color.g, color.b, color.a)
        SetTextCentre(true)
        -- SetTextColour(color['r'], color['g'], color['b'], color['a'])
        SetTextOutline()
        BeginTextCommandDisplayText("STRING");
        AddTextComponentSubstringPlayerName(text);
        EndTextCommandDisplayText(xPosition, yPosition);
    elseif GAME == 'redm' then
        local vstr = CreateVarString(10, "LITERAL_STRING", tostring(text))  -- the game will crash if VALUE is not a string
        SetTextColor(color.r, color.g, color.b, color.a)
        SetTextScale(0.0, 0.35)
        SetTextFontForCurrentCommand(0)
        SetTextCentre(true)
    
        DisplayText(vstr, xPosition, yPosition)
    end

end

function Round(number, places)  -- http://lua-users.org/wiki/SimpleRound
    local mult = 10^(places or 0)
    return math.floor(number * mult + 0.5) / mult
end