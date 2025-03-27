# PlinkoPlayController

The `PlinkoPlayController` component is a key part of the gameplay interface, allowing users to initiate a play or cash out based on their current game state. It supports manual play, autoplay for a specified number of plays, dynamic currency handling, and play amount adjustments.

---

## Component Overview

The `PlinkoPlayController` allows the user to:

- Select a currency.
- Adjust the play amount.
- Start a play (manual or auto).
- Cash out winnings.
- Toggle between manual play and autoplay.

---

## Setup

### 1. Install the package using npm:

```bash
npm install @enigma-lake/plinko-play-controller-sdk
```

### 2. Import the component and styles in your project:

```tsx
import {
  AUTO_PLAY_STATE,
  GAME_MODE,
  AutoManualPlayProvider,
} from "@enigma-lake/plinko-play-controller-sdk";

import "@enigma-lake/plinko-play-controller-sdk/dist/style.css";
```

---

## Context & Provider

### `AutoManualPlayProvider`

The `AutoManualPlayProvider` wraps the PlinkoPlayController, managing both manual play and autoplay. It uses React Context to provide game state and actions throughout the component tree.

🔹 **Features of `AutoManualPlayProvider`**:

- **Manages Game Mode**: Switches between MANUAL and AUTOPLAY.
- **Handles Autoplay**: Sets the number of plays, tracks rounds, and stops automatically.
- **Provides Context:** Exposes state and functions for controlling play behavior.

## Props

### 1. `StylingProps`

Handles the styling-related properties for the component.

- **`panel`**(optional): Custom styling for the play controller.
  - **`bgColorHex`**: Hex color for the panel background.
  - **`top`**: top margin for the panel relative to the window.
  - **`overlayButtonBgColor`**(optional):
    - Defines the background color of the special button overlay.
    - Used only when `overlayPlayButton` is provided.
    - **_Only applies when the controller is disabled_**

### 2. `CurrencyProps`

Handles currency-related logic and settings.

- **`currencyOptions`**: An object containing the following properties:
  - **`currentCurrency`**: The currently selected currency (e.g., `Currency.SWEEPS`).
  - **`currencies`**: Array of available currencies that the user can choose from.

### 3. `ActionsProps`

Defines functions for the user actions.

- **`onPlay`**: A callback function to trigger when the user starts a play.
- **`onAutoPlay`**: A callback function to trigger when the user starts autoplay. It accepts `next` (a function to execute the next play round) and `stop` (a function to forcefully stop autoplay).

### 4. `PlaySettingsProps`

Handles game-specific settings and states.

- **`playOptions`**: An object containing the following properties:
  - **`isPlaying`**: Boolean flag indicating whether the game is currently in progress.
  - **`disabledController`**: Boolean flag to disable all interactive elements in the component, preventing user interactions (e.g., when the game is in progress).
  - **`displayController`**: Boolean flag to determine if the play controller should be visible.
  - **`playHook`**: A hook providing the current play amount, play limits, and a function to set the play amount.
    - **`playLimits`**: Play limits for the game.
    - **`playAmount`**: The current play amount.
    - **`setPlayAmount`**: A function to set the play amount.
  - **`autoPlayDelay`** (optional): The delay (in milliseconds) before auto play starts.
  - **`overlayPlayButton`** (optional):
    - Accepts a function that returns the content of the special button.
    - When provided, it overlays the play button, indicating bonus rounds or special gameplay options.
    - **_Only appear when the controller is disabled_**

---

## Example Usage

```tsx
import "@enigma-lake/plinko-play-controller-sdk/dist/style.css";
import { AutoManualPlayProvider, GAME_MODE, AUTO_PLAY_STATE } from "@enigma-lake/plinko-play-controller-sdk";
import { Currency } from "@enigma-lake/zoot-platform-sdk";

const GameExample = () => {
  const config = {
    currencyOptions: {
      currentCurrency: Currency.SWEEPS,
      currencies: [Currency.SWEEPS, Currency.GOLD],
    },
    onPlay: () => console.log("Play button clicked"),
    onAutoPlay: (next, stop) => {
      console.log("Auto Play started with selection:", selection);
      next(); // Proceed to the next autoplay round
      stop(); // Stop autoplay (e.g., in case of an error or when the user chooses to stop)
    },
    playOptions: {
      displayController: true,
      isPlaying: false,
      disabledController: false,
      playHook: () => {
        return {
          playLimits: { min: 1, max: 100 },
          playAmount: 10,
          setPlayAmount: (value) => console.log("New play amount:", value),
        };
      },
      overlayPlayButton: () => "Bonus Round",
    },
    panel: {
      bottom: '15px',
      bgColorHex: "#081E64",
      overlayButtonBgColor:  "#01243A"
    }
  };

  return (
    <AutoManualPlayProvider config={config}>
      {({ autoPlay: { state }, mode }) => (
        // children content
      )}
    </AutoManualPlayProvider>
  );
};
```

---

## Key Features

1. **Dynamic Currency Handling**:

   - Supports multiple currencies (e.g., SWEEPS, GOLD).
   - Allows users to switch currencies easily.

2. **Play Amount Adjustment**:

   - Includes buttons to halve or double the play amount.
   - Validates play amounts against user balance and play limits.

3. **Custom Styling**:

   - Supports customizable input and button colors.

4. **Play Actions**:
   - Allows users to initiate gameplay

---

## Development Notes

1. **Play Amount Validation**:

   - The play amount is validated to ensure it falls within the minimum and maximum limits, as well as the user's available balance.

2. **Responsive Design**:
   - The component is styled to be responsive and integrate seamlessly into various layouts.
