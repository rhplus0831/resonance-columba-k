import { ROLE_RESONANCE_SKILLS } from "@/data/RoleResonanceSkills";
import { PlayerConfig } from "@/interfaces/player-config";
import { ResonanceSkill } from "@/interfaces/role-skill";
import { roleImages } from "@/utils/role-image-utils";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Avatar, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Image from "next/image";

import type { JSX } from "react";

interface RoleSkillSelectsProps {
  playerConfig: PlayerConfig;
  setRoleResonance: (role: string, resonance: number) => void;
}

export default function RoleSkillSelects(props: RoleSkillSelectsProps) {
  const { playerConfig, setRoleResonance } = props;
  const { roles: playerRoles } = playerConfig;

  const handleResonanceLevelClick = (role: string, resonance: number) => {
    setRoleResonance(role, resonance);
  };

  const renderSkillText = (roleSkill: ResonanceSkill) => {
    const block = (keyPrefix: string, text: string): JSX.Element => (
      <span key={keyPrefix} className="mx-auto block text-center pt-1 max-sm:min-w-24">
        {text}
      </span>
    );

    const texts: any = [];

    const pdtSkill = roleSkill?.buyMore?.product;
    if (pdtSkill) {
      Object.entries(pdtSkill).map(([pdt, percent]) => {
        texts.push(block(`roleskilltext-pdt-${pdt}`, `${pdt}+${percent}%`));
      });
    }

    const citySkill = roleSkill?.buyMore?.city;
    if (citySkill) {
      Object.entries(citySkill).map(([city, percent]) => {
        texts.push(block(`roleskilltext-city-${city}`, `${city} 특산품 +${percent}%`));
      });
    }

    const allSkill = roleSkill?.buyMore?.all;
    if (allSkill) {
      texts.push(block("roleskilltext-all", `모든 거래품 +${allSkill}%`));
    }

    const bargainSkills = roleSkill?.bargain;
    if (bargainSkills) {
      const {
        firstTrySuccessRate,
        afterFailedSuccessRate,
        bargainCount,
        bargainSuccessRate,
        bargainRate,
        raiseCount,
        raiseSuccessRate,
        raiseRate,
        afterFailedLessFatigue,
      } = bargainSkills;

      if (firstTrySuccessRate) {
        texts.push(block("roleskilltext-firstTrySuccessRate", `첫 흥정 성공률 +${firstTrySuccessRate}%`));
      }

      if (afterFailedSuccessRate) {
        texts.push(block("roleskilltext-afterFailedSuccessRate", `흥정 실패 후 다음 성공률 +${afterFailedSuccessRate}%`));
      }

      if (bargainCount) {
        texts.push(block("roleskilltext-bargainCount", `가격 인하 횟수 +${bargainCount}`));
      }

      if (bargainSuccessRate) {
        texts.push(block("roleskilltext-bargainSuccessRate", `가격 인하 성공률 +${bargainSuccessRate}%`));
      }

      if (bargainRate) {
        texts.push(block("roleskilltext-bargainRate", `가격 인하 폭 +${bargainRate}%`));
      }

      if (raiseCount) {
        texts.push(block("roleskilltext-raiseCount", `가격 인상 횟수 +${raiseCount}`));
      }

      if (raiseSuccessRate) {
        texts.push(block("roleskilltext-raiseSuccessRate", `가격 인상 성공률 +${raiseSuccessRate}%`));
      }

      if (raiseRate) {
        texts.push(block("roleskilltext-raiseRate", `가격 인상 폭 +${raiseRate}%`));
      }

      if (afterFailedLessFatigue) {
        texts.push(block("roleskilltext-afterFailedLessFatigue", `흥정 실패 시 피로도 증가 -${afterFailedLessFatigue}`));
      }
    }

    const taxCutSkill = roleSkill?.taxCut;
    if (taxCutSkill) {
      const cityTaxCut = taxCutSkill.city;
      if (cityTaxCut) {
        Object.entries(cityTaxCut).map(([city, percentValue]) => {
          const percent = percentValue * 100;
          texts.push(block(`roleskilltext-taxCut-${city}`, `${city} 세율${percent}%`));
        });
      }
    }

    const otherSkills = roleSkill?.other;
    if (otherSkills) {
      const { driveLessFatigue } = otherSkills;
      if (driveLessFatigue) {
        texts.push(block("roleskilltext-driveLessFatigue", `운행 피로도-${driveLessFatigue}`));
      }
    }

    return texts;
  };

  // table of role skills per resonance level
  return (
    <Box>
      <TableContainer className="w-full bg-white dark:bg-gray-800 max-w-6xl mx-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">승무원</TableCell>
              {[0, 1, 4, 5].map((resonance) => (
                <TableCell key={`resonance-${resonance}`} align="center">
                  공명{resonance}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(ROLE_RESONANCE_SKILLS).map(([role, resonanceSkills]) => (
              <TableRow key={`role-${role}`}>
                <TableCell scope="row" className="max-sm:p-1">
                  <Avatar className="mx-auto">
                    <Image src={roleImages[role.replace(" ", "_").replace("-", "_")]} alt={role.replace(" ", "_").replace("-", "_")} width={40} height={40} />
                  </Avatar>
                  <span className="mx-auto block text-center pt-2">{role}</span>
                </TableCell>
                <TableCell scope="row" className="max-sm:p-1">
                  <Button
                    startIcon={(playerRoles?.[role]?.resonance ?? 0) === 0 ? <CheckBoxIcon /> : null}
                    onClick={() => handleResonanceLevelClick(role, 0)}
                    className="h-16"
                  >
                    없음
                  </Button>
                </TableCell>

                {[1, 4, 5].map((resonanceLevel) => {
                  const key = `resonance-${role}-${resonanceLevel}`;
                  const roleSkills = resonanceSkills[resonanceLevel];
                  if (!roleSkills) {
                    return <TableCell key={key} align="center" className="max-sm:p-1"></TableCell>;
                  }

                  return (
                    <TableCell key={key} align="center" className="max-sm:p-1">
                      <Button
                        startIcon={(playerRoles?.[role]?.resonance ?? 0) === resonanceLevel ? <CheckBoxIcon /> : null}
                        onClick={() => handleResonanceLevelClick(role, resonanceLevel)}
                        className="h-16"
                      >
                        <Box className="flex-col">{renderSkillText(roleSkills)}</Box>
                      </Button>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
