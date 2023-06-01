let SelectedLooping = false
let SelectedEntity = null
let CursorLooping = false
let Cursor = false

// Deletion Logic
RegisterKeyMapping('+twiliDebug:deleteSelection', 'Delete selected entity', 'keyboard', 'DELETE')

RegisterCommand('+twiliDebug:deleteSelection', (source, args) => {
    if (!SelectedEntity) { return; }
    console.log(IsEntityAnObject(SelectedEntity));
    if (IsEntityAnObject(SelectedEntity)) {
        SetEntityAsMissionEntity(SelectedEntity, true, true);
    }
    DeleteEntity(SelectedEntity)
});

RegisterCommand('+twiliDebug:deleteSelection', (source, args) => { return; });


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
    SelectedEntity = RaycastFromPlayerAsync();
    // console.log('abbb')
    // console.log(SelectedEntity)
    // console.log('baaa')
    if (lastsel != SelectedEntity && !IsEntityAPed(lastsel)) {
        SetEntityDrawOutline(lastsel, false);
    }

    selcoord = GetEntityCoords(SelectedEntity)
    if (selcoord == [0, 0, 0]) {
        SelectedLooping = false;
        SelectedEntity = null;  // prevent Bounding script from crashing
        return;
    }

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
        if (!DoesEntityExist(SelectedEntity)) {
            SelectedLooping = false;
            SelectedEntity = null;  // prevent Bounding script from crashing... potentially. haven't run into this but, it's good practice
            selInvoke("setFocus", false);
            selInvoke("toggle", false); }
        if (!SelectedLooping) { clearTick(thread); }

        DrawEntityBoundingBox(SelectedEntity, {r:106, g:26, b:176, a:47}, 'selection')
        entity_model = GetEntityModel(SelectedEntity)
        model_name = GetEntityArchetypeName(SelectedEntity)
        if (IsEntityAVehicle(SelectedEntity)) {
            selInvoke("updateText", {
                ["twdebug"]: ([`
                    <div class='tooltip'><span class='tooltip-text'>
                        ${SelectedEntity}<br>

                    </span></div>
                `])
            })
        }
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