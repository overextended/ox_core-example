CreateThread(function()
    -- Get a map containing all players as instances of OxPlayer.
    local players = Ox.GetPlayers()

    -- Get the next entry.
    local player = players[next(players)]

    if player then
        -- Print the table, containing basic data about their player and active character.
        print(player)

        -- Set 'police' to a random grade.
        player.setGroup('police', math.random(0, 3))

        -- Get the new grade and print it.
        local group = player.getGroup('police')
        print(player.source, 'police grade:', group)

        -- Retrieve the player's gender. These values are stored separately from the standard 'player' object.
        local gender = player.get("gender")
        print(gender)
    end
end)

CreateThread(function()
    -- Get an object containing all players in the police or sheriff groups, with grade 3 or higher.
    local players = Ox.GetPlayers({
        groups = { sheriff = 3, police = 3 }
    })

    print('cops', json.encode(players, { indent = true }))
end)

RegisterCommand('getveh', function(source)
    local player = Ox.GetPlayer(source)
    if not player then return end

    -- Fetch a vehicle owned by the player from the database.
    local vehicleId = MySQL.scalar.await("SELECT id FROM vehicles WHERE owner = ? AND stored IS NOT NULL LIMIT 1",
        { player.charId })

    print('veh', vehicleId, player)

    if vehicleId then
        local coords = player.getCoords()

        -- Spawn it
        local vehicle = Ox.SpawnVehicle(
            vehicleId,
            { coords.x, coords.y + 3.0, coords.z + 1.0 },
            GetEntityHeading(player.ped)
        )

        if vehicle then
            -- Print the vehicle object.
            print(vehicle)
            print(vehicle.getCoords())

            Wait(200)

            SetPedIntoVehicle(player.ped, vehicle.entity, -1)
        end
    end
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
