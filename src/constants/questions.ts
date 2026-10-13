export type SurveyAnswer = {
  text: string;
  points: number;
  aliases?: string[];
};

export type SurveyQuestion = {
  id: string;
  prompt: string;
  answers: SurveyAnswer[];
};

export type RapidFireSet = {
  id: string;
  questions: SurveyQuestion[];
};

export type FinalRound = {
  id: string;
  prompt: string;
  orderedAnswers: string[];
};

export const BOARD_QUESTIONS: SurveyQuestion[] = [
  {
    id: "bq-1",
    prompt: "Name something people forget when leaving the house",
    answers: [
      { text: "Keys", points: 32, aliases: ["house keys", "car keys"] },
      { text: "Phone", points: 28, aliases: ["mobile", "cellphone"] },
      { text: "Wallet", points: 18, aliases: ["purse"] },
      { text: "Sunglasses", points: 10 },
      { text: "Umbrella", points: 7 },
      { text: "Water bottle", points: 5, aliases: ["bottle"] },
    ],
  },
  {
    id: "bq-2",
    prompt: "Name a popular weekend activity for families",
    answers: [
      { text: "Movies", points: 30, aliases: ["cinema", "film"] },
      { text: "Picnic", points: 22 },
      { text: "Park", points: 18, aliases: ["playground"] },
      { text: "Shopping", points: 14, aliases: ["mall"] },
      { text: "Restaurant", points: 10, aliases: ["dining out", "eating out"] },
      { text: "Board games", points: 6, aliases: ["games"] },
    ],
  },
  {
    id: "bq-3",
    prompt: "Name something you find in a cricket stadium",
    answers: [
      { text: "Pitch", points: 28 },
      { text: "Crowd", points: 24, aliases: ["fans", "audience"] },
      { text: "Scoreboard", points: 18 },
      { text: "Stumps", points: 14, aliases: ["wickets"] },
      { text: "Vendors", points: 10, aliases: ["food stalls"] },
      { text: "Cameras", points: 6 },
    ],
  },
  {
    id: "bq-4",
    prompt: "Name a dish people order at a wedding buffet",
    answers: [
      { text: "Paneer", points: 26, aliases: ["paneer butter masala"] },
      { text: "Biryani", points: 24 },
      { text: "Gulab jamun", points: 18, aliases: ["dessert", "sweets"] },
      { text: "Naan", points: 14, aliases: ["roti", "bread"] },
      { text: "Salad", points: 10 },
      { text: "Ice cream", points: 8 },
    ],
  },
  {
    id: "bq-5",
    prompt: "Name something kids argue about in the car",
    answers: [
      { text: "Window seat", points: 34, aliases: ["seat"] },
      { text: "Music", points: 22, aliases: ["songs", "radio"] },
      { text: "AC", points: 16, aliases: ["temperature", "air"] },
      { text: "Snacks", points: 12, aliases: ["food"] },
      { text: "Touching", points: 9, aliases: ["space", "kicking"] },
      { text: "Phone", points: 7, aliases: ["games", "tablet"] },
    ],
  },
  {
    id: "bq-6",
    prompt: "Name a reason someone is late to a family dinner",
    answers: [
      { text: "Traffic", points: 36 },
      { text: "Work", points: 22, aliases: ["office"] },
      { text: "Getting ready", points: 16, aliases: ["dressing", "makeup"] },
      { text: "Lost track of time", points: 12, aliases: ["forgot time"] },
      { text: "Kids", points: 8 },
      { text: "Wrong address", points: 6, aliases: ["directions"] },
    ],
  },
  {
    id: "bq-7",
    prompt: "Name something people do first thing in the morning",
    answers: [
      { text: "Check phone", points: 30, aliases: ["phone", "social media"] },
      { text: "Brush teeth", points: 24 },
      { text: "Coffee", points: 18, aliases: ["tea", "chai"] },
      { text: "Alarm snooze", points: 14, aliases: ["snooze", "alarm"] },
      { text: "Stretch", points: 8, aliases: ["exercise", "yoga"] },
      { text: "Shower", points: 6 },
    ],
  },
  {
    id: "bq-8",
    prompt: "Name a gift people give at a housewarming",
    answers: [
      { text: "Plant", points: 28, aliases: ["flowers"] },
      { text: "Kitchenware", points: 22, aliases: ["utensils", "cookware"] },
      { text: "Sweets", points: 18, aliases: ["mithai", "dessert"] },
      { text: "Decor", points: 14, aliases: ["frame", "painting"] },
      { text: "Cash", points: 10, aliases: ["money", "envelope"] },
      { text: "Wine", points: 8, aliases: ["bottle"] },
    ],
  },
];

export const RAPID_FIRE_SET: RapidFireSet = {
  id: "rf-1",
  questions: [
    {
      id: "rf-q1",
      prompt: "Name a fruit that is yellow",
      answers: [
        { text: "Banana", points: 45 },
        { text: "Mango", points: 30 },
        { text: "Lemon", points: 15 },
        { text: "Pineapple", points: 10 },
      ],
    },
    {
      id: "rf-q2",
      prompt: "Name something you pack for a beach trip",
      answers: [
        { text: "Sunscreen", points: 40 },
        { text: "Towel", points: 25 },
        { text: "Swimsuit", points: 20 },
        { text: "Umbrella", points: 15 },
      ],
    },
    {
      id: "rf-q3",
      prompt: "Name a pet people keep at home",
      answers: [
        { text: "Dog", points: 42 },
        { text: "Cat", points: 28 },
        { text: "Fish", points: 16 },
        { text: "Bird", points: 14 },
      ],
    },
    {
      id: "rf-q4",
      prompt: "Name a school subject",
      answers: [
        { text: "Math", points: 35, aliases: ["maths", "mathematics"] },
        { text: "Science", points: 25 },
        { text: "English", points: 22 },
        { text: "History", points: 18 },
      ],
    },
    {
      id: "rf-q5",
      prompt: "Name something cold from the fridge",
      answers: [
        { text: "Milk", points: 30 },
        { text: "Juice", points: 25 },
        { text: "Ice cream", points: 24 },
        { text: "Water", points: 21 },
      ],
    },
  ],
};

export const FINAL_ROUND: FinalRound = {
  id: "final-1",
  prompt: "Rank the most common things people do on a Sunday morning",
  orderedAnswers: [
    "Sleep in",
    "Have breakfast",
    "Watch TV",
    "Go for a walk",
    "Read newspaper",
    "Visit family",
  ],
};

export const QUESTIONS_PER_BOARD_ROUND = 2;
export const BOARD_ROUND_COUNT = 3;
export const MAX_STRIKES = 3;
export const RAPID_FIRE_TARGET = 200;
export const RAPID_FIRE_P1_SECONDS = 30;
export const RAPID_FIRE_P2_SECONDS = 35;
export const FINAL_ROUND_SECONDS = 60;
export const ANSWER_WINDOW_SECONDS = 10;

export const roundMultiplier = (round: number): number => {
  if (round <= 1) return 1;
  if (round === 2) return 2;
  return 3;
};
