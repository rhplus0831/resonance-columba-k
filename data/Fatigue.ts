import { Fatigue } from "@/interfaces/fatigue";
import { PlayerConfigRoles } from "@/interfaces/player-config";
import { CITY_FATIGUES } from "resonance-data-columba-k/dist/columbabuild";

const FATIGUES: Fatigue[] = CITY_FATIGUES;

export const findFatigue = (fromCity: string, toCity: string, playerConfigRoles: PlayerConfigRoles): number => {
  let fatigue = FATIGUES.find((f) => f.cities.includes(fromCity) && f.cities.includes(toCity))?.fatigue ?? 0;
  if (fatigue === 0) {
    return fatigue;
  }

  // find if player has resonance level 1 BO-X
  if (playerConfigRoles["BO-X"]?.resonance === 1) {
    fatigue -= 1;
  }

  return fatigue;
};
