

function test_weather_transition()
    local w1 = 0
    local w2 = 0
    local wp = 0.0

    w1, w2, wp = GetWeatherTypeTransition(w1, w2, wp)

    print(w1)
    print(w2)
    print(wp)

end

RegisterCommand('wtest', function(source, args)
    test_weather_transition()
end, false)

RegisterCommand('htest', function(source, args)
    print(GetHashKey(args[1]))
end, false)