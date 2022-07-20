import { player } from "@overextended/ox_core/client";

RegisterCommand(
  "saveveh",
  () => {
    const vehicle = GetVehiclePedIsIn(player.getPed(), false);
    if (!vehicle) return;

    const data = exports.ox_lib.getVehicleProperties(vehicle);
    TriggerServerEvent("saveProperties", VehToNet(vehicle), data);
  },
  false
);

async function init() {
  console.log(player);
  console.log(player.hasGroup("police"));
  console.log(player.getCoords(), GetEntityHeading(player.getPed()));
}

onNet("ox:playerLoaded", init);

if (player) init();

onNet("ox:playerLogout", () => {
  console.log("logged out");
});
