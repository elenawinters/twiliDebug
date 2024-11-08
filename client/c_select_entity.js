let SelectedLooping = false
let SelectedEntity = null
let CursorLooping = false
let Cursor = false

const tab_insert = '&nbsp;&nbsp;&nbsp;&nbsp;'

switch(GAME) {
    case FIVEM:
        SetEntityDrawOutlineShader(1)
        SetEntityDrawOutlineColor(255, 255, 255, 127)
        break
    default:
        Citizen.invokeNative('0x5261A01A', 1)  // SetEntityDrawOutlineShader
        Citizen.invokeNative('0xB41A56C2', 255, 255, 255, 127)  // SetEntityDrawOutlineColor
}

// Deletion Logic
exports.twiliKeybinds.RegisterKeyMapping('+twiliDebug:deleteSelection', 'Delete selected entity', 'keyboard', 'DELETE')

// on('CEventDamage', function (victims, suspect) {
//     for (let [, victim] of Object.entries(victims)) {
//         if (!IsPedAPlayer(suspect) || !IsPedAPlayer(victim)) { return; }  // required for hybrid
//         const position = CalculateDamagePosition(suspect, victim);
//         const weaponHash = GetPedCauseOfDeath(victim);
//         const isMelee = GetWeaponDamageType(weaponHash) == 2;
//         const damageBone = GetPedLastDamageBone(victim);

//         let [suspectData, victimData, situationData] = CreateSituationReport(suspect, victim, position, weaponHash, 0, damageBone, false, isMelee)

//         emitNet("twiliCore:damage:_sync", suspectData, victimData, situationData);
//     }
// })

// emit('twiliCore:damage:event', suspectData, victimData, situationData);
onNet('twiliDebug:deleteEntity', (entity, remote) => {
    if (remote == true) {
        entity = NetworkGetEntityFromNetworkId(entity)
    }
    if (IsEntityAnObject(entity)) {
        SetEntityAsMissionEntity(entity, true, true);
    }
    DeleteEntity(entity)
});

RegisterCommand('+twiliDebug:deleteSelection', (source, args) => {
    if (!SelectedEntity) { return; }
    const network_owner = NetworkGetEntityOwner(SelectedEntity)
    // emitNet('twiliDebug:deleteEntity:_sync', SelectedEntity, GetPlayerServerId(network_owner));
    if (network_owner !== -1 && network_owner !== PLAYER_INDEX) {
    // if (network_owner !== -1) {
        emitNet('twiliDebug:deleteEntity:_sync', NetworkGetNetworkIdFromEntity(SelectedEntity), GetPlayerServerId(network_owner));
    } else {
        emit('twiliDebug:deleteEntity', SelectedEntity);
    }
    // emit('twiliDebug:deleteEntity', SelectedEntity);
    // if (!SelectedEntity) { return; }
    // if (IsEntityAnObject(SelectedEntity)) {
    //     SetEntityAsMissionEntity(SelectedEntity, true, true);
    // }
    // DeleteEntity(SelectedEntity)
});

RegisterCommand('-twiliDebug:deleteSelection', (source, args) => { return; });

// Cursor Logic

function renderCursor() {
    if (CursorLooping) { return; }

    CursorLooping = true;
    const thread = setTick(() => {
        if (!Cursor) { CursorLooping = false; }
        if (!CursorLooping) { clearTick(thread); }
        ShowHudComponentThisFrame(14)
    })
}

if (GAME == FIVEM) {
    exports.twiliKeybinds.RegisterKeyMapping('+twiliDebug:renderCursor', 'Display cursor in center of frame', 'keyboard', 'LMENU')

    RegisterCommand('+twiliDebug:renderCursor', (source, args) => {
        Cursor = true
        renderCursor()
    });

    RegisterCommand('-twiliDebug:renderCursor', (source, args) => {
        Cursor = false
        renderCursor()
    });
}


