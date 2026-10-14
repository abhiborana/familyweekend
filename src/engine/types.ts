import type { SfxCue } from "../constants/assets";
import type { SurveyAnswer, SurveyQuestion } from "../constants/questions";

export type TeamId = "A" | "B";

export type ClientRole = "host" | "tv" | "familyA" | "familyB";

export type GamePhase =
  | "setup"
  | "faceOff"
  | "faceOffMember"
  | "mainPlay"
  | "steal"
  | "award"
  | "rapidFireP1"
  | "rapidFireP2"
  | "rapidFireScore"
  | "finalRound"
  | "winner"
  | "eliminated";

export type FaceOffStep = "buzz" | "firstCaptain" | "secondCaptain" | "memberFallback";

export type TvView = "gameplay" | "branding" | "scores";

export type BoardSlot = {
  answer: SurveyAnswer;
  revealed: boolean;
};

export type Family = {
  name: string;
  members: string[];
  score: number;
};

export type FaceOffAnswer = {
  teamId: TeamId;
  answerIndex: number | null;
  isMiss: boolean;
};

export type RapidAnswer = {
  text: string;
  points: number;
  sameAsOther: boolean;
  questionPrompt: string;
  questionIndex: number;
};

export type GameState = {
  roomCode: string;
  phase: GamePhase;
  familyA: Family;
  familyB: Family;
  round: number;
  questionIndexInRound: number;
  boardQuestionIndex: number;
  currentQuestion: SurveyQuestion | null;
  board: BoardSlot[];
  strikes: number;
  controllingTeam: TeamId | null;
  firstBuzzerTeam: TeamId | null;
  buzzerWinner: TeamId | null;
  buzzersOpen: boolean;
  faceOffStep: FaceOffStep;
  faceOffAnswers: FaceOffAnswer[];
  faceOffMemberName: string | null;
  /**
   * After a miss with nothing on the board: no #1-challenge face-off.
   * Teams alternate on further misses; any survey-board hit wins control.
   */
  faceOffAfterMiss: boolean;
  roundPoints: number;
  awardTeam: TeamId | null;
  multiplier: number;
  questionVisibleOnTv: boolean;
  lastRevealedIndex: number | null;
  rapidFireIndex: number;
  /** Remaining question indexes to ask (pass moves current to the end). */
  rapidDeck: number[];
  rapidTimerStarted: boolean;
  rapidP1Answers: RapidAnswer[];
  rapidP2Answers: RapidAnswer[];
  rapidP1Total: number;
  rapidP2Total: number;
  rapidQuestionVisible: boolean;
  timerSeconds: number;
  timerRunning: boolean;
  timerLabel: string;
  finalJumbled: string[];
  finalSubmitted: string[];
  finalCorrect: boolean | null;
  finalCorrectCount: number | null;
  finalQuestionVisible: boolean;
  finalOptionsVisible: boolean;
  finalDragFrom: number | null;
  finalDragTo: number | null;
  finalDraggingText: string | null;
  advancingTeam: TeamId | null;
  /** Host-controlled TV overlay. Branding/scores replace gameplay until toggled off. */
  tvView: TvView;
  /** When true, TV shows the buzzer duel instead of the board/question. */
  buzzerFocusOnTv: boolean;
  sfxCue: SfxCue;
  sfxNonce: number;
  confettiNonce: number;
  message: string;
  lastSnapshot: GameState | null;
};

export type GameAction =
  | {
      type: "SET_FAMILIES";
      payload: {
        familyA: { name: string; members: string[] };
        familyB: { name: string; members: string[] };
      };
    }
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "OPEN_BUZZERS" }
  | { type: "RESET_BUZZERS" }
  | { type: "DISMISS_BUZZER_FOCUS" }
  | { type: "SET_TV_VIEW"; payload: { view: TvView } }
  | { type: "LOCK_BUZZER"; payload: { teamId: TeamId } }
  | {
      type: "SUBMIT_FACEOFF_ANSWER";
      payload: { answerIndex: number | null; isMiss?: boolean };
    }
  | { type: "FACEOFF_INCORRECT" }
  | { type: "START_FACEOFF_MEMBER"; payload: { memberName: string } }
  | {
      type: "MARK_FACEOFF_ON_BOARD";
      payload: { answerIndex: number };
    }
  | { type: "MARK_FACEOFF_MEMBER_MISS" }
  | { type: "REVEAL_QUESTION" }
  | { type: "REVEAL_FINAL_OPTIONS" }
  | { type: "REVEAL_ANSWER"; payload: { answerIndex: number } }
  | { type: "MARK_CORRECT"; payload: { answerIndex: number } }
  | { type: "MARK_INCORRECT" }
  | { type: "GIVE_STRIKE" }
  | { type: "START_STEAL" }
  | { type: "RESOLVE_STEAL"; payload: { success: boolean; answerIndex?: number } }
  | { type: "AWARD_POINTS" }
  | { type: "NEXT_QUESTION" }
  | { type: "NEXT_ROUND" }
  | { type: "GO_TO_BOARD_ROUND"; payload: { round: 1 | 2 | 3 } }
  | { type: "GO_TO_RAPID_FIRE" }
  | { type: "GO_TO_JUMBLE" }
  | { type: "FORCE_PHASE"; payload: { phase: GamePhase } }
  | { type: "START_TIMER"; payload: { seconds: number; label?: string } }
  | { type: "TICK" }
  | { type: "STOP_TIMER" }
  | { type: "LOG_RAPID_ANSWER"; payload: { text: string } }
  | {
      type: "SET_RAPID_ANSWER";
      payload: { text: string; points: number; sameAsOther?: boolean };
    }
  | { type: "PASS_RAPID_QUESTION" }
  | { type: "SAME_ANSWER_BUZZ" }
  | { type: "REVEAL_RAPID_QUESTION" }
  | { type: "FINISH_RAPID_PLAYER" }
  | { type: "EVALUATE_RAPID_SCORE" }
  | { type: "START_FINAL_ROUND" }
  | {
      type: "UPDATE_FINAL_ORDER";
      payload: {
        order: string[];
        dragFrom?: number | null;
        dragTo?: number | null;
        draggingText?: string | null;
      };
    }
  | { type: "CLEAR_FINAL_DRAG" }
  | { type: "SUBMIT_FINAL_ORDER"; payload: { order: string[] } }
  | { type: "TRIGGER_SFX"; payload: { cue: SfxCue } }
  | { type: "CLEAR_SFX" }
  | { type: "UNDO" }
  | { type: "SET_ROOM_CODE"; payload: { roomCode: string } };
