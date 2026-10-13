import {
  ANSWER_WINDOW_SECONDS,
  BOARD_QUESTIONS,
  BOARD_ROUND_COUNT,
  FINAL_ROUND,
  FINAL_ROUND_SECONDS,
  MAX_STRIKES,
  QUESTIONS_PER_BOARD_ROUND,
  RAPID_FIRE_P1_SECONDS,
  RAPID_FIRE_P2_SECONDS,
  RAPID_FIRE_SET,
  RAPID_FIRE_TARGET,
  roundMultiplier,
} from "../constants/questions";
import { createInitialState } from "./createInitialState";
import { findAnswerIndex } from "./matchAnswer";
import {
  allAnswersRevealed,
  getOpposingTeam,
  getRevealedPoints,
} from "./selectors";
import type { FaceOffAnswer, GameAction, GameState, TeamId } from "./types";

const cloneForUndo = (state: GameState): GameState => {
  const { lastSnapshot: _ignored, ...rest } = state;
  return structuredClone(rest) as GameState;
};

const withUndo = (prev: GameState, next: GameState): GameState => ({
  ...next,
  lastSnapshot: cloneForUndo(prev),
});

const cue = (
  state: GameState,
  sfxCue: GameState["sfxCue"],
  confetti = false,
): Pick<GameState, "sfxCue" | "sfxNonce" | "confettiNonce"> => ({
  sfxCue,
  sfxNonce: state.sfxNonce + 1,
  confettiNonce: confetti ? state.confettiNonce + 1 : state.confettiNonce,
});

const RAPID_DECK = [0, 1, 2, 3, 4] as const;

const clearFinalDrag = (): Pick<
  GameState,
  "finalDragFrom" | "finalDragTo" | "finalDraggingText"
> => ({
  finalDragFrom: null,
  finalDragTo: null,
  finalDraggingText: null,
});

const finishRapidPlayerState = (state: GameState): GameState => {
  if (state.phase === "rapidFireP1") {
    return {
      ...state,
      phase: "rapidFireP2",
      rapidFireIndex: 0,
      rapidDeck: [...RAPID_DECK],
      rapidTimerStarted: false,
      currentQuestion: RAPID_FIRE_SET.questions[0] ?? null,
      rapidQuestionVisible: false,
      questionVisibleOnTv: false,
      timerSeconds: RAPID_FIRE_P2_SECONDS,
      timerRunning: false,
      timerLabel: "Player 2 — 35s",
      message:
        "Player 2's turn. Reveal question to start 35s (P1 answers hidden on TV).",
    };
  }
  if (state.phase === "rapidFireP2") {
    return {
      ...state,
      phase: "rapidFireScore",
      rapidDeck: [],
      rapidTimerStarted: false,
      timerRunning: false,
      rapidQuestionVisible: false,
      questionVisibleOnTv: false,
      message: `Combined score: ${state.rapidP1Total + state.rapidP2Total}. Need ${RAPID_FIRE_TARGET}.`,
    };
  }
  return state;
};

const clearAnswerWindow = (): Pick<
  GameState,
  "questionVisibleOnTv" | "timerRunning" | "timerSeconds" | "timerLabel"
> => ({
  questionVisibleOnTv: false,
  timerRunning: false,
  timerSeconds: 0,
  timerLabel: "",
});

const loadBoardQuestion = (
  state: GameState,
  boardQuestionIndex: number,
): Partial<GameState> => {
  const question = BOARD_QUESTIONS[boardQuestionIndex];
  if (!question) {
    return {
      message: "No more board questions in the dataset.",
      phase: "award",
    };
  }

  return {
    boardQuestionIndex,
    currentQuestion: question,
    board: question.answers.map((answer) => ({ answer, revealed: false })),
    strikes: 0,
    controllingTeam: null,
    firstBuzzerTeam: null,
    buzzerWinner: null,
    buzzersOpen: false,
    faceOffStep: "buzz",
    faceOffAnswers: [],
    faceOffMemberName: null,
    faceOffAfterMiss: false,
    roundPoints: 0,
    awardTeam: null,
    multiplier: roundMultiplier(state.round),
    phase: "faceOff",
    questionVisibleOnTv: false,
    lastRevealedIndex: null,
    timerRunning: false,
    timerSeconds: 0,
    timerLabel: "",
    message: `Round ${state.round} (×${roundMultiplier(state.round)}) — Open buzzers for face-off.`,
  };
};

