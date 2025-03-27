import { Currency } from "@enigma-lake/zoot-platform-sdk";

import PlayAmountControl from "../PlayController/PlayController";
import { usePlayController } from "../../hooks/usePlayController";
import Button from "../Button";

import styles_button from "../Button/Button.module.scss";

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
        <Button className={styles_button.buttonSpecial}>
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
