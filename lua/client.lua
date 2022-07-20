RegisterCommand('saveveh', function()
    if not cache.vehicle then return end

    local data = lib.getVehicleProperties(cache.vehicle)
    TriggerServerEvent('saveProperties', VehToNet(cache.vehicle), data)
end)

local function init()
    print(player.hasGroup('police'))
    print(player.getCoords(), GetEntityHeading(cache.ped))
end

RegisterNetEvent('ox:playerLoaded', init)

if player then
    CreateThread(init)
end

RegisterNetEvent('ox:playerLogout', function()
    print('logged out')
end)