const revealSlot = (state: GameState, answerIndex: number): GameState => {
  if (!state.board[answerIndex] || state.board[answerIndex].revealed) {
    return state;
  }

  const board = state.board.map((slot, index) =>
    index === answerIndex ? { ...slot, revealed: true } : slot,
  );

  return {
    ...state,
    board,
    lastRevealedIndex: answerIndex,
    roundPoints: board
      .filter((slot) => slot.revealed)
      .reduce((sum, slot) => sum + slot.answer.points, 0),
  };
};

const beginMainPlay = (
  state: GameState,
  controllingTeam: TeamId,
): GameState => {
  const name =
    controllingTeam === "A" ? state.familyA.name : state.familyB.name;
  return {
    ...state,
    controllingTeam,
    phase: "mainPlay",
    buzzersOpen: false,
    buzzerWinner: controllingTeam,
    faceOffStep: "buzz",
    faceOffAfterMiss: false,
    ...clearAnswerWindow(),
    message: `${name} has control · round total ${state.roundPoints}. Keep playing the board.`,
  };
};

const teamName = (state: GameState, teamId: TeamId) =>
  teamId === "A" ? state.familyA.name : state.familyB.name;

const applyFaceOffHit = (state: GameState, answerIndex: number): GameState => {
  const answeringTeam = state.buzzerWinner;
  if (!answeringTeam || state.phase !== "faceOff") return state;
  if (!state.board[answerIndex] || state.board[answerIndex].revealed) return state;

  let next = revealSlot(state, answerIndex);
  next = {
    ...next,
    ...clearAnswerWindow(),
    ...cue(next, "revealAnswer"),
  };

  const entry: FaceOffAnswer = {
    teamId: answeringTeam,
    answerIndex,
    isMiss: false,
  };
  const hits = [...state.faceOffAnswers.filter((item) => !item.isMiss), entry];

  // After any miss (no board challenge pending): any survey hit → that family plays
  if (state.faceOffAfterMiss) {
    return beginMainPlay(
      { ...next, faceOffAnswers: hits, faceOffAfterMiss: false },
      answeringTeam,
    );
  }

  // #1 on first board hit → instant control
  if (hits.length === 1 && answerIndex === 0) {
    return beginMainPlay({ ...next, faceOffAnswers: hits }, answeringTeam);
  }

  // First board hit but not #1 → other team gets one chance to beat that rank
  if (hits.length === 1) {
    const other = getOpposingTeam(answeringTeam);
    return {
      ...next,
      faceOffAnswers: hits,
      faceOffStep: "secondCaptain",
      faceOffAfterMiss: false,
      buzzersOpen: false,
      buzzerWinner: other,
      message: `Revealed #${answerIndex + 1} (${next.board[answerIndex]?.answer.points} pts). ${teamName(next, other)} — one chance to beat that rank.`,
    };
  }

  // Second board hit (challenge) — better rank wins; both stay revealed
  const firstHit = hits[0];
  const firstRank = firstHit.answerIndex ?? 99;
  const winner =
    answerIndex < firstRank ? answeringTeam : firstHit.teamId;

  return beginMainPlay({ ...next, faceOffAnswers: hits }, winner);
};

const applyFaceOffMiss = (state: GameState): GameState => {
  if (state.phase !== "faceOff") return state;
  const answeringTeam = state.buzzerWinner;
  if (!answeringTeam) return state;

  const hits = state.faceOffAnswers.filter((item) => !item.isMiss);

  // Challenge miss after a non-#1 board hit — leading family keeps control
  if (hits.length > 0 && !state.faceOffAfterMiss) {
    const leader = [...hits].sort(
      (a, b) => (a.answerIndex ?? 99) - (b.answerIndex ?? 99),
    )[0];
    return {
      ...beginMainPlay(state, leader.teamId),
      ...cue(state, "strike"),
      message: `Miss — ${teamName(state, leader.teamId)} keeps control.`,
    };
  }

  // Miss with nothing on the board (or after prior misses):
  // do not reopen buzzers — alternate answering team; next survey hit wins control
  const other = getOpposingTeam(answeringTeam);
  return {
    ...state,
    faceOffAfterMiss: true,
    buzzersOpen: false,
    buzzerWinner: other,
    faceOffStep: "secondCaptain",
    ...clearAnswerWindow(),
    message: `Incorrect. ${teamName(state, other)} answers next — any board answer wins control.`,
    ...cue(state, "strike"),
  };
};

