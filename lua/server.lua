CreateThread(function()
    -- Get an array containing all players, and apply metamethods.
    local players = Ox.GetPlayers()

    -- Get the first entry
    local player = players[1]

    if player then
        -- Print the table, containing their identity, ids, phone number, etc.
        print(json.encode(player, { indent = true }))

        -- Set 'police' to a random grade.
        player.setGroup('police', math.random(0, 3))

        -- Get the new grade and print it.
        local group = player.getGroup('police')
        print(player.source, 'police grade:', group)

        -- Retrieve all player metadata. These values are stored separately from the standard 'player' table.
        local data = player.get()
        print(json.encode(data, { indent = true }))

        -- Retrieve the player's discord id from metadata.
        local discord = player.get('discord')
        print(json.encode(discord, { indent = true }))

        -- This can create a new persistent vehicle, owned by the player.
        -- local vehicle = Ox.CreateVehicle({
        --     model = 'sultanrs',
        --     owner = player.charid,
        -- }, player.getCoords(), GetEntityHeading(player.ped))
    end
end)

CreateThread(function()
    -- Get an array containing all players in the police or sheriff groups, with grade 3 or higher.
    local players = Ox.GetPlayers({
        groups = {['sheriff'] = 3, ['police'] = 3}
    })

    print(json.encode(players, { indent = true }))
end)

RegisterCommand('getveh', function(source)
    local player = Ox.GetPlayer(source)
    if not player then return end

    -- Fetch a vehicle owned by the player from the database.
    CreateThread(function()
        local vehicleId = MySQL.scalar.await('SELECT id FROM vehicles WHERE owner = ? AND stored IS NOT NULL LIMIT 1', { player.charId, })

        if vehicleId then
            local coords = player.getCoords()

            -- Spawn it
            local vehicle = Ox.CreateVehicle(vehicleId, vector3(coords.x, coords.y + 3.0, coords.z + 1.0),
                GetEntityHeading(player.ped))

            if vehicle then
                -- Print the vehicle table.
                print(json.encode(vehicle, { indent = true }))

                -- Print the vehicle metadata.
                print(json.encode(vehicle.get(), { indent = true }))

                print(vehicle.getCoords())

            end
        end
    end)
end)

RegisterNetEvent('saveProperties', function(netid, data)
    local vehicle = Ox.GetVehicleFromNetId(netid)
    if not vehicle then return end

    vehicle.set('properties', data)
    vehicle.setStored('impound', true)
end)


SetInterval(function()
    local player = Ox.GetPlayers()[1]

    if player then
        -- Set a random number for the "test" metadata property, and replicate to client.
        player.set('test', math.random(1, 100), true)
    end
end, 1000)