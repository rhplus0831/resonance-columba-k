import { Formula } from "@/data/Formulas";
import { Typography } from "@mui/material";
import Image from "next/image";
import { Fragment } from "react";
import FatigueIcon from "../icons/FatigueIcon";
import 콘덴싱_코어Src from "/public/engine-cores/콘덴싱 코어.png";
import 잔향_코어Src from "/public/engine-cores/잔향 코어.png";
import 용광로_코어Src from "/public/engine-cores/용광로 코어.png";
import 음에너지_코어Src from "/public/engine-cores/음에너지 코어.png";
import 과부하_코어Src from "/public/engine-cores/과부하 코어.png";

export interface FormulaOfLevelHeadProps {
  formulaOfLevel: Formula;
  formulaOfLevelIndex: number;
  produceName: string;
}

export default function FormulaOfLevelHead(props: FormulaOfLevelHeadProps) {
  const { formulaOfLevel, formulaOfLevelIndex, produceName } = props;
  const cores = ["과부하_코어", "용광로_코어", "콘덴싱_코어", "음에너지_코어", "잔향_코어"] as const;
  const coreSrcs = {
    과부하_코어: 과부하_코어Src,
    용광로_코어: 용광로_코어Src,
    콘덴싱_코어: 콘덴싱_코어Src,
    음에너지_코어: 음에너지_코어Src,
    잔향_코어: 잔향_코어Src,
  };

  return (
    <Typography>
      <span className="align-middle pr-4">{formulaOfLevel.formulaLevel}级</span>
      <span className="align-middle pr-4">
        <FatigueIcon className="align-middle mr-1" />
        <span className="align-middle">{formulaOfLevel.fatigue}</span>
      </span>
      <span>
        {cores.map((core) => {
          const condition = (formulaOfLevel.unlockCondition as any)[core] as number;
          const key = `${produceName}-${formulaOfLevelIndex}-core-${core}`;
          if (condition > 1) {
            return (
              <Fragment key={key}>
                <Image src={coreSrcs[core]} alt={core} width={24} height={24} className="align-middle" />
                <span className="align-middle pl-1 pr-2">Lv{condition}</span>
              </Fragment>
            );
          }
          return <Fragment key={key}></Fragment>;
        })}
      </span>
    </Typography>
  );
}
