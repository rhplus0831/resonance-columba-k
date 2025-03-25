import { CITIES, CityName } from "@/data/Cities";
import { PlayerConfig } from "@/interfaces/player-config";
import { CityGroupedExchanges } from "@/interfaces/route-page";
import { getBestRoutesByNumberOfBuyingProductTypes } from "@/utils/route-page-utils";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo, useState } from "react";

export interface RouteSelectionTabProps {
  playerConfig: PlayerConfig;
  cityGroupedExchangesAllTargetCities: CityGroupedExchanges;
}

export default function RouteSelectionTab(props: RouteSelectionTabProps) {
  /* props */
  const { playerConfig, cityGroupedExchangesAllTargetCities } = props;

  /* states */
  const [selectedCityForReco, setSelectedCityForReco] = useState<CityName>("any");

  /* calculation */
  const detailedRecommendations = useMemo(() => {
    const results = [];
    for (let i = 1; i <= 7; i++) {
      results.push(
        getBestRoutesByNumberOfBuyingProductTypes(
          selectedCityForReco,
          i,
          cityGroupedExchangesAllTargetCities,
          playerConfig
        )
      );
    }
    return results;
  }, [cityGroupedExchangesAllTargetCities, playerConfig, selectedCityForReco]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-2xl mx-auto my-4 w-full box-border">
        <div className="flex justify-between items-center mb-4">
          <Typography component="h3">
          출발 도시를 선택하면 해당 도시에서 출발하는 가장 좋은 경로를 볼 수 있으며, 전체를 돌아볼 때 가장 좋은 경로를 보려면 아무거나 선택하세요.
          </Typography>
        </div>
        <div className="flex flex-col">
          <Typography className="py-1">개인 설정을 입력해야 합니다.</Typography>
          <Typography className="py-1">구매하는 상품 종류가 많을수록 필요한 보충서는 적어지지만, 일반적으로 이익도 낮아집니다.</Typography>
          <Typography className="py-1">
            알고리즘은 그래프와는 다른 방식으로 보충서를 사용합니다. 낭비를 방지하기 위해 모든 보충 상품을 구매할 수 있음을 확인한 후에만 보충서를 사용하고, 마지막으로 다음 수익 순위의 상품으로 창고를 채웁니다.
          </Typography>
        </div>
      </div>

      <Box className="m-4">
        <FormControl fullWidth>
          <InputLabel id="select-source-city-for-reco-lebel">시작 도시</InputLabel>
          <Select
            labelId="select-source-city-for-reco-lebel"
            id="select-source-city-for-reco"
            value={selectedCityForReco}
            label="시작 도시"
            size="small"
            onChange={(e) => setSelectedCityForReco(e.target.value as CityName)}
          >
            {CITIES.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
            <MenuItem key="any" value="any">
              도시 선택
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {detailedRecommendations
        .slice()
        .reverse()
        .map((exchangesCombination, index) => {
          return (
            exchangesCombination.length > 0 && (
              <Box key={`recomendation-${index}`} className="m-4">
                <Typography>구매 필요 물품 {detailedRecommendations.length - index}개</Typography>
                <Box className="m-4 max-sm:mx-0">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>시작 도시</TableCell>
                          <TableCell>도착 도시</TableCell>
                          <TableCell>누적 이익</TableCell>
                          <TableCell>보충 횟수</TableCell>
                          <TableCell>구매한 상품</TableCell>
                          <TableCell>구매 가능한 상품</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {exchangesCombination
                          .slice(0, 3) // only show top 3
                          .map((row, index) => (
                            <TableRow
                              key={`recommendation-${index}-${row.fromCity}-${row.toCity}-option-${index}`}
                              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              <TableCell>{row.fromCity}</TableCell>
                              <TableCell>{row.toCity}</TableCell>
                              <TableCell>{row.profitOfCombination}</TableCell>
                              <TableCell>{row.restockCount}</TableCell>
                              <TableCell>
                                {row.choosenExchanges
                                  .filter((exchange) => !exchange.isForFillCargo)
                                  .map((exchange) => exchange.product)
                                  .join(", ")}
                              </TableCell>
                              <TableCell>
                                {row.choosenExchanges
                                  .filter((exchange) => exchange.isForFillCargo)
                                  .map((exchange) => exchange.product)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )
          );
        })}
    </>
  );
}
