
RegisterCommand('turnonthelights', (source, args) => {
    SetArtificialLightsState(false)
    SetArtificialLightsStateAffectsVehicles(false)
});


RegisterCommand('turnoffthelights', (source, args) => {
    SetArtificialLightsState(true)
    SetArtificialLightsStateAffectsVehicles(false)
});

RegisterCommand('fuckimnotafk', (source, args) => {
    DisableIdleCamera(true)
});