// Selection Logic
exports.twiliKeybinds.RegisterKeyMapping('+twiliDebug:selectEntity', 'Raycast out and select an entity', 'keyboard', 'MOUSE_MIDDLE')

RegisterCommand('+twiliDebug:selectEntity', (source, args) => {
    startRaycast()
    drawSelection()
});

RegisterCommand('-twiliDebug:selectEntity', (source, args) => { return; });


RegisterCommand('twiliveh', (source, args) => {
    if (SelectedEntity == null) { return; }
    if (!IsEntityAVehicle(SelectedEntity)) { return; }

    switch (args[0]) {
        case 'enter':
            SetPedIntoVehicle(PLAYER_PED(), SelectedEntity, -1);
            break;
        case 'del':
        case 'delete':
            DeleteEntity(SelectedEntity);
            break;
    }

    // if (args[0] == 'enter') {
    //     SetPedIntoVehicle(PLAYER_PED(), SelectedEntity, -1)
    // }

    // if (args[0] == )

});

function startRaycast() {
    lastsel = SelectedEntity;
    // console.log(SelectedEntity)
    // RaycastFromPlayerAsync_SetSelection();
    RaycastFromPlayerCapsule();
}

function selectEntity() {
    // lastsel = SelectedEntity;
    // // console.log(SelectedEntity)
    // // RaycastFromPlayerAsync_SetSelection();
    // SelectedEntity = RaycastFromPlayer();
    // console.log('abbb')
    // console.log(SelectedEntity)
    // console.log('baaa')
    if (lastsel != SelectedEntity && !IsEntityAPed(lastsel)) {
        switch(GAME) {
            case FIVEM:
                SetEntityDrawOutline(lastsel, false);
                break;
            default:
                Citizen.invokeNative('0x76180407', lastsel, false)
        }
        // SetEntityDrawOutline(lastsel, false);
    }

    selcoord = GetEntityCoords(SelectedEntity)
    // console.log(selcoord)
    // console.log([0, 0, 0])
    // console.log(selcoord == [0, 0, 0])
    if (selcoord[0] == 0 && selcoord[1] == 0 && selcoord[2] == 0) {  // js is weird, cuz [0, 0, 0] does not equal [0, 0, 0] according to it
        // console.log('running blank logic')
        SelectedLooping = false;
        SelectedEntity = null;  // prevent Bounding script from crashing
        return;
    }
    // console.log(SelectedEntity)

    if (!IsEntityAPed(SelectedEntity)) {
        switch(GAME) {
            case FIVEM:
                SetEntityDrawOutline(SelectedEntity, true);
                break;
            default:
                Citizen.invokeNative('0x76180407', SelectedEntity, true)
        }
        // SetEntityDrawOutline(SelectedEntity, true);
    }
}

