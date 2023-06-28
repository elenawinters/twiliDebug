let IsRendering = false

RegisterCommand('twiliset', (source, args) => {
    if (!Object.keys(Renderers).includes(args[0]) && !Object.keys(Settings).includes(args[0])) { return; }
    let result = null
    if (Object.keys(Renderers).includes(args[0])) { Renderers[args[0]] = !Renderers[args[0]]; result = Renderers[args[0]]}
    if (Object.keys(Settings).includes(args[0])) { Settings[args[0]] = !Settings[args[0]]; result = Settings[args[0]] }
    // console.log('here?')
    console.log(Renderers)
    // Settings[args[0]] = !Settings[args[0]];
    TriggerEvent('chat:addMessage', {
        color: [255, 0, 0],
        multiline: true,
        args: {"twiliDebug": `{${args[0]} is now equal to ${result}`}
    });
    renderDebug();
});


function renderDebug() {
    if (IsRendering) { return; }
    IsRendering = true;
    const thread = setTick(() => {
        if (Object.values(Renderers).every(v => v === false)) { IsRendering = false; clearTick(thread); }
        // console.log('test')
        Object.entries(Renderers).forEach((entry) => {
            const [renderer, status] = entry
            if (!status) { return; }
            if (renderer == 'render_peds') {
                Object.values(GetGamePool('CPed')).forEach((entity) => {
                    let position = GetEntityCoords(entity);
                    let [onScreen, _x, _y] = GetScreenCoordFromWorldCoord(position[0], position[1], position[2])
                    if (!onScreen) { return; }
                    DrawEntityBoundingBox(entity, {r:50, g:255, b:50, a:47})
                    if (!Settings.render_text || !IsEntityInRangeOfPlayer(entity)) { return; }
                    DrawTextOnScreen(`${entity}~n~${GetEntityArchetypeName(entity)}~n~${GetEntityHealth(entity)}/${GetPedMaxHealth(entity)}~n~${GetEntityPopulationType(entity)}`, _x, _y)
                })
            } else if (renderer == 'render_objects') {
                Object.values(GetGamePool('CObject')).forEach((entity) => {
                    let position = GetEntityCoords(entity);
                    let [onScreen, _x, _y] = GetScreenCoordFromWorldCoord(position[0], position[1], position[2])
                    if (!onScreen) { return; }
                    DrawEntityBoundingBox(entity, {r:255, g:0, b:0, a:47})
                    if (!Settings.render_text || !IsEntityInRangeOfPlayer(entity, 50)) { return; }
                    DrawTextOnScreen(`${entity}~n~${GetEntityArchetypeName(entity)}~n~${GetEntityModel(entity)}~n~${position}`, _x, _y, null, 0.2)

                })
            } else if (renderer == 'render_vehicles') {
                Object.values(GetGamePool('CVehicle')).forEach((entity) => {
                    let position = GetEntityCoords(entity);
                    let [onScreen, _x, _y] = GetScreenCoordFromWorldCoord(position[0], position[1], position[2])
                    if (!onScreen) { return; }
                    DrawEntityBoundingBox(entity, {r:255, g:150, b:0, a:47})
                    if (!Settings.render_text || !IsEntityInRangeOfPlayer(entity)) { return; }
                    DrawTextOnScreen(`${entity}~n~${GetEntityArchetypeName(entity)}~n~${GetEntityModel(entity)}~n~${position}`, _x, _y)

                })
            } else if (renderer == 'render_pickups') {
                Object.values(GetGamePool('CPickup')).forEach((entity) => {
                    let position = GetEntityCoords(entity);
                    let [onScreen, _x, _y] = GetScreenCoordFromWorldCoord(position[0], position[1], position[2])
                    if (!onScreen) { return; }
                    DrawEntityBoundingBox(entity, {r:0, g:0, b:255, a:47})
                    if (!Settings.render_text || !IsEntityInRangeOfPlayer(entity)) { return; }
                    DrawTextOnScreen(`${entity}~n~${GetEntityArchetypeName(entity)}~n~${GetEntityModel(entity)}~n~${position}`, _x, _y)

                })
            }
        })
    })
}