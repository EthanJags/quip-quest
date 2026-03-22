import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const player: Player = {
  id: "",
  name: "",
  score: 0,
  isHost: false,
  avatar: "",
};

const initialState: Game = {
  code: -1,
  players: [player],
  gameSettings: {
    rounds: 5,
    timePerQuestion: 30,
    timePerVote: 20,
    timePerResults: 15,
    timePerScore: 10,
    promptDeck: "standard",
  },
  latestAnswers: {},
  gameActive: false,
  currentStage: "Answering",
  currentRound: 1,
  currentPrompt: "",
  timeRemaining: 0,
  chatHistory: [],
  startTime: -1,
};

const resetState: Game = {
  // this is needed cuz persistence overrides the namespace initialState
  code: -1,
  players: [player],
  gameSettings: {
    rounds: 5,
    timePerQuestion: 30,
    timePerVote: 20,
    timePerResults: 15,
    timePerScore: 10,
    promptDeck: "standard",
  },
  latestAnswers: {},
  gameActive: false,
  currentStage: "Answering",
  currentRound: 1,
  currentPrompt: "",
  timeRemaining: 0,
  chatHistory: [],
  startTime: -1,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
      state.code = action.payload.code;
      state.players = action.payload.players;
      state.gameSettings = action.payload.gameSettings;
      state.latestAnswers = action.payload.latestAnswers;
      state.gameActive = action.payload.gameActive;
      state.currentStage = action.payload.currentStage;
      state.currentPrompt = action.payload.currentPrompt;
      state.currentRound = action.payload.currentRound;
      state.timeRemaining = action.payload.timeRemaining;
      state.startTime = action.payload.startTime;
    },
    setGameCode: (state, action: PayloadAction<number>) => {
      state.code = action.payload;
    },
    setGameSettings: (state, action: PayloadAction<GameSettings>) => {
      state.gameSettings = action.payload;
    },
    setAnswers: (state, action: PayloadAction<LatestAnswers>) => {
      state.latestAnswers = action.payload;
    },
    setGameActive: (state, action: PayloadAction<boolean>) => {
      state.gameActive = action.payload;
    },
    setCurrentStage: (state, action: PayloadAction<GameStates>) => {
      state.currentStage = action.payload;
    },
    setCurrentPrompt: (state, action: PayloadAction<string>) => {
      state.currentPrompt = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      if (!state.players) {
        state.players = [action.payload];
      } else {
        state.players.push(action.payload);
      }
    },
    resetGame: (state) => {
      state = resetState;
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    incrementRound: (state) => {
      state.currentRound++;
    },

    //     removePlayer: (state, action: PayloadAction<ID>) => {
    //         if (state.Players) {
    //             state.Players = state.Players.filter((player) => player.id !== action.payload);
    //         } else {
    //             console.error('Player not found');
    //         }
  },
});

export const {
  setGameCode,
  setGame,
  setGameSettings,
  setAnswers,
  addPlayer,
  setGameActive,
  setCurrentStage,
  setCurrentPrompt,
  resetGame,
  setPlayers,
  incrementRound,
} = gameSlice.actions;

export default gameSlice.reducer;
