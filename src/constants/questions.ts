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

export type FinalRound = {
  id: string;
  prompt: string;
  orderedAnswers: string[];
};

/** Shared survey pool from dataset.csv — used for board, rapid fire, and jumble. */
export const BOARD_QUESTIONS: SurveyQuestion[] = [
  {
    id: "bq-1",
    prompt: "Couples apne partner ko pyaar se kis naam se bulaate hai?",
    answers: [
      { text: "Jaanu/Jaan", points: 30,
        aliases: ["Jaanu","Jaan"],
      },
      { text: "Baby", points: 20 },
      { text: "Honey", points: 14 },
      { text: "My love", points: 7 },
      { text: "Shona", points: 7 },
    ],
  },
  {
    id: "bq-2",
    prompt: "Subah uthte hi log sabse pehle kya karte hai?",
    answers: [
      { text: "Phone dekhte hai", points: 35 },
      { text: "Brush karte hai", points: 20 },
      { text: "Chai peete hai", points: 18 },
      { text: "Bhagwan ko pranam karte hai", points: 12 },
      { text: "Paani peete hai", points: 8 },
    ],
  },
  {
    id: "bq-3",
    prompt: "Indian ghar mein sabse zyada kaun si cheez kho jaati hai?",
    answers: [
      { text: "TV/AC ka remote", points: 32,
        aliases: ["TV","AC ka remote"],
      },
      { text: "Chaabi", points: 28 },
      { text: "Mobile charger", points: 16 },
      { text: "Chasma", points: 12 },
      { text: "Chappal", points: 8 },
    ],
  },
  {
    id: "bq-4",
    prompt: "Shaadi mein log sabse zyada kis cheez ka intezaar karte hai?",
    answers: [
      { text: "Khaana", points: 40 },
      { text: "Baraat/Dance", points: 22,
        aliases: ["Baraat","Dance"],
      },
      { text: "Dulha-Dulhan ki entry", points: 15 },
      { text: "Phere", points: 10 },
      { text: "Shagun/Gifts", points: 6,
        aliases: ["Shagun","Gifts"],
      },
    ],
  },
  {
    id: "bq-5",
    prompt: "Log chai ke saath kya khaana pasand karte hai?",
    answers: [
      { text: "Biscuit", points: 34 },
      { text: "Samosa", points: 18 },
      { text: "Pakode", points: 16 },
      { text: "Rusk", points: 12 },
      { text: "Namkeen/Bhujia", points: 10,
        aliases: ["Namkeen","Bhujia"],
      },
    ],
  },
  {
    id: "bq-6",
    prompt: "Ghar se nikalte waqt log sabse zyada kya bhoolte hai?",
    answers: [
      { text: "Chaabi", points: 28 },
      { text: "Wallet/Purse", points: 26,
        aliases: ["Wallet","Purse"],
      },
      { text: "Mobile", points: 20 },
      { text: "Charger", points: 12 },
      { text: "Paani ki bottle", points: 8 },
    ],
  },
  {
    id: "bq-7",
    prompt: "Indian kitchen mein kaun si cheez ke bina kaam nahi chalta?",
    answers: [
      { text: "Namak", points: 26 },
      { text: "Pressure cooker", points: 22 },
      { text: "Haldi", points: 18 },
      { text: "Tawa", points: 14 },
      { text: "Pyaaz", points: 10 },
    ],
  },
  {
    id: "bq-8",
    prompt: "Sabse popular street food kaun sa hai?",
    answers: [
      { text: "Pani puri/Golgappa", points: 38,
        aliases: ["Pani puri","Golgappa"],
      },
      { text: "Chaat", points: 16 },
      { text: "Vada pav", points: 14 },
      { text: "Samosa", points: 12 },
      { text: "Momos", points: 10 },
      { text: "Pav bhaji", points: 6 },
    ],
  },
  {
    id: "bq-9",
    prompt: "Exam se pehle students kya karte hai?",
    answers: [
      { text: "Bhagwan se prarthna", points: 30 },
      { text: "Last minute padhai", points: 28 },
      { text: "Dahi-cheeni khaate hai", points: 14 },
      { text: "Ghabrate hai", points: 12 },
      { text: "Doston se discuss karte hai", points: 8 },
    ],
  },
  {
    id: "bq-10",
    prompt: "Mummy ka sabse common dialogue kya hota hai?",
    answers: [
      { text: "Khaana kha liya?", points: 28 },
      { text: "Padhai kar li?", points: 22 },
      { text: "Phone rakh do", points: 20 },
      { text: "Sharma ji ka beta dekho", points: 14 },
      { text: "Jaldi so jao", points: 10 },
    ],
  },
  {
    id: "bq-11",
    prompt: "Salary aate hi log sabse pehle kya karte hai?",
    answers: [
      { text: "EMI/Bills bharte hai", points: 38,
        aliases: ["EMI","Bills bharte hai"],
      },
      { text: "Ghar paise bhejte hai", points: 16 },
      { text: "Shopping karte hai", points: 14 },
      { text: "Saving/SIP karte hai", points: 14,
        aliases: ["Saving","SIP karte hai"],
      },
      { text: "Udhaar chukate hai", points: 10 },
      { text: "Party karte hai", points: 6 },
    ],
  },
  {
    id: "bq-12",
    prompt: "Aapka favourite cricketer kaun hai?",
    answers: [
      { text: "Virat Kohli", points: 36 },
      { text: "MS Dhoni", points: 26 },
      { text: "Rohit Sharma", points: 20 },
      { text: "Sachin Tendulkar", points: 12 },
      { text: "Hardik Pandya", points: 4 },
    ],
  },
  {
    id: "bq-13",
    prompt: "Ladki ko shaadi ke liye ladke mein sabse zyada kya chahiye?",
    answers: [
      { text: "Achhi naukri", points: 28 },
      { text: "Samajhdaar hona", points: 22 },
      { text: "Family ki respect", points: 18 },
      { text: "Achha dikhna", points: 12 },
      { text: "Paisa", points: 10 },
    ],
  },
  {
    id: "bq-14",
    prompt: "Garmi mein log kya peena pasand karte hai?",
    answers: [
      { text: "Nimbu paani", points: 30 },
      { text: "Lassi/Chaas", points: 20,
        aliases: ["Lassi","Chaas"],
      },
      { text: "Thanda paani", points: 16 },
      { text: "Cold drink", points: 14 },
      { text: "Aam panna", points: 8 },
      { text: "Ganne ka ras", points: 6 },
    ],
  },
  {
    id: "bq-15",
    prompt: "Train mein safar karte waqt log kya saath le jaate hai?",
    answers: [
      { text: "Khaana/Tiffin", points: 32,
        aliases: ["Khaana","Tiffin"],
      },
      { text: "Charger/Powerbank", points: 24,
        aliases: ["Charger","Powerbank"],
      },
      { text: "Paani ki bottle", points: 16 },
      { text: "Chadar", points: 12 },
      { text: "Earphones", points: 10 },
    ],
  },
  {
    id: "bq-16",
    prompt: "Log mobile mein sabse zyada kaun si app use karte hai?",
    answers: [
      { text: "WhatsApp", points: 38 },
      { text: "Instagram", points: 24 },
      { text: "YouTube", points: 20 },
      { text: "Facebook", points: 8 },
      { text: "PhonePe/Google Pay", points: 6,
        aliases: ["PhonePe","Google Pay"],
      },
    ],
  },
  {
    id: "bq-17",
    prompt: "Pati-patni sabse zyada kis baat pe ladte hai?",
    answers: [
      { text: "Time na dena", points: 24 },
      { text: "Ghar ke kaam", points: 20 },
      { text: "Paise ke kharche", points: 18 },
      { text: "Rishtedaar", points: 16 },
      { text: "Phone mein busy rehna", points: 12 },
    ],
  },
  {
    id: "bq-18",
    prompt: "Diwali pe log sabse pehle kya karte hai?",
    answers: [
      { text: "Ghar ki safai", points: 30 },
      { text: "Lakshmi puja", points: 26 },
      { text: "Mithai khareedte hai", points: 16 },
      { text: "Rangoli banate hai", points: 12 },
      { text: "Naye kapde lete hai", points: 10 },
    ],
  },
  {
    id: "bq-19",
    prompt: "Dulhan shaadi mein kis rang ka joda pehenti hai?",
    answers: [
      { text: "Laal", points: 70 },
      { text: "Maroon", points: 12 },
      { text: "Gulabi", points: 8 },
      { text: "Golden", points: 4 },
      { text: "Peela", points: 2 },
    ],
  },
  {
    id: "bq-20",
    prompt: "Ghar mein log sabse zyada time kahan bitate hai?",
    answers: [
      { text: "Bedroom", points: 34 },
      { text: "Drawing room", points: 26 },
      { text: "Kitchen", points: 18 },
      { text: "Chhat/Balcony", points: 12,
        aliases: ["Chhat","Balcony"],
      },
      { text: "Bathroom", points: 6 },
    ],
  },
  {
    id: "bq-21",
    prompt: "Bachche school na jaane ke liye kya bahana banate hai?",
    answers: [
      { text: "Pet dard", points: 42 },
      { text: "Sir dard", points: 22 },
      { text: "Bukhaar", points: 18 },
      { text: "Ulti aa rahi hai", points: 8 },
      { text: "Homework nahi kiya", points: 6 },
    ],
  },
  {
    id: "bq-22",
    prompt: "Dost se udhaar maangte waqt log kya kehte hai?",
    answers: [
      { text: "Medical emergency hai", points: 24 },
      { text: "Wallet ghar bhool gaya", points: 22 },
      { text: "Salary aane pe de dunga", points: 20 },
      { text: "Ghar mein emergency hai", points: 18 },
      { text: "Petrol daalna hai", points: 10 },
    ],
  },
  {
    id: "bq-23",
    prompt: "Shaadi mein sabse zyada kharcha kis cheez pe hota hai?",
    answers: [
      { text: "Venue/Hall", points: 30,
        aliases: ["Venue","Hall"],
      },
      { text: "Khaana/Catering", points: 28,
        aliases: ["Khaana","Catering"],
      },
      { text: "Gehne", points: 20 },
      { text: "Decoration", points: 12 },
      { text: "Kapde", points: 8 },
    ],
  },
  {
    id: "bq-24",
    prompt: "Subah ke nashte mein log kya khaate hai?",
    answers: [
      { text: "Paratha", points: 26 },
      { text: "Poha", points: 22 },
      { text: "Sandwich/Bread-butter", points: 16,
        aliases: ["Sandwich","Bread-butter"],
      },
      { text: "Idli-Dosa", points: 12 },
      { text: "Daliya/Cornflakes", points: 8,
        aliases: ["Daliya","Cornflakes"],
      },
    ],
  },
  {
    id: "bq-25",
    prompt: "Raat ko neend na aaye toh log kya karte hai?",
    answers: [
      { text: "Phone chalate hai", points: 48 },
      { text: "TV/Web series dekhte hai", points: 20,
        aliases: ["TV","Web series dekhte hai"],
      },
      { text: "Gaane sunte hai", points: 12 },
      { text: "Paani peete hai", points: 8 },
      { text: "Kitaab padhte hai", points: 6 },
    ],
  },
  {
    id: "bq-26",
    prompt: "Log shopping kahan se karna pasand karte hai?",
    answers: [
      { text: "Online (Amazon/Flipkart)", points: 42,
        aliases: ["Online","Amazon","Flipkart"],
      },
      { text: "Local market", points: 28 },
      { text: "Mall", points: 18 },
      { text: "Branded showroom", points: 8 },
    ],
  },
  {
    id: "bq-27",
    prompt: "Mehmaan ghar aaye toh sabse pehle kya dete hai?",
    answers: [
      { text: "Paani", points: 48 },
      { text: "Chai", points: 34 },
      { text: "Cold drink", points: 10 },
      { text: "Nashta", points: 6 },
    ],
  },
  {
    id: "bq-28",
    prompt: "Aapka favourite Bollywood actor kaun hai?",
    answers: [
      { text: "Shah Rukh Khan", points: 34 },
      { text: "Salman Khan", points: 20 },
      { text: "Amitabh Bachchan", points: 16 },
      { text: "Akshay Kumar", points: 12 },
      { text: "Ranveer Singh", points: 8 },
      { text: "Aamir Khan", points: 6 },
    ],
  },
  {
    id: "bq-29",
    prompt: "Weekend pe log kya karna pasand karte hai?",
    answers: [
      { text: "Aaram/Sona", points: 32,
        aliases: ["Aaram","Sona"],
      },
      { text: "Family ke saath bahar jaana", points: 20 },
      { text: "Movie/Web series dekhna", points: 18,
        aliases: ["Movie","Web series dekhna"],
      },
      { text: "Doston se milna", points: 14 },
      { text: "Ghar ke kaam", points: 10 },
    ],
  },
  {
    id: "bq-30",
    prompt: "Baarish mein log kya khaana pasand karte hai?",
    answers: [
      { text: "Pakode", points: 44 },
      { text: "Garam chai", points: 22 },
      { text: "Bhutta", points: 16 },
      { text: "Samosa", points: 8 },
      { text: "Jalebi", points: 6 },
    ],
  },
  {
    id: "bq-31",
    prompt: "Naya phone kharidte waqt log sabse pehle kya dekhte hai?",
    answers: [
      { text: "Camera", points: 30 },
      { text: "Price", points: 26 },
      { text: "Battery", points: 18 },
      { text: "Brand", points: 14 },
      { text: "RAM/Storage", points: 10,
        aliases: ["RAM","Storage"],
      },
    ],
  },
  {
    id: "bq-32",
    prompt: "Pati der raat ghar aaye toh patni kya kehti hai?",
    answers: [
      { text: "Kahan the ab tak?", points: 40 },
      { text: "Khaana garam kar dun?", points: 24 },
      { text: "Phone kyun nahi uthaya?", points: 20 },
      { text: "Haath-muh dho lo", points: 8 },
      { text: "Chup chaap so jao", points: 4 },
    ],
  },
  {
    id: "bq-33",
    prompt: "Gussa aane pe log kya karte hai?",
    answers: [
      { text: "Chillakar bolte hai", points: 28 },
      { text: "Chup ho jaate hai", points: 26 },
      { text: "Baat karna band kar dete hai", points: 22 },
      { text: "Cheezein patakte hai", points: 10 },
      { text: "Bahar ghoomne nikal jaate hai", points: 8 },
      { text: "Khaana nahi khaate", points: 4 },
    ],
  },
  {
    id: "bq-34",
    prompt: "Aapka favourite tyohaar kaun sa hai?",
    answers: [
      { text: "Diwali", points: 46 },
      { text: "Holi", points: 24 },
      { text: "Navratri/Garba", points: 10,
        aliases: ["Navratri","Garba"],
      },
      { text: "Eid", points: 8 },
      { text: "Rakshabandhan", points: 6 },
    ],
  },
  {
    id: "bq-35",
    prompt: "Naye saal pe log kaun si resolution lete hai?",
    answers: [
      { text: "Fit rehna/Gym jaana", points: 32,
        aliases: ["Fit rehna","Gym jaana"],
      },
      { text: "Paise bachana", points: 24 },
      { text: "Nayi skill seekhna", points: 14 },
      { text: "Buri aadat chhodna", points: 14 },
      { text: "Phone kam use karna", points: 10 },
      { text: "Ghoomne jaana", points: 4 },
    ],
  },
  {
    id: "bq-36",
    prompt: "Log gift mein sabse zyada kya dena pasand karte hai?",
    answers: [
      { text: "Kapde", points: 28 },
      { text: "Mithai/Dry fruits", points: 22,
        aliases: ["Mithai","Dry fruits"],
      },
      { text: "Cash/Shagun", points: 20,
        aliases: ["Cash","Shagun"],
      },
      { text: "Ghadi/Jewellery", points: 14,
        aliases: ["Ghadi","Jewellery"],
      },
      { text: "Phool/Chocolate", points: 10,
        aliases: ["Phool","Chocolate"],
      },
    ],
  },
  {
    id: "bq-37",
    prompt: "Honeymoon ke liye log kaun si jagah chunte hai?",
    answers: [
      { text: "Goa", points: 26 },
      { text: "Manali", points: 22 },
      { text: "Kashmir", points: 18 },
      { text: "Kerala", points: 12 },
      { text: "Shimla", points: 10 },
    ],
  },
  {
    id: "bq-38",
    prompt: "Doctor ke paas jaane se pehle log kya karte hai?",
    answers: [
      { text: "Google pe symptoms search karte hai", points: 36 },
      { text: "Dadi/Nani ka nuskha try karte hai", points: 30,
        aliases: ["Dadi","Nani ka nuskha try karte hai"],
      },
      { text: "Khud dawai le lete hai", points: 14 },
      { text: "Dost/Rishtedaar se poochte hai", points: 12,
        aliases: ["Dost","Rishtedaar se poochte hai"],
      },
      { text: "Intezaar karte hai", points: 6 },
    ],
  },
  {
    id: "bq-39",
    prompt: "Online payment (UPI) se log sabse zyada kiske liye paise dete hai?",
    answers: [
      { text: "Kirana/Sabzi", points: 30,
        aliases: ["Kirana","Sabzi"],
      },
      { text: "Mobile recharge/Bills", points: 24,
        aliases: ["Mobile recharge","Bills"],
      },
      { text: "Online khaana", points: 18 },
      { text: "Petrol", points: 14 },
      { text: "Shopping", points: 10 },
    ],
  },
  {
    id: "bq-40",
    prompt: "Bijli chali jaaye toh log kya karte hai?",
    answers: [
      { text: "Phone ki torch jalate hai", points: 30 },
      { text: "Chhat/Bahar nikal jaate hai", points: 24,
        aliases: ["Chhat","Bahar nikal jaate hai"],
      },
      { text: "Bijli vibhag ko call karte hai", points: 20 },
      { text: "Sone chale jaate hai", points: 14 },
      { text: "Mombatti jalate hai", points: 10 },
    ],
  },
];

