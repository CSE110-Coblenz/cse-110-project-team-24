import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";

export class GameScreenController extends ScreenController {
    private model: GameScreenModel;
    private view: GameScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;

        this.model = new GameScreenModel();
        this.view = new GameScreenView(
            (choiceIndex) => this.handleChoice(choiceIndex),
            () => this.handleNext()
        );
    }

    startGame(): void {
        this.model.reset();
        this.view.setScore(this.model.getScore());
        const q = this.model.getCurrentQuestion();
        this.view.setQuestion(
            q.prompt,
            q.choices,
            this.model.getQuestionIndex() + 1,
            this.model.getTotalQuestions()
        );
        this.view.show();
    }

    private handleChoice(choiceIndex: number): void {
        const question = this.model.getCurrentQuestion();
        const isCorrect = choiceIndex === question.correctIndex;
        if (isCorrect) {
            this.model.incrementScore();
            this.view.setScore(this.model.getScore());
        }
        const correctAnswerText = question.choices[question.correctIndex];
        this.view.highlightChoices(choiceIndex, question.correctIndex);
        this.view.showFeedback(isCorrect, correctAnswerText);
        this.view.showNextButton();
    }

    private handleNext(): void {
        if (this.model.hasNextQuestion()) {
            this.model.goToNextQuestion();
            const q = this.model.getCurrentQuestion();
            this.view.setQuestion(
                q.prompt,
                q.choices,
                this.model.getQuestionIndex() + 1,
                this.model.getTotalQuestions()
            );
        } else {
            this.endGame();
        }
    }

    private endGame(): void {
        const score = this.model.getScore();
        const total = this.model.getTotalQuestions();
        const isPerfect = score === total;
        this.view.showResults(
            score,
            total,
            () => this.startGame(),
            () => this.screenSwitcher.switchToScreen({ type: "home" }),
            isPerfect
        );
    }

    getView(): GameScreenView {
        return this.view;
    }
}
