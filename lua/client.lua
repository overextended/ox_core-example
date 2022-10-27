---@param value number
lib.onCache('vehicle', function(value)
    lib.notify({
        title = 'Updated vehicle cache',
        description = ('%s updated to %s'):format(cache.vehicle, value),
        type = 'inform',
        icon = 'car',
    })
end)

RegisterCommand('saveveh', function()
    if not cache.vehicle then return end

    local data = lib.getVehicleProperties(cache.vehicle)
    TriggerServerEvent('saveProperties', VehToNet(cache.vehicle), data)
end)

local function init()
    print(json.encode(player, { indent = true, }))
    print(player.hasGroup('police'))
    print(player.getCoords(), GetEntityHeading(cache.ped))

    while player do
        print(player.test or 'nil')
        Wait(1000)
    end

    print('logged out!')
end

RegisterNetEvent('ox:playerLoaded', init)

if player then
    CreateThread(init)
end

RegisterNetEvent('ox:playerLogout', function()
    print('logged out')
end)