export const QUESTIONS_PER_BOARD_ROUND = 2;
export const BOARD_ROUND_COUNT = 3;
export const MAX_STRIKES = 3;
export const RAPID_FIRE_QUESTION_COUNT = 5;
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

const shuffleIndexes = (indexes: number[]): number[] => {
  const deck = [...indexes];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

/** Fisher–Yates shuffle of dataset indexes for one game session. */
export const createShuffledBoardDeck = (): number[] =>
  shuffleIndexes(BOARD_QUESTIONS.map((_, index) => index));

export const getBoardQuestionFromDeck = (
  deck: number[],
  deckIndex: number,
): SurveyQuestion | null => {
  const sourceIndex = deck[deckIndex];
  if (sourceIndex === undefined) return null;
  return BOARD_QUESTIONS[sourceIndex] ?? null;
};

/** Random subset from the shared pool (used for rapid fire). */
export const pickRandomQuestions = (
  count: number,
  excludeIds: string[] = [],
): SurveyQuestion[] => {
  const excluded = new Set(excludeIds);
  const pool = BOARD_QUESTIONS.filter((question) => !excluded.has(question.id));
  const source = pool.length >= count ? pool : BOARD_QUESTIONS;
  const picked = shuffleIndexes(source.map((_, index) => index)).slice(0, count);
  return picked
    .map((index) => source[index])
    .filter((question): question is SurveyQuestion => Boolean(question));
};

/** Jumble answer order from survey points (highest first). */
export const buildFinalRound = (question: SurveyQuestion): FinalRound => ({
  id: question.id,
  prompt: question.prompt,
  orderedAnswers: [...question.answers]
    .sort((left, right) => right.points - left.points)
    .map((answer) => answer.text),
});

export const pickFinalRound = (excludeIds: string[] = []): FinalRound => {
  const [question] = pickRandomQuestions(1, excludeIds);
  const fallback = BOARD_QUESTIONS[0];
  if (!question && !fallback) {
    return { id: "final-empty", prompt: "No questions available", orderedAnswers: [] };
  }
  return buildFinalRound(question ?? fallback);
};
