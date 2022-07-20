import { oxmysql as MySQL } from "@overextended/oxmysql";
import {
  GetPlayer,
  GetPlayers,
  CreateVehicle,
  GetVehicleFromNetId,
} from "@overextended/ox_core/server";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  const players = GetPlayers(true);
  const player = players[0];

  if (!player) return;

  console.log(player);
  player.setGroup("police", getRandomInt(0, 5));

  const group = player.getGroup("police");
  console.log(player.source, "police grade:", group);

  const discord = player.get("discord");
  console.log(discord);

  console.log(player.getCoords(true));
})();

RegisterCommand(
  "getveh",
  async (source: number) => {
    const player = source > 0 && GetPlayer(source);
    const vehicleId = <number>(
      await MySQL.scalar("SELECT id FROM vehicles WHERE owner = ? LIMIT 1", [
        player ? player.charid : 1,
      ])
    );
    if (!vehicleId) return;

    const coords = player ? player.getCoords(true) : [0, 0, 0];

    const vehicle = await CreateVehicle(
      vehicleId,
      [coords[0], coords[1] + 3.0, coords[2] + 1.0],
      player ? GetEntityHeading(player.ped) : 90
    );

    if (!vehicle) return;

    console.log(vehicle);
    console.log(vehicle.getCoords());
  },
  false
);

onNet(
  "saveProperties",
  function (netid: number, data: Record<string, unknown>) {
    const vehicle = GetVehicleFromNetId(netid);
    vehicle.set("properties", data);
    vehicle.store("wat");
  }
);
