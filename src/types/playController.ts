import { Currency, PlayLimits } from "@enigma-lake/zoot-platform-sdk";

export type StylingProps = {
  panel: {
    top: string;
    bgColorHex: string;
  };
};

export type CurrencyProps = {
  currentCurrency: Currency;
  currencies: Currency[];
};

export type ActionsProps = {
  onPlay: () => void;
  onAutoPlay: (next: () => void, stop: () => void) => void;
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
};

export type PlayControllerProps = StylingProps &
  ActionsProps & {
    currencyOptions: CurrencyProps;
    playOptions: PlaySettingsProps;
  };

export const PLAY_HALVE = 0.5;
export const PLAY_DOUBLE = 2;
