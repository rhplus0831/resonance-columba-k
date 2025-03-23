import { CITY_WITH_PRESTIGE, CityName } from "@/data/Cities";
import { PlayerConfig } from "@/interfaces/player-config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import { SetStateAction } from "react";
import BargainInputs from "../bargain-inputs";
import GameEventConfigPanel from "../game-event-config-panel";
import NumberInput from "../number-input";
import ProductUnlockSelect from "../product-unlock-select";
import RoleSkillSelects from "../role-skill-selects";
import SyncPlayerConfigPanel from "../sync-player-config-panel";

interface PlayerConfigTabProps {
  playerConfig: PlayerConfig;
  onPlayerConfigChange: (field: string, value: any) => void;
  setPlayerConfig: (updater: SetStateAction<PlayerConfig>) => void;
  setRoleResonance: (role: string, resonance: number) => void;
  setProductUnlock: (newConfig: { [pdtName: string]: boolean }) => void;
  uploadPlayerConfig: (config: PlayerConfig) => Promise<boolean>;
  downloadPlayerConfig: (nanoid: string) => Promise<boolean>;
  onGoBargainChange: (field: string, value: number) => void;
  setGameEvent: (eventName: string, activated: boolean) => void;
}

export default function PlayerConfigTab(props: PlayerConfigTabProps) {
  const {
    playerConfig,
    onPlayerConfigChange,
    setPlayerConfig,
    onGoBargainChange,
    setRoleResonance,
    setProductUnlock,
    downloadPlayerConfig,
    uploadPlayerConfig,
    setGameEvent,
  } = props;

  const onPrestigeChange = (city: CityName, value: number) => {
    if (!isNaN(value)) {
      onPlayerConfigChange("prestige", { ...playerConfig.prestige, [city]: value });
    }
  };

  return (
    <Paper
      className="p-6 max-sm:px-0 max-w-4xl mx-auto my-4 w-full box-border"
      sx={{
        "& .MuiFormControl-root": {
          width: "10rem",
          margin: "0.5rem",
        },
      }}
    >
      <Box className="m-4">
        <Typography className="p-2">무역 설정</Typography>
        <NumberInput
          label="화물칸 크기"
          min={100}
          max={3000}
          defaultValue={500}
          type="integer"
          value={playerConfig.maxLot}
          setValue={(newValue) => onPlayerConfigChange("maxLot", newValue)}
        />
        <NumberInput
          label="무역 레벨"
          min={1}
          max={99}
          defaultValue={10}
          type="integer"
          value={playerConfig.tradeLevel}
          setValue={(newValue) => onPlayerConfigChange("tradeLevel", newValue)}
        />
      </Box>

      <Box className="m-4">
        <Typography className="p-2">
          평판 레벨 : 세금과 티켓당 구매한 상품의 양에 영향을 미칩니다. 현재는 레벨 8 이상만 지원합니다. 하위 도시의 평판은 주요 도시의 평판을 따릅니다.
        </Typography>
        {CITY_WITH_PRESTIGE.map((city) => (
          <NumberInput
            key={"prestige-input" + city}
            label={city}
            min={1}
            max={20}
            defaultValue={1}
            type="integer"
            value={playerConfig.prestige[city]}
            setValue={(newValue) => onPrestigeChange(city, newValue)}
          />
        ))}
      </Box>

      <Box className="m-4">
        <Typography className="p-2">협상</Typography>
        <BargainInputs barginConfig={playerConfig.bargain} onBargainChange={onGoBargainChange} />
      </Box>

      <Box className="m-4">
        <Typography className="p-2">유닛 공명</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}></AccordionSummary>
          <AccordionDetails className="p-0">
            <RoleSkillSelects playerConfig={playerConfig} setRoleResonance={setRoleResonance} />
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className="m-4">
        <Typography className="p-2">물품 해금</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}></AccordionSummary>
          <AccordionDetails className="p-0">
            <ProductUnlockSelect playerConfig={playerConfig} setProductUnlock={setProductUnlock} />
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className="m-4">
        <Typography className="p-2">글로벌 이벤트</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}></AccordionSummary>
          <AccordionDetails className="p-0">
            <GameEventConfigPanel playerConfig={playerConfig} setGameEvent={setGameEvent} />
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className="m-4">
        <Typography className="p-2">데이터 동기화</Typography>
        <SyncPlayerConfigPanel
          playerConfig={playerConfig}
          setPlayerConfig={setPlayerConfig}
          downloadPlayerConfig={downloadPlayerConfig}
          uploadPlayerConfig={uploadPlayerConfig}
        />
      </Box>
    </Paper>
  );
}
