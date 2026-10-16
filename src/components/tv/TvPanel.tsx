"use client";

import ConnectionBadge from "@/components/ConnectionBadge";
import { ASSETS, type SfxCue } from "@/constants/assets";
import { getOpposingTeam, getRoundDisplayName } from "@/engine";
import type { RapidAnswer } from "@/engine/types";
import useGameRoom from "@/hooks/useGameRoom";
import useSfxPlayer from "@/hooks/useSfxPlayer";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";

type TvPanelProps = {
  roomCode: string;
};

const STEAL_FAIL_CONFETTI_DELAY_MS = 1200;
const STRIKE_FLASH_MS = 1100;

const TvPanel = ({ roomCode }: TvPanelProps) => {
  const { state, connected, connectionError } = useGameRoom("tv", roomCode);
  useSfxPlayer(state.sfxCue, state.sfxNonce);
  useTvConfetti(state.confettiNonce, state.sfxCue);

  const withOverlay = (node: ReactNode) => (
    <>
      <StrikeFlashOverlay cue={state.sfxCue} nonce={state.sfxNonce} />
      {node}
    </>
  );

  const stealerTeam =
    state.phase === "steal" && state.controllingTeam
      ? getOpposingTeam(state.controllingTeam)
      : null;

  const showBoard =
    state.phase === "faceOff" ||
    state.phase === "faceOffMember" ||
    state.phase === "mainPlay" ||
    state.phase === "steal" ||
    state.phase === "award";

  const showRapid =
    state.phase === "rapidFireP1" ||
    state.phase === "rapidFireP2" ||
    state.phase === "rapidFireScore";

  const showFinal =
    state.phase === "finalRound" ||
    (state.phase === "winner" && state.finalCorrectCount !== null);

  const tvQuestion =
    (state.questionVisibleOnTv || state.rapidQuestionVisible || state.finalQuestionVisible) &&
      state.currentQuestion?.prompt
      ? state.currentQuestion.prompt
      : null;

  const teamAActive =
    stealerTeam === "A" ||
    (!stealerTeam &&
      (state.controllingTeam === "A" || state.buzzerWinner === "A"));
  const teamBActive =
    stealerTeam === "B" ||
    (!stealerTeam &&
      (state.controllingTeam === "B" || state.buzzerWinner === "B"));

  const showBuzzerFocus =
    state.tvView === "gameplay" && state.buzzerFocusOnTv;

  const viewMode: TvViewMode =
    state.tvView === "branding"
      ? "branding"
      : state.tvView === "scores"
        ? "scores"
        : showBuzzerFocus
          ? "buzzer"
          : showRapid
            ? "rapid"
            : showFinal
              ? "final"
              : "gameplay";

  if (state.tvView === "branding") {
    return withOverlay(
      <TvViewStage key={viewMode} mode={viewMode}>
        <div
          className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-6"
          style={{ backgroundColor: "rgba(0, 13, 46)" }}
        >
          <Image
            src={ASSETS.logoLite}
            alt="Family Weekend"
            width={560}
            height={560}
            priority
            className="tv-brand-logo relative z-10 h-auto w-[min(72vw,26rem)] object-contain"
          />
        </div>
      </TvViewStage>,
    );
  }

  if (state.tvView === "scores") {
    return withOverlay(
      <TvViewStage key={viewMode} mode={viewMode}>
        <div
          className="relative flex min-h-[100dvh] max-w-full flex-col items-center justify-center gap-8 px-6 py-10"
          style={{ backgroundColor: "rgba(0, 13, 46)" }}
        >
          <Image
            src={ASSETS.logoLite}
            alt="Family Weekend"
            width={220}
            height={220}
            priority
            className="tv-brand-logo h-auto w-[min(40vw,11rem)] object-contain"
          />
          <div className="grid w-full gap-6 md:grid-cols-2 md:gap-10">
            <TeamFocusCard
              name={state.familyA.name}
              score={state.familyA.score}
              showScore
              motionClass="tv-focus-card tv-focus-card--a"
            />
            <TeamFocusCard
              name={state.familyB.name}
              score={state.familyB.score}
              showScore
              motionClass="tv-focus-card tv-focus-card--b"
            />
          </div>
        </div>
      </TvViewStage>,
    );
  }

  if (showBuzzerFocus) {
    const winner = state.buzzerWinner;
    return withOverlay(
      <TvViewStage key={viewMode} mode={viewMode}>
        <TvShell>
          <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-10">
            <p className="tv-view-eyebrow font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/80">
              {winner ? "Buzzed in" : "Buzzers open"}
            </p>
            <div className="grid w-full gap-6 md:grid-cols-2 md:gap-10">
              <TeamFocusCard
                name={state.familyA.name}
                winner={winner === "A"}
                waiting={state.buzzersOpen && !winner}
                dimmed={winner !== null && winner !== "A"}
                motionClass="tv-focus-card tv-focus-card--a"
              />
              <TeamFocusCard
                name={state.familyB.name}
                winner={winner === "B"}
                waiting={state.buzzersOpen && !winner}
                dimmed={winner !== null && winner !== "B"}
                motionClass="tv-focus-card tv-focus-card--b"
              />
            </div>
            {winner ? (
              <p className="buzzer-winner-label font-[family-name:var(--font-heading)] text-3xl font-semibold text-amber-200 md:text-4xl">
                {(winner === "A" ? state.familyA.name : state.familyB.name)} locked in
              </p>
            ) : null}
          </div>
        </TvShell>
      </TvViewStage>,
    );
  }

  return withOverlay(
    <TvViewStage key={viewMode} mode={viewMode}>
    <TvShell>
      <div className="tv-gameplay-panel relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-6 py-5 md:px-10">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={ASSETS.logoLite}
              alt="Family Weekend"
              width={88}
              height={88}
              className="h-auto w-[72px] object-contain md:w-[88px] rounded-full"
              priority
            />
            <div>
              <p className="font-[family-name:var(--font-heading)] text-xl font-medium text-white md:text-2xl">
                {getRoundDisplayName(state)}
              </p>
              {showBoard ? (
                <p className="text-sm text-slate-400">×{state.multiplier}</p>
              ) : null}
            </div>
          </div>
          <ConnectionBadge
            connected={connected}
            roomCode={roomCode}
            error={connectionError}
          />
        </header>

        {showBoard ? (
          <div className="mt-5 grid grid-cols-[minmax(0,0.9fr)_auto_minmax(0,0.9fr)] items-end gap-3 md:gap-6">
            <ScorePill
              name={state.familyA.name}
              score={state.familyA.score}
              active={teamAActive}
              side="left"
              compact
              badge={stealerTeam === "A" ? "Steal" : null}
            />
            <div className="min-w-[8rem] text-center md:min-w-[12rem]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Round total
              </p>
              <p className="font-[family-name:var(--font-heading)] text-5xl font-semibold tabular-nums text-amber-300 md:text-6xl">
                {state.roundPoints}
                <span className="ml-1 text-lg text-slate-400">×{state.multiplier}</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                Strikes
              </p>
              <div className="mt-1 flex justify-center gap-2">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className={`grid size-9 place-items-center rounded-lg border text-lg font-bold transition duration-300 md:size-10 md:text-xl ${index < state.strikes
                      ? "scale-105 border-rose-400 bg-rose-500/30 text-rose-200"
                      : "border-white/15 bg-black/30 text-white/25"
                      }`}
                  >
                    X
                  </span>
                ))}
              </div>
            </div>
            <ScorePill
              name={state.familyB.name}
              score={state.familyB.score}
              active={teamBActive}
              side="right"
              compact
              badge={stealerTeam === "B" ? "Steal" : null}
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <ScorePill
              name={state.familyA.name}
              score={state.familyA.score}
              active={false}
              side="left"
              compact
            />
            <ScorePill
              name={state.familyB.name}
              score={state.familyB.score}
              active={false}
              side="right"
              compact
            />
          </div>
        )}

        <div className="mt-5 text-center">
          {tvQuestion ? (
            <p className="mx-auto max-w-4xl text-balance font-[family-name:var(--font-heading)] text-2xl font-medium text-white md:text-4xl">
              {tvQuestion}
            </p>
          ) : showBoard ? (
            <p className="text-slate-500">Waiting for question…</p>
          ) : showFinal && !state.finalQuestionVisible ? (
            <p className="text-slate-500">Waiting for jumble question…</p>
          ) : null}
          {state.phase === "mainPlay" && state.controllingTeam ? (
            <p className="mt-2 text-sm text-slate-300">
              {(state.controllingTeam === "A" ? state.familyA.name : state.familyB.name)}{" "}
              has control
            </p>
          ) : null}
          {state.phase === "steal" && stealerTeam ? (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-rose-300">
              Steal — {(stealerTeam === "A" ? state.familyA.name : state.familyB.name)}
            </p>
          ) : null}
          {state.timerRunning ? (
            <p className="mt-4 font-[family-name:var(--font-heading)] text-6xl font-semibold text-amber-300 tabular-nums">
              {state.timerSeconds}
            </p>
          ) : null}
        </div>

        {showFinal ? (
          <div className="mt-8 flex flex-1 flex-col gap-6">
            {state.finalCorrectCount !== null ? (
              <>
                <p className="text-center font-[family-name:var(--font-heading)] text-3xl text-amber-300">
                  {state.finalCorrectCount}/{state.finalOrderedAnswers.length}{" "}
                  correct
                  {state.finalCorrect ? " — grand prize!" : ""}
                </p>
                <div className="grid flex-1 gap-6 md:grid-cols-2">
                  <OrderColumn
                    title="Correct order"
                    items={state.finalOrderedAnswers}
                    highlightAgainst={state.finalOrderedAnswers}
                  />
                  <OrderColumn
                    title="Their order"
                    items={state.finalSubmitted}
                    highlightAgainst={state.finalOrderedAnswers}
                  />
                </div>
              </>
            ) : state.finalOptionsVisible ? (
              <div className="mx-auto w-full max-w-2xl">
                {state.finalDraggingText ? (
                  <p className="mb-4 text-center font-[family-name:var(--font-heading)] text-xl text-amber-200">
                    Moving{" "}
                    <span className="font-semibold text-amber-300">
                      {state.finalDraggingText}
                    </span>
                    {state.finalDragFrom !== null && state.finalDragTo !== null
                      ? ` · ${state.finalDragFrom + 1} → ${state.finalDragTo + 1}`
                      : null}
                  </p>
                ) : null}
                <OrderColumn
                  title="Live order"
                  items={state.finalJumbled}
                  highlightAgainst={null}
                  dragFrom={state.finalDragFrom}
                  dragTo={state.finalDragTo}
                  draggingText={state.finalDraggingText}
                />
              </div>
            ) : (
              <p className="text-center text-slate-500">
                Options hidden until host reveals them
              </p>
            )}
          </div>
        ) : null}

        {showRapid ? (
          <div className="mt-8 flex flex-1 flex-col gap-6">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                {state.phase === "rapidFireScore"
                  ? "Combined total"
                  : state.phase === "rapidFireP2"
                    ? "Player 2 total"
                    : "Player 1 total"}
              </p>
              <p className="font-[family-name:var(--font-heading)] text-6xl font-semibold text-amber-300 tabular-nums">
                {state.phase === "rapidFireScore"
                  ? state.rapidP1Total + state.rapidP2Total
                  : state.phase === "rapidFireP2"
                    ? state.rapidP2Total
                    : state.rapidP1Total}
              </p>
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <RapidColumn
                title="Player 1"
                answers={state.phase === "rapidFireP2" ? [] : state.rapidP1Answers}
                total={state.rapidP1Total}
                hidden={state.phase === "rapidFireP2"}
                slots={state.rapidQuestions.length || 5}
              />
              <RapidColumn
                title="Player 2"
                answers={
                  state.phase === "rapidFireP1" ? [] : state.rapidP2Answers
                }
                total={state.rapidP2Total}
                hidden={state.phase === "rapidFireP1"}
                slots={state.rapidQuestions.length || 5}
              />
            </div>
          </div>
        ) : null}

        {showBoard ? (
          <div className="mt-8 grid flex-1 gap-3 md:grid-cols-2">
            {state.board.map((slot, index) => (
              <BoardFlipCard
                key={`${slot.answer.text}-${index}`}
                index={index}
                text={slot.answer.text}
                points={slot.answer.points}
                revealed={slot.revealed}
                justRevealed={state.lastRevealedIndex === index && slot.revealed}
              />
            ))}
          </div>
        ) : null}

        {state.phase === "award" ? (
          <p className="mt-6 text-center font-[family-name:var(--font-heading)] text-3xl text-amber-300">
            {state.message}
          </p>
        ) : null}
      </div>
    </TvShell>
    </TvViewStage>,
  );
};

