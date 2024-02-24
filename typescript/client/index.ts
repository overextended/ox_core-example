import { GetPlayer } from "@overextended/ox_core/client";
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
  const player = GetPlayer();

  if (!player.charId) return;

  console.log(player);
  console.log(player.getCoords());
  console.log(player.getGroup("police"));

  while (player.charId) {
    console.log(player.stateId);
    await new Promise((resolve) => setTimeout(resolve, 1000, null));
  }

  console.log("logged out!");
}

setImmediate(init);

onNet("ox:playerLoaded", init);

onNet("ox:playerLogout", () => console.log("logged out"));
