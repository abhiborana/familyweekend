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

/** Board survey questions — answer counts follow the dataset (not padded to 6). */
export const BOARD_QUESTIONS: SurveyQuestion[] = [
  {
    id: "bq-1",
    prompt:
      "Bollywood films me doctor operation theatre se bahar aakar kya kehta hai?",
    answers: [
      {
        text: "Sorry wo nahi bach paye",
        points: 53,
        aliases: ["nahi bach paye", "sorry", "wo nahi bache"],
      },
      {
        text: "Operation succesful",
        points: 15,
        aliases: ["operation successful", "successful", "succesful"],
      },
      {
        text: "Bhagwan ka naam lijiye / Dua kijiye",
        points: 10,
        aliases: [
          "bhagwan ka naam lijiye",
          "dua kijiye",
          "bhagwan ka naam",
          "dua",
        ],
      },
      {
        text: "Wo ab khatre se bahar he",
        points: 8,
        aliases: ["khatre se bahar", "bahar he", "bahar hai"],
      },
      {
        text: "Congratulations/Good news",
        points: 5,
        aliases: ["congratulations", "good news", "congrats"],
      },
    ],
  },
  {
    id: "bq-2",
    prompt: "Couples pyaar se ek dusre ko kis naam se bulate hai?",
    answers: [
      { text: "Jaan/Jaanu", points: 29, aliases: ["jaan", "jaanu"] },
      { text: "Baby", points: 28 },
      { text: "Babu", points: 21 },
      { text: "My love", points: 11, aliases: ["love"] },
      { text: "Honey", points: 4 },
      { text: "Shona", points: 4 },
    ],
  },
  {
    id: "bq-3",
    prompt: "Rohit sharma ki batting ke alawa aur kya accha lagta hai?",
    answers: [
      {
        text: "Masti karna/ Daantna",
        points: 34,
        aliases: ["masti karna", "daantna", "masti", "daant"],
      },
      {
        text: "Cool attitude",
        points: 19,
        aliases: ["attitude", "cool"],
      },
      {
        text: "Style/ personality",
        points: 14,
        aliases: ["style", "personality"],
      },
      {
        text: "Simplicity/Humble nature",
        points: 6,
        aliases: ["simplicity", "humble", "humble nature"],
      },
    ],
  },
  {
    id: "bq-4",
    prompt: "Log garden me ghumne kyu jaate hai?",
    answers: [
      {
        text: "Fresh hawa khaane",
        points: 42,
        aliases: ["fresh hawa", "hawa khaane", "hawa"],
      },
      {
        text: "Time spend karne/ romantic date pe",
        points: 24,
        aliases: [
          "time spend karne",
          "romantic date",
          "date",
          "time spend",
        ],
      },
      {
        text: "Walk/exercise",
        points: 23,
        aliases: ["walk", "exercise", "walking"],
      },
      {
        text: "Acche nazaare dekhne",
        points: 9,
        aliases: ["nazaare", "nazaare dekhne", "scenery"],
      },
    ],
  },
  {
    id: "bq-5",
    prompt:
      "Ek chiz jo cricket fans apni team ka luck badalne ke liye karte hai?",
    answers: [
      {
        text: "Prayer/Chants",
        points: 50,
        aliases: ["prayer", "chants", "prayers", "chant"],
      },
      {
        text: "Seat/Jagah change karna",
        points: 25,
        aliases: ["seat change", "jagah change", "seat", "jagah"],
      },
      {
        text: "Fingers cross",
        points: 7,
        aliases: ["fingers crossed", "cross fingers"],
      },
      {
        text: "Lucky jersey/ t-shirt",
        points: 7,
        aliases: ["lucky jersey", "jersey", "t-shirt", "tshirt", "lucky t-shirt"],
      },
    ],
  },
  {
    id: "bq-6",
    prompt: "Kitchen me milne wali ek chiz jise log chehre par lagate hai?",
    answers: [
      { text: "Haldi", points: 54, aliases: ["turmeric"] },
      { text: "Besan", points: 22 },
      { text: "Dahi", points: 6, aliases: ["curd", "yogurt"] },
      { text: "Kheera", points: 4, aliases: ["cucumber"] },
      {
        text: "Chawal ka pani",
        points: 3,
        aliases: ["rice water", "chawal pani"],
      },
      { text: "Neembu", points: 3, aliases: ["nimbu", "lemon", "lime"] },
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

/** Jumble — answers ordered by survey popularity (highest first). */
export const FINAL_ROUND: FinalRound = {
  id: "final-1",
  prompt: "Ek aisa khana jiski khushbu se hi bhukh lag jaati ho?",
  orderedAnswers: [
    "Biryani",
    "Paaw bhaji",
    "Noodles",
    "Chhole bhature",
    "Paneer ki sabji",
    "Rajma chawal",
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
