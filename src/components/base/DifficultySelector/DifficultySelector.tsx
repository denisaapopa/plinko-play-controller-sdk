import { useRef } from "react";
import { PlaySettingsProps } from "../../../types/playController";
import style_difficulty from "./DifficultySelector.module.scss";
import Selector from "./Selector";
import { RiskTypes, SELECTORS } from "./types";

const DifficultySelector = ({
  playOptions,
  dropdownConfig,
}: {
  playOptions: PlaySettingsProps;
  dropdownConfig: {
    bgColorHex: string;
    borderConfig: {
      [RiskTypes.LOW]: string;
      [RiskTypes.MEDIUM]: string;
      [RiskTypes.HIGH]: string;
    };
  };
}) => {
  const {
    rows,
    risks,
    disabledMenu,
    currentRisk,
    currentRow,
    onRiskChange,
    onRowNumberChange,
  } = playOptions;
  const borderStyle = useRef(dropdownConfig.borderConfig[RiskTypes.LOW]);

  function onRiskSelected(value: RiskTypes) {
    borderStyle.current = dropdownConfig.borderConfig[value];
    onRiskChange(value);
  }
  return (
    <div className={style_difficulty.base}>
      <Selector<RiskTypes>
        currentValue={currentRisk}
        label={SELECTORS.RISK}
        values={risks}
        onSelect={onRiskSelected}
        disabled={disabledMenu}
        borderColor={borderStyle.current}
      />
      <Selector<number>
        currentValue={currentRow}
        label={SELECTORS.ROWS}
        values={rows}
        onSelect={onRowNumberChange}
        disabled={disabledMenu}
        borderColor={borderStyle.current}
      />
    </div>
  );
};

export default DifficultySelector;
