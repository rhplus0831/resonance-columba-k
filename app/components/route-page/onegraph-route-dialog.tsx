import { CityName } from "@/data/Cities";
import { PRODUCTS } from "@/data/Products";
import { OneGraphRouteDialogProps, OnegraphBuyCombinationStats } from "@/interfaces/route-page";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import { Box, Chip } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

interface DisplayData {
  profit: number;
  fatigue: number;
  profitPerFatigue: number;
  buyProducts: React.JSX.Element[];
  profitOrder: React.JSX.Element[];
  usedLot: number;
  restockCount: number;
  generalProfitIndex: number;
  isWastingRestock: boolean;
  lastNotWastingRestock: number;
}

export default function OneGraphRouteDialog(props: OneGraphRouteDialogProps) {
  const { open, setOpen, data } = props;
  if (!data) {
    return null;
  }

  const { stats, playerConfig, fromCity, toCity } = data;
  const { simpleGo: simpleGoData, goAndReturn: goAndReturnData, goAndReturnTotal: goAndReturnTotalData } = stats;
  const { bargain, returnBargain } = playerConfig;
  const { bargainFatigue: bargainFatigueGo, raiseFatigue: raiseFatigueGo, disabled: goBargainDisabled } = bargain;
  const { bargainFatigue: bargainFatigueRt, raiseFatigue: raiseFatigueRt, disabled: rtBargainDisabled } = returnBargain;
  const bargainFatigueTotalGo = goBargainDisabled ? 0 : (bargainFatigueGo ?? 0) + (raiseFatigueGo ?? 0);
  const bargainFatigueTotalRt = rtBargainDisabled ? 0 : (bargainFatigueRt ?? 0) + (raiseFatigueRt ?? 0);
  const bargainFatigueTotal = bargainFatigueTotalGo + bargainFatigueTotalRt;
  const goAndReturn = playerConfig.onegraph.goAndReturn;

  const buildDisplayData = (stats: OnegraphBuyCombinationStats, city: CityName): DisplayData => {
    // display products ordered base on profit
    const profitOrder = stats.combinations.map((c) => (
      <span key={`profitorder-${c.name}`} className="mx-1">
        {c.name}
      </span>
    ));

    // display products orderd base on in-game order
    const buyProducts = stats.combinations
      // find the basePrice of the product
      .map((c) => {
        const basePrice = PRODUCTS.find((p) => p.name === c.name)?.buyPrices?.[city] ?? 0;
        return {
          basePrice,
          ...c,
        };
      })
      // sort by basePrice, to make it has the same order in game, instead of sorted by profit
      .sort((a, b) => b.basePrice - a.basePrice)
      // map to name for display
      .map((c) => {
        const { name, buyLot, availableLot } = c;
        const chipText = buyLot < availableLot ? `(买${buyLot} / 总${availableLot})` : buyLot;
        const BuyNumberChip = <Chip label={chipText} size="small" className="mx-1" />;

        return (
          <span key={`buyproducts-${name}`} className="mx-1 inline-flex items-center">
            {name}
            {BuyNumberChip}
          </span>
        );
      });
    return {
      profit: stats.profit,
      fatigue: stats.fatigue,
      profitPerFatigue: stats.profitPerFatigue,
      generalProfitIndex: stats.generalProfitIndex,
      buyProducts,
      profitOrder,
      usedLot: stats.usedLot,
      restockCount: stats.restock,
      isWastingRestock: stats.lastNotWastingRestock !== stats.restock,
      lastNotWastingRestock: stats.lastNotWastingRestock,
    } as DisplayData;
  };

  const goDisplayData = buildDisplayData(goAndReturn ? goAndReturnData[0] : simpleGoData, fromCity);
  const returnDisplayData = goAndReturn ? buildDisplayData(goAndReturnData[1], toCity) : undefined;
  const totalDisplayData = (() => {
    if (!goAndReturn) {
      return undefined;
    }
    const { profit, fatigue, profitPerFatigue, generalProfitIndex, restock } = goAndReturnTotalData;
    return {
      profit,
      fatigue,
      profitPerFatigue,
      generalProfitIndex,
      restockCount: restock,
    };
  })();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog fullWidth={true} maxWidth="xl" open={open} onClose={handleClose}>
        <DialogTitle className="flex items-center">
          {fromCity} <RouteOutlinedIcon className="px-4 text-6xl" /> {toCity}
        </DialogTitle>
        <DialogContent>
          <Box className="m-8">
            <DialogContentText>이익 : {goDisplayData.profit}</DialogContentText>
            <DialogContentText>주문서 소모 : {goDisplayData.restockCount}</DialogContentText>
            {goDisplayData.isWastingRestock && (
              <DialogContentText className="text-red-500">
                주문서 과잉! 재고가 낭비됩니다. {goDisplayData.lastNotWastingRestock}개 이상 사용 후 더 이상 수익이 발생하지 않습니다.
              </DialogContentText>
            )}
            <DialogContentText component="div">구매 상품 : {goDisplayData.buyProducts}</DialogContentText>
            <DialogContentText>고이익 상품 : {goDisplayData.profitOrder}</DialogContentText>
            <DialogContentText>필요 화물칸 : {goDisplayData.usedLot}</DialogContentText>
            <DialogContentText>
              피로도 :{goDisplayData.fatigue}
              {bargainFatigueTotalGo > 0 ? ` (议价占${bargainFatigueTotalGo})` : ""}
            </DialogContentText>
            <DialogContentText>이익/피로도 비율 : {goDisplayData.profitPerFatigue}</DialogContentText>
            {goDisplayData.restockCount > 0 && (
              <DialogContentText>综合参考利润：{goDisplayData.generalProfitIndex}</DialogContentText>
            )}
          </Box>
          {goAndReturn && returnDisplayData && (
            <>
              <Box className="m-8">
                <DialogContentText>귀환 이익: {returnDisplayData.profit}</DialogContentText>
                <DialogContentText>귀환 주문서 소모: {returnDisplayData.restockCount}</DialogContentText>
                {returnDisplayData.isWastingRestock && (
                  <DialogContentText className="text-red-500">
                    주문서 과잉! 재고가 낭비됩니다. {returnDisplayData.lastNotWastingRestock}개 이상 사용 후 더 이상 수익이 발생하지 않습니다.
                  </DialogContentText>
                )}
                <DialogContentText component="div">구매 상품: {returnDisplayData.buyProducts}</DialogContentText>
                <DialogContentText>고이익 상품: {returnDisplayData.profitOrder}</DialogContentText>
                <DialogContentText>필요 화물칸: {returnDisplayData.usedLot}</DialogContentText>
                <DialogContentText>
                  귀환 피로도: {returnDisplayData.fatigue}
                  {bargainFatigueTotalRt > 0 ? ` (흥정 ${bargainFatigueTotalRt})` : ""}
                </DialogContentText>
                <DialogContentText>귀환 이익/피로도 비율: {returnDisplayData.profitPerFatigue}</DialogContentText>
                {returnDisplayData.restockCount > 0 && (
                  <DialogContentText>귀환 종합 참고 이익: {returnDisplayData.generalProfitIndex}</DialogContentText>
                )}
              </Box>
              <Box className="m-8">
                <DialogContentText>총 이익: {totalDisplayData!.profit}</DialogContentText>
                <DialogContentText>총 주문서 소모: {totalDisplayData!.restockCount}</DialogContentText>
                <DialogContentText>
                  총 피로도: {totalDisplayData!.fatigue}
                  {bargainFatigueTotal > 0 ? ` (흥정 ${bargainFatigueTotal})` : ""}
                </DialogContentText>
                <DialogContentText>
                  총 이익/피로도 비율: 
                  {totalDisplayData!.profitPerFatigue}
                </DialogContentText>
                {totalDisplayData!.generalProfitIndex > 0 && (
                  <DialogContentText>
                    총 종합 참고 이익: 
                    {totalDisplayData!.generalProfitIndex}
                  </DialogContentText>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
