// Some of these functions will likely move to twiliCore
function RotationToDirection(deg) {
    const rad_x = deg[0] * 0.0174532924
    const rad_z = deg[2] * 0.0174532924

    const dir_x = -Math.sin(rad_z) * Math.cos(rad_x)
    const dir_y = Math.cos(rad_z) * Math.cos(rad_x)
    const dir_z = Math.sin(rad_x)
    // const dir = {x=dir_x, y=dir_y, z=dir_z}
    const dir = [dir_x, dir_y, dir_z]
    return dir
}

function RaycastFromPlayerAsync() {
    const playerPed = PLAYER_PED()
    // const camCoord = {x=t[0], y=t[1], z=[2]} = t = GetGameplayCamCoord()
    const camCoord = GetGameplayCamCoord()
    const camRot = GetGameplayCamRot(0)

    let rayHandle = StartShapeTestLosProbe(camCoord, arrayAdd(camCoord, arrayMultiply(RotationToDirection(camRot), 1000)), 4294967295, playerPed, 0)
    // let rayHandle = StartShapeTestLosProbe(camCoord, camCoord + RotationToDirection(camRot) * 1000, 4294967295, playerPed, 0)
    // local rayHandle = StartShapeTestCapsule(camCoord, camCoord + RotationToDirection(camRot) * 10000, 5, 4294967295, playerPed, 0)
    // local status, hit, endCoords, surfaceNormal, entityHit = GetShapeTestResult(rayHandle)
    // status = GetShapeTestResult(rayHandle, hit, endCoords, surfaceNormal, entityHit)

    let testStatus = 1
    let hit = false
    let endCoords = [0, 0, 0]
    let surfaceNormal = [0, 0, 0]
    let entityHit = 0

    const thread = setTick(async () => {
        if (testStatus != 2) { return; }
        [testStatus, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle)
        clearTick(thread);
    })
    // while status ~= 2 do
    //     status, hit, endCoords, surfaceNormal, entityHit = GetShapeTestResult(rayHandle)
    //     -- statusloop = status
    //     Citizen.Wait(0)
    // end

    return entityHit

    // return hit, endCoords, surfaceNormal, entityHit
}

// function GetEntityLosFromPlayer(entity)
//     if not Settings['render_los'] then
//         return true
//     end

//     local entity_pos = GetEntityCoords(entity)
//     local camera_pos = GetGameplayCamCoord()
//     local handle = StartShapeTestLosProbe(camera_pos, entity_pos, 4294967295, entity, 4)

//     local status, hit, end_pos, normal, entity_hit = GetShapeTestResult(handle)

//     return hit
// end

// function IsEntityInRangeOfPlayer(entity, range)
//     if not Settings['render_text_local'] then
//         return true
//     end
//     if range == nil then
//         range = 100
//     end

//     local entity_pos = GetEntityCoords(entity)
//     local camera_pos = GetGameplayCamCoord()
//     local dist = #(camera_pos - entity_pos)  -- there is a GTA native for this but this is quicker than the native

//     if dist < range then
//         return true
//     else
//         return false
//     end
    
// end



// function DrawTextOnScreen(text, xPosition, yPosition, color, size, justification, center)
//     if color == nil then
//         color = {r=0, g=255, b=0, a=255}
//     end
//     if size == nil then
//         size = 0.3
//     end
//     if justification == nil then
//         justification = 0
//     end
//     if center == true or center == nil then
//         SetTextCentre(true)
//     end
//     if GAME == 'fivem' then
//         SetTextFont(0)
//         -- SetTextScale(1.0, 0.4)
//         SetTextScale(0.0, size)
//         SetTextColour(color.r, color.g, color.b, color.a)
//         -- SetTextColour(color['r'], color['g'], color['b'], color['a'])
//         SetTextOutline()
//         BeginTextCommandDisplayText("STRING");
//         AddTextComponentSubstringPlayerName(text);
//         EndTextCommandDisplayText(xPosition, yPosition);
//     elseif GAME == 'redm' then
//         local vstr = CreateVarString(10, "LITERAL_STRING", text.toString())  -- the game will crash if VALUE is not a string
//         SetTextColor(color.r, color.g, color.b, color.a)
//         SetTextScale(0.0, 0.35)
//         SetTextFontForCurrentCommand(0)
    
//         DisplayText(vstr, xPosition, yPosition)
//     end

// end

// function Round(number, places)  -- http://lua-users.org/wiki/SimpleRound
//     local mult = 10^(places or 0)
//     return math.floor(number * mult + 0.5) / mult
// end