const useTvConfetti = (confettiNonce: number, sfxCue: SfxCue) => {
  useEffect(() => {
    if (confettiNonce === 0) return;
    const delay =
      sfxCue === "strike" ? STEAL_FAIL_CONFETTI_DELAY_MS : 0;
    const timer = window.setTimeout(() => {
      void confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#f5d76e", "#f0a830", "#fff7d6", "#e8c547"],
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [confettiNonce, sfxCue]);
};

type StrikeFlashOverlayProps = {
  cue: SfxCue;
  nonce: number;
};

const StrikeFlashOverlay = ({ cue, nonce }: StrikeFlashOverlayProps) => {
  const [flashKey, setFlashKey] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (nonce === 0) return;
    if (cue !== "strike" && cue !== "buzzer") return;
    setFlashKey(nonce);
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), STRIKE_FLASH_MS);
    return () => window.clearTimeout(timer);
  }, [cue, nonce]);

  if (!visible || flashKey === 0) return null;

  return (
    <div
      key={flashKey}
      className="strike-flash-overlay pointer-events-none fixed inset-0 z-50 grid place-items-center"
      aria-hidden
    >
      <div className="strike-flash-card grid size-[min(42vw,16rem)] place-items-center rounded-[2rem] border-4 border-rose-400 bg-rose-600/90 shadow-[0_0_80px_rgba(244,63,94,0.45)]">
        <X
          className="size-[min(28vw,10rem)] stroke-[3.5] text-white"
          absoluteStrokeWidth
        />
      </div>
    </div>
  );
};