const awardRound = (state: GameState, teamId: TeamId): GameState => {
  const points = getRevealedPoints(state) * state.multiplier;
  const familyKey = teamId === "A" ? "familyA" : "familyB";
  const family = state[familyKey];

  return {
    ...state,
    [familyKey]: { ...family, score: family.score + points },
    awardTeam: teamId,
    roundPoints: points,
    phase: "award",
    questionVisibleOnTv: false,
    timerRunning: false,
    message: `${family.name} scores ${points} points!`,
    ...cue(state, "scoresAllot", true),
  };
};

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const advanceAfterBoardQuestion = (state: GameState): GameState => {
  const nextQuestionInRound = state.questionIndexInRound + 1;
  const nextBoardIndex = state.boardQuestionIndex + 1;

  if (nextQuestionInRound < QUESTIONS_PER_BOARD_ROUND && BOARD_QUESTIONS[nextBoardIndex]) {
    return {
      ...state,
      questionIndexInRound: nextQuestionInRound,
      ...loadBoardQuestion(state, nextBoardIndex),
    };
  }

  if (state.round < BOARD_ROUND_COUNT) {
    const nextRound = state.round + 1;
    return {
      ...state,
      round: nextRound,
      questionIndexInRound: 0,
      ...loadBoardQuestion({ ...state, round: nextRound }, nextBoardIndex),
    };
  }

  const advancingTeam: TeamId =
    state.familyA.score >= state.familyB.score ? "A" : "B";
  const advancing =
    advancingTeam === "A" ? state.familyA : state.familyB;

  return {
    ...state,
    phase: "eliminated",
    advancingTeam,
    questionVisibleOnTv: false,
    message: `${advancing.name} advances to rapid fire. Losing family is eliminated.`,
    buzzersOpen: false,
  };
};

