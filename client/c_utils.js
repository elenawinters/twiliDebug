// const modelHash = GetHashKey('ex_warel_girders')


function twiliGetEntityArchetypeName(entity) {
    switch(GAME) {
        case FIVEM:
            return GetEntityArchetypeName(entity)
        default:  // this native doesn't really work in RedM. It just returns the input
            return Citizen.invokeNative('0x47B870F5', entity);
    }
}


function loadModelAndOutline(c) {
    const modelHash = GetHashKey('adder')

    if (!HasModelLoaded(modelHash)) {
        // If the model isnt loaded we request the loading of the model and wait that the model is loaded
        console.log('requesting model')
        RequestModel(modelHash);
        console.log('requested')
        // do {
        //     new Promise(resolve => setTimeout(resolve, 100));
        // } while (!HasModelLoaded(modelHash));
        const thread = setTick(async () => {
            if (HasModelLoaded(modelHash)) { clearTick(thread); }
        })
    }

    // Delay(3000)

    // At this moment the model its loaded, so now we can create the object
    console.log('trying to load')
    const obj = CreateVehicle(modelHash, c[0], c[1], c[2], GetEntityHeading(PlayerPedId())+90, 1, 0)
    // const obj = CreateObject(modelHash, c[0], c[1], c[2], true);
    console.log('loaded?')
    SetEntityDrawOutlineShader(0)
    SetEntityDrawOutlineColor(0, 255, 0, 255)
    SetEntityDrawOutline(obj, true)

}

// Some of these functions will likely move to twiliCore
function GetForwardVector(deg) {
    const [rad_x, rad_z] = [deg[0] * 0.0174532924, deg[2] * 0.0174532924]

    const [dir_x, dir_y, dir_z] = [-Math.sin(rad_z) * Math.cos(rad_x), Math.cos(rad_z) * Math.cos(rad_x), Math.sin(rad_x)]

    const dir = [dir_x, dir_y, dir_z]
    // console.log(dir)
    // console.log(GetEntityForwardVector(PLAYER_PED()))
    return dir
}

// var [testStatus, hit, endCoords, surfaceNormal, entityHit] = [1, false, [0, 0, 0], [0, 0, 0], 0]
// function fuckthisfuckingshit(_hit, _endCoords, _surfaceNormal, _entityHit) {
//     [hit, endCoords, surfaceNormal, entityHit] = [_hit, _endCoords, _surfaceNormal, _entityHit]
// }

function RaycastFromPlayer() {
    const playerPed = PLAYER_PED()
    const camCoord = GetGameplayCamCoord()
    const camRot = GetGameplayCamRot(0)

    const castCoord = arrayAdd(camCoord, arrayMultiply(GetForwardVector(camRot), 1000))

    // This doesn't take the coord arrays.
    // using expensive cuz async is a pain right now. need to learn how to handle it
    const rayHandle = StartExpensiveSynchronousShapeTestLosProbe(camCoord[0], camCoord[1], camCoord[2], castCoord[0], castCoord[1], castCoord[2], 4294967295, playerPed, 4)
    // const rayHandle = StartShapeTestLosProbe(camCoord[0], camCoord[1], camCoord[2], castCoord[0], castCoord[1], castCoord[2], 4294967295, playerPed, 0)

    // let [testStatus, hit, endCoords, surfaceNormal, entityHit] = [1, false, [0, 0, 0], [0, 0, 0], 0]

    let [testStatus, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle)
    // const thread = setTick(() => {
    // THIS IS CRASHING?!?!?
    // do {
    //     [testStatus, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle)  // this is a bitch
    //     console.log(testStatus)
    //     // exports.twiliCore.util().Delay(2000)  // huh
    //     Delay(0)
    // } while (testStatus != 2)
    // })
    // console.log(thread)
    // console.log(entityHit)
    // console.log('has it been 5 seconds?')
    // return entityHit
    return hit, endCoords, surfaceNormal, entityHit
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

function distanceBetweenVectors(v1, v2) {
    let dx = v1[0] - v2[0]
    let dy = v1[1] - v2[1]
    let dz = v1[2] - v2[2]
    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

function IsEntityInRangeOfPlayer(entity, range) {
    if (!Settings.render_text_local) { return true; }
    if (range == null) { range = 100; }

    const dist = distanceBetweenVectors(GetEntityCoords(entity), GetGameplayCamCoord())

    return dist < range ? true : false
}

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




function DrawTextOnScreen(text, xPosition, yPosition, color, size, justification, center) {
    if (color == null) { color = {r:0, g:255, b:0, a:255}; }
    if (size == null) { size = 0.3; }
    if (justification == null) { justification = 0; }
    if (center == true || center == null) { SetTextCentre(true) }
    switch (GAME) {
        case FIVEM:
            SetTextFont(0)
            // SetTextScale(1.0, 0.4)
            SetTextScale(0.0, size)
            SetTextColour(color.r, color.g, color.b, color.a)
            // SetTextColour(color['r'], color['g'], color['b'], color['a'])
            SetTextOutline()
            BeginTextCommandDisplayText("STRING");
            AddTextComponentSubstringPlayerName(text);
            EndTextCommandDisplayText(xPosition, yPosition);
            break;
        case REDM:
            let vstr = CreateVarString(10, "LITERAL_STRING", text.toString())
            SetTextColor(color.r, color.g, color.b, color.a)
            SetTextScale(0.0, 0.35)
            SetTextFontForCurrentCommand(0)
        
            DisplayText(vstr, xPosition, yPosition)

    }
}

// function Round(number, places)  -- http://lua-users.org/wiki/SimpleRound
//     local mult = 10^(places or 0)
//     return math.floor(number * mult + 0.5) / mult
// end