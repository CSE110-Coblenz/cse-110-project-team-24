# NewYorkScreen - Taxi Mini-Game

## Overview

The NewYorkScreen directory contains a fast-paced educational mini-game where players must identify correct New York City facts displayed on animated taxis. Two taxis move across the screen simultaneously, each displaying a different fact about NYC. Players must quickly click on the taxi displaying the true fact to score points.

## Features

### Core Gameplay

- **Dual Taxi Animation**: Two taxis move continuously across the screen in opposite directions (left-to-right and right-to-left)
- **True/False Fact Pairs**: Each round displays two NYC facts - one true, one false
- **Scoring System**: Players earn points by clicking the correct taxi
- **Speed Challenge**: After clicking the correct taxi first, players can click it multiple times to test their clicking speed and maximize points

### Scoring Rules

- **Correct First Click**: If the player clicks the correct taxi first, they can click it unlimited times during that round for maximum points
- **Wrong First Click Penalty**: If the player clicks the wrong taxi before the correct one, that round is "locked" and no points can be earned for the remainder of that question
- **Round Reset**: Each time a new fact pair appears (when taxis reset their positions), the round state resets and players get a fresh chance

### Visual Features

- **Animated Taxi Movement**: Smooth horizontal scrolling animations using Konva
- **Road Graphics**: Two roads (top and bottom) with yellow lane dividers
- **Taxi Sprites**: Custom taxi images with fact text overlays
- **Score Display**: Real-time score counter in the top-left corner
- **Image Loading**: Graceful fallback to yellow rectangles if taxi images fail to load

## Architecture

The NewYorkScreen follows the **Model-View-Controller (MVC)** pattern:

```
Controller (GameScreenController)
    ↓ coordinates
Model (GameScreenModel)  ← →  View (GameScreenView)
    ↓ manages state         ↓ renders graphics
    Score tracking          Konva stage
```

### Data Flow

1. **User Interaction**: Player clicks a taxi → `GameScreenView` triggers callback
2. **Event Handling**: `GameScreenController.handleTaxiClick()` processes the click
3. **State Management**: `GameScreenModel` updates score
4. **Visual Update**: `GameScreenView.updateScore()` refreshes display
5. **Fact Rotation**: When taxis reset position, `GameScreenView.updateToNextFact()` cycles facts

## File Structure

```
NewYorkScreen/
├── GameScreenController.ts  # Game logic and user interaction
├── GameScreenModel.ts        # Score state management
├── GameScreenView.ts         # Visual rendering and animations
├── NewYorkFacts.ts           # Fact data storage
├── AnimateTaxi.ts            # Animation utilities
├── Taxi.ts                   # Taxi sprite creation
└── Road.ts                   # Road graphics utilities
```

---

## File Details

### GameScreenController.ts

**Purpose**: Central coordinator for game logic, user input, and state transitions.

**Key Responsibilities**:

- Handles taxi click events and scoring logic
- Enforces scoring rules (locked rounds, unlimited correct clicks)
- Manages game lifecycle (start, end, timer)
- Coordinates between Model and View
- Tracks round state for each question

**Key Methods**:

- `startGame()`: Initializes game state and displays the view
- `handleTaxiClick(taxiNumber)`: Processes clicks, checks correctness, updates score
- `endGame()`: Stops timer and transitions to results screen

**Round State Tracking**:

- `currentRoundLocked`: Prevents scoring if wrong taxi clicked first
- `correctTaxiClickedThisRound`: Tracks if correct taxi has been clicked
- `lastFactIndex`: Detects when new questions appear to reset round state

**Scoring Logic Flow**:

```
User clicks taxi
    ↓
Check if new question (fact index changed)
    ↓ Yes → Reset round state
    ↓
Check if clicked taxi is correct
    ↓ Yes → Check if round is locked
        ↓ No → Award point, mark correct taxi clicked
        ↓ Yes → No points (round was locked)
    ↓ No → Check if correct taxi already clicked
        ↓ No → Lock round (wrong taxi clicked first)
        ↓ Yes → Round remains unlocked
```

---

### GameScreenModel.ts

**Purpose**: Manages game state, specifically the player's score.

**Key Responsibilities**:

- Stores and tracks the current score
- Provides methods to increment and retrieve score
- Resets score for new games

