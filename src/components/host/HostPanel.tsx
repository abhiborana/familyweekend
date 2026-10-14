"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import ConnectionBadge from "@/components/ConnectionBadge";
import FinalOrderDnd from "@/components/host/FinalOrderDnd";
import { Button } from "@/components/ui/button";
import {
  ANSWER_WINDOW_SECONDS,
  RAPID_FIRE_TARGET,
} from "@/constants/questions";
import { getRoundDisplayName } from "@/engine";
import type { GamePhase, TeamId } from "@/engine/types";
import useGameRoom from "@/hooks/useGameRoom";
import useHostTimer from "@/hooks/useHostTimer";

type HostPanelProps = {
  roomCode: string;
};

const HostPanel = ({ roomCode }: HostPanelProps) => {
  const { state, connected, connectionError, dispatch } = useGameRoom("host", roomCode);
  useHostTimer(state.timerRunning, dispatch);

  const [familyAName, setFamilyAName] = useState(state.familyA.name);
  const [familyBName, setFamilyBName] = useState(state.familyB.name);
  const [membersA, setMembersA] = useState(state.familyA.members.join(", "));
  const [membersB, setMembersB] = useState(state.familyB.members.join(", "));
  const [answersHidden, setAnswersHidden] = useState(false);
  const [rapidText, setRapidText] = useState("");

  const roundName = getRoundDisplayName(state);

  const mode =
    state.phase === "setup"
      ? "setup"
      : state.phase === "rapidFireP1" ||
          state.phase === "rapidFireP2" ||
          state.phase === "rapidFireScore"
        ? "rapid"
        : state.phase === "finalRound"
          ? "jumble"
          : state.phase === "winner"
            ? "winner"
            : state.phase === "eliminated"
              ? "board"
              : "board";

  const saveFamilies = () => {
    dispatch({
      type: "SET_FAMILIES",
      payload: {
        familyA: {
          name: familyAName,
          members: membersA.split(",").map((item) => item.trim()).filter(Boolean),
        },
        familyB: {
          name: familyBName,
          members: membersB.split(",").map((item) => item.trim()).filter(Boolean),
        },
      },
    });
  };

  const currentRapidTotal =
    state.phase === "rapidFireP2" ? state.rapidP2Total : state.rapidP1Total;

  return (
    <div className="min-h-[100dvh] bg-[#0b1220] text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:px-6">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-amber-300">
              Host panel
            </p>
            <p className="text-sm text-slate-400">{roundName}</p>
          </div>
          <ConnectionBadge
            connected={connected}
            roomCode={roomCode}
            error={connectionError}
          />
        </header>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Now playing</p>
            <p className="text-lg font-medium text-amber-200">{roundName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Detail</p>
            <p className="text-sm text-slate-300">
              {mode === "board"
                ? `×${state.multiplier} · Q${state.questionIndexInRound + 1}`
                : state.phase}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Scores</p>
            <p className="text-sm">
              {state.familyA.name} {state.familyA.score} — {state.familyB.score}{" "}
              {state.familyB.name}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => dispatch({ type: "END_GAME" })}
            >
              End game
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => dispatch({ type: "UNDO" })}>
              Undo
            </Button>
          </div>
          <div className="md:col-span-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            <p className="mr-1 text-xs uppercase tracking-wider text-slate-400">
              TV view
            </p>
            <Button
              type="button"
              size="sm"
              variant={state.tvView === "branding" ? "default" : "outline"}
              onClick={() =>
                dispatch({
                  type: "SET_TV_VIEW",
                  payload: {
                    view: state.tvView === "branding" ? "gameplay" : "branding",
                  },
                })
              }
            >
              {state.tvView === "branding" ? "Show gameplay" : "Branding view"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={state.tvView === "scores" ? "default" : "outline"}
              onClick={() =>
                dispatch({
                  type: "SET_TV_VIEW",
                  payload: {
                    view: state.tvView === "scores" ? "gameplay" : "scores",
                  },
                })
              }
            >
              {state.tvView === "scores" ? "Show gameplay" : "Scores view"}
            </Button>
            <p className="text-xs text-slate-500">
              Now: {state.tvView}
              {state.buzzerFocusOnTv ? " · buzzer focus" : ""}
            </p>
          </div>
          <p className="md:col-span-4 text-sm text-slate-300">{state.message}</p>
        </section>

        {state.phase !== "setup" ? (
          <section className="rounded-2xl border border-amber-300/20 bg-amber-400/5 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-amber-200/80">
              Jump to round
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === "board" ? "secondary" : "outline"}
                onClick={() => dispatch({ type: "NEXT_QUESTION" })}
              >
                Next question
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "board" && state.round === 1 ? "default" : "outline"}
                onClick={() =>
                  dispatch({ type: "GO_TO_BOARD_ROUND", payload: { round: 1 } })
                }
              >
                Single ×1
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "board" && state.round === 2 ? "default" : "outline"}
                onClick={() =>
                  dispatch({ type: "GO_TO_BOARD_ROUND", payload: { round: 2 } })
                }
              >
                Double ×2
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "board" && state.round === 3 ? "default" : "outline"}
                onClick={() =>
                  dispatch({ type: "GO_TO_BOARD_ROUND", payload: { round: 3 } })
                }
              >
                Triple ×3
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "rapid" ? "default" : "outline"}
                onClick={() => dispatch({ type: "GO_TO_RAPID_FIRE" })}
              >
                Rapid fire
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "jumble" ? "default" : "outline"}
                onClick={() => dispatch({ type: "GO_TO_JUMBLE" })}
              >
                Jumble round
              </Button>
            </div>
          </section>
        ) : null}

        {mode === "setup" ? (
          <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Family A name
              <input
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                value={familyAName}
                onChange={(event) => setFamilyAName(event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              Family B name
              <input
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                value={familyBName}
                onChange={(event) => setFamilyBName(event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              Family A members (comma-separated)
              <input
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                value={membersA}
                onChange={(event) => setMembersA(event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              Family B members (comma-separated)
              <input
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                value={membersB}
                onChange={(event) => setMembersB(event.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="button" onClick={saveFamilies}>
                Save families
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  saveFamilies();
                  dispatch({ type: "START_GAME" });
                }}
              >
                Start game
              </Button>
            </div>
          </section>
        ) : null}

        {mode === "board" ? (
          <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wider text-slate-400">Play</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => dispatch({ type: "REVEAL_QUESTION" })}
                >
                  {state.questionVisibleOnTv ? "Hide question" : "Reveal question"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch({
                      type: "START_TIMER",
                      payload: {
                        seconds: ANSWER_WINDOW_SECONDS,
                        label: "Answer window",
                      },
                    })
                  }
                >
                  Start {ANSWER_WINDOW_SECONDS}s timer
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnswersHidden((value) => !value)}
                >
                  {answersHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  <span className="ml-1">{answersHidden ? "Show" : "Hide"} answers</span>
                </Button>
              </div>
            </div>

            <BoardPhaseActions
              phase={state.phase}
              buzzersOpen={state.buzzersOpen}
              buzzerWinner={state.buzzerWinner}
              buzzerFocusOnTv={state.buzzerFocusOnTv}
              strikes={state.strikes}
              onOpenBuzzers={() => dispatch({ type: "OPEN_BUZZERS" })}
              onResetBuzzers={() => dispatch({ type: "RESET_BUZZERS" })}
              onShowQuestion={() => dispatch({ type: "DISMISS_BUZZER_FOCUS" })}
              onIncorrect={() => dispatch({ type: "FACEOFF_INCORRECT" })}
              onStrike={() => dispatch({ type: "GIVE_STRIKE" })}
              onAward={() => dispatch({ type: "AWARD_POINTS" })}
            />

            <p className="text-sm text-slate-400">
              Answering:{" "}
              {state.buzzerWinner === "A"
                ? state.familyA.name
                : state.buzzerWinner === "B"
                  ? state.familyB.name
                  : state.controllingTeam === "A"
                    ? state.familyA.name
                    : state.controllingTeam === "B"
                      ? state.familyB.name
                      : "—"}
              {" · "}
              Round total {state.roundPoints}
              {state.phase === "steal" ? " · STEAL" : ""}
            </p>

            <p className="rounded-xl bg-black/30 px-3 py-2 text-base font-medium">
              {state.currentQuestion?.prompt ?? "No question — use Jump to round"}
            </p>
            <p className="text-xs text-slate-500">
              TV question: {state.questionVisibleOnTv ? "visible" : "hidden"} · Timer{" "}
              {state.timerSeconds}s {state.timerRunning ? "(running)" : ""}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {state.board.map((slot, index) => (
                <button
                  key={`${slot.answer.text}-${index}`}
                  type="button"
                  disabled={slot.revealed}
                  onClick={() =>
                    dispatch({ type: "MARK_CORRECT", payload: { answerIndex: index } })
                  }
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    slot.revealed
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : state.phase === "award"
                        ? "border-sky-300/30 bg-sky-500/10 hover:border-sky-300/50"
                        : "border-white/15 bg-black/20 hover:border-amber-300/50"
                  }`}
                >
                  <span className="font-medium">
                    #{index + 1}{" "}
                    {answersHidden && !slot.revealed ? "••••••••" : slot.answer.text}
                  </span>
                  <span className="ml-2 text-slate-400">
                    {answersHidden && !slot.revealed ? "" : slot.answer.points}
                    {state.phase === "award" && !slot.revealed ? " · reveal only" : ""}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {mode === "rapid" ? (
          <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Rapid fire</p>
            <p className="text-sm text-slate-300">
              Member total {currentRapidTotal} · Combined{" "}
              {state.rapidP1Total + state.rapidP2Total} / {RAPID_FIRE_TARGET}
            </p>
            <p className="text-xs text-slate-500">
              One timer for all 5. Pass skips and returns later if time remains.
              Finishes automatically after 5 answers.
            </p>
            <p className="rounded-xl bg-black/30 px-3 py-2 font-medium">
              Q{state.rapidFireIndex + 1}:{" "}
              {state.rapidQuestions[state.rapidFireIndex]?.prompt ?? "—"}
            </p>
            <p className="text-xs text-slate-500">
              Deck:{" "}
              {state.rapidDeck.length
                ? state.rapidDeck.map((i) => i + 1).join(" → ")
                : "empty"}{" "}
              · Timer{" "}
              {state.rapidTimerStarted
                ? state.timerRunning
                  ? `${state.timerSeconds}s`
                  : "done"
                : "not started"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => dispatch({ type: "REVEAL_RAPID_QUESTION" })}>
                {state.rapidTimerStarted
                  ? "Show question"
                  : "Reveal + start timer"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => dispatch({ type: "PASS_RAPID_QUESTION" })}
                disabled={state.rapidDeck.length <= 1}
              >
                Pass
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch({ type: "FINISH_RAPID_PLAYER" })}
              >
                Finish player
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => dispatch({ type: "EVALUATE_RAPID_SCORE" })}
              >
                Evaluate vs {RAPID_FIRE_TARGET}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => dispatch({ type: "SAME_ANSWER_BUZZ" })}
              >
                Same-answer buzz
              </Button>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="grid min-w-[16rem] flex-1 gap-1 text-sm">
                Log answer (points from survey)
                <input
                  className="rounded-xl border border-white/15 bg-black/30 px-3 py-2"
                  value={rapidText}
                  onChange={(event) => setRapidText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && rapidText.trim()) {
                      dispatch({
                        type: "LOG_RAPID_ANSWER",
                        payload: { text: rapidText.trim() },
                      });
                      setRapidText("");
                    }
                  }}
                />
              </label>
              <Button
                type="button"
                onClick={() => {
                  if (!rapidText.trim()) return;
                  dispatch({
                    type: "LOG_RAPID_ANSWER",
                    payload: { text: rapidText.trim() },
                  });
                  setRapidText("");
                }}
              >
                Log
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <LoggedList title="Player 1" answers={state.rapidP1Answers} total={state.rapidP1Total} />
              <LoggedList title="Player 2" answers={state.rapidP2Answers} total={state.rapidP2Total} />
            </div>
          </section>
        ) : null}

        {mode === "jumble" ? (
          <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">Jumble round</p>
            <p className="text-sm text-slate-400">
              Host reference (not on TV until reveal):{" "}
              {state.currentQuestion?.prompt ?? "—"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => dispatch({ type: "REVEAL_QUESTION" })}
              >
                {state.finalQuestionVisible ? "Hide question" : "Reveal question"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => dispatch({ type: "REVEAL_FINAL_OPTIONS" })}
                disabled={!state.finalQuestionVisible}
              >
                Reveal options
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  dispatch({
                    type: "START_TIMER",
                    payload: { seconds: 60, label: "Final — 60s" },
                  })
                }
                disabled={!state.finalOptionsVisible}
              >
                Start 60s
              </Button>
              <Button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "SUBMIT_FINAL_ORDER",
                    payload: { order: state.finalJumbled },
                  })
                }
                disabled={!state.finalOptionsVisible}
              >
                Check final order
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              TV: question {state.finalQuestionVisible ? "on" : "off"} · options{" "}
              {state.finalOptionsVisible ? "on" : "off"} · Timer{" "}
              {state.timerRunning ? `${state.timerSeconds}s` : "off"}
            </p>
            {state.finalOptionsVisible ? (
              <FinalOrderDnd
                items={state.finalJumbled}
                onChange={(preview) =>
                  dispatch({
                    type: "UPDATE_FINAL_ORDER",
                    payload: {
                      order: preview.order,
                      dragFrom: preview.dragFrom,
                      dragTo: preview.dragTo,
                      draggingText: preview.draggingText,
                    },
                  })
                }
                onDragEnd={() => dispatch({ type: "CLEAR_FINAL_DRAG" })}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-slate-500">
                Reveal question, then options, before dragging the order.
              </p>
            )}
          </section>
        ) : null}

        {mode === "winner" ? (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-lg text-amber-200">{state.message}</p>
            {state.finalCorrectCount !== null ? (
              <p className="mt-2 text-slate-300">
                Jumble: {state.finalCorrectCount}/{state.finalOrderedAnswers.length}{" "}
                correct
              </p>
            ) : null}
            <p className="mt-3 text-sm text-slate-400">
              Use Jump to round above to keep playing, or restart.
            </p>
            <Button
              type="button"
              className="mt-3"
              variant="outline"
              onClick={() => dispatch({ type: "START_GAME" })}
            >
              Restart game
            </Button>
          </section>
        ) : null}
      </div>
    </div>
  );
};

type BoardPhaseActionsProps = {
  phase: GamePhase;
  buzzersOpen: boolean;
  buzzerWinner: TeamId | null;
  buzzerFocusOnTv: boolean;
  strikes: number;
  onOpenBuzzers: () => void;
  onResetBuzzers: () => void;
  onShowQuestion: () => void;
  onIncorrect: () => void;
  onStrike: () => void;
  onAward: () => void;
};

const BoardPhaseActions = ({
  phase,
  buzzersOpen,
  buzzerWinner,
  buzzerFocusOnTv,
  strikes,
  onOpenBuzzers,
  onResetBuzzers,
  onShowQuestion,
  onIncorrect,
  onStrike,
  onAward,
}: BoardPhaseActionsProps) => {
  const inTeamPlay = phase === "mainPlay" || phase === "steal";
  const inFaceOff = phase === "faceOff" || phase === "faceOffMember";

  if (phase === "award") {
    return (
      <p className="rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
        Play done for this question — tap hidden answers to reveal for the
        audience (no points). Then use Next question.
      </p>
    );
  }

  if (inTeamPlay) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="destructive" onClick={onStrike}>
          Give strike ({strikes}/3)
          {phase === "steal" ? " / fail steal" : ""}
        </Button>
        <Button type="button" variant="outline" onClick={onAward}>
          Award points
        </Button>
      </div>
    );
  }

  if (buzzersOpen) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onResetBuzzers}>
          Reset buzzers
        </Button>
        <Button type="button" variant="secondary" onClick={onShowQuestion}>
          Show question on TV
        </Button>
      </div>
    );
  }

  if (buzzerWinner && inFaceOff) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="destructive" onClick={onIncorrect}>
          Incorrect answer
        </Button>
        {buzzerFocusOnTv ? (
          <Button type="button" variant="secondary" onClick={onShowQuestion}>
            Show question on TV
          </Button>
        ) : null}
      </div>
    );
  }

  if (inFaceOff) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onOpenBuzzers}>
          Open buzzers
        </Button>
      </div>
    );
  }

  return null;
};

type LoggedListProps = {
  title: string;
  answers: {
    text: string;
    points: number;
    questionPrompt: string;
    questionIndex: number;
  }[];
  total: number;
};

const LoggedList = ({ title, answers, total }: LoggedListProps) => {
  const byQuestion = Array.from({ length: 5 }, (_, index) =>
    answers.find((answer) => answer.questionIndex === index),
  );

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-sm font-medium text-amber-200">
        {title} · {total} pts
      </p>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">
        {byQuestion.map((answer, index) => (
          <li key={`q-${index}`}>
            Q{index + 1}.{" "}
            {answer ? (
              <>
                {answer.text}{" "}
                <span className="text-slate-500">(+{answer.points})</span>
              </>
            ) : (
              <span className="text-slate-500">—</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostPanel;
