import { GetPricesProducts } from "@/interfaces/get-prices";
import { PlayerConfig } from "@/interfaces/player-config";
import { getBargainSummary } from "@/utils/bargain-utils";
import { calculateRouteCycleV2 } from "@/utils/route-cycle-utils-v2";
import { calculateGeneralProfitIndex } from "@/utils/route-page-utils";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import React, { useMemo, useState } from "react";
import NumberInput from "../number-input";

interface RouteCycleTabProps {
  playerConfig: PlayerConfig;
  prices: GetPricesProducts;
}

export default function RouteCycleTab(props: RouteCycleTabProps) {
  const { playerConfig, prices } = props;

  /* states */
  // route cycle inputs
  const [maxBargainCount, setMaxBargainCount] = useState(3);
  const [maxRaiseCount, setMaxRaiseCount] = useState(3);
  const [maxRestockCount, setMaxRestockCount] = useState(3);
  const routeCycleInputs = useMemo(() => {
    return {
      maxBargainCount,
      maxRaiseCount,
      maxRestockCount,
    };
  }, [maxBargainCount, maxRaiseCount, maxRestockCount]);

  /* calculation */
  const bargainSummery = useMemo(
    () => getBargainSummary(playerConfig.roles, playerConfig.tradeLevel),
    [playerConfig.roles, playerConfig.tradeLevel]
  );

  const routeCycleV2 = useMemo(() => {
    try {
      return calculateRouteCycleV2(
        prices,
        playerConfig.maxLot,
        playerConfig.roles,
        playerConfig.prestige,
        playerConfig.productUnlockStatus,
        playerConfig.events,
        bargainSummery,
        routeCycleInputs
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [
    prices,
    playerConfig.maxLot,
    playerConfig.roles,
    playerConfig.prestige,
    playerConfig.productUnlockStatus,
    playerConfig.events,
    bargainSummery,
    routeCycleInputs,
  ]);

  const v2Stats = useMemo(() => {
    if (!routeCycleV2 || !routeCycleV2.length) {
      return null;
    }

    const cities = routeCycleV2.map((route) => route.fromCity);

    const totalProfit = routeCycleV2.reduce((acc, route) => acc + route.graphItem.profit, 0);
    const totalFatigue = routeCycleV2.reduce((acc, route) => acc + route.graphItem.totalFatigue, 0);
    const totalRestock = routeCycleV2.reduce((acc, route) => acc + route.graphItem.restock, 0);
    const totalBargain = routeCycleV2.reduce((acc, route) => acc + route.graphItem.bargainCount, 0);
    const totalRaise = routeCycleV2.reduce((acc, route) => acc + route.graphItem.raiseCount, 0);
    const profitPerFatigue = Math.round(totalProfit / totalFatigue);
    const generalProfitIndex = calculateGeneralProfitIndex(totalProfit, totalFatigue, totalRestock);

    return {
      cities,
      totalProfit,
      totalFatigue,
      totalRestock,
      totalBargain,
      totalRaise,
      profitPerFatigue,
      generalProfitIndex,
    };
  }, [routeCycleV2]);

  const nb = (number: number) => Number(number.toFixed(2));

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-2xl mx-auto my-4 w-full box-border">
        <div className="flex flex-col">
          <Typography className="py-1">다중 정거장 순환 경로 추천.</Typography>
          <Typography className="py-1">개발 중.</Typography>
          <Typography className="py-1">개인화 설정에서 협상 생활 기술이 계산에 포함됩니다.</Typography>
          <Typography className="py-1">협상 성공 여부가 무작위 이벤트이므로, 계산된 이익과 피로도는 기대값입니다.</Typography>
          <Typography className="py-1">
            계산된 협상 횟수는 최고 기대 이익을 달성할 수 있는 횟수이며, 실제 운영 시에는 상황에 따라 협상 지속 여부를 판단하시기 바랍니다.
          </Typography>
        </div>
      </div>

      <Paper
        className="p-6 max-sm:px-0 max-w-4xl mx-auto my-4 w-full box-border"
        sx={{
          "& .MuiFormControl-root": {
            width: "10rem",
            margin: "0.5rem",
          },
        }}
      >
        <NumberInput
          className=""
          label="편도 협상 횟수 제한"
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          type="integer"
          value={maxBargainCount}
          setValue={setMaxBargainCount}
        />
        <NumberInput
          className=""
          label="편도 가격 인상 횟수 제한"
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          type="integer"
          value={maxRaiseCount}
          setValue={setMaxRaiseCount}
        />
        <NumberInput
          className=""
          label="편도 재고 보충 횟수 제한"
          min={0}
          max={5}
          step={1}
          defaultValue={0}
          type="integer"
          value={maxRestockCount}
          setValue={setMaxRestockCount}
        />

        {routeCycleV2 && routeCycleV2.length > 1 && v2Stats && (
          <Box>
            <Typography>
              경로:
              {v2Stats.cities.map((c) => {
                return (
                  <React.Fragment key={`route-city-name${c}`}>
                    {c} <RouteOutlinedIcon className="mx-2" />
                  </React.Fragment>
                );
              })}
              {v2Stats.cities[0]}
            </Typography>
            <Typography>예상 총 이익: {v2Stats.totalProfit}</Typography>
            <Typography>예상 총 피로도: {nb(v2Stats.totalFatigue)}</Typography>
            <Typography>피로도 당 이익: {v2Stats.profitPerFatigue}</Typography>
            <Typography>종합 기준 이익: {v2Stats.generalProfitIndex}</Typography>
            <Typography>총 필요 보충서: {v2Stats.totalRestock}</Typography>
            {/* <Typography>总砍价次数：{v2Stats.totalBargain}</Typography>
            <Typography>总抬价次数：{v2Stats.totalRaise}</Typography> */}
            {routeCycleV2.map((route) => {
              const { fromCity, toCity, graphItem } = route;
              const {
                bargainCount,
                bargainTotalFagigue,
                buys,
                generalProfitIndex,
                profit,
                profitPerFatigue,
                raiseCount,
                raiseTotalFatigue,
                restock,
                routeFatigue,
                totalFatigue,
                bargainExpectedRate,
                raiseExpectedRate,
              } = graphItem;

              return (
                <Box key={`route-cycle-${fromCity}-${toCity}`} className="my-4">
                  <Typography>
                    {fromCity} <RouteOutlinedIcon className="mx-2" /> {toCity}
                  </Typography>
                  <Typography>이익: {profit}</Typography>
                  <Typography>
                    피로도: {nb(totalFatigue)} (경로 {routeFatigue} + 인하 {nb(bargainTotalFagigue)} + 인상{" "}
                    {nb(raiseTotalFatigue)})
                  </Typography>
                  <Typography>단위 피로도 이익: {profitPerFatigue}</Typography>
                  <Typography>종합 참고 이익: {generalProfitIndex}</Typography>
                  <Typography>보충 횟수: {restock}</Typography>
                  <Typography>
                    인하 횟수: {bargainCount} (피로도: {nb(bargainTotalFagigue)}) (기대치: {nb(bargainExpectedRate * 100)}%)
                  </Typography>
                  <Typography>
                    인상 횟수: {raiseCount} (피로도: {nb(raiseTotalFatigue)}) (기대치: {nb(raiseExpectedRate * 100)}%)
                  </Typography>
                  <Typography>
                    구매: &nbsp;
                    {buys
                      .map((buy) => {
                        return buy.pdtName + " (" + buy.lot + ")";
                      })
                      .join(", ")}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* display bargain summery */}
      <Paper>
        <Typography>개인화된 협상 요약</Typography>
        <Typography>인하률: {bargainSummery?.bargainRate}</Typography>
        <Typography>인상률: {bargainSummery?.raiseRate}</Typography>
        <Typography>생활 기술 제공:</Typography>
        <Typography>인하 횟수: {bargainSummery?.skillBargainCount}</Typography>
        <Typography>인상 횟수: {bargainSummery?.skillRaiseCount}</Typography>
        <Typography>인하률: {bargainSummery?.skillBargainRate}</Typography>
        <Typography>인상률: {bargainSummery?.skillRaiseRate}</Typography>
        <Typography>인하 성공률: {bargainSummery?.skillBargainSuccessRate}</Typography>
        <Typography>인상 성공률: {bargainSummery?.skillRaiseSuccessRate}</Typography>
        <Typography>첫 시도 성공률: {bargainSummery?.skillFirstTrySuccessRate}</Typography>
        <Typography>실패 후 성공률: {bargainSummery?.skillAfterFailedSuccessRate}</Typography>
        <Typography>실패 후 감소 피로도: {bargainSummery?.skillAfterFailedLessFatigue}</Typography>
      </Paper>
    </>
  );
}
