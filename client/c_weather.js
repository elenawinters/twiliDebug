let weatherDebug = false
RegisterCommand('wtestdebug', (source, args) => {
    weatherDebug = !weatherDebug
    wtestdebug()
    // if (weatherDebug) {wtestdebug()} else {selInvoke("updateText", {["twdebug2"]: ([``])})}
});

RegisterCommand('flash', (source, args) => {
    ForceLightningFlash();
});

typelist = [
    'BLIZZARD', 'CLEAR', 'CLEARING', 'CLOUDS', 'EXTRASUNNY', 'FOGGY', 'HALLOWEEN',
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
                    ${wtypes[w1]}<br>${wp*100}%<br>${wtypes[w2]}<br>
                </span></div>
            `])
        })
    })
}