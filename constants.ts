import { Starter } from './types';

// In a real scenario, this would come from the API. 
// We include this here so the UI works immediately for the demo without the backend running.
export const MOCK_STARTERS: Starter[] = [
  { id: 1, category: "🎯 Aspirations & Skills", text: "How would you like to spend your elder years?", questionType: "How", focus: "Future / Aspirations" },
  { id: 2, category: "🎯 Aspirations & Skills", text: "If you could be brilliant in one subject which would you choose?", questionType: "Which (Conditional)", focus: "Aspirations" },
  { id: 3, category: "🎯 Aspirations & Skills", text: "If you could work as an assistant to anyone for a year who would you choose?", questionType: "Who (Conditional)", focus: "Aspirations / Work" },
  { id: 4, category: "🎯 Aspirations & Skills", text: "What are the largest obstacles preventing you from realizing your dreams?", questionType: "What (List)", focus: "Present / Self" },
  { id: 5, category: "🎯 Aspirations & Skills", text: "What do you dream your life will be like in 10 years?", questionType: "What", focus: "Future / Aspirations" },
  { id: 6, category: "🎯 Aspirations & Skills", text: "What's your dream job?", questionType: "What", focus: "Future / Aspirations" },
  { id: 7, category: "🌍 Big Picture & Worldview", text: "At what age do most people become old and what is the secret to staying young?", questionType: "What (Compound)", focus: "Philosophy" },
  { id: 8, category: "🌍 Big Picture & Worldview", text: "Do you believe in coincidence or synchronicity?", questionType: "Binary Choice (Do)", focus: "Philosophy / Belief" },
  { id: 9, category: "🌍 Big Picture & Worldview", text: "How will our culture change in the next 100 years?", questionType: "How", focus: "Future" },
  { id: 10, category: "🌍 Big Picture & Worldview", text: "If you could give all human beings one virtue which would you choose?", questionType: "Which (Conditional)", focus: "Philosophy / Worldview" },
  { id: 11, category: "🌍 Big Picture & Worldview", text: "Is it more essential to develop beliefs or gain knowledge?", questionType: "Binary Choice (Is)", focus: "Philosophy" },
  { id: 12, category: "🌍 Big Picture & Worldview", text: "What makes a house a home?", questionType: "What", focus: "Philosophy / Lifestyle" },
  { id: 13, category: "💡 Hypothetical", text: "If money were no object what kind of party would you throw and where?", questionType: "What / Where", focus: "Creative / Lifestyle" },
  { id: 14, category: "💡 Hypothetical", text: "If you could do something dangerous just once with no risk what would you do?", questionType: "What (Conditional)", focus: "Creative / Aspirations" },
  { id: 15, category: "💡 Hypothetical", text: "If you could have a conversation with a deceased friend or relative who would you choose?", questionType: "Who (Conditional)", focus: "Past / Family" },
  { id: 16, category: "💡 Hypothetical", text: "If you got a tattoo what would you get and where would you put it?", questionType: "What / Where", focus: "Creative / Self" },
  { id: 17, category: "💡 Hypothetical", text: "Would you rather live by the beach or in the mountains?", questionType: "Would you rather", focus: "Preferences / Lifestyle" },
  { id: 18, category: "💡 Hypothetical", text: "What historical time period would you most like to visit?", questionType: "What", focus: "Past / Hypothetical" },
  { id: 19, category: "👤 Personal Reflection", text: "Do you live more in the past, present, or future?", questionType: "Multiple Choice", focus: "Philosophy / Self" },
  { id: 20, category: "👤 Personal Reflection", text: "What are the most important qualities you look for in friends?", questionType: "What (List)", focus: "Present / Self" },
  { id: 21, category: "👤 Personal Reflection", text: "What does your perfect day look like?", questionType: "What", focus: "Preferences / Lifestyle" },
  { id: 22, category: "👤 Personal Reflection", text: "What makes you laugh the hardest?", questionType: "What", focus: "Preferences / Self" },
  { id: 23, category: "👤 Personal Reflection", text: "What's the hardest thing you've ever done?", questionType: "What", focus: "Past / Self" },
  { id: 24, category: "👤 Personal Reflection", text: "Which of your personality traits would you most like to change?", questionType: "Which", focus: "Self / Aspirations" },
  { id: 25, category: "👤 Personal Reflection", text: "Who has inspired you as a mentor and why?", questionType: "Who / Why", focus: "Past / Self" }
];

// Mapped to base tailwind color names
export const CATEGORY_COLORS: Record<string, string> = {
  "🎯 Aspirations & Skills": "emerald",
  "🌍 Big Picture & Worldview": "indigo",
  "💡 Hypothetical": "amber",
  "👤 Personal Reflection": "rose"
};

export const CATEGORY_ICONS: Record<string, string> = {
  "🎯 Aspirations & Skills": "Target",
  "🌍 Big Picture & Worldview": "Globe",
  "💡 Hypothetical": "Lightbulb",
  "👤 Personal Reflection": "User"
};