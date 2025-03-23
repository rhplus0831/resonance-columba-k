import { PlayerConfigBargain } from "@/interfaces/player-config";
import InputAdornment from "@mui/material/InputAdornment";
import NumberInput from "./number-input";

export default function BargainInputs(props: {
  barginConfig: PlayerConfigBargain;
  onBargainChange: (field: string, value: number) => void;
  className?: string;
}) {
  const { barginConfig, onBargainChange, className } = props;
  return (
    <>
      <NumberInput
        className={className}
        label="인상"
        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
        min={0}
        max={20}
        step={0.1}
        defaultValue={0}
        type="float"
        decimalPlaces={1}
        value={barginConfig.raisePercent}
        setValue={(newValue) => onBargainChange("raisePercent", newValue)}
      />
      <NumberInput
        className={className}
        label="인상 피로도"
        min={0}
        max={100}
        defaultValue={0}
        type="integer"
        value={barginConfig.raiseFatigue}
        setValue={(newValue) => onBargainChange("raiseFatigue", newValue)}
      />
      <NumberInput
        className={className}
        label="인하"
        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
        min={0}
        step={0.1}
        max={20}
        defaultValue={0}
        type="float"
        decimalPlaces={1}
        value={barginConfig.bargainPercent}
        setValue={(newValue) => onBargainChange("bargainPercent", newValue)}
      />
      <NumberInput
        className={className}
        label="인하 피로도"
        min={0}
        max={100}
        defaultValue={0}
        type="integer"
        value={barginConfig.bargainFatigue}
        setValue={(newValue) => onBargainChange("bargainFatigue", newValue)}
      />
    </>
  );
}
