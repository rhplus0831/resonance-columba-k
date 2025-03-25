import { CITIES, CityName } from "@/data/Cities";
import { SelectedCities } from "@/interfaces/prices-table";
import { CityGroupedExchanges } from "@/interfaces/route-page";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Box, IconButton, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MultipleSelect from "../../prices-table/multiple-select";

interface DetailedSimulationTabProps {
  selectedCities: SelectedCities;
  setSourceCities: (cities: string[]) => void;
  setTargetCities: (cities: string[]) => void;
  switchSourceAndTargetCities: () => void;
  cityGroupedExchangesSelectedTargetCities: CityGroupedExchanges;
}

export default function DetailedSimulationTab(props: DetailedSimulationTabProps) {
  const {
    selectedCities,
    setSourceCities,
    setTargetCities,
    switchSourceAndTargetCities,
    cityGroupedExchangesSelectedTargetCities,
  } = props;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-2xl mx-auto my-4 w-full box-border">
        <div className="flex justify-between items-center mb-4">
          <Typography component="h3">출발 도시와 도착 도시를 하나 이상 선택해 모든 노선과 최적의 특가 조합을 확인하세요</Typography>
        </div>
        <div className="flex flex-col">
          <Typography className="py-1">개인 설정이 필요합니다.</Typography>
          <Typography className="py-1">노선에 있는 상품은 이익 순으로 정렬되어 있습니다. 첫 번째 상품은 가장 높은 이익을 가진 상품입니다.</Typography>
          <Typography className="py-1">누적 이익은 현재 상품과 그 위에 있는 모든 상품의 단품 이익의 합입니다. 누적 컨테이너 수도 마찬가지입니다.</Typography>
          <Typography className="py-1">열차장은 희망에 따라 위에서 아래로 구매할 품목을 하나 이상 선택해주세요</Typography>
        </div>
      </div>

      <Box className="m-4 flex justify-center items-center">
        <Typography>노선</Typography>
        <Box className="m-4">
          <MultipleSelect
            label="원산지"
            name="sourceCities"
            allOptions={CITIES}
            selectedOptions={selectedCities.sourceCities}
            handleChange={(selected: CityName[]) => setSourceCities(selected)}
          />
          <MultipleSelect
            label="목표 도시"
            name="targetCities"
            allOptions={CITIES}
            selectedOptions={selectedCities.targetCities}
            handleChange={(selected: CityName[]) => setTargetCities(selected)}
          />
          <IconButton onClick={switchSourceAndTargetCities} size="small">
            <SyncAltIcon />
          </IconButton>
        </Box>
      </Box>

      {Object.keys(cityGroupedExchangesSelectedTargetCities).map((fromCity) => {
        return (
          <div key={fromCity}>
            {Object.keys(cityGroupedExchangesSelectedTargetCities[fromCity]).map((toCity) => {
              return (
                <div
                  key={`table-${fromCity}-${toCity}`}
                  className="p-2 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-5xl mx-auto my-2 w-full box-border"
                >
                  <Typography className="my-4 flex items-center">
                    {fromCity}
                    <RouteOutlinedIcon className="mx-2" />
                    {toCity}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>제품</TableCell>
                          <TableCell align="right">구매가</TableCell>
                          <TableCell align="right">판매가</TableCell>
                          <TableCell align="right">단일 화물칸</TableCell>
                          <TableCell align="right">단일 이익</TableCell>
                          <TableCell align="right">단일 누적 이익</TableCell>
                          <TableCell align="right">단일 누적 화물칸</TableCell>
                          <TableCell align="right">보충 누적 이익</TableCell>
                          <TableCell align="right">보충 누적 화물칸</TableCell>
                          <TableCell align="right">보충 횟수</TableCell>
                          <TableCell align="right">피로도</TableCell>
                          <TableCell align="right">피로도당 이익</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cityGroupedExchangesSelectedTargetCities[fromCity][toCity].map((row) => (
                          <TableRow
                            key={`row-${row.product}-${row.fromCity}-${row.toCity}`}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            className={row.loss ? "line-through decoration-red-500 decoration-1" : ""}
                          >
                            <TableCell scope="row">{row.product}</TableCell>
                            <TableCell align="right">{row.buyPrice}</TableCell>
                            <TableCell align="right">{row.sellPrice}</TableCell>
                            <TableCell align="right">{row.buyLot}</TableCell>
                            <TableCell align="right">{row.lotProfit}</TableCell>
                            <TableCell align="right">{row.accumulatedProfit}</TableCell>
                            <TableCell align="right">{row.accumulatedLot}</TableCell>
                            <TableCell align="right">{row.restockAccumulatedProfit}</TableCell>
                            <TableCell align="right">{row.restockAccumulatedLot}</TableCell>
                            <TableCell align="right">{row.restockCount}</TableCell>
                            <TableCell align="right">{row.fatigue}</TableCell>
                            <TableCell align="right">{row.profitPerFatigue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
