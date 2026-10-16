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
    prompt: "कपल अपने पार्टनर को प्यार से किस नाम से बुलाते हैं?",
    answers: [
      { text: "जानू/जान", points: 30, aliases: ["जानू","जान"] },
      { text: "बेबी", points: 20 },
      { text: "हनी", points: 14 },
      { text: "माई लव", points: 7 },
      { text: "शोना", points: 7 },
    ],
  },
  {
    id: "bq-2",
    prompt: "सुबह उठते ही लोग सबसे पहले क्या करते हैं?",
    answers: [
      { text: "फोन देखते हैं", points: 35 },
      { text: "ब्रश करते हैं", points: 20 },
      { text: "चाय पीते हैं", points: 18 },
      { text: "भगवान को प्रणाम करते हैं", points: 12 },
      { text: "पानी पीते हैं", points: 8 },
    ],
  },
  {
    id: "bq-3",
    prompt: "भारतीय घर में सबसे ज़्यादा कौन सी चीज़ खो जाती है?",
    answers: [
      { text: "टीवी/एसी का रिमोट", points: 32, aliases: ["टीवी","एसी का रिमोट"] },
      { text: "चाबी", points: 28 },
      { text: "मोबाइल चार्जर", points: 16 },
      { text: "चश्मा", points: 12 },
      { text: "चप्पल", points: 8 },
    ],
  },
  {
    id: "bq-4",
    prompt: "शादी में लोग सबसे ज़्यादा किस चीज़ का इंतज़ार करते हैं?",
    answers: [
      { text: "खाना", points: 40 },
      { text: "बारात/डांस", points: 22, aliases: ["बारात","डांस"] },
      { text: "दूल्हा-दुल्हन की एंट्री", points: 15 },
      { text: "फेरे", points: 10 },
      { text: "शगुन/गिफ्ट्स", points: 6, aliases: ["शगुन","गिफ्ट्स"] },
    ],
  },
  {
    id: "bq-5",
    prompt: "लोग चाय के साथ क्या खाना पसंद करते हैं?",
    answers: [
      { text: "बिस्किट", points: 34 },
      { text: "समोसा", points: 18 },
      { text: "पकौड़े", points: 16 },
      { text: "रस्क", points: 12 },
      { text: "नमकीन/भुजिया", points: 10, aliases: ["नमकीन","भुजिया"] },
    ],
  },
  {
    id: "bq-6",
    prompt: "घर से निकलते वक़्त लोग सबसे ज़्यादा क्या भूलते हैं?",
    answers: [
      { text: "चाबी", points: 28 },
      { text: "वॉलेट/पर्स", points: 26, aliases: ["वॉलेट","पर्स"] },
      { text: "मोबाइल", points: 20 },
      { text: "चार्जर", points: 12 },
      { text: "पानी की बोतल", points: 8 },
    ],
  },
  {
    id: "bq-7",
    prompt: "भारतीय किचन में कौन सी चीज़ के बिना काम नहीं चलता?",
    answers: [
      { text: "नमक", points: 26 },
      { text: "प्रेशर कुकर", points: 22 },
      { text: "हल्दी", points: 18 },
      { text: "तवा", points: 14 },
      { text: "प्याज़", points: 10 },
    ],
  },
  {
    id: "bq-8",
    prompt: "सबसे पॉपुलर स्ट्रीट फ़ूड कौन सा है?",
    answers: [
      { text: "पानी पूरी/गोलगप्पा", points: 38, aliases: ["पानी पूरी","गोलगप्पा"] },
      { text: "चाट", points: 16 },
      { text: "वड़ा पाव", points: 14 },
      { text: "समोसा", points: 12 },
      { text: "मोमोज", points: 10 },
      { text: "पाव भाजी", points: 6 },
    ],
  },
  {
    id: "bq-9",
    prompt: "एग्ज़ाम से पहले स्टूडेंट्स क्या करते हैं?",
    answers: [
      { text: "भगवान से प्रार्थना", points: 30 },
      { text: "लास्ट मिनट पढ़ाई", points: 28 },
      { text: "दही-चीनी खाते हैं", points: 14 },
      { text: "घबराते हैं", points: 12 },
      { text: "दोस्तों से डिस्कस करते हैं", points: 8 },
    ],
  },
  {
    id: "bq-10",
    prompt: "मम्मी का सबसे कॉमन डायलॉग क्या होता है?",
    answers: [
      { text: "खाना खा लिया?", points: 28 },
      { text: "पढ़ाई कर ली?", points: 22 },
      { text: "फोन रख दो", points: 20 },
      { text: "शर्मा जी का बेटा देखो", points: 14 },
      { text: "जल्दी सो जाओ", points: 10 },
    ],
  },
  {
    id: "bq-11",
    prompt: "सैलरी आते ही लोग सबसे पहले क्या करते हैं?",
    answers: [
      { text: "ईएमआई/बिल्स भरते हैं", points: 38, aliases: ["ईएमआई","बिल्स भरते हैं"] },
      { text: "घर पैसे भेजते हैं", points: 16 },
      { text: "शॉपिंग करते हैं", points: 14 },
      { text: "सेविंग/एसआईपी करते हैं", points: 14, aliases: ["सेविंग","एसआईपी करते हैं"] },
      { text: "उधार चुकाते हैं", points: 10 },
      { text: "पार्टी करते हैं", points: 6 },
    ],
  },
  {
    id: "bq-12",
    prompt: "आपका फेवरिट क्रिकेटर कौन है?",
    answers: [
      { text: "विराट कोहली", points: 36 },
      { text: "एमएस धोनी", points: 26 },
      { text: "रोहित शर्मा", points: 20 },
      { text: "सचिन तेंदुलकर", points: 12 },
      { text: "हार्दिक पांड्या", points: 4 },
    ],
  },
  {
    id: "bq-13",
    prompt: "लड़की को शादी के लिए लड़के में सबसे ज़्यादा क्या चाहिए?",
    answers: [
      { text: "अच्छी नौकरी", points: 28 },
      { text: "समझदार होना", points: 22 },
      { text: "फ़ैमिली की रिस्पेक्ट", points: 18 },
      { text: "अच्छा दिखना", points: 12 },
      { text: "पैसा", points: 10 },
    ],
  },
  {
    id: "bq-14",
    prompt: "गर्मी में लोग क्या पीना पसंद करते हैं?",
    answers: [
      { text: "नींबू पानी", points: 30 },
      { text: "लस्सी/छाछ", points: 20, aliases: ["लस्सी","छाछ"] },
      { text: "ठंडा पानी", points: 16 },
      { text: "कोल्ड ड्रिंक", points: 14 },
      { text: "आम पन्ना", points: 8 },
      { text: "गन्ने का रस", points: 6 },
    ],
  },
  {
    id: "bq-15",
    prompt: "ट्रेन में सफ़र करते वक़्त लोग क्या साथ ले जाते हैं?",
    answers: [
      { text: "खाना/टिफ़िन", points: 32, aliases: ["खाना","टिफ़िन"] },
      { text: "चार्जर/पावरबैंक", points: 24, aliases: ["चार्जर","पावरबैंक"] },
      { text: "पानी की बोतल", points: 16 },
      { text: "चादर", points: 12 },
      { text: "ईयरफ़ोन", points: 10 },
    ],
  },
  {
    id: "bq-16",
    prompt: "लोग मोबाइल में सबसे ज़्यादा कौन सी ऐप यूज़ करते हैं?",
    answers: [
      { text: "व्हाट्सऐप", points: 38 },
      { text: "इंस्टाग्राम", points: 24 },
      { text: "यूट्यूब", points: 20 },
      { text: "फ़ेसबुक", points: 8 },
      { text: "फोनपे/गूगल पे", points: 6, aliases: ["फोनपे","गूगल पे"] },
    ],
  },
  {
    id: "bq-17",
    prompt: "पति-पत्नी सबसे ज़्यादा किस बात पे लड़ते हैं?",
    answers: [
      { text: "टाइम न देना", points: 24 },
      { text: "घर के काम", points: 20 },
      { text: "पैसे के खर्चे", points: 18 },
      { text: "रिश्तेदार", points: 16 },
      { text: "फोन में बिज़ी रहना", points: 12 },
    ],
  },
  {
    id: "bq-18",
    prompt: "दिवाली पे लोग सबसे पहले क्या करते हैं?",
    answers: [
      { text: "घर की सफ़ाई", points: 30 },
      { text: "लक्ष्मी पूजा", points: 26 },
      { text: "मिठाई खरीदते हैं", points: 16 },
      { text: "रंगोली बनाते हैं", points: 12 },
      { text: "नए कपड़े लेते हैं", points: 10 },
    ],
  },
  {
    id: "bq-19",
    prompt: "दुल्हन शादी में किस रंग का जोड़ा पहनती है?",
    answers: [
      { text: "लाल", points: 70 },
      { text: "मरून", points: 12 },
      { text: "गुलाबी", points: 8 },
      { text: "गोल्डन", points: 4 },
      { text: "पीला", points: 2 },
    ],
  },
  {
    id: "bq-20",
    prompt: "घर में लोग सबसे ज़्यादा टाइम कहाँ बिताते हैं?",
    answers: [
      { text: "बेडरूम", points: 34 },
      { text: "ड्रॉइंग रूम", points: 26 },
      { text: "किचन", points: 18 },
      { text: "छत/बालकनी", points: 12, aliases: ["छत","बालकनी"] },
      { text: "बाथरूम", points: 6 },
    ],
  },
  {
    id: "bq-21",
    prompt: "बच्चे स्कूल न जाने के लिए क्या बहाना बनाते हैं?",
    answers: [
      { text: "पेट दर्द", points: 42 },
      { text: "सिर दर्द", points: 22 },
      { text: "बुखार", points: 18 },
      { text: "उल्टी आ रही है", points: 8 },
      { text: "होमवर्क नहीं किया", points: 6 },
    ],
  },
  {
    id: "bq-22",
    prompt: "दोस्त से उधार मांगते वक़्त लोग क्या कहते हैं?",
    answers: [
      { text: "मेडिकल इमरजेंसी है", points: 24 },
      { text: "वॉलेट घर भूल गया", points: 22 },
      { text: "सैलरी आने पे दे दूंगा", points: 20 },
      { text: "घर में इमरजेंसी है", points: 18 },
      { text: "पेट्रोल डालना है", points: 10 },
    ],
  },
  {
    id: "bq-23",
    prompt: "शादी में सबसे ज़्यादा खर्चा किस चीज़ पे होता है?",
    answers: [
      { text: "वेन्यू/हॉल", points: 30, aliases: ["वेन्यू","हॉल"] },
      { text: "खाना/केटरिंग", points: 28, aliases: ["खाना","केटरिंग"] },
      { text: "गहने", points: 20 },
      { text: "डेकोरेशन", points: 12 },
      { text: "कपड़े", points: 8 },
    ],
  },
  {
    id: "bq-24",
    prompt: "सुबह के नाश्ते में लोग क्या खाते हैं?",
    answers: [
      { text: "पराठा", points: 26 },
      { text: "पोहा", points: 22 },
      { text: "सैंडविच/ब्रेड-बटर", points: 16, aliases: ["सैंडविच","ब्रेड-बटर"] },
      { text: "इडली-डोसा", points: 12 },
      { text: "दलिया/कॉर्नफ़्लेक्स", points: 8, aliases: ["दलिया","कॉर्नफ़्लेक्स"] },
    ],
  },
  {
    id: "bq-25",
    prompt: "रात को नींद न आए तो लोग क्या करते हैं?",
    answers: [
      { text: "फोन चलाते हैं", points: 48 },
      { text: "टीवी/वेब सीरीज़ देखते हैं", points: 20, aliases: ["टीवी","वेब सीरीज़ देखते हैं"] },
      { text: "गाने सुनते हैं", points: 12 },
      { text: "पानी पीते हैं", points: 8 },
      { text: "किताब पढ़ते हैं", points: 6 },
    ],
  },
  {
    id: "bq-26",
    prompt: "लोग शॉपिंग कहाँ से करना पसंद करते हैं?",
    answers: [
      { text: "ऑनलाइन (अमेज़न/फ़्लिपकार्ट)", points: 42, aliases: ["ऑनलाइन","अमेज़न","फ़्लिपकार्ट"] },
      { text: "लोकल मार्केट", points: 28 },
      { text: "मॉल", points: 18 },
      { text: "ब्रांडेड शोरूम", points: 8 },
    ],
  },
  {
    id: "bq-27",
    prompt: "मेहमान घर आए तो सबसे पहले क्या देते हैं?",
    answers: [
      { text: "पानी", points: 48 },
      { text: "चाय", points: 34 },
      { text: "कोल्ड ड्रिंक", points: 10 },
      { text: "नाश्ता", points: 6 },
    ],
  },
  {
    id: "bq-28",
    prompt: "आपका फेवरिट बॉलीवुड ऐक्टर कौन है?",
    answers: [
      { text: "शाहरुख़ खान", points: 34 },
      { text: "सलमान खान", points: 20 },
      { text: "अमिताभ बच्चन", points: 16 },
      { text: "अक्षय कुमार", points: 12 },
      { text: "रणवीर सिंह", points: 8 },
      { text: "आमिर खान", points: 6 },
    ],
  },
  {
    id: "bq-29",
    prompt: "वीकेंड पे लोग क्या करना पसंद करते हैं?",
    answers: [
      { text: "आराम/सोना", points: 32, aliases: ["आराम","सोना"] },
      { text: "फ़ैमिली के साथ बाहर जाना", points: 20 },
      { text: "मूवी/वेब सीरीज़ देखना", points: 18, aliases: ["मूवी","वेब सीरीज़ देखना"] },
      { text: "दोस्तों से मिलना", points: 14 },
      { text: "घर के काम", points: 10 },
    ],
  },
  {
    id: "bq-30",
    prompt: "बारिश में लोग क्या खाना पसंद करते हैं?",
    answers: [
      { text: "पकौड़े", points: 44 },
      { text: "गरम चाय", points: 22 },
      { text: "भुट्टा", points: 16 },
      { text: "समोसा", points: 8 },
      { text: "जलेबी", points: 6 },
    ],
  },
  {
    id: "bq-31",
    prompt: "नया फोन खरीदते वक़्त लोग सबसे पहले क्या देखते हैं?",
    answers: [
      { text: "कैमरा", points: 30 },
      { text: "प्राइस", points: 26 },
      { text: "बैटरी", points: 18 },
      { text: "ब्रांड", points: 14 },
      { text: "रैम/स्टोरेज", points: 10, aliases: ["रैम","स्टोरेज"] },
    ],
  },
  {
    id: "bq-32",
    prompt: "पति देर रात घर आए तो पत्नी क्या कहती है?",
    answers: [
      { text: "कहाँ थे अब तक?", points: 40 },
      { text: "खाना गरम कर दूँ?", points: 24 },
      { text: "फोन क्यों नहीं उठाया?", points: 20 },
      { text: "हाथ-मुँह धो लो", points: 8 },
      { text: "चुप चाप सो जाओ", points: 4 },
    ],
  },
  {
    id: "bq-33",
    prompt: "गुस्सा आने पे लोग क्या करते हैं?",
    answers: [
      { text: "चिल्लाकर बोलते हैं", points: 28 },
      { text: "चुप हो जाते हैं", points: 26 },
      { text: "बात करना बंद कर देते हैं", points: 22 },
      { text: "चीज़ें पटकते हैं", points: 10 },
      { text: "बाहर घूमने निकल जाते हैं", points: 8 },
      { text: "खाना नहीं खाते", points: 4 },
    ],
  },
  {
    id: "bq-34",
    prompt: "आपका फेवरिट त्योहार कौन सा है?",
    answers: [
      { text: "दिवाली", points: 46 },
      { text: "होली", points: 24 },
      { text: "नवरात्रि/गरबा", points: 10, aliases: ["नवरात्रि","गरबा"] },
      { text: "ईद", points: 8 },
      { text: "रक्षाबंधन", points: 6 },
    ],
  },
  {
    id: "bq-35",
    prompt: "नए साल पे लोग कौन सी रेज़ोल्यूशन लेते हैं?",
    answers: [
      { text: "फ़िट रहना/जिम जाना", points: 32, aliases: ["फ़िट रहना","जिम जाना"] },
      { text: "पैसे बचाना", points: 24 },
      { text: "नई स्किल सीखना", points: 14 },
      { text: "बुरी आदत छोड़ना", points: 14 },
      { text: "फोन कम यूज़ करना", points: 10 },
      { text: "घूमने जाना", points: 4 },
    ],
  },
  {
    id: "bq-36",
    prompt: "लोग गिफ्ट में सबसे ज़्यादा क्या देना पसंद करते हैं?",
    answers: [
      { text: "कपड़े", points: 28 },
      { text: "मिठाई/ड्राई फ्रूट्स", points: 22, aliases: ["मिठाई","ड्राई फ्रूट्स"] },
      { text: "कैश/शगुन", points: 20, aliases: ["कैश","शगुन"] },
      { text: "घड़ी/ज्वेलरी", points: 14, aliases: ["घड़ी","ज्वेलरी"] },
      { text: "फूल/चॉकलेट", points: 10, aliases: ["फूल","चॉकलेट"] },
    ],
  },
  {
    id: "bq-37",
    prompt: "हनीमून के लिए लोग कौन सी जगह चुनते हैं?",
    answers: [
      { text: "गोवा", points: 26 },
      { text: "मनाली", points: 22 },
      { text: "कश्मीर", points: 18 },
      { text: "केरल", points: 12 },
      { text: "शिमला", points: 10 },
    ],
  },
  {
    id: "bq-38",
    prompt: "डॉक्टर के पास जाने से पहले लोग क्या करते हैं?",
    answers: [
      { text: "गूगल पे सिम्पटम्स सर्च करते हैं", points: 36 },
      { text: "दादी/नानी का नुस्खा ट्राय करते हैं", points: 30, aliases: ["दादी","नानी का नुस्खा ट्राय करते हैं"] },
      { text: "खुद दवाई ले लेते हैं", points: 14 },
      { text: "दोस्त/रिश्तेदार से पूछते हैं", points: 12, aliases: ["दोस्त","रिश्तेदार से पूछते हैं"] },
      { text: "इंतज़ार करते हैं", points: 6 },
    ],
  },
  {
    id: "bq-39",
    prompt: "ऑनलाइन पेमेंट (यूपीआई) से लोग सबसे ज़्यादा किसके लिए पैसे देते हैं?",
    answers: [
      { text: "किराना/सब्ज़ी", points: 30, aliases: ["किराना","सब्ज़ी"] },
      { text: "मोबाइल रिचार्ज/बिल्स", points: 24, aliases: ["मोबाइल रिचार्ज","बिल्स"] },
      { text: "ऑनलाइन खाना", points: 18 },
      { text: "पेट्रोल", points: 14 },
      { text: "शॉपिंग", points: 10 },
    ],
  },
  {
    id: "bq-40",
    prompt: "बिजली चली जाए तो लोग क्या करते हैं?",
    answers: [
      { text: "फोन की टॉर्च जलाते हैं", points: 30 },
      { text: "छत/बाहर निकल जाते हैं", points: 24, aliases: ["छत","बाहर निकल जाते हैं"] },
      { text: "बिजली विभाग को कॉल करते हैं", points: 20 },
      { text: "सोने चले जाते हैं", points: 14 },
      { text: "मोमबत्ती जलाते हैं", points: 10 },
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