type TvViewMode =
  | "branding"
  | "scores"
  | "buzzer"
  | "rapid"
  | "final"
  | "gameplay";

const TvViewStage = ({
  mode,
  children,
}: {
  mode: TvViewMode;
  children: ReactNode;
}) => (
  <div className={`tv-view-stage tv-view-stage--${mode}`}>{children}</div>
);

const TvShell = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-[100dvh] overflow-hidden bg-[#070b16] text-white">
    <Image
      src={ASSETS.boardArt}
      alt=""
      fill
      priority
      className="object-cover opacity-35"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#070b16]/70 via-[#0b1220]/85 to-[#070b16]" />
    {children}
  </div>
);

type TeamFocusCardProps = {
  name: string;
  score?: number;
  showScore?: boolean;
  winner?: boolean;
  waiting?: boolean;
  dimmed?: boolean;
  motionClass?: string;
};

const TeamFocusCard = ({
  name,
  score = 0,
  showScore = false,
  winner = false,
  waiting = false,
  dimmed = false,
  motionClass = "",
}: TeamFocusCardProps) => (
  <div className={motionClass || undefined}>
    <div
      className={`flex min-h-[14rem] flex-col items-center justify-center rounded-[2rem] border px-8 py-10 text-center transition duration-300 md:min-h-[18rem] ${
        winner
          ? "buzzer-winner-card scale-[1.03] border-amber-300/70 bg-amber-400/20 shadow-[0_0_60px_rgba(245,215,110,0.28)]"
          : waiting
            ? "buzzer-waiting-card border-white/20 bg-black/45"
            : dimmed
              ? "scale-95 border-white/10 bg-black/30 opacity-45"
              : "border-amber-300/30 bg-black/40"
      }`}
    >
      {winner ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
          First buzz
        </p>
      ) : null}
      <p className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
        {name}
      </p>
      {showScore ? (
        <p className="mt-6 font-[family-name:var(--font-heading)] text-7xl font-semibold tabular-nums text-amber-300 md:text-8xl">
          {score}
        </p>
      ) : null}
    </div>
  </div>
);

