export interface TriviaQuestion {
    prompt: string;
    choices: string[];
    correctIndex: number;
}

export class GameScreenModel {
    private questions: TriviaQuestion[] = [
        {
            prompt: "In which year did the Boston Tea Party take place?",
            choices: ["1763", "1773", "1783", "1793"],
            correctIndex: 1,
        },
        {
            prompt: "Which famous trail connects 16 historic sites in Boston?",
            choices: ["Liberty Walk", "Freedom Trail", "Patriot Path", "Revolution Route"],
            correctIndex: 1,
        },
        {
            prompt: "What iconic Boston landmark sits atop Beacon Hill?",
            choices: ["Old North Church", "Faneuil Hall", "Massachusetts State House", "Bunker Hill Monument"],
            correctIndex: 2,
        },
        {
            prompt: "Which battle early in the American Revolution was fought near Boston in 1775?",
            choices: ["Battle of Saratoga", "Battle of Bunker Hill", "Battle of Yorktown", "Battle of Trenton"],
            correctIndex: 1,
        },
        {
            prompt: "What is the nickname of Boston reflecting its many universities?",
            choices: ["City of Lights", "Hub of the Universe", "Athens of America", "Emerald City"],
            correctIndex: 2,
        },
    ];

    private currentQuestionIndex = 0;
    private score = 0;

    reset(): void {
        this.score = 0;
        this.currentQuestionIndex = 0;
    }

    getCurrentQuestion(): TriviaQuestion {
        return this.questions[this.currentQuestionIndex];
    }

    getScore(): number {
        return this.score;
    }

    getQuestionIndex(): number {
        return this.currentQuestionIndex;
    }

    getTotalQuestions(): number {
        return this.questions.length;
    }

    incrementScore(): void {
        this.score++;
    }

    hasNextQuestion(): boolean {
        return this.currentQuestionIndex < this.questions.length - 1;
    }

    goToNextQuestion(): void {
        if (this.hasNextQuestion()) {
            this.currentQuestionIndex++;
        }
    }
}
