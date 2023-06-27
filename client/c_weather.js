let weatherDebug = false
RegisterCommand('wtestdebug', (source, args) => {
    weatherDebug = !weatherDebug
    wtestdebug()
});

RegisterCommand('flash', (source, args) => {
    ForceLightningFlash();
});

typelist = [
    'BLIZARD', 'CLEAR', 'CLEARING', 'CLOUDS', 'EXTRASUNNY', 'FOGGY', 'HALLOWEEN',
    'NEUTRAL', 'OVERCAST', 'RAIN', 'SMOG', 'SNOW', 'SNOWLIGHT', 'THUNDER', 'XMAS'
]

wtypes = {}

typelist.forEach((val) => {
    wtypes[GetHashKey(val)] = val
})


function wtestdebug() {
    selInvoke("toggle", true)
    const thread = setTick(() => {
        if (!weatherDebug) { clearTick(thread); }
        const [w1, w2, wp] = GetWeatherTypeTransition()
        selInvoke("updateText", {
            ["twdebug2"]: ([`
                <div class='tooltip2'><span class='tooltip2-text'>
                    ${wtypes[w1]} -> ${wp}% -> ${wtypes[w2]}
                </span></div>
            `])
        })
    })
}