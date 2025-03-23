import { Formula } from "@/data/Formulas";
import { FormulaProduce, PriceItem } from "@/interfaces/formula-page";
import { Box, Typography } from "@mui/material";

export interface ProfitInfoProps {
  formulaOfLevel: Formula;
  consumesPrimary: FormulaProduce[];
  findBuyPrice: (product: string) => PriceItem | null;
  findSellPrice: (product: string) => PriceItem | null;
}

export default function ProfitInfo(props: ProfitInfoProps) {
  const { formulaOfLevel, consumesPrimary, findBuyPrice, findSellPrice } = props;

  const sell = findSellPrice(formulaOfLevel.produce.product);
  if (!sell) {
    return <></>;
  }

  // materials buy price
  const consumesPrimaryPrice = Math.round(
    consumesPrimary.reduce((acc, item) => {
      const buy = findBuyPrice(item.product);
      if (buy) {
        const { price } = buy;
        return acc + price * item.num;
      } else {
        console.warn(`no buy price for ${item.product}`);
        return acc;
      }
    }, 0)
  );

  // sell price
  const { price: sellPrice } = sell;

  // profit
  const profit = Math.round(sellPrice * formulaOfLevel.produce.num) - consumesPrimaryPrice;
  const singleProfit = Math.round(profit / formulaOfLevel.produce.num);

  // extra produces profit
  const extraProducesAvg =
    (formulaOfLevel.extraProduces.chance * (formulaOfLevel.extraProduces.max + formulaOfLevel.extraProduces.min)) / 2;
  const extraProducesProfit = Math.round(extraProducesAvg * sellPrice);
  const totalProfit = profit + extraProducesProfit;

  return (
    <Box className="my-2">
      <Typography>원자재 가격 : {consumesPrimaryPrice}</Typography>
      <Box className="my-1">
        <Typography>이익 : {totalProfit}</Typography>
        <Typography className="ml-4">고정 생산 이익 : {profit}</Typography>
        <Typography className="ml-4">추가 생산 기대 이익 : {extraProducesProfit}</Typography>
        <Typography>단일 이익 : {singleProfit}</Typography>
        <Typography>추가 생산 기대 이익 : {extraProducesProfit}</Typography>
      </Box>
    </Box>
  );
}
