local SelectedLooping = false
SelectedEntity = nil
local CursorLooping = false
local Cursor = false

SetEntityDrawOutlineShader(1)
SetEntityDrawOutlineColor(255, 255, 255, 127)
-- SetEntityDrawOutlineColor(0, 255, 0, 255)


RegisterKeyMapping('+deleteselectedentity', 'Delete selected entity', 'keyboard', 'DELETE')

RegisterCommand('+deleteselectedentity', function()
    if SelectedEntity then
        print(IsEntityAnObject(SelectedEntity))
        if IsEntityAnObject(SelectedEntity) then
            SetEntityAsMissionEntity(SelectedEntity, true, true)
            DeleteObject(SelectedEntity)
        else
            DeleteEntity(SelectedEntity)
        end
    end
end, false)

RegisterCommand('-deleteselectedentity', function()
    return
end, false)


RegisterKeyMapping('+rendercursorforselection', 'Display cursor in center of frame', 'keyboard', 'LMENU')

RegisterCommand('+rendercursorforselection', function()
    Cursor = true
    -- print("test")
    renderCursor()
end, false)

RegisterCommand('-rendercursorforselection', function()
    Cursor = false
    renderCursor()
    return
end, false)

function renderCursor()
    -- Cursor = not Cursor
    if CursorLooping then
        return
    end
    Citizen.CreateThread(function ()
        CursorLooping = true
        while CursorLooping do
            if Cursor == false then
                CursorLooping = false
                return
            end
            ShowHudComponentThisFrame(14)
            Citizen.Wait(0)
        end
    end)
end


RegisterKeyMapping('+selectentity', 'Raycast out and select an entity', 'keyboard', 'MOUSE_EXTRABTN2')

RegisterCommand('+selectentity', function()
    selectEntity()
    -- if not IsEntityAPed(SelectedEntity) then
    --     SetEntityDrawOutline(SelectedEntity, true)
    -- end
    drawSelection()
end, false)

RegisterCommand('-selectentity', function()
    return
end, false)

-- RegisterCommand('selectSelf', function()
--     SelectedEntity = PlayerPedId()
--     selectEntity()
--     drawSelection()
--     return
-- end, false)

function selectEntity()
    lastsel = SelectedEntity
    SelectedEntity = RaycastFromPlayerAsync()
    if lastsel ~= SelectedEntity then
        if not IsEntityAPed(lastsel) then
            SetEntityDrawOutline(lastsel, false)
        end
    end
    selcoord = GetEntityCoords(SelectedEntity)
    if selcoord == vector3(0, 0, 0) then
        -- if not IsEntityAPed(lastsel) then
        --     SetEntityDrawOutline(lastsel, false)
        -- end
        SelectedLooping = false
        SelectedEntity = nil  -- prevent Bounding script from crashing
        return
    end
    print(SelectedEntity)
    if not IsEntityAPed(SelectedEntity) then
        SetEntityDrawOutline(SelectedEntity, true)
    end
    -- SetEntityDrawOutline(SelectedEntity, true)
end

