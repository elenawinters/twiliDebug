let IsRendering = false

RegisterCommand('twiliset', (source, args) => {
    if (!Settings.includes(args[0])) { return; }
    Settings[args[0]] = !Settings[args[0]];
    TriggerEvent('chat:addMessage', {
        color: [255, 0, 0],
        multiline: true,
        args: {"twiliDebug": `{${args[0]} is now equal to ${Settings[args[0]]}}`}
    });
    renderDebug();
});


function renderDebug() {
    if (IsRendering) { return; }
    IsRendering = true;
    const thread = setTick(() => {
        if (!IsRendering) { return; }
    })
}