**State Properties**:

- `score: number`: Current player score (starts at 0)

**Key Methods**:

- `reset()`: Resets score to 0 for a new game
- `incrementScore()`: Increases score by 1
- `getScore()`: Returns current score

---

### GameScreenView.ts

**Purpose**: Renders all visual elements using Konva.js and manages animations.

**Key Responsibilities**:

- Creates and displays the game stage (roads, taxis, score)
- Manages Konva groups and layers
- Initializes and controls taxi animations
- Updates visual elements (score, fact text)
- Handles screen visibility (show/hide)

**Key Components**:

- `taxi1`: Bottom road taxi (moves left-to-right, displays fact1)
- `taxi2`: Top road taxi (moves right-to-left, displays fact2)
- `scoreText`: Score display element
- `taxi1Animation` / `taxi2Animation`: Animation controllers

**Visual Layout**:

```
┌─────────────────────────────────┐
│ Score: X                        │
│                                 │
│ ───────────────────────────────│ ← Top Road (taxi2, R→L)
│                                 │
│                                 │
│ ───────────────────────────────│ ← Bottom Road (taxi1, L→R)
└─────────────────────────────────┘
```

**Key Methods**:

- `show()`: Makes screen visible and starts animations
- `hide()`: Hides screen and stops animations
- `updateScore(score)`: Updates score display text
- `updateToNextFact()`: Cycles to next fact pair
- `getCurrentFactIndex()`: Returns current fact index for controller
- `initializeAnimations()`: Sets up taxi movement animations

**Animation Initialization**:

- Animations are initialized when the layer becomes available (after `show()`)
- Each taxi has its own animation instance
- Animations call `updateToNextFact()` when taxis reset position

---

### NewYorkFacts.ts

**Purpose**: Stores fact pair data about New York City.

**Data Structure**:

```typescript
interface FactPair {
  fact1: string; // First fact (displayed on taxi1)
  fact2: string; // Second fact (displayed on taxi2)
  fact1IsTrue: boolean; // true if fact1 is correct, false if fact2 is correct
}
```

**Key Components**:

- `NEW_YORK_FACT_PAIRS`: Array of 8 fact pairs about NYC
- Each pair contains one true and one false statement

**Available Facts** (8 pairs total):

1. Languages spoken in NYC
2. NYC as US capital history
3. Subway operating hours
4. Tourist visit statistics
5. Number of boroughs
6. Brooklyn Bridge opening date
7. Number of yellow taxis
8. Daily water consumption

**Key Functions**:

- `getFactPairByIndex(index)`: Retrieves a specific fact pair
- `getCorrectFactIndex(factPair)`: Returns 1 if fact1 is true, 2 if fact2 is true

**Fact Rotation**:

- Facts cycle automatically using modulo operation: `(index + 1) % length`
- When a taxi resets position, `updateToNextFact()` advances to the next pair
- Both taxis display facts from the same pair simultaneously

---

### AnimateTaxi.ts

**Purpose**: Provides animation utilities for taxi movement.

**Key Components**:

- `TaxiAnimation` interface: Standardized animation control (start/stop)
- Two animation factory functions for different directions

**Animation Functions**:

**`createLeftToRightAnimation()`**:

- Moves taxi from left to right across screen
- Resets taxi to left side (`-taxiWidth`) when it exits right side
- Used for `taxi1` on bottom road
- Calls `onReset` callback when taxi resets (triggers fact update)

**`createRightToLeftAnimation()`**:

- Moves taxi from right to left across screen
- Resets taxi to right side (`STAGE_WIDTH`) when it exits left side
- Used for `taxi2` on top road
- Calls `onReset` callback when taxi resets (triggers fact update)

**Animation Mechanics**:

- Uses Konva's `Animation` class with frame callbacks
- Speed controlled by `speed` parameter (pixels per frame)
- Default speed: 2 pixels/frame (configurable in `GameScreenView`)
- Continuous loop: taxis reset and immediately reappear
- Animations run on the Konva layer

**Reset Callback**:

- When a taxi resets position, it calls `updateToNextFact()`
- This ensures facts update even if player doesn't click
- Both taxis can trigger fact updates (uses modulo to avoid double-updates)

---

### Taxi.ts

**Purpose**: Creates taxi sprite groups with images and text overlays.

