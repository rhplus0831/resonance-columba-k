import { ResonanceSkill } from "@/interfaces/role-skill";

type GameEvent = ResonanceSkill & {
  name: string;
  description?: string;
  playConfigurable: boolean;
  taxVariation: {
    product?: {
      [key: string]: number; // ex: 홍차: -5 for -5% tax
    };
    city?: {
      [key: string]: number;
    };
  };
};

export const EVENTS: GameEvent[] = [
  // 홍차 전쟁 2024/03/21 - 2024/04/11(CN)
  // 홍차 전쟁 2024/07/30 - 2024/08/20(CN)
  // 홍차 전쟁 영구
  {
    name: "홍차 전쟁",
    description: "홍차 구매 수량 +50%, 홍차 세율 -5%",
    playConfigurable: true,
    buyMore: {
      product: {
        홍차: 50,
      },
    },
    taxVariation: {
      product: {
        홍차: -0.05,
      },
    },
  },
];
