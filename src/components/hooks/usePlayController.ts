import { AUTO_PLAY_STATE } from "../../types";
import { useAutoManualPlayState } from "../AutoManualPlayStateProvider/AutoManualPlayStateContext";
import { ChangeEvent, FocusEvent } from "react";

export const usePlayController = () => {
  const {
    config,
    autoPlay: { state, handleAutoPlay, stopAutoplay },
  } = useAutoManualPlayState();
  const { currentCurrency, currencies } = config.currencyOptions;
  const {
    isPlaying,
    disabledController,
    playHook,
    overlayPlayButton,
    isPlayButtonPressed = false,
    isStopButtonPressed = false,
    setIsStopButtonPressed,
  } = config.playOptions;

  const { playAmount, playLimits, setPlayAmount } = playHook?.() ?? {};
  const minPlayAmount = playLimits?.[currentCurrency]?.limits.min ?? 0;
  const maxPlayAmount = playLimits?.[currentCurrency]?.limits.max ?? 0;

  const isDisabled = () => disabledController || isPlaying;
  const isAutoplayDisabled = () =>
    disabledController || state === AUTO_PLAY_STATE.PLAYING;

  const adjustPlayAmount = (multiplier: number) => {
    if (isDisabled()) {
      return;
    }
    const newAmount = Math.max(
      minPlayAmount,
      Math.min(playAmount * multiplier, maxPlayAmount),
    );
    setPlayAmount(Number(newAmount.toFixed(2)));
  };

  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled()) {
      return;
    }
    setPlayAmount(Number(event.currentTarget.value));
  };

  const onBlurAmount = (event: FocusEvent<HTMLInputElement>) => {
    if (isDisabled()) {
      return;
    }
    const newAmount = Number(event.currentTarget.value);
    setPlayAmount(Math.max(minPlayAmount, Math.min(newAmount, maxPlayAmount)));
  };

  const isValidPlayAmount =
    playAmount >= minPlayAmount && playAmount <= maxPlayAmount;

  return {
    currentCurrency,
    currencies,
    playAmount,
    minPlayAmount,
    maxPlayAmount,
    setPlayAmount,
    adjustPlayAmount,
    onChangeAmount,
    onBlurAmount,
    playOptions: config.playOptions,
    isValidPlayAmount,
    overlayPlayButton,
    isPlayButtonPressed,
    isStopButtonPressed,
    setIsStopButtonPressed,
    manualPlay: {
      isDisabled,
      onPlay: config.onPlay,
    },
    autoPlay: {
      isDisabled: isAutoplayDisabled,
      state,
      onPlay: handleAutoPlay,
      onStopPlay: stopAutoplay,
    },
  };
};