export const applyAction = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_ROOM_CODE":
      return { ...state, roomCode: action.payload.roomCode };

    case "SET_FAMILIES":
      return withUndo(state, {
        ...state,
        familyA: {
          ...state.familyA,
          name: action.payload.familyA.name || state.familyA.name,
          members: action.payload.familyA.members.slice(0, 5),
        },
        familyB: {
          ...state.familyB,
          name: action.payload.familyB.name || state.familyB.name,
          members: action.payload.familyB.members.slice(0, 5),
        },
        message: "Families updated.",
      });

    case "START_GAME": {
      const base = {
        ...createInitialState(state.roomCode),
        familyA: { ...state.familyA, score: 0 },
        familyB: { ...state.familyB, score: 0 },
        round: 1,
        questionIndexInRound: 0,
      };
      return withUndo(state, {
        ...base,
        ...loadBoardQuestion(base, 0),
      });
    }

    case "END_GAME":
      return withUndo(state, {
        ...state,
        phase: "winner",
        buzzersOpen: false,
        timerRunning: false,
        questionVisibleOnTv: false,
        rapidQuestionVisible: false,
        message: "Game ended by host.",
      });

    case "OPEN_BUZZERS":
      return withUndo(state, {
        ...state,
        buzzersOpen: true,
        buzzerWinner: null,
        faceOffStep: "buzz",
        phase: state.phase === "faceOffMember" ? "faceOff" : state.phase,
        message: "Buzzers open!",
      });

    case "RESET_BUZZERS":
      return withUndo(state, {
        ...state,
        buzzersOpen: false,
        buzzerWinner: null,
        firstBuzzerTeam: null,
        faceOffStep: "buzz",
        faceOffAnswers: [],
        faceOffMemberName: null,
        faceOffAfterMiss: false,
        phase: "faceOff",
        questionVisibleOnTv: false,
        message: "Buzzers reset. Open again when ready.",
      });

    case "LOCK_BUZZER": {
      if (!state.buzzersOpen || state.buzzerWinner) return state;
      return {
        ...state,
        buzzersOpen: false,
        buzzerWinner: action.payload.teamId,
        firstBuzzerTeam: state.firstBuzzerTeam ?? action.payload.teamId,
        faceOffStep: "firstCaptain",
        message: `${
          action.payload.teamId === "A" ? state.familyA.name : state.familyB.name
        } buzzed first!`,
        ...cue(state, "buzzerPressed"),
      };
    }

    case "FACEOFF_INCORRECT":
      return withUndo(state, applyFaceOffMiss(state));

    case "SUBMIT_FACEOFF_ANSWER": {
      if (action.payload.isMiss === true || action.payload.answerIndex === null) {
        return withUndo(state, applyFaceOffMiss(state));
      }
      return withUndo(state, applyFaceOffHit(state, action.payload.answerIndex));
    }

    case "START_FACEOFF_MEMBER":
    case "MARK_FACEOFF_MEMBER_MISS":
      // Member face-off removed — host alternates teams in real life.
      return state;

    case "MARK_FACEOFF_ON_BOARD":
      return withUndo(state, applyFaceOffHit(state, action.payload.answerIndex));

    case "REVEAL_QUESTION": {
      if (state.phase === "finalRound") {
        return withUndo(state, {
          ...state,
          finalQuestionVisible: true,
          questionVisibleOnTv: true,
          message: "Jumble question revealed on TV.",
        });
      }
      return withUndo(state, {
        ...state,
        questionVisibleOnTv: true,
        timerSeconds: ANSWER_WINDOW_SECONDS,
        timerRunning: true,
        timerLabel: "Answer window",
        message: "Question revealed — 10 seconds to answer.",
      });
    }

    case "REVEAL_FINAL_OPTIONS":
      if (state.phase !== "finalRound") return state;
      return withUndo(state, {
        ...state,
        finalOptionsVisible: true,
        finalQuestionVisible: true,
        questionVisibleOnTv: true,
        message: "Jumble options revealed — drag to order on host.",
      });

    case "REVEAL_ANSWER": {
      const next = revealSlot(state, action.payload.answerIndex);
      if (next === state) return state;
      return withUndo(state, {
        ...next,
        ...clearAnswerWindow(),
        message: `Revealed: ${next.board[action.payload.answerIndex]?.answer.text}`,
        ...cue(next, "revealAnswer"),
      });
    }

    case "MARK_CORRECT": {
      if (
        state.phase !== "mainPlay" &&
        state.phase !== "steal" &&
        state.phase !== "faceOff"
      ) {
        return state;
      }

      if (state.phase === "faceOff") {
        return withUndo(state, applyFaceOffHit(state, action.payload.answerIndex));
      }

      if (state.phase === "steal" && state.controllingTeam) {
        const next = revealSlot(state, action.payload.answerIndex);
        const stealer = getOpposingTeam(state.controllingTeam);
        return withUndo(
          state,
          awardRound(
            { ...next, ...clearAnswerWindow(), ...cue(next, "revealAnswer") },
            stealer,
          ),
        );
      }

      const next = revealSlot(state, action.payload.answerIndex);
      const done = allAnswersRevealed(next);
      if (done && state.controllingTeam) {
        return withUndo(
          state,
          awardRound(
            {
              ...next,
              ...clearAnswerWindow(),
              ...cue(next, "revealAnswer"),
            },
            state.controllingTeam,
          ),
        );
      }

      return withUndo(state, {
        ...next,
        ...clearAnswerWindow(),
        message: `Correct: ${next.board[action.payload.answerIndex]?.answer.text}`,
        ...cue(next, "revealAnswer"),
      });
    }

    case "MARK_INCORRECT":
    case "GIVE_STRIKE": {
      if (state.phase === "steal" && state.controllingTeam) {
        const awarded = awardRound(state, state.controllingTeam);
        return withUndo(state, {
          ...awarded,
          ...clearAnswerWindow(),
          message: "Steal missed — points stay with controlling family.",
          ...cue(state, "strike", true),
        });
      }

      if (state.phase !== "mainPlay") return state;
      const strikes = state.strikes + 1;
      if (strikes >= MAX_STRIKES) {
        return withUndo(state, {
          ...state,
          strikes,
          phase: "steal",
          ...clearAnswerWindow(),
          message: "3 strikes! Steal is live — match an answer or Give strike to fail steal.",
          ...cue(state, "strike"),
        });
      }
      return withUndo(state, {
        ...state,
        strikes,
        ...clearAnswerWindow(),
        message: `Strike ${strikes}!`,
        ...cue(state, "strike"),
      });
    }

    case "START_STEAL":
      return withUndo(state, {
        ...state,
        phase: "steal",
        message: "Steal chance — one guess for the opposing family.",
      });

    case "RESOLVE_STEAL": {
      if (state.phase !== "steal" || !state.controllingTeam) return state;
      if (action.payload.success && action.payload.answerIndex !== undefined) {
        const next = revealSlot(state, action.payload.answerIndex);
        const stealer = getOpposingTeam(state.controllingTeam);
        return withUndo(state, awardRound(next, stealer));
      }
      return withUndo(state, awardRound(state, state.controllingTeam));
    }

    case "AWARD_POINTS": {
      if (allAnswersRevealed(state) && state.controllingTeam) {
        return withUndo(state, awardRound(state, state.controllingTeam));
      }
      if (state.awardTeam) {
        return withUndo(state, awardRound(state, state.awardTeam));
      }
      if (state.controllingTeam) {
        return withUndo(state, awardRound(state, state.controllingTeam));
      }
      return state;
    }

    case "NEXT_QUESTION": {
      const nextBoardIndex =
        state.phase === "award" || allAnswersRevealed(state)
          ? state.boardQuestionIndex + 1
          : state.boardQuestionIndex + 1;
      if (!BOARD_QUESTIONS[nextBoardIndex]) {
        return withUndo(state, {
          ...state,
          message: "No more survey questions — jump to Rapid fire or Jumble.",
        });
      }
      return withUndo(state, {
        ...state,
        questionIndexInRound: Math.min(
          state.questionIndexInRound + 1,
          QUESTIONS_PER_BOARD_ROUND - 1,
        ),
        ...loadBoardQuestion(state, nextBoardIndex),
      });
    }

    case "NEXT_ROUND": {
      if (state.phase === "eliminated" || state.round >= BOARD_ROUND_COUNT) {
        return applyAction(state, { type: "GO_TO_RAPID_FIRE" });
      }

      const nextRound = Math.min(state.round + 1, BOARD_ROUND_COUNT) as 1 | 2 | 3;
      return applyAction(state, {
        type: "GO_TO_BOARD_ROUND",
        payload: { round: nextRound },
      });
    }

    case "GO_TO_BOARD_ROUND": {
      const round = action.payload.round;
      const advanceIndex =
        state.phase === "award" ||
        state.phase === "eliminated" ||
        state.phase.startsWith("rapid") ||
        state.phase === "finalRound" ||
        state.phase === "winner";
      const boardIndex = Math.min(
        advanceIndex && state.currentQuestion
          ? state.boardQuestionIndex + 1
          : state.boardQuestionIndex,
        BOARD_QUESTIONS.length - 1,
      );
      if (!BOARD_QUESTIONS[boardIndex]) {
        return withUndo(state, {
          ...state,
          message: "No board questions left — use Rapid fire or Jumble.",
        });
      }
      return withUndo(state, {
        ...state,
        round,
        questionIndexInRound: 0,
        ...loadBoardQuestion({ ...state, round }, boardIndex),
        message:
          round === 1
            ? "Single points round — open buzzers when ready."
            : round === 2
              ? "Double points round — open buzzers when ready."
              : "Triple points round — open buzzers when ready.",
      });
    }

    case "GO_TO_RAPID_FIRE":
      return withUndo(state, {
        ...state,
        phase: "rapidFireP1",
        rapidFireIndex: 0,
        rapidDeck: [...RAPID_DECK],
        rapidTimerStarted: false,
        rapidP1Answers: [],
        rapidP2Answers: [],
        rapidP1Total: 0,
        rapidP2Total: 0,
        currentQuestion: RAPID_FIRE_SET.questions[0] ?? null,
        rapidQuestionVisible: false,
        questionVisibleOnTv: false,
        board: [],
        strikes: 0,
        buzzersOpen: false,
        timerSeconds: RAPID_FIRE_P1_SECONDS,
        timerRunning: false,
        timerLabel: "Player 1 — 30s",
        message:
          "Rapid fire — Player 1. Reveal to start one 30s timer for all 5 questions.",
      });

    case "GO_TO_JUMBLE": {
      const jumbled = shuffle([...FINAL_ROUND.orderedAnswers]);
      return withUndo(state, {
        ...state,
        phase: "finalRound",
        currentQuestion: {
          id: FINAL_ROUND.id,
          prompt: FINAL_ROUND.prompt,
          answers: FINAL_ROUND.orderedAnswers.map((text, index) => ({
            text,
            points: 6 - index,
          })),
        },
        finalJumbled: jumbled,
        finalSubmitted: [],
        finalCorrect: null,
        finalCorrectCount: null,
        finalQuestionVisible: false,
        finalOptionsVisible: false,
        ...clearFinalDrag(),
        board: [],
        buzzersOpen: false,
        rapidQuestionVisible: false,
        ...clearAnswerWindow(),
        message: "Jumble round — reveal question, then reveal options.",
      });
    }

    case "FORCE_PHASE":
      return withUndo(state, {
        ...state,
        phase: action.payload.phase,
        message: `Phase set to ${action.payload.phase}`,
      });

    case "START_TIMER":
      return withUndo(state, {
        ...state,
        timerSeconds: action.payload.seconds,
        timerRunning: true,
        timerLabel: action.payload.label ?? state.timerLabel,
      });

    case "TICK": {
      if (!state.timerRunning) return state;
      if (state.timerSeconds <= 1) {
        const wasAnswerWindow = state.timerLabel === "Answer window";
        if (wasAnswerWindow) {
          return {
            ...state,
            ...clearAnswerWindow(),
            message: "Answer window closed — match on host.",
          };
        }
        return {
          ...state,
          timerSeconds: 0,
          timerRunning: false,
          timerLabel: "",
          rapidQuestionVisible: false,
          questionVisibleOnTv: false,
          message: "Time is up!",
          ...cue(state, "strike"),
        };
      }
      return { ...state, timerSeconds: state.timerSeconds - 1 };
    }

    case "STOP_TIMER":
      return withUndo(state, {
        ...state,
        timerRunning: false,
      });

    case "LOG_RAPID_ANSWER": {
      if (state.phase !== "rapidFireP1" && state.phase !== "rapidFireP2") {
        return state;
      }
      const questionIndex = state.rapidFireIndex;
      const question = RAPID_FIRE_SET.questions[questionIndex];
      if (!question) return state;

      const alreadyAnswered =
        state.phase === "rapidFireP1"
          ? state.rapidP1Answers.some((a) => a.questionIndex === questionIndex)
          : state.rapidP2Answers.some((a) => a.questionIndex === questionIndex);
      if (alreadyAnswered) return state;

      const matchIndex = findAnswerIndex(action.payload.text, question.answers);
      const points =
        matchIndex >= 0 ? (question.answers[matchIndex]?.points ?? 0) : 0;
      const matchedText =
        matchIndex >= 0
          ? (question.answers[matchIndex]?.text ?? action.payload.text)
          : action.payload.text;

      const p1Same = state.rapidP1Answers.find(
        (a) => a.questionIndex === questionIndex,
      );
      const p1Match =
        state.phase === "rapidFireP2" &&
        p1Same &&
        p1Same.text.toLowerCase() === matchedText.toLowerCase();

      if (p1Match) {
        return withUndo(state, {
          ...state,
          message: "Same as Player 1 — pass or try a different answer.",
          ...cue(state, "buzzer"),
        });
      }

      const entry = {
        text: matchedText,
        points,
        sameAsOther: false,
        questionPrompt: question.prompt,
        questionIndex,
      };

      const rapidDeck = state.rapidDeck.filter((i) => i !== questionIndex);
      const nextIndex = rapidDeck[0] ?? questionIndex;
      const nextQuestion = RAPID_FIRE_SET.questions[nextIndex] ?? question;
      const timerStillGoing = state.timerRunning && state.timerSeconds > 0;

      if (state.phase === "rapidFireP1") {
        const rapidP1Answers = [...state.rapidP1Answers, entry];
        const rapidP1Total = rapidP1Answers.reduce(
          (sum, item) => sum + item.points,
          0,
        );
        const finished =
          rapidP1Answers.length >= RAPID_FIRE_SET.questions.length;
        const nextState: GameState = {
          ...state,
          rapidP1Answers,
          rapidP1Total,
          rapidDeck,
          rapidFireIndex: nextIndex,
          currentQuestion: finished ? question : nextQuestion,
          rapidQuestionVisible: finished ? false : timerStillGoing,
          questionVisibleOnTv: finished ? false : timerStillGoing,
          message: finished
            ? `P1 answered all 5 — ${rapidP1Total} pts.`
            : `Logged (+${points}). ${rapidDeck.length} left in the deck.`,
        };
        if (finished) {
          return withUndo(state, finishRapidPlayerState(nextState));
        }
        return withUndo(state, nextState);
      }

      const rapidP2Answers = [...state.rapidP2Answers, entry];
      const rapidP2Total = rapidP2Answers.reduce(
        (sum, item) => sum + item.points,
        0,
      );
      const finished =
        rapidP2Answers.length >= RAPID_FIRE_SET.questions.length;
      const nextState: GameState = {
        ...state,
        rapidP2Answers,
        rapidP2Total,
        rapidDeck,
        rapidFireIndex: nextIndex,
        currentQuestion: finished ? question : nextQuestion,
        rapidQuestionVisible: finished ? false : timerStillGoing,
        questionVisibleOnTv: finished ? false : timerStillGoing,
        message: finished
          ? `P2 answered all 5 — ${rapidP2Total} pts.`
          : `Logged (+${points}). ${rapidDeck.length} left in the deck.`,
      };
      if (finished) {
        return withUndo(state, finishRapidPlayerState(nextState));
      }
      return withUndo(state, nextState);
    }

    case "SET_RAPID_ANSWER":
      return applyAction(state, {
        type: "LOG_RAPID_ANSWER",
        payload: { text: action.payload.text },
      });

    case "PASS_RAPID_QUESTION": {
      if (state.phase !== "rapidFireP1" && state.phase !== "rapidFireP2") {
        return state;
      }
      if (state.rapidDeck.length <= 1) {
        return withUndo(state, {
          ...state,
          message:
            state.rapidDeck.length === 0
              ? "No questions left in the deck."
              : "Only one question left — answer or wait for time.",
        });
      }
      const [current, ...rest] = state.rapidDeck;
      const rapidDeck = [...rest, current];
      const nextIndex = rapidDeck[0] ?? current;
      return withUndo(state, {
        ...state,
        rapidDeck,
        rapidFireIndex: nextIndex,
        currentQuestion:
          RAPID_FIRE_SET.questions[nextIndex] ?? state.currentQuestion,
        rapidQuestionVisible: state.rapidQuestionVisible || state.timerRunning,
        questionVisibleOnTv: state.questionVisibleOnTv || state.timerRunning,
        message: `Passed Q${current + 1} — will come back if time remains.`,
      });
    }

    case "SAME_ANSWER_BUZZ":
      return withUndo(state, {
        ...state,
        message: "Same answer as player 1 — pass or try again.",
        ...cue(state, "buzzer"),
      });

    case "REVEAL_RAPID_QUESTION": {
      if (state.phase !== "rapidFireP1" && state.phase !== "rapidFireP2") {
        return state;
      }
      const question =
        RAPID_FIRE_SET.questions[state.rapidFireIndex] ?? state.currentQuestion;
      if (!state.rapidTimerStarted) {
        const seconds =
          state.phase === "rapidFireP1"
            ? RAPID_FIRE_P1_SECONDS
            : RAPID_FIRE_P2_SECONDS;
        const label =
          state.phase === "rapidFireP1" ? "Player 1 — 30s" : "Player 2 — 35s";
        return withUndo(state, {
          ...state,
          rapidQuestionVisible: true,
          questionVisibleOnTv: true,
          rapidTimerStarted: true,
          timerSeconds: seconds,
          timerRunning: true,
          timerLabel: label,
          currentQuestion: question,
          message: `Timer started — answer all 5 in ${seconds}s. Pass to skip and revisit.`,
        });
      }
      return withUndo(state, {
        ...state,
        rapidQuestionVisible: true,
        questionVisibleOnTv: true,
        currentQuestion: question,
        message: state.timerRunning
          ? `Showing Q${state.rapidFireIndex + 1} — ${state.timerSeconds}s left.`
          : `Showing Q${state.rapidFireIndex + 1}.`,
      });
    }

    case "FINISH_RAPID_PLAYER":
      if (state.phase !== "rapidFireP1" && state.phase !== "rapidFireP2") {
        return state;
      }
      return withUndo(state, finishRapidPlayerState(state));

    case "EVALUATE_RAPID_SCORE": {
      const combined = state.rapidP1Total + state.rapidP2Total;
      if (combined >= RAPID_FIRE_TARGET) {
        const jumbled = shuffle([...FINAL_ROUND.orderedAnswers]);
        return withUndo(state, {
          ...state,
          phase: "finalRound",
          currentQuestion: {
            id: FINAL_ROUND.id,
            prompt: FINAL_ROUND.prompt,
            answers: FINAL_ROUND.orderedAnswers.map((text, index) => ({
              text,
              points: 6 - index,
            })),
          },
          finalJumbled: jumbled,
          finalSubmitted: [],
          finalCorrect: null,
          finalCorrectCount: null,
          finalQuestionVisible: false,
          finalOptionsVisible: false,
          ...clearFinalDrag(),
          board: [],
          buzzersOpen: false,
          rapidQuestionVisible: false,
          ...clearAnswerWindow(),
          message: `${combined} points — jumble unlocked. Reveal question when ready.`,
          ...cue(state, "scoresAllot", true),
        });
      }
      return withUndo(state, {
        ...state,
        phase: "winner",
        message: `${combined} points — below ${RAPID_FIRE_TARGET}. Game over.`,
        ...cue(state, "strike"),
      });
    }

    case "START_FINAL_ROUND":
      return applyAction(state, { type: "GO_TO_JUMBLE" });

    case "UPDATE_FINAL_ORDER":
      return {
        ...state,
        finalJumbled: action.payload.order,
        finalDragFrom:
          action.payload.dragFrom !== undefined
            ? action.payload.dragFrom
            : state.finalDragFrom,
        finalDragTo:
          action.payload.dragTo !== undefined
            ? action.payload.dragTo
            : state.finalDragTo,
        finalDraggingText:
          action.payload.draggingText !== undefined
            ? action.payload.draggingText
            : state.finalDraggingText,
      };

    case "CLEAR_FINAL_DRAG":
      return {
        ...state,
        ...clearFinalDrag(),
      };

    case "SUBMIT_FINAL_ORDER": {
      const correctCount = action.payload.order.reduce(
        (count, item, index) =>
          item === FINAL_ROUND.orderedAnswers[index] ? count + 1 : count,
        0,
      );
      const correct = correctCount === FINAL_ROUND.orderedAnswers.length;
      return withUndo(state, {
        ...state,
        finalSubmitted: action.payload.order,
        finalJumbled: action.payload.order,
        ...clearFinalDrag(),
        finalCorrect: correct,
        finalCorrectCount: correctCount,
        phase: "winner",
        timerRunning: false,
        message: correct
          ? "Perfect order — grand prize!"
          : `${correctCount}/${FINAL_ROUND.orderedAnswers.length} correct.`,
        ...(correct
          ? cue(state, "scoresAllot", true)
          : cue(state, "strike")),
      });
    }

    case "TRIGGER_SFX":
      return {
        ...state,
        ...cue(state, action.payload.cue),
      };

    case "CLEAR_SFX":
      return { ...state, sfxCue: "none" };

    case "UNDO": {
      if (!state.lastSnapshot) return state;
      return { ...state.lastSnapshot, lastSnapshot: null };
    }

    default:
      return state;
  }
};