**Key Features**:

- **Image Loading**: Loads taxi image from `/taxi.png`
- **Fallback Rendering**: Uses yellow rectangle if image fails to load
- **Text Overlay**: Displays fact text on top of taxi image
- **Horizontal Flipping**: Supports mirroring for opposite-direction taxis

**Key Methods**:

**`createTaxi(x, y, text, width, height, flipHorizontal)`**:

- Creates a Konva.Group containing:
  1. Taxi image (or fallback rectangle)
  2. Text overlay with fact content
- Handles asynchronous image loading
- Automatically removes placeholder when image loads
- Adjusts x-position when flipping horizontally

**Image Loading Flow**:

```
1. Create placeholder rectangle (yellow)
2. Start loading image asynchronously
3. On success: Replace rectangle with image
4. On failure: Keep placeholder rectangle
```

**Text Styling**:

- Font: Arial, 24px
- Alignment: Center (horizontal and vertical)
- Color: Black
- Width: Matches taxi width for proper wrapping

**Horizontal Flipping**:

- Used for `taxi2` (top road, right-to-left movement)
- Applies `scaleX(-1)` to mirror image
- Adjusts x-position to `width` to compensate for flip origin

---

### Road.ts

**Purpose**: Creates road graphics and lane divider decorations.

**Key Components**:

- Static utility class (no instances needed)
- Creates visual road elements for the game stage

**Key Methods**:

**`createRoad(x, y, width, height)`**:

- Creates a dark gray (`#333333`) rectangle representing a road
- Returns a Konva.Rect object

**`createLaneDividers(roadCenterY, roadWidth, group)`**:

- Creates dashed yellow lane dividers
- Dividers are 30px wide rectangles, spaced 40px apart
- Color: Gold (`#FFD700`)
- Positioned at road center (4px tall)

**`createRoads(roadHeight, group)`**:

- Main method that creates both roads and their dividers
- Creates two roads:
  - **Bottom road**: Spans from `STAGE_HEIGHT - roadHeight` to `STAGE_HEIGHT`
  - **Top road**: Spans from `0` to `roadHeight`
- Adds lane dividers to both roads
- Returns object with road center positions and dimensions

**Road Specifications**:

- Road width: `STAGE_WIDTH` (800px)
- Default road height: 250px (set in `GameScreenView`)
- Road color: Dark gray (`#333333`)
- Lane divider: Gold/yellow (`#FFD700`)

**Road Layout**:

```
┌──────────────────────────────────┐
│ Top Road (250px height)         │ ← Road 2, center at y=125
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
│                                  │
│ (Middle space: 100px)            │
│                                  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
│ Bottom Road (250px height)       │ ← Road 1, center at y=475
└──────────────────────────────────┘
```

---

## How Files Work Together

### Initialization Flow

```
1. GameScreenController constructor
   ↓
2. Creates GameScreenModel (score = 0)
   ↓
3. Creates GameScreenView with click callbacks
   ↓
4. GameScreenView constructor:
   - Loads facts from NewYorkFacts.ts
   - Creates roads using Road.ts
   - Creates taxis using Taxi.ts
   - Sets up click handlers
   ↓
5. When show() is called:
   - Initializes animations using AnimateTaxi.ts
   - Starts both taxi animations
```

### Gameplay Loop

```
User clicks taxi
   ↓
GameScreenView.onTaxiClick callback
   ↓
GameScreenController.handleTaxiClick()
   ↓
Check current fact from NewYorkFacts.ts
   ↓
Determine if correct taxi clicked
   ↓
If correct and round not locked:
   → GameScreenModel.incrementScore()
   → GameScreenView.updateScore()
   ↓
If wrong and correct not clicked yet:
   → Lock round (no future points)
```

### Fact Update Flow

```
Taxi animation reaches screen edge
   ↓
AnimateTaxi.ts onReset callback
   ↓
GameScreenView.updateToNextFact()
   ↓
Cycle to next fact pair (NewYorkFacts.ts)
   ↓
Update taxi text displays
   ↓
GameScreenController detects fact index change
   ↓
Reset round state (unlock round)
```

### Animation Cycle

