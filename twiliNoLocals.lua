if GAME == 'redm' then
    -- taken from https://github.com/stratolark/nolocals and modified
    -- notable native GetEntityPopulationType  -- scenario is type 4, ambient is type 6
    Citizen.InvokeNative(0xC6DCC2A3A8825C85, true) -- DisableAmbientRoadPopulation
    -- Citizen.InvokeNative(0x2F9AC754FE179D58, 0) -- SetPopulationBudgetMultiplier
    Citizen.CreateThread(
        function()
            while true do
                Citizen.Wait(0)
                -- Citizen.InvokeNative(0x2F9AC754FE179D58, 0) -- SetPopulationBudgetMultiplier
                Citizen.InvokeNative(0x28CB6391ACEDD9DB, 0.0) -- SetScenarioHumanDensityMultiplierThisFrame - 4
                Citizen.InvokeNative(0xBA0980B5C0A11924, 0.0) -- SetAmbientHumanDensityMultiplierThisFrame - 6
                -- Citizen.InvokeNative(0xDB48E99F8E064E56, 50.0) -- SetScenarioAnimalDensityMultiplierThisFrame
                -- Citizen.InvokeNative(0xC0258742B034DFAF, 50.0) -- SetAmbientAnimalDensityMultiplierThisFrame
            end
        end
    )
end