type BoardFlipCardProps = {
  index: number;
  text: string;
  points: number;
  revealed: boolean;
  justRevealed: boolean;
};

const BoardFlipCard = ({
  index,
  text,
  points,
  revealed,
  justRevealed,
}: BoardFlipCardProps) => (
  <div className="board-flip-scene min-h-20">
    <div
      className={`board-flip-card ${revealed ? "is-flipped" : ""} ${justRevealed ? "is-just-revealed" : ""
        }`}
    >
      <div className="board-flip-face board-flip-back flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-full bg-white/10 font-mono text-lg text-amber-200">
            {index + 1}
          </span>
          <span className="text-xl font-medium tracking-[0.35em] text-slate-500 md:text-2xl">
            ••••••••
          </span>
        </div>
      </div>
      <div
        className={`board-flip-face board-flip-front flex items-center justify-between rounded-2xl border px-5 py-4 ${justRevealed
          ? "border-emerald-400/70 bg-emerald-500/25 shadow-[0_0_30px_rgba(52,211,153,0.25)]"
          : "border-emerald-400/40 bg-emerald-500/15"
          }`}
      >
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-full bg-white/10 font-mono text-lg text-amber-200">
            {index + 1}
          </span>
          <span className="text-xl font-medium md:text-2xl">{text}</span>
        </div>
        <span className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-amber-300 tabular-nums">
          {points}
        </span>
      </div>
    </div>
  </div>
);

