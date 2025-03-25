"use client";

import usePlayerConfig from "@/hooks/usePlayerConfig";
import useRouteCalculation from "@/hooks/useRouteCalculation";
import { Box, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { sendGTMEvent } from "@next/third-parties/google";
import { useContext, useState } from "react";
import DetailedSimulationTab from "../components/route-page/tabs/detailed-simulation-tab";
import OnegraphTab from "../components/route-page/tabs/onegraph-tab";
import PlayerConfigTab from "../components/route-page/tabs/player-config-tab";
import RouteCycleTab from "../components/route-page/tabs/route-cycle-tab";
import RouteSelectionTab from "../components/route-page/tabs/route-selection-tab";
import { PriceContext } from "../price-provider";

export default function RoutePage() {
  const { prices } = useContext(PriceContext);

  /* tabs */
  const [tabIndex, setTabIndex] = useState(0);
  const tabNames = ["그래프", "개인 설정", "루트 최적화", "하드코어 시물레이션", "루프 추천", "계산 원리"];
  const onTabChange = (newIndex: number) => {
    setTabIndex(newIndex);
    trackTabChange(newIndex);
  };

  /* player config */
  const {
    playerConfig,
    setPlayerConfig,
    setRoleResonance,
    setProductUnlock,
    setGameEvent,
    downloadPlayerConfig,
    uploadPlayerConfig,
  } = usePlayerConfig();

  const onPlayerConfigChange = (field: string, value: any) => {
    setPlayerConfig((prev) => ({ ...prev, [field]: value }));
  };

  const onGoBargainChange = (field: string, value: number) => {
    if (!isNaN(value)) {
      onPlayerConfigChange("bargain", { ...playerConfig.bargain, [field]: value });
    }
  };

  /* route calculation for "route selection" tab & "detailed simulation" tab */
  const {
    selectedCities,
    setSourceCities,
    setTargetCities,
    switchSourceAndTargetCities,
    cityGroupedExchangesAllTargetCities,
    cityGroupedExchangesSelectedTargetCities,
  } = useRouteCalculation({ playerConfig, prices });

  /* tracking */
  const trackTabChange = (index: number) => {
    sendGTMEvent({ event: "route_page_tab_change", label: tabNames[index] });
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={(_e: React.SyntheticEvent, newIndex: number) => onTabChange(newIndex)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {tabNames.map((tabName, index) => (
            <Tab label={tabName} key={`tab-${index}`} />
          ))}
        </Tabs>
      </Box>

      {/* 그래프 */}
      <div role="tabpanel" hidden={tabIndex !== 0}>
        <OnegraphTab
          playerConfig={playerConfig}
          onPlayerConfigChange={onPlayerConfigChange}
          onGoBargainChange={onGoBargainChange}
        />
      </div>

      {/* 개인 설정 */}
      <div role="tabpanel" hidden={tabIndex !== 1}>
        <PlayerConfigTab
          playerConfig={playerConfig}
          onPlayerConfigChange={onPlayerConfigChange}
          setPlayerConfig={setPlayerConfig}
          setRoleResonance={setRoleResonance}
          setProductUnlock={setProductUnlock}
          uploadPlayerConfig={uploadPlayerConfig}
          downloadPlayerConfig={downloadPlayerConfig}
          onGoBargainChange={onGoBargainChange}
          setGameEvent={setGameEvent}
        />
      </div>

      {/* 루트 최적화 */}
      <div role="tabpanel" hidden={tabIndex !== 2}>
        <RouteSelectionTab
          playerConfig={playerConfig}
          cityGroupedExchangesAllTargetCities={cityGroupedExchangesAllTargetCities}
        />
      </div>

      {/* 详细模拟 */}
      <div role="tabpanel" hidden={tabIndex !== 3}>
        <DetailedSimulationTab
          selectedCities={selectedCities}
          setSourceCities={setSourceCities}
          setTargetCities={setTargetCities}
          switchSourceAndTargetCities={switchSourceAndTargetCities}
          cityGroupedExchangesSelectedTargetCities={cityGroupedExchangesSelectedTargetCities}
        />
      </div>

      {/* 루프 추천 */}
      <div role="tabpanel" hidden={tabIndex !== 4}>
        <RouteCycleTab playerConfig={playerConfig} prices={prices} />
      </div>

      {/* 계산 원리 */}
      <div role="tabpanel" hidden={tabIndex !== 5}>
        <div className="bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-2xl mx-auto my-4 w-full box-border">
          <div className="flex flex-col">
            <Typography className="py-1">구매가는 협상 후 세전 가격입니다.</Typography>
            <Typography className="py-1">판매가는 인상 후 세전 가격입니다.</Typography>
            <Typography className="py-1">이익은 세후 이익입니다.</Typography>
            <Typography className="py-1">
              이익 정렬은 단위 적재량 이익을 사용하며, 현재 단위 피로도 이익이나 단위 보충서 이익은 지원하지 않습니다.
            </Typography>
            <Typography className="py-1">
              거래소 정산 페이지에 표시되는 이익은 구매세와 판매 시 이익세를 포함하지 않지만, 알고리즘이 계산하는 이익은 세후이므로 시뮬레이션된 이익이 거래소에 표시된 이익보다 약간 낮습니다.
            </Typography>
            <Typography className="py-1">종합 참고 이익 알고리즘: 총 이익 / (총 피로도 소모 + 총 보충서 수 * 33)</Typography>
          </div>
        </div>
      </div>
    </Box>
  );
}
