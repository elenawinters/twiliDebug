let SelectedLooping = false
let SelectedEntity = null
let CursorLooping = false
let Cursor = false

const tab_insert = '&nbsp;&nbsp;&nbsp;&nbsp;'

// Deletion Logic
RegisterKeyMapping('+twiliDebug:deleteSelection', 'Delete selected entity', 'keyboard', 'DELETE')

RegisterCommand('+twiliDebug:deleteSelection', (source, args) => {
    if (!SelectedEntity) { return; }
    if (IsEntityAnObject(SelectedEntity)) {
        SetEntityAsMissionEntity(SelectedEntity, true, true);
    }
    DeleteEntity(SelectedEntity)
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

RegisterKeyMapping('+twiliDebug:renderCursor', 'Display cursor in center of frame', 'keyboard', 'LMENU')

RegisterCommand('+twiliDebug:renderCursor', (source, args) => {
    Cursor = true
    renderCursor()
});

RegisterCommand('-twiliDebug:renderCursor', (source, args) => {
    Cursor = false
    renderCursor()
});


// Selection Logic
RegisterKeyMapping('+twiliDebug:selectEntity', 'Raycast out and select an entity', 'keyboard', 'MOUSE_EXTRABTN2')

RegisterCommand('+twiliDebug:selectEntity', (source, args) => {
    selectEntity()
    drawSelection()
});

RegisterCommand('-twiliDebug:selectEntity', (source, args) => { return; });


function selectEntity() {
    lastsel = SelectedEntity;
    // console.log(SelectedEntity)
    // RaycastFromPlayerAsync_SetSelection();
    SelectedEntity = RaycastFromPlayer();
    // console.log('abbb')
    // console.log(SelectedEntity)
    // console.log('baaa')
    if (lastsel != SelectedEntity && !IsEntityAPed(lastsel)) {
        SetEntityDrawOutline(lastsel, false);
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
        SetEntityDrawOutline(SelectedEntity, true);
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
            selInvoke("setFocus", false);
            selInvoke("toggle", false); }
        if (!SelectedLooping) { clearTick(thread); }
        // console.log(SelectedEntity)

        DrawEntityBoundingBox(SelectedEntity, {r:106, g:26, b:176, a:47}, 'selection')
        entity_model = GetEntityModel(SelectedEntity)
        model_name = GetEntityArchetypeName(SelectedEntity)
        entity_coords = GetEntityCoords(SelectedEntity)
        entity_rotation = GetEntityRotation(SelectedEntity)
        // Rotation:<br>${tab_insert}${entity_rotation[0]}<br>${tab_insert}${entity_rotation[1]}<br>${tab_insert}${entity_rotation[2]}<br>
        selInvoke("updateText", {
            ["twdebug"]: ([`
                <div class='tooltip'><span class='tooltip-text'>
                    ${SelectedEntity}: <br>${tab_insert}${model_name} / ${entity_model}<br>
                    Coordinates:<br>${tab_insert}${entity_coords[0]}<br>${tab_insert}${entity_coords[1]}<br>${tab_insert}${entity_coords[2]}<br>
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