interface IDialogue{
    follow: string,
    spellCheck: string,
    englishCheck: string,
    emojiCheck: string,
    image: string,
    audio: string,
    video: string,
    location: string,
    file: string,
    anotherWord: string,
    studyType: string,
    report: string,
    dictMode: string,
};


export const Dialogue: IDialogue = {
    follow: "✏️Type any word to search for its translation.\n✏️Type \"STUDY\" to learn from an exam (TOEFL/GRE/TOEIC/IELTS).\n✏️Type \"REPORT\" to report bug and/or give suggestions.\n✏️",
    spellCheck: "Are you looking for: \n ", // + spellCheck list ,
    englishCheck: "Well...Ask me again in English 👩‍💻",
    emojiCheck: "If you want to look up a word, ask me without emojis! 🌝",
    image: "I love this image! ❤️",
    audio: "Ooops...I'm better at recognizing words... 👀",
    video: "Thanks for sharing! 😎",
    location: "It is good people who make good places. ✨",
    file: "Stop telling people more than they need to know! 👻",
    anotherWord: 'Would you like to learn another word? 🦄',
    studyType: "What kind of exam would you like to study? 🌱",
    report: "Please report the issue in the form! 🙇‍♀️ https://forms.gle/aawPQNEYfEgwyvCi8",
    dictMode: "Back to dictionary mode 📖"
};