```
Left-to-Right Taxi (taxi1):
   Start: x = -taxiWidth (off-screen left)
   Move: x += speed each frame
   End: x > STAGE_WIDTH (off-screen right)
   Reset: x = -taxiWidth, call onReset

Right-to-Left Taxi (taxi2):
   Start: x = STAGE_WIDTH (off-screen right)
   Move: x -= speed each frame
   End: x < -taxiWidth (off-screen left)
   Reset: x = STAGE_WIDTH, call onReset
```

---

## Configuration

### Customizable Parameters

**In `GameScreenView.ts`**:

- `taxiSpeed: number = 3` - Pixels per frame for taxi movement
- `taxiScale: number = 0.8` - Taxi sprite size multiplier
- `roadHeight: number = 250` - Height of each road

**In `AnimateTaxi.ts`**:

- Default `speed: number = 2` - Overridden by GameScreenView.taxiSpeed

**In `Taxi.ts`**:

- Font size: `24px` (currently hardcoded)
- Image path: `/taxi.png` (must be in public directory)

**In `constants.ts`**:

- `STAGE_WIDTH: 800`
- `STAGE_HEIGHT: 600`
- `GAME_DURATION: 10` (seconds, currently disabled)

---

## Dependencies

- **Konva.js**: 2D canvas rendering library for all graphics
- **TypeScript**: Type-safe JavaScript
- **NewYorkFacts.ts**: Local data module
- **constants.ts**: Shared stage dimensions

---

## Future Enhancements

Potential improvements based on TODO comments in code:

1. **Audio Feedback**:

   - Success sound when correct taxi clicked
   - Wrong answer sound when incorrect taxi clicked
   - Squeeze sound on taxi clicks

2. **Timer Functionality**:

   - Enable countdown timer
   - Add time display to UI
   - Auto-transition to results screen when time expires

3. **Visual Feedback**:

   - Highlight correct/incorrect taxi clicks
   - Animation effects on score update
   - Taxi bounce/shake effects

4. **Game Balancing**:
   - Adjustable difficulty (taxi speed)
   - Power-ups or bonus rounds
   - High score tracking

---

## Testing Scenarios

### Scoring Rules

**Scenario 1: Correct First Click**

1. Question appears with two facts
2. Player clicks correct taxi → Score +1
3. Player clicks correct taxi again → Score +1
4. Player clicks correct taxi 5 more times → Score +5
5. **Result**: 7 points earned

**Scenario 2: Wrong First Click**

1. Question appears with two facts
2. Player clicks wrong taxi → Round locked
3. Player clicks correct taxi → No points
4. Player clicks correct taxi again → No points
5. **Result**: 0 points earned

**Scenario 3: Correct Then Wrong**

1. Question appears with two facts
2. Player clicks correct taxi → Score +1, round unlocked
3. Player clicks wrong taxi → No penalty (round stays unlocked)
4. Player clicks correct taxi again → Score +1
5. **Result**: 2 points earned

### Fact Rotation

- Taxis cycle through all 8 fact pairs
- After 8 pairs, wraps around to first pair
- Both taxis update simultaneously
- Round state resets on each new question

---

## File Summary Table

| File                      | Type       | Purpose                                   | Key Exports                                                |
| ------------------------- | ---------- | ----------------------------------------- | ---------------------------------------------------------- |
| `GameScreenController.ts` | Controller | Game logic, click handling, scoring rules | `GameScreenController` class                               |
| `GameScreenModel.ts`      | Model      | Score state management                    | `GameScreenModel` class                                    |
| `GameScreenView.ts`       | View       | Visual rendering, animations              | `GameScreenView` class                                     |
| `NewYorkFacts.ts`         | Data       | Fact pair storage                         | `NEW_YORK_FACT_PAIRS`, utility functions                   |
| `AnimateTaxi.ts`          | Utility    | Animation creation                        | `createLeftToRightAnimation`, `createRightToLeftAnimation` |
| `Taxi.ts`                 | Component  | Taxi sprite creation                      | `Taxi.createTaxi()`                                        |
| `Road.ts`                 | Component  | Road graphics creation                    | `Road.createRoads()`, `Road.createLaneDividers()`          |

---

This README documents the complete architecture and functionality of the NewYorkScreen mini-game. All files work together to create an interactive, educational game experience where players test their knowledge of New York City facts while enjoying smooth animations and challenging gameplay mechanics.
