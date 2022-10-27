import { player } from "@overextended/ox_core/client";
import { notify, cache, onCache } from "@overextended/ox_lib/client";

onCache("vehicle", (value: number) => {
  notify({
    title: "Updated vehicle cache",
    description: `${cache.vehicle} updated to ${value}`,
    type: "inform",
    icon: "car",
  });
});

RegisterCommand(
  "saveveh",
  () => {
    if (!cache.vehicle) return;

    const data = exports.ox_lib.getVehicleProperties(cache.vehicle);
    TriggerServerEvent("saveProperties", VehToNet(cache.vehicle), data);
  },
  false
);

async function init() {
  console.log(player);
  console.log(player.hasGroup("police"));
  console.log(player.getCoords(), GetEntityHeading(player.getPed()));

  while (player) await new Promise((resolve) => setTimeout(resolve, 0));

  console.log("logged out!");  
}

onNet("ox:playerLoaded", init);

if (player) init();

onNet("ox:playerLogout", () => {
  console.log("logged out");
});
