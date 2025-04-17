import { useRef } from "react";
import { AUTO_PLAY_STATE } from "../../types";
import { PlayControllerProps } from "../../types/playController";

const useAutoPlay = ({
  config,
  autoPlay: {
    setNumberOfPlays,
    numberOfPlays,
    setPlayedRounds,
    playedRounds,
    setState,
    state,
  },
}: {
  config: PlayControllerProps;
  autoPlay: {
    state: AUTO_PLAY_STATE;
    playedRounds: number;
    numberOfPlays: number;
    setState: React.Dispatch<React.SetStateAction<AUTO_PLAY_STATE>>;
    setPlayedRounds: React.Dispatch<React.SetStateAction<number>>;
    setNumberOfPlays: React.Dispatch<React.SetStateAction<number>>;
  };
}) => {
  const { autoPlayDelay = 500, disabledController } = config.playOptions;
  // Refs to store mutable values
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoplayActiveRef = useRef(false);

  const stopAutoplay = () => {
    isAutoplayActiveRef.current = false;
    if (playIntervalRef.current) {
      clearTimeout(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setState(AUTO_PLAY_STATE.IDLE);
    setTimeout(() => {
      setPlayedRounds(0);
    }, autoPlayDelay);
  };

  // Schedule the next loop
  const scheduleNextLoop = (
    currentPlayedRounds: number,
    remainingPlays: number,
    directly = false,
  ) => {
    if (!isAutoplayActiveRef.current) {
      return;
    }

    if (directly) {
      loopRounds(currentPlayedRounds, remainingPlays);
    } else {
      playIntervalRef.current = setTimeout(
        () => loopRounds(currentPlayedRounds + 1, remainingPlays - 1),
        autoPlayDelay,
      );
    }
  };

  // Loop function
  const loopRounds = (currentPlayedRounds: number, remainingPlays: number) => {
    if (!isAutoplayActiveRef.current) {
      return;
    }

    if (remainingPlays < 1 || numberOfPlays === 0) {
      setNumberOfPlays(Infinity);
      stopAutoplay();
      return;
    }

    setPlayedRounds(currentPlayedRounds + 1);
    setNumberOfPlays((prev) => Math.max(prev - 1, 0));

    config.onAutoPlay(
      () => scheduleNextLoop(currentPlayedRounds, remainingPlays, false),
      stopAutoplay,
      state,
    );
  };

  const handleAutoPlay = () => {
    if (disabledController) {
      return;
    }

    isAutoplayActiveRef.current = true;
    setState(AUTO_PLAY_STATE.PLAYING);

    loopRounds(playedRounds, numberOfPlays);
  };

  return {
    handleAutoPlay,
    scheduleNextLoop,
    loopRounds,
    stopAutoplay,
  };
};

export default useAutoPlay;