type ScorePillProps = {
  name: string;
  score: number;
  active: boolean;
  side: "left" | "right";
  compact?: boolean;
  badge?: string | null;
};

const ScorePill = ({ name, score, active, side, compact, badge }: ScorePillProps) => (
  <div
    className={`rounded-2xl border px-3 py-2 transition duration-300 md:px-4 md:py-3 ${active
      ? "scale-[1.02] border-amber-300/50 bg-amber-400/15 shadow-[0_0_40px_rgba(245,215,110,0.15)]"
      : "border-white/10 bg-black/35"
      } ${side === "right" ? "md:text-right" : ""}`}
  >
    {badge ? (
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-rose-300">
        {badge}
      </p>
    ) : null}
    <p
      className={`truncate font-[family-name:var(--font-heading)] font-semibold ${compact ? "text-base md:text-lg" : "text-xl"
        }`}
    >
      {name}
    </p>
    <p
      className={`font-[family-name:var(--font-heading)] font-semibold tabular-nums text-amber-300 ${compact ? "text-2xl md:text-3xl" : "text-4xl"
        }`}
    >
      {score}
    </p>
  </div>
);

type OrderColumnProps = {
  title: string;
  items: string[];
  highlightAgainst: string[] | null;
  dragFrom?: number | null;
  dragTo?: number | null;
  draggingText?: string | null;
};

const OrderColumn = ({
  title,
  items,
  highlightAgainst,
  dragFrom = null,
  dragTo = null,
  draggingText = null,
}: OrderColumnProps) => (
  <div>
    <p className="mb-3 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
      {title}
    </p>
    <div className="grid gap-2">
      {items.map((item, index) => {
        const isCorrect = highlightAgainst
          ? highlightAgainst[index] === item
          : null;
        const isDropTarget =
          draggingText !== null && dragTo === index && dragFrom !== dragTo;
        const isDragging =
          draggingText !== null &&
          (dragTo === index || (dragFrom === index && dragTo === index));
        return (
          <div
            key={`${title}-${item}-${index}`}
            className={`jumble-slot rounded-2xl border px-4 py-3 text-center text-lg font-medium ${isCorrect === true
              ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
              : isCorrect === false
                ? "border-rose-400/40 bg-rose-500/15 text-rose-100"
                : isDragging
                  ? "jumble-slot-dragging border-amber-300/70 bg-amber-400/25 text-amber-50"
                  : isDropTarget
                    ? "jumble-slot-target border-sky-300/60 bg-sky-500/20 text-sky-50"
                    : "border-amber-300/30 bg-black/40"
              }`}
          >
            <span className="mr-2 text-slate-500">{index + 1}.</span>
            {item}
          </div>
        );
      })}
    </div>
  </div>
);

type RapidColumnProps = {
  title: string;
  answers: RapidAnswer[];
  total: number;
  hidden: boolean;
  slots: number;
};

const RapidColumn = ({
  title,
  answers,
  total,
  hidden,
  slots,
}: RapidColumnProps) => (
  <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
    <div className="mb-3 flex items-baseline justify-between gap-2">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-amber-300 tabular-nums">
        {hidden ? "—" : total}
      </p>
    </div>
    {hidden ? (
      <p className="py-8 text-center text-sm text-slate-500">Hidden</p>
    ) : (
      <ul className="space-y-2">
        {Array.from({ length: slots }).map((_, index) => {
          const answer = answers.find((item) => item.questionIndex === index);
          return (
            <li
              key={`${title}-${index}`}
              className="flex min-h-12 items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2"
            >
              <span className="text-slate-500">{index + 1}.</span>
              <span className="flex-1 px-2 text-left">
                {answer ? answer.text : "—"}
              </span>
              <span className="font-semibold text-amber-300 tabular-nums">
                {answer ? `+${answer.points}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default TvPanel;