function drawSelection() {
    if (SelectedLooping) { return; }
    SelectedLooping = true
    selInvoke("setFocus", true)
    selInvoke("toggle", true)

    const thread = setTick(() => {
        // clearTick(thread);
        if (!DoesEntityExist(SelectedEntity)) {
            SelectedLooping = false;
            SelectedEntity = null;  // prevent Bounding script from crashing... potentially. haven't run into this but, it's good practice
            // selInvoke("setFocus", false);
            // selInvoke("toggle", false); 
            selInvoke("updateText", {["twdebug"]: ([``])})
        }
        if (!SelectedLooping) { clearTick(thread); return; }
        // console.log(SelectedEntity)
        // {r=106, g=26, b=176, a=47}
        DrawEntityBoundingBox(SelectedEntity, {r:106, g:26, b:176, a:47}, 'selection')
        entity_model = GetEntityModel(SelectedEntity)
        // model_name = GetEntityArchetypeName(SelectedEntity)
        model_name = GAME == FIVEM ? GetEntityArchetypeName(SelectedEntity) : Citizen.invokeNative('0x47B870F5', SelectedEntity)
        entity_coords = GetEntityCoords(SelectedEntity)
        entity_rotation = GetEntityRotation(SelectedEntity)
        // Rotation:<br>${tab_insert}${entity_rotation[0]}<br>${tab_insert}${entity_rotation[1]}<br>${tab_insert}${entity_rotation[2]}<br>
        // GetEntityHealth(SelectedEntity).."/"..GetPedMaxHealth(SelectedEntity).." ("..GetPedArmour(SelectedEntity).." armor)".."<br>"
        entityTypeNum = GetEntityType(SelectedEntity)
        // if 
        try {  // this has errored on me before so I'm just defaulting it to -1 if it errors
            network_owner = NetworkGetEntityOwner(SelectedEntity)
        } catch (e) {
            console.log(`Error occured while trying to get network owner: ${e}`)
            network_owner = -1;
        }
        selInvoke("updateText", {
            ["twdebug"]: ([`
                <div class='tooltip'><span class='tooltip-text'>
                    ${SelectedEntity}: <br>${tab_insert}${model_name} / ${entity_model}<br>
                    Coordinates:<br>${tab_insert}${entity_coords[0]}<br>${tab_insert}${entity_coords[1]}<br>${tab_insert}${entity_coords[2]}<br>
                    Entity Type: ${entityTypes[entityTypeNum]} (${entityTypeNum})<br>
                    ${IsEntityAVehicle(SelectedEntity) ? `Vehicle:<br>
                        ${tab_insert}Health:<br>
                        ${GetVehicleClass(SelectedEntity) == 15 ? `
                            ${tab_insert}${tab_insert}Main Rotor: ${GetHeliMainRotorHealth(SelectedEntity)}<br>
                            ${tab_insert}${tab_insert}Tail Rotor: ${GetHeliTailRotorHealth(SelectedEntity)}<br>
                            ${tab_insert}${tab_insert}Tail Boom: ${GetHeliTailBoomHealth(SelectedEntity)}<br>` : ''}
                        ${tab_insert}${tab_insert}Engine: ${GetVehicleEngineHealth(SelectedEntity)}<br>
                        ${tab_insert}${tab_insert}Body: ${GetVehicleBodyHealth(SelectedEntity)}<br>
                        ${tab_insert}${tab_insert}Tank: ${GetVehiclePetrolTankHealth(SelectedEntity)}<br>
                        ${tab_insert}${tab_insert}Tires: ${exports.twiliCore.GetCombinedWheelHealth(SelectedEntity)}<br>
                        ${tab_insert}Temp: ${GetVehicleEngineTemperature(SelectedEntity)}<br>
                        ${tab_insert}Oil: ${GetVehicleOilLevel(SelectedEntity)}<br>
                        ${tab_insert}RPM: ${GetVehicleCurrentRpm(SelectedEntity)}<br>
                        ${tab_insert}Dirt: ${GetVehicleDirtLevel(SelectedEntity)}<br>
                        ${tab_insert}Fuel: ${GetVehicleFuelLevel(SelectedEntity)}<br>
                        ` : ''}
                    ${IsEntityAPed(SelectedEntity) ? `Pedestrian:<br>
                        ${tab_insert}Health: ${GetEntityHealth(SelectedEntity)}/${GetPedMaxHealth(SelectedEntity)} ${GAME == FIVEM ? `(${GetPedArmour(SelectedEntity)} armor)`: ''}<br>
                        ${tab_insert}PopType: ${GetEntityPopulationType(SelectedEntity)}<br>` : ''}
                    ${!IsEntityAVehicle(SelectedEntity) && !IsEntityAPed(SelectedEntity) ? `Health: ${GetEntityHealth(SelectedEntity)}<br>` : ''}
                    Network Owner: ${GetPlayerName(network_owner)} (${GetPlayerServerId(network_owner)})
                </span></div>
            `])
        })
    })
}

function selInvoke(_type, data) {
	SendNUIMessage({
		callback: {
			type: _type,
			data: data,
		},
	})
}

exports('selInvoke', selInvoke);