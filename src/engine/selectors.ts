import {
  getBoardQuestionFromDeck,
  QUESTIONS_PER_BOARD_ROUND,
  RAPID_FIRE_TARGET,
  roundMultiplier,
} from "../constants/questions";
import type { GameState, TeamId } from "./types";

export const getFamily = (state: GameState, teamId: TeamId) =>
  teamId === "A" ? state.familyA : state.familyB;

export const getOpposingTeam = (teamId: TeamId): TeamId =>
  teamId === "A" ? "B" : "A";

export const getCurrentBoardQuestion = (state: GameState) =>
  getBoardQuestionFromDeck(state.boardDeck, state.boardQuestionIndex);

export const getRevealedPoints = (state: GameState): number =>
  state.board
    .filter((slot) => slot.revealed)
    .reduce((sum, slot) => sum + slot.answer.points, 0);

export const getHiddenAnswerIndexes = (state: GameState): number[] =>
  state.board
    .map((slot, index) => (slot.revealed ? -1 : index))
    .filter((index) => index >= 0);

export const allAnswersRevealed = (state: GameState): boolean =>
  state.board.length > 0 && state.board.every((slot) => slot.revealed);

export const getMultiplierForRound = (round: number): number =>
  roundMultiplier(round);

export const canOpenBuzzers = (state: GameState): boolean =>
  state.phase === "faceOff" && state.faceOffStep === "buzz" && !state.buzzersOpen;

export const rapidFireCombined = (state: GameState): number =>
  state.rapidP1Total + state.rapidP2Total;

export const rapidFirePassed = (state: GameState): boolean =>
  rapidFireCombined(state) >= RAPID_FIRE_TARGET;

export const getRapidQuestion = (state: GameState, index = state.rapidFireIndex) =>
  state.rapidQuestions[index] ?? null;

export const getFinalOrderedAnswers = (state: GameState) =>
  state.finalOrderedAnswers;

export const questionsLeftInRound = (state: GameState): number =>
  QUESTIONS_PER_BOARD_ROUND - state.questionIndexInRound;

export const boardQuestionsRemaining = (state: GameState): number =>
  state.boardDeck.length - state.boardQuestionIndex;

export const getRoundDisplayName = (state: GameState): string => {
  switch (state.phase) {
    case "setup":
      return "Setup";
    case "faceOff":
    case "faceOffMember":
    case "mainPlay":
    case "steal":
    case "award":
      if (state.round <= 1) return "Single points";
      if (state.round === 2) return "Double points";
      return "Triple points";
    case "eliminated":
      return "Elimination";
    case "rapidFireP1":
      return "Rapid fire · Player 1";
    case "rapidFireP2":
      return "Rapid fire · Player 2";
    case "rapidFireScore":
      return "Rapid fire · Score";
    case "finalRound":
      return "Jumble round";
    case "winner":
      return state.finalCorrectCount !== null ? "Jumble result" : "Game over";
    default:
      return "Family Weekend";
  }
};
