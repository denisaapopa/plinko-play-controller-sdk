import { Currency, PlayLimits } from "@enigma-lake/zoot-platform-sdk";
import { ReactNode } from "react";
import { AUTO_PLAY_STATE } from "./gameMode";

export type StylingProps = {
  panel: {
    top: string;
    bgColorHex: string;
    overlayButtonBgColor?: string;
  };
};

export type CurrencyProps = {
  currentCurrency: Currency;
  currencies: Currency[];
};

export type ActionsProps = {
  onPlay: () => void;
  onAutoPlay: (
    next: () => void,
    stop: () => void,
    state: AUTO_PLAY_STATE,
  ) => void;
};

export type PlaySettingsProps = {
  isPlaying: boolean;
  disabledController: boolean;
  displayController: boolean;
  playHook: () => {
    playLimits?: PlayLimits;
    playAmount: number;
    setPlayAmount: (value: number) => void;
  };
  autoPlayDelay?: number;
  overlayPlayButton?: () => ReactNode;
  isPlayButtonPressed?: boolean;
  isStopButtonPressed?: boolean;
  setIsStopButtonPressed?: (value: boolean) => void;
};

export type PlayControllerProps = StylingProps &
  ActionsProps & {
    currencyOptions: CurrencyProps;
    playOptions: PlaySettingsProps;
  };

export const PLAY_HALVE = 0.5;
export const PLAY_DOUBLE = 2;
