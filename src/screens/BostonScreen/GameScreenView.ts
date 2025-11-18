import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

type ChoiceHandler = (choiceIndex: number) => void;

export class GameScreenView implements View {
    private group: Konva.Group;
    private questionText: Konva.Text;
    private progressText: Konva.Text;
    private scoreText: Konva.Text;
    private choiceGroups: Konva.Group[] = [];
    private feedbackText: Konva.Text;
    private nextButtonGroup: Konva.Group;
    private resultsGroup: Konva.Group;
    private congratsGroup: Konva.Group;

    constructor(onChoiceSelected: ChoiceHandler, onNext: () => void) {
        this.group = new Konva.Group({ visible: false });

        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "#f5f7fa",
        });
        this.group.add(bg);

        this.progressText = new Konva.Text({
            x: 20,
            y: 20,
            text: "Question 1/5",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#333",
        });
        this.group.add(this.progressText);

        this.scoreText = new Konva.Text({
            x: STAGE_WIDTH - 160,
            y: 20,
            text: "Score: 0",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#333",
        });
        this.group.add(this.scoreText);

        this.questionText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 100,
            text: "",
            fontSize: 28,
            fontFamily: "Arial",
            fill: "#111",
            width: STAGE_WIDTH - 80,
            align: "center",
        });
        this.questionText.offsetX(this.questionText.width() / 2);
        this.group.add(this.questionText);

        const choiceWidth = 600;
        const choiceHeight = 60;
        const startY = 200;
        const gap = 20;

        for (let i = 0; i < 4; i++) {
            const g = new Konva.Group({ x: STAGE_WIDTH / 2 - choiceWidth / 2, y: startY + i * (choiceHeight + gap) });
            const rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: choiceWidth,
                height: choiceHeight,
                fill: "#ffffff",
                cornerRadius: 10,
                stroke: "#ccc",
                strokeWidth: 2,
            });
            const txt = new Konva.Text({
                x: 20,
                y: 18,
                text: "",
                fontSize: 20,
                fontFamily: "Arial",
                fill: "#111",
                width: choiceWidth - 40,
            });
            g.add(rect);
            g.add(txt);
            ((index: number) => {
                g.on("click", () => onChoiceSelected(index));
            })(i);
            this.group.add(g);
            this.choiceGroups.push(g);
        }

        this.feedbackText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: startY + 4 * (choiceHeight + gap) + 50,
            text: "",
            fontSize: 22,
            fontFamily: "Arial",
            fill: "#333",
            align: "center",
            width: STAGE_WIDTH - 80,
        });
        this.feedbackText.offsetX(this.feedbackText.width() / 2);
        this.group.add(this.feedbackText);

        this.nextButtonGroup = new Konva.Group({ visible: false });
        const nextRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: STAGE_HEIGHT - 90,
            width: 200,
            height: 50,
            fill: "#2563eb",
            cornerRadius: 10,
            stroke: "#1e40af",
            strokeWidth: 2,
        });
        const nextText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT - 73,
            text: "Next",
            fontSize: 22,
            fontFamily: "Arial",
            fill: "#fff",
            align: "center",
        });
        nextText.offsetX(nextText.width() / 2);
        this.nextButtonGroup.add(nextRect);
        this.nextButtonGroup.add(nextText);
        this.nextButtonGroup.on("click", onNext);
        this.group.add(this.nextButtonGroup);

        // Inline results UI (hidden until quiz ends)
        this.resultsGroup = new Konva.Group({ visible: false });
        const resBg = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 250,
            y: STAGE_HEIGHT / 2 - 120,
            width: 500,
            height: 240,
            fill: "#ffffff",
            cornerRadius: 12,
            stroke: "#ddd",
            strokeWidth: 2,
        });
        const resText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2 - 70,
            text: "",
            fontSize: 26,
            fontFamily: "Arial",
            fill: "#111",
            align: "center",
            width: 480,
        });
        resText.offsetX(resText.width() / 2);

        const playAgainGroup = new Konva.Group();
        const playRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 210,
            y: STAGE_HEIGHT / 2 + 10,
            width: 180,
            height: 50,
            fill: "#16a34a",
            cornerRadius: 10,
            stroke: "#15803d",
            strokeWidth: 2,
        });
        const playText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 120,
            y: STAGE_HEIGHT / 2 + 22,
            text: "Play Again",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#fff",
            align: "center",
        });
        playText.offsetX(playText.width() / 2);
        playAgainGroup.add(playRect);
        playAgainGroup.add(playText);

        const menuGroup = new Konva.Group();
        const menuRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 + 30,
            y: STAGE_HEIGHT / 2 + 10,
            width: 180,
            height: 50,
            fill: "#2563eb",
            cornerRadius: 10,
            stroke: "#1e40af",
            strokeWidth: 2,
        });
        const menuText = new Konva.Text({
            x: STAGE_WIDTH / 2 + 120,
            y: STAGE_HEIGHT / 2 + 22,
            text: "Menu",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#fff",
            align: "center",
        });
        menuText.offsetX(menuText.width() / 2);
        menuGroup.add(menuRect);
        menuGroup.add(menuText);

        this.resultsGroup.add(resBg);
        this.resultsGroup.add(resText);
        this.resultsGroup.add(playAgainGroup);
        this.resultsGroup.add(menuGroup);
        this.group.add(this.resultsGroup);

        // Perfect score congrats UI (hidden until quiz ends with all correct)
        this.congratsGroup = new Konva.Group({ visible: false });
        const cgBg = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 280,
            y: STAGE_HEIGHT / 2 - 160,
            width: 560,
            height: 320,
            fill: "#ffffff",
            cornerRadius: 12,
            stroke: "#ddd",
            strokeWidth: 2,
        });
        const cgTitle = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2 - 135,
            text: "Congratulations!",
            fontSize: 30,
            fontFamily: "Arial",
            fill: "#16a34a",
            align: "center",
            width: 540,
        });
        cgTitle.offsetX(cgTitle.width() / 2);

        // Image placeholder; user will replace the URL later
        const cgImageHolder = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 220,
            y: STAGE_HEIGHT / 2 - 100,
            width: 440,
            height: 180,
            fill: "#f1f5f9",
            stroke: "#cbd5e1",
            strokeWidth: 2,
            cornerRadius: 8,
        });
        const cgImageText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2 - 20,
            text: "Congrats image placeholder\n(replace with PNG)",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "#64748b",
            align: "center",
            width: 420,
        });
        cgImageText.offsetX(cgImageText.width() / 2);

        // Optional: if a PNG is added later, it will render here
        // Konva.Image.fromURL("/congrats_boston.png", (img) => {
        //     img.x(STAGE_WIDTH / 2 - 220);
        //     img.y(STAGE_HEIGHT / 2 - 100);
        //     img.width(440);
        //     img.height(180);
        //     this.congratsGroup.add(img);
        //     this.group.getLayer()?.draw();
        // });

        // Play Again button group
        const cgPlayAgainGroup = new Konva.Group();
        const cgPlayRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 210,
            y: STAGE_HEIGHT / 2 + 95,
            width: 180,
            height: 50,
            fill: "#16a34a",
            cornerRadius: 10,
            stroke: "#15803d",
            strokeWidth: 2,
        });
        const cgPlayText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 120,
            y: STAGE_HEIGHT / 2 + 107,
            text: "Play Again",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#fff",
            align: "center",
        });
        cgPlayText.offsetX(cgPlayText.width() / 2);
        cgPlayAgainGroup.add(cgPlayRect);
        cgPlayAgainGroup.add(cgPlayText);

        // Menu button group
        const cgMenuGroup = new Konva.Group();
        const cgMenuRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 + 30,
            y: STAGE_HEIGHT / 2 + 95,
            width: 180,
            height: 50,
            fill: "#2563eb",
            cornerRadius: 10,
            stroke: "#1e40af",
            strokeWidth: 2,
        });
        const cgMenuText = new Konva.Text({
            x: STAGE_WIDTH / 2 + 120,
            y: STAGE_HEIGHT / 2 + 107,
            text: "Menu",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#fff",
            align: "center",
        });
        cgMenuText.offsetX(cgMenuText.width() / 2);
        cgMenuGroup.add(cgMenuRect);
        cgMenuGroup.add(cgMenuText);

        this.congratsGroup.add(cgBg);
        this.congratsGroup.add(cgTitle);
        this.congratsGroup.add(cgImageHolder);
        this.congratsGroup.add(cgImageText);
        this.congratsGroup.add(cgPlayAgainGroup);
        this.congratsGroup.add(cgMenuGroup);
        this.group.add(this.congratsGroup);
    }

    setQuestion(prompt: string, choices: string[], questionNumber: number, totalQuestions: number): void {
        // Return from results state to question state
        this.resultsGroup.visible(false);
        this.congratsGroup.visible(false);
        this.questionText.visible(true);
        this.progressText.visible(true);
        this.scoreText.visible(true);
        this.feedbackText.visible(true);
        this.progressText.text(`Question ${questionNumber}/${totalQuestions}`);
        this.questionText.text(prompt);
        for (let i = 0; i < this.choiceGroups.length; i++) {
            const g = this.choiceGroups[i];
            const rect = g.findOne<Konva.Rect>("Rect");
            const txt = g.findOne<Konva.Text>("Text");
            rect?.fill("#ffffff");
            rect?.stroke("#ccc");
            if (txt) txt.text(choices[i] ?? "");
            g.listening(true);
            g.visible(true);
            g.opacity(1);
        }
        this.feedbackText.text("");
        this.nextButtonGroup.visible(false);
        this.group.getLayer()?.draw();
    }

    showResults(score: number, total: number, onPlayAgain: () => void, onMenu: () => void, isPerfect: boolean): void {
        // Hide question UI
        this.nextButtonGroup.visible(false);
        this.questionText.visible(false);
        this.progressText.visible(false);
        this.scoreText.visible(false);
        this.feedbackText.visible(false);
        for (const g of this.choiceGroups) {
            g.listening(false);
            g.visible(false);
        }
        this.feedbackText.text("");

        if (isPerfect) {
            // Wire congrats buttons
            const cgButtons = this.congratsGroup.find<Konva.Group>("Group");
            const cgPlayAgain = cgButtons[0];
            const cgMenu = cgButtons[1];
            cgPlayAgain?.off("click");
            cgMenu?.off("click");
            cgPlayAgain?.on("click", onPlayAgain);
            cgMenu?.on("click", onMenu);

            this.resultsGroup.visible(false);
            this.congratsGroup.visible(true);
        } else {
            // Configure standard results content and actions
            const resText = this.resultsGroup.findOne<Konva.Text>("Text");
            if (resText) {
                resText.text(`You Lose!\nScore: ${score} / ${total}`);
            }
            const groups = this.resultsGroup.find<Konva.Group>("Group");
            const playAgainGroup = groups[0];
            const menuGroup = groups[1];
            playAgainGroup?.off("click");
            menuGroup?.off("click");
            playAgainGroup?.on("click", onPlayAgain);
            menuGroup?.on("click", onMenu);

            this.congratsGroup.visible(false);
            this.resultsGroup.visible(true);
        }
        this.group.getLayer()?.draw();
    }

    setScore(score: number): void {
        this.scoreText.text(`Score: ${score}`);
        this.group.getLayer()?.draw();
    }

    showFeedback(isCorrect: boolean, correctAnswerText: string): void {
        this.feedbackText.fill(isCorrect ? "#16a34a" : "#dc2626");
        this.feedbackText.text(
            isCorrect ? "Correct!" : `Incorrect. Answer: ${correctAnswerText}`
        );
        for (const g of this.choiceGroups) {
            g.listening(false);
            g.opacity(0.9);
        }
        this.group.getLayer()?.draw();
    }

    highlightChoices(selectedIndex: number, correctIndex: number): void {
        this.choiceGroups.forEach((g, i) => {
            const rect = g.findOne<Konva.Rect>("Rect");
            if (!rect) return;
            if (i === correctIndex) {
                rect.fill("#d1fae5");
                rect.stroke("#16a34a");
            } else if (i === selectedIndex && selectedIndex !== correctIndex) {
                rect.fill("#fee2e2");
                rect.stroke("#dc2626");
            } else {
                rect.fill("#ffffff");
                rect.stroke("#ccc");
            }
        });
        this.group.getLayer()?.draw();
    }

    showNextButton(): void {
        this.nextButtonGroup.visible(true);
        this.group.getLayer()?.draw();
    }

    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
}
