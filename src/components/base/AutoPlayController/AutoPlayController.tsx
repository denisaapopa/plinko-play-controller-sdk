import { Currency } from "@enigma-lake/zoot-platform-sdk";

import { usePlayController } from "../../hooks/usePlayController";
import { AUTO_PLAY_STATE } from "../../../types";
import PlayAmountControl from "../PlayController/PlayController";
import Button from "../Button";

import styles_button from "../Button/Button.module.scss";

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
        <>
          {state === AUTO_PLAY_STATE.PLAYING ? (
            <Button
              className={styles_button.buttonCashout}
              onClick={onStopPlay}
            >
              Stop Autoplay
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
              Start Autoplay
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default AutoPlayController;
