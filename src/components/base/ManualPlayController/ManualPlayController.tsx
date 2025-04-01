import { Currency } from "@enigma-lake/zoot-platform-sdk";

import PlayAmountControl from "../PlayController/PlayController";
import { usePlayController } from "../../hooks/usePlayController";
import Button from "../Button";

import styles_button from "../Button/Button.module.scss";
import { useCallback, useEffect } from "react";

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
  } = usePlayController();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();
        const scBtn = `${[styles_button["buttonSweeps__active"]]}`;
        const gcBtn = `${[styles_button["buttonGold__active"]]}`;

        const activeClassName =
          currentCurrency === Currency.GOLD ? gcBtn : scBtn;

        const button = document.querySelector(
          "[data-role='primary-button']",
        ) as HTMLButtonElement;

        if (button && !isDisabled()) {
          button.classList.add(activeClassName);
          onPlay();
          setTimeout(() => {
            button.classList.remove(activeClassName);
          }, 200);
        }
      }
    },
    [currentCurrency, isDisabled, onPlay],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, true);
    return () => {
      window.removeEventListener("keydown", handleKeyPress, true);
    };
  }, [handleKeyPress]);

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
        >
          Play now
        </Button>
      )}
    </>
  );
};

export default ManualPlayController;
