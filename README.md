# US Cities Exploration Game

A web-based educational game where players explore major US cities, learn facts, and play mini-games to "unlock" each city. Built with TypeScript, Vite, and Konva.js.

## Overview

This project is an interactive map application that guides players through six major US cities:

- **New York**: A fast-paced taxi game.
- **Boston**: A trivia challenge about history and landmarks.
- **Chicago**: A museum matching game involving facts and drag-and-drop mechanics.
- **Washington DC**: A memory matching game with US Presidents.
- **Los Angeles**: A map exploration game with location-based trivia.
- **San Diego**: A Wordle-style word guessing game with local themes.

The goal is to complete the mini-game in each city to mark it as "Completed" on the main map.

## Project Structure

The project follows a **Model-View-Controller (MVC)** architecture for each screen to ensure separation of concerns and testability.

### Key Directories

- `src/screens/`: Contains the logic for each screen (city or menu).
  - `AboutScreen`: Displays game overview and how-to-play instructions.
  - `BostonScreen`: Contains the Boston trivia mini-game logic.
  - `ChicagoScreen`: Implements the drag-and-drop museum matching game.
  - `CityInfoScreen`: An intermediate screen showing facts about a city before the game starts.
  - `DCScreen`: Hosts the Washington D.C. presidents memory game.
  - `HomeScreen`: The main map interface where players select cities.
  - `LosAngelesScreen`: The interactive map exploration game for LA.
  - `NewYorkScreen`: The taxi animation and fact game for NYC.
  - `PostcardScreen`: A gallery view for postcards collected after completing cities.
  - `ResultsScreen`: Displays the final score and outcome of a mini-game.
  - `SanDiegoScreen`: The San Diego Wordle-style word guessing game.
  - `SanFranciscoScreen`: Structure for a potential San Francisco level.
  - `StartScreen`: The main menu entry point of the application.
- `src/GameStateManager.ts`: A singleton that manages global game state (completed cities) and persists it to LocalStorage.
- `src/main.ts`: Entry point that initializes the application and the main `App` class which handles screen switching.
- `src/constants.ts`: Global configuration values (stage dimensions, etc.).
- `src/types.ts`: Shared TypeScript interfaces and type definitions.
- `tests/`: Contains Unit and Integration tests using Vitest.

### Tech Stack

- **Language**: TypeScript
- **Build Tool**: Vite
- **Rendering**: Konva.js (Canvas library)
- **Testing**: Vitest with JSDOM and custom mocks for Konva.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Game

To start the development server:

```bash
npm run dev
```

Open your browser to the URL shown (usually `http://localhost:5173`).

### Building for Production

To build the project for deployment:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Testing

The project uses **Vitest** for testing.

To run all tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## Features & Highlights

- **Interactive Map**: Navigate between cities using a visual map interface.
- **Diverse Mini-Games**:
  - **Drag & Drop**: Used in Chicago for matching facts to museums.
  - **Animation**: Custom taxi animations in New York using Konva's animation frame system.
  - **Trivia & Logic**: Quizzes in Boston/LA and word puzzles in San Diego.
- **State Persistence**: Your progress is saved automatically so you can continue where you left off.
- **Responsive Design**: scales to fit the browser window.

## Architecture Details

- **Screen Management**: The `App` class acts as the main router, showing/hiding Konva Groups for each screen.
- **Singleton State**: `GameStateManager` ensures only one instance manages the global state across the entire application.
- **Event Handling**: Custom event handling for mouse interactions on the Canvas elements.

## Credits

This project was developed by Team 24 for CSE 110.
