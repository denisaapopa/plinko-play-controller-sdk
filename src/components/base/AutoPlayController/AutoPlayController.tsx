import { Currency } from "@enigma-lake/zoot-platform-sdk";
import { useCallback, useEffect, useMemo } from "react";

import { usePlayController } from "../../hooks/usePlayController";
import { AUTO_PLAY_STATE, GAME_MODE } from "../../../types";
import PlayAmountControl from "../PlayController/PlayController";
import Button from "../Button";

import styles_button from "../Button/Button.module.scss";
import { addPressedClass, removePressedClass, selectButton } from "../../utils";

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
    isStopButtonPressed,
    setIsStopButtonPressed,
  } = usePlayController();

  const roleButton = GAME_MODE.AUTOPLAY;

  const activeClassName = useMemo(() => {
    const isCashout = isStopButtonPressed;
    const baseClass =
      currentCurrency === Currency.GOLD
        ? styles_button.buttonGold__active
        : styles_button.buttonSweeps__active;

    return isCashout ? styles_button.buttonCashout__active : baseClass;
  }, [currentCurrency, isStopButtonPressed]);

  const getClassName = useMemo(() => {
    if (isStopButtonPressed) {
      return `${styles_button.buttonCashout} ${activeClassName}`;
    }
    if (state === AUTO_PLAY_STATE.PLAYING) {
      return styles_button.buttonCashout;
    }
    return currentCurrency === Currency.GOLD
      ? styles_button.buttonGold
      : styles_button.buttonSweeps;
  }, [currentCurrency, state, isStopButtonPressed, activeClassName]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      const button = selectButton(roleButton);
      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const canTrigger =
        !isDisabled() ||
        state === AUTO_PLAY_STATE.PLAYING ||
        isStopButtonPressed;

      if (canTrigger) {
        addPressedClass(roleButton, activeClassName);
        button.click();
      }
    },
    [activeClassName, isDisabled, state, isStopButtonPressed],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      const button = selectButton(roleButton);
      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!isStopButtonPressed) {
        removePressedClass(roleButton, activeClassName);
      }
    },
    [activeClassName, isStopButtonPressed],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKeyPress, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [handleKeyPress, handleKeyUp]);

  const handleOnStop = useCallback(() => {
    setIsStopButtonPressed?.(true);
    onStopPlay();
  }, [setIsStopButtonPressed, onStopPlay]);

  const isButtonDisabled =
    state === AUTO_PLAY_STATE.PLAYING || isStopButtonPressed
      ? false
      : isDisabled() || !isValidPlayAmount;

  const buttonLabel =
    state === AUTO_PLAY_STATE.PLAYING || isStopButtonPressed
      ? "Stop Autoplay"
      : "Start Autoplay";

  const buttonAction =
    state === AUTO_PLAY_STATE.PLAYING || isStopButtonPressed
      ? handleOnStop
      : onPlay;

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
          disabled={isButtonDisabled}
          className={getClassName}
          onClick={buttonAction}
          roleType={roleButton}
        >
          {buttonLabel}
        </Button>
      )}
    </>
  );
};

export default AutoPlayController;
