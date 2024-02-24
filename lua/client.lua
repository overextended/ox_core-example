---@param value number
lib.onCache('vehicle', function(value)
    lib.notify({
        title = 'Updated vehicle cache',
        description = ('%s updated to %s'):format(cache.vehicle, value),
        type = 'info',
        icon = 'car',
    })
end)

RegisterCommand('saveveh', function()
    if not cache.vehicle then return end

    local data = lib.getVehicleProperties(cache.vehicle)
    TriggerServerEvent('saveProperties', VehToNet(cache.vehicle), data)
end)

local function init()
    local player = Ox.GetPlayer()

    if not player.charId then return end

    print(player)
    print(player.getCoords())
    print(player.getGroup("police"))

    while player.charId do
        print(player.stateId)
        Wait(1000)
    end

    print('logged out!')
end

CreateThread(init)

RegisterNetEvent('ox:playerLoaded', init)

RegisterNetEvent('ox:playerLogout', function()
    print('logged out')
end)