function drawSelection()
    Citizen.CreateThread(function ()
        if SelectedLooping == true then
            return
        end
        SelectedLooping = true
        selInvoke("setFocus", true)
        selInvoke("toggle", true)
        while SelectedLooping do
            if DoesEntityExist(SelectedEntity) == false then
                SelectedLooping = false
                SelectedEntity = nil  -- prevent Bounding script from crashing... potentially. haven't run into this but, it's good practice
                selInvoke("setFocus", false)
                selInvoke("toggle", false)
                return
            end
            -- if SelectedEntity == nil then
            --     SelectedLooping = false
            --     return
            -- end
            DrawEntityBoundingBox(SelectedEntity, {r=106, g=26, b=176, a=47}, 'selection')
            entity_model = GetEntityModel(SelectedEntity)
            model_name = GetEntityArchetypeName(SelectedEntity)
            if IsEntityAVehicle(SelectedEntity) then
                -- SendNUIMessage({
                --     hello = "world",
                --     action = "showMessage"
                -- })
                
                selInvoke("updateText", {
                    ["twdebug"] = ([[
                        <div class='tooltip'><span class='tooltip-text'>%s</span></div>
                    ]]):format(
                        SelectedEntity.."<br>"..
                        entity_model.." / "..model_name.."<br>"..
                        -- GetEntityHealth(SelectedEntity).."/"..
                        -- GetPedMaxHealth(SelectedEntity).."~n~"..
                        GetVehicleEngineTemperature(SelectedEntity).."<br>"..
                        GetVehicleOilLevel(SelectedEntity).."<br>"..
                        GetVehicleCurrentRpm(SelectedEntity).."<br>"..
                        GetVehicleDirtLevel(SelectedEntity).."<br>"..
                        "Health: "..GetEntityHealth(SelectedEntity).."<br>"..
                        -- GetEntityArchetypeName(SelectedEntity).."~n~"..
                        GetEntityCoords(SelectedEntity)),
                })
                -- DrawTextOnScreen(
                --     SelectedEntity.."~n~"..
                --     entity_model.." / "..model_name.."~n~"..
                --     -- GetEntityHealth(SelectedEntity).."/"..
                --     -- GetPedMaxHealth(SelectedEntity).."~n~"..
                --     GetVehicleEngineTemperature(SelectedEntity).."~n~"..
                --     GetVehicleCurrentRpm(SelectedEntity).."~n~"..
                --     -- GetEntityArchetypeName(SelectedEntity).."~n~"..
                --     GetEntityCoords(SelectedEntity),
                --     0.7, 0.2, nil, nil, 2, false)
            elseif IsEntityAPed(SelectedEntity) then
                selInvoke("updateText", {
                    ["twdebug"] = ([[
                        <div class='tooltip'><span class='tooltip-text'>%s</span></div>
                    ]]):format(
                        "SelectedEntity: "..SelectedEntity.."<br>"..
                    "Model: "..entity_model.." / "..model_name.."<br>"..
                    "Health: "..GetEntityHealth(SelectedEntity).."/"..GetPedMaxHealth(SelectedEntity).." ("..GetPedArmour(SelectedEntity).." armor)".."<br>"..
                    "Population Type: "..GetEntityPopulationType(SelectedEntity).."<br>"..
                    GetEntityCoords(SelectedEntity)),
                })
                -- DrawTextOnScreen(
                --     SelectedEntity.."~n~"..
                --     entity_model.." / "..model_name.."~n~"..
                --     GetEntityHealth(SelectedEntity).."/"..GetPedMaxHealth(SelectedEntity).."~n~"..
                --     GetEntityPopulationType(SelectedEntity).."~n~"..
                --     GetEntityCoords(SelectedEntity),
                --     0.7, 0.2, nil, nil, 2, false)
            else
                selInvoke("updateText", {
                    ["twdebug"] = ([[
                        <div class='tooltip'><span class='tooltip-text'>%s</span></div>
                    ]]):format(
                        SelectedEntity.."<br>"..
                        entity_model.." / "..model_name.."<br>"..
                        "Health: "..GetEntityHealth(SelectedEntity).."<br>"..
                        GetEntityCoords(SelectedEntity)),
                })
                -- DrawTextOnScreen(
                --     SelectedEntity.."~n~"..
                --     entity_model.." / "..model_name.."~n~"..
                --     GetEntityCoords(SelectedEntity), 
                --     0.7, 0.2, nil, nil, 2, false)
            end
            Citizen.Wait(0)
        end

    end)
end


function selInvoke(_type, data)
	SendNUIMessage({
		callback = {
			type = _type,
			data = data,
		},
	})
end

-- RegisterNUICallback("updateStats", function(data, cb)
-- 	cb(true)
-- 	Debugger:SetHandling(tonumber(data.key), data.value)
-- end)
