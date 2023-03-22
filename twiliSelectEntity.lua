local SelectedLooping = false
SelectedEntity = nil
local CursorLooping = false
local Cursor = false

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
    print('Key pressed')
    selectEntity()
end, false)

RegisterCommand('-selectentity', function()
    return
end, false)

function selectEntity()
    SelectedEntity = RaycastFromPlayerAsync()
    if GetEntityCoords(SelectedEntity) == vector3(0, 0, 0) then
        SelectedLooping = false
        return
    end
    if SelectedLooping then
        return
    end
    print(SelectedEntity)
    print(GetEntityCoords(SelectedEntity))
    print(GetEntityModel(SelectedEntity))
    Citizen.CreateThread(function ()
        SelectedLooping = true
        while SelectedLooping do
            if SelectedEntity == nil then
                SelectedLooping = false
                return
            end
            DrawEntityBoundingBox(SelectedEntity, {r=106, g=26, b=176, a=47}, 'selection')
            Citizen.Wait(0)
        end
    end)
end

