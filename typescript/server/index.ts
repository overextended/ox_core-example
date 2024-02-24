import { oxmysql as MySQL } from "@overextended/oxmysql";
import {
  GetPlayer,
  GetPlayers,
  GetVehicleFromNetId,
  SpawnVehicle,
} from "@overextended/ox_core/server";
import { sleep } from "@overextended/ox_lib";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  // Get an array containing all players as instances of OxPlayer.
  const players = Object.values(GetPlayers());

  // Get the first entry.
  const player = players[0];

  if (player) {
    // Print the object, containing basic data about their player and active character.
    console.log(player);

    // Set 'police' to a random grade.
    player.setGroup("police", getRandomInt(0, 5));

    // Get the new grade and print it.
    const group = player.getGroup("police");
    console.log(player.source, "police grade:", group);

    // Retrieve the player's gender. These values are stored separately from the standard 'player' object.
    const gender = player.get("gender");
    console.log(gender);
  }
})();

(async () => {
  // Get an object containing all players in the police or sheriff groups, with grade 3 or higher.
  const players = GetPlayers({
    groups: { sheriff: 3, police: 3 },
  });

  console.log('cops', players);
})();

RegisterCommand(
  "getveh",
  async (source: number) => {
    const player = source > 0 && GetPlayer(source);
    if (!player) return;

    // Fetch a vehicle owned by the player from the database.
    const vehicleId = <number>(
      await MySQL.scalar(
        "SELECT id FROM vehicles WHERE owner = ? AND stored IS NOT NULL LIMIT 1",
        [player.charId]
      )
    );

    if (vehicleId) {
      const coords = player.getCoords();

      // Spawn it
      const vehicle = await SpawnVehicle(
        vehicleId,
        [coords[0], coords[1] + 3.0, coords[2] + 1.0],
        GetEntityHeading(player.ped)
      );

      if (vehicle) {
        // Print the vehicle object.
        console.log(vehicle);
        console.log(vehicle.getCoords());

        await sleep(200);

        SetPedIntoVehicle(player.ped, vehicle.entity, -1);
      }
    }
  },
  false
);

onNet(
  "saveProperties",
  function (netId: number, data: Record<string, unknown>) {
    console.log(netId);
    const vehicle = GetVehicleFromNetId(netId);
    if (!vehicle) return;

    vehicle.set("properties", data);
    vehicle.setStored("impound", true);
  }
);
