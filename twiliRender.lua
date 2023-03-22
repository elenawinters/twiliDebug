RegisterCommand('twiliset', function(source, args)
    Settings[args[1]] = not Settings[args[1]]
    TriggerEvent('chat:addMessage', {
        color = { 255, 0, 0},
        multiline = true,
        args = {"twiliDebug", tostring(args[1])..' is now equal to '..tostring(Settings[args[1]])}
    })
    renderDebug()
end, false)


-- heli engine. white smoke below 900, cutting out below 600, gray smoke below 500 (use 400 for display, or dont include), failure below 200
-- aero vehicles in general: 900 yellow, 600 orange, 300 red, 200 black
-- https://github.com/TomGrobbe/vMenu/blob/master/vMenu/FunctionsController.cs
-- https://github.com/TomGrobbe/vMenu/blob/master/vMenu/CommonFunctions.cs
-- https://forum.cfx.re/t/how-to-use-colors-in-lua-scripting/458
-- cars and motorcycles: hiss & smoke below 400, sputtering below 300, engine degradation (delayed) below 100, fire below 0, explosion below 0 if moving
-- TODO: DO BOATS AND SUBMARINES

HealthValues = {  -- always y, o, r, m for this struct
    air = {y=900, o=600, r=300, m=200},
    land = {y=400, o=300, r=100, m=0}  -- boats also use this
  }

IsRendering = false

function renderDebug()
    if IsRendering == true then
        return
    end
    Citizen.CreateThread(function ()
        IsRendering = true
        while IsRendering == true do
            local posIndex = 1
            local scheduleTerminate = true
            for key, value in pairs(Settings) do
                if value == true then
                    scheduleTerminate = false
                end
            end
            if scheduleTerminate == true then
                IsRendering = false
                return
            end

            -- ['fInitialDriveForce'] = 1.5,
            -- ['fDriveInertia'] = 5,
            -- ['fInitialDriveMaxFlatVel'] = 178
            for key, value in pairs(Settings) do
                if value == true then
                    if key == 'veh_handling' then
                        local veh = GetVehiclePedIsIn(PlayerPedId(), false)
                        for i, field in ipairs({'fInitialDriveForce', 'fDriveInertia', 'fInitialDriveMaxFlatVel' }) do
                            DrawTextOnScreen(string.rep("~n~", posIndex) .. field .. ': ' .. GetVehicleHandlingFloat(veh, 'CHandlingData', field), 0.5, 0.0, {r=255, g=255, b=255, a=255})
                            posIndex = posIndex + 1
                        end
                    elseif key == 'render_peds' then
                        local entities = GetGamePool('CPed')
                        for i = 1, #entities do
                            local position = GetEntityCoords(entities[i])
                            local onScreen, _x, _y = GetScreenCoordFromWorldCoord(position.x, position.y, position.z)
                            if onScreen then
                                DrawEntityBoundingBox(entities[i], {r=50, g=255, b=50, a=47})
                                if Settings['render_text'] and IsEntityInRangeOfPlayer(entities[i]) then
                                    -- SetDrawOrigin(position.x, position.y, position.z, 0)
                                    DrawTextOnScreen(
                                        entities[i].."~n~"..
                                        GetEntityHealth(entities[i]).."/"..
                                        GetPedMaxHealth(entities[i]).."~n~"..
                                        GetEntityPopulationType(entities[i]), _x, _y)
                                end
                            end
                        end
                    elseif key == 'render_objects' then
                        local entities = GetGamePool('CObject')
                        for i = 1, #entities do
                            DrawEntityBoundingBox(entities[i], {r=255, g=0, b=0, a=47})
                            if Settings['render_text'] then
                                local position = GetEntityCoords(entities[i])
                                local onScreen, _x, _y = GetScreenCoordFromWorldCoord(position.x, position.y, position.z)
                                if onScreen and IsEntityInRangeOfPlayer(entities[i]) then
                                    -- SetDrawOrigin(position.x, position.y, position.z, 0)
                                    -- DrawTextOnScreen(entities[i].."~n~"..GetEntityModel(entities[i]).."~n~"..position, 0.0, 0.0)
                                    DrawTextOnScreen(
                                        entities[i].."~n~"..
                                        GetEntityModel(entities[i]).."~n~"..
                                        position, _x, _y, nil, 0.2)
                                end
                            end
                        end
                    elseif key == 'render_vehicles' then
                        local entities = GetGamePool('CVehicle')
                        for i = 1, #entities do
                            local position = GetEntityCoords(entities[i])
                            local onScreen, _x, _y = GetScreenCoordFromWorldCoord(position.x, position.y, position.z)
                            if onScreen then
                                DrawEntityBoundingBox(entities[i], {r=255, g=150, b=0, a=47})
                                if Settings['render_text'] and IsEntityInRangeOfPlayer(entities[i]) then
                                    DrawTextOnScreen(entities[i].."~n~"..
                                    GetEntityModel(entities[i]).."~n~"..
                                    position, _x, _y)
                                end
                            end
                        end
                    elseif key == 'render_pickups' then
                        local entities = GetGamePool('CPickup')
                        for i = 1, #entities do
                            local position = GetEntityCoords(entities[i])
                            local onScreen, _x, _y = GetScreenCoordFromWorldCoord(position.x, position.y, position.z)
                            if onScreen then
                                DrawEntityBoundingBox(entities[i], {r=0, g=0, b=255, a=47})
                                if Settings['render_text'] and IsEntityInRangeOfPlayer(entities[i]) then
                                    DrawTextOnScreen(
                                        entities[i].."~n~"..
                                        GetEntityModel(entities[i]).."~n~"..
                                        position, _x, _y)
                                end
                            end
                        end
                    end
                end
            end

            Citizen.Wait(0)
        end
    end)
    print('Render thread has started.')
end
