import { Currency } from "@enigma-lake/zoot-platform-sdk";
import { useCallback, useEffect, useMemo } from "react";

import PlayAmountControl from "../PlayController/PlayController";
import Button from "../Button";
import styles_button from "../Button/Button.module.scss";

import { usePlayController } from "../../hooks/usePlayController";
import { GAME_MODE } from "../../../types";
import { selectButton, addPressedClass, removePressedClass } from "../../utils";

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
    isPlayButtonPressed,
  } = usePlayController();

  const roleButton = GAME_MODE.MANUAL;

  const activeClassName = useMemo(() => {
    return currentCurrency === Currency.GOLD
      ? styles_button.buttonGold__active
      : styles_button.buttonSweeps__active;
  }, [currentCurrency]);

  const buttonClassName = useMemo(() => {
    return currentCurrency === Currency.GOLD
      ? styles_button.buttonGold
      : styles_button.buttonSweeps;
  }, [currentCurrency]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== "Space" || isPlayButtonPressed) {
        return;
      }

      const button = selectButton(roleButton);
      if (!button || isDisabled()) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      addPressedClass(roleButton, activeClassName);
      button.click();
    },
    [isPlayButtonPressed, isDisabled, activeClassName],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== "Space" || isPlayButtonPressed) {
        return;
      }

      const button = selectButton(roleButton);
      if (!button) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      removePressedClass(roleButton, activeClassName);
    },
    [isPlayButtonPressed, activeClassName],
  );

  useEffect(() => {
    if (isPlayButtonPressed) {
      addPressedClass(roleButton, activeClassName);
    } else {
      removePressedClass(roleButton, activeClassName);
    }
  }, [isPlayButtonPressed, activeClassName]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyPress, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [handleKeyPress, handleKeyUp]);

  const handlePlayClick = useCallback(() => {
    if (!isPlayButtonPressed) {
      onPlay();
    }
  }, [isPlayButtonPressed, onPlay]);

  const isButtonDisabled = isDisabled() || !isValidPlayAmount;

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
          className={buttonClassName}
          onClick={handlePlayClick}
          roleType={roleButton}
        >
          Play now
        </Button>
      )}
    </>
  );
};

export default ManualPlayController;
