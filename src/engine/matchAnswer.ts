import type { SurveyAnswer } from "../constants/questions";

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    // Keep Latin + Devanagari letters/digits so Hindi answers still match.
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");

export const findAnswerIndex = (
  guess: string,
  answers: SurveyAnswer[],
): number => {
  const normalizedGuess = normalize(guess);
  if (!normalizedGuess) return -1;

  return answers.findIndex((answer) => {
    const candidates = [answer.text, ...(answer.aliases ?? [])].map(normalize);
    return candidates.some(
      (candidate) =>
        candidate === normalizedGuess ||
        candidate.includes(normalizedGuess) ||
        normalizedGuess.includes(candidate),
    );
  });
};

export const filterAnswerMatches = (
  guess: string,
  answers: SurveyAnswer[],
): number[] => {
  const normalizedGuess = normalize(guess);
  if (!normalizedGuess) return answers.map((_, index) => index);

  return answers
    .map((answer, index) => ({ answer, index }))
    .filter(({ answer }) => {
      const candidates = [answer.text, ...(answer.aliases ?? [])].map(normalize);
      return candidates.some((candidate) => candidate.includes(normalizedGuess));
    })
    .map(({ index }) => index);
};
