
RegisterCommand('pedpop', function(source, args)
    SetPedPopulationBudget(args[1])
    ForceCleanup()
end, false)

