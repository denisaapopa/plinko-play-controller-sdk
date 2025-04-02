import { Currency } from "@enigma-lake/zoot-platform-sdk";

import PlayAmountControl from "../PlayController/PlayController";
import { usePlayController } from "../../hooks/usePlayController";
import Button from "../Button";

import styles_button from "../Button/Button.module.scss";
import { useCallback, useEffect, useMemo } from "react";
import { GAME_MODE } from "../../../types";

const ManualPlayController = () => {
  const {
    currentCurrency,
    currencies,
    playAmount,
    minPlayAmount,
    maxPlayAmount,
    isValidPlayAmount,
    adjustPlayAmount,
    onChangeAmount,
    onBlurAmount,
    manualPlay: { isDisabled, onPlay },
    overlayPlayButton,
    isButtonPressed,
  } = usePlayController();

  const roleButton = GAME_MODE.MANUAL;
  const activeClassName = useMemo(() => {
    const scBtn = `${[styles_button["buttonSweeps__active"]]}`;
    const gcBtn = `${[styles_button["buttonGold__active"]]}`;

    return currentCurrency === Currency.GOLD ? gcBtn : scBtn;
  }, [currentCurrency]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();
        const role = `role-${roleButton}-button`;
        const button = document.querySelector(
          `[data-role=${role}]`,
        ) as HTMLButtonElement;

        if (button && !isDisabled()) {
          if (!button.classList.contains(activeClassName)) {
            button.classList.add(activeClassName);
          }
          button.click();
        }
      }
    },
    [activeClassName, isDisabled, currentCurrency, onPlay, roleButton],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();

        const role = `role-${roleButton}-button`;
        const button = document.querySelector(
          `[data-role=${role}]`,
        ) as HTMLButtonElement;

        if (button && button.classList.contains(activeClassName)) {
          button.classList.remove(activeClassName);
        }
      }
    },
    [activeClassName, currentCurrency, roleButton],
  );

  useEffect(() => {
    const role = `role-${GAME_MODE.MANUAL}-button`;
    const button = document.querySelector(
      `[data-role=${role}]`,
    ) as HTMLButtonElement;

    if (!button) {
      return;
    }

    button.classList.toggle(activeClassName, isButtonPressed);
  }, [isButtonPressed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKeyPress, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [currentCurrency]);

  return (
    <>
      <PlayAmountControl
        playAmount={playAmount}
        minPlayAmount={minPlayAmount}
        maxPlayAmount={maxPlayAmount}
        isDisabled={isDisabled}
        adjustPlayAmount={adjustPlayAmount}
        onChangeAmount={onChangeAmount}
        onBlurAmount={onBlurAmount}
        currentCurrency={currentCurrency}
        currencies={currencies}
      />

      {overlayPlayButton && isDisabled() ? (
        <Button className={styles_button.buttonOverride}>
          {overlayPlayButton()}
        </Button>
      ) : (
        <Button
          disabled={isDisabled() || !isValidPlayAmount}
          className={
            currentCurrency === Currency.GOLD
              ? styles_button.buttonGold
              : styles_button.buttonSweeps
          }
          onClick={onPlay}
          roleType={roleButton}
        >
          Play now
        </Button>
      )}
    </>
  );
};

export default ManualPlayController;
