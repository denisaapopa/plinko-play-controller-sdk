import { Currency } from "@enigma-lake/zoot-platform-sdk";

import { usePlayController } from "../../hooks/usePlayController";
import { AUTO_PLAY_STATE, GAME_MODE } from "../../../types";
import PlayAmountControl from "../PlayController/PlayController";
import Button from "../Button";

import styles_button from "../Button/Button.module.scss";
import { useCallback, useEffect, useMemo } from "react";

const AutoPlayController = () => {
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
    autoPlay: { isDisabled, state, onPlay, onStopPlay },
    overlayPlayButton,
  } = usePlayController();

  const roleButton = GAME_MODE.AUTOPLAY;
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

        if (button && (!isDisabled() || state === AUTO_PLAY_STATE.PLAYING)) {
          if (!button.classList.contains(activeClassName)) {
            button.classList.add(activeClassName);
          }
          button.click();
        }
      }
    },
    [activeClassName, isDisabled, currentCurrency, state, roleButton],
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
    [activeClassName, currentCurrency, state, roleButton],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKeyPress, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [currentCurrency, state]);

  const getClassName = () => {
    if (state === AUTO_PLAY_STATE.PLAYING) {
      return styles_button.buttonCashout;
    }
    if (currentCurrency === Currency.GOLD) {
      return styles_button.buttonGold;
    }
    return styles_button.buttonSweeps;
  };

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
          disabled={
            state === AUTO_PLAY_STATE.PLAYING
              ? false
              : isDisabled() || !isValidPlayAmount
          }
          className={getClassName()}
          onClick={state === AUTO_PLAY_STATE.PLAYING ? onStopPlay : onPlay}
          roleType={roleButton}
        >
          {state === AUTO_PLAY_STATE.PLAYING
            ? "Stop Autoplay"
            : "Start Autoplay"}
        </Button>
      )}
    </>
  );
};

export default AutoPlayController;
