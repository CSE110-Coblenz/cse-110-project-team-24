import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";

export type ResultOutcome = "win" | "loss";

const OUTCOME_STYLES: Record<
  ResultOutcome,
  { label: string; title: string; message: string; badgeColor: string }
> = {
  win: {
    label: "Victory",
    title: "Great run!",
    message: "You matched every museum fact. Grab another city!",
    badgeColor: "#22c55e",
  },
  loss: {
    label: "Try again",
    title: "Out of attempts",
    message: "All three guesses are up. Ready for another tour?",
    badgeColor: "#f97316",
  },
};

/**
 * ResultsScreenView - Renders the results screen with win/loss states
 */
export class ResultsScreenView implements View {
  private readonly group: Konva.Group;
  private readonly finalScoreText: Konva.Text;
  private readonly titleText: Konva.Text;
  private readonly messageText: Konva.Text;
  private readonly outcomeLabel: Konva.Label;
  private readonly outcomeLabelTag: Konva.Tag;
  private readonly outcomeLabelText: Konva.Text;

  constructor(onPlayAgainClick: () => void) {
    this.group = new Konva.Group({ visible: false });

    const background = new Konva.Rect({
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: STAGE_HEIGHT },
      fillLinearGradientColorStops: [0, "#0f172a", 1, "#1e3054"],
    });
    this.group.add(background);

    const cardWidth = 560;
    const cardHeight = 460;
    const cardX = STAGE_WIDTH / 2 - cardWidth / 2;
    const cardY = Math.max(40, (STAGE_HEIGHT - cardHeight) / 2);

    const card = new Konva.Rect({
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      cornerRadius: 32,
      fill: "#ffffff",
      shadowColor: "rgba(15, 23, 42, 0.25)",
      shadowBlur: 48,
      shadowOpacity: 0.4,
      shadowOffsetY: 18,
    });
    this.group.add(card);

    this.outcomeLabel = new Konva.Label({
      x: STAGE_WIDTH / 2,
      y: cardY - 24,
      opacity: 0.95,
      listening: false,
    });
    this.outcomeLabelTag = new Konva.Tag({
      cornerRadius: 999,
      fill: OUTCOME_STYLES.win.badgeColor,
    });
    this.outcomeLabelText = new Konva.Text({
      text: OUTCOME_STYLES.win.label.toUpperCase(),
      fontSize: 16,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fontStyle: "600",
      fill: "#ffffff",
      align: "center",
      padding: 12,
    });
    this.outcomeLabel.add(this.outcomeLabelTag);
    this.outcomeLabel.add(this.outcomeLabelText);
    this.group.add(this.outcomeLabel);
    this.centerOutcomeLabel();

    this.titleText = new Konva.Text({
      x: cardX + 40,
      y: cardY + 50,
      width: cardWidth - 80,
      text: OUTCOME_STYLES.win.title,
      align: "center",
      fontSize: 36,
      fontFamily: "Clash Display, 'Trebuchet MS', Arial, sans-serif",
      fill: "#0f172a",
    });
    this.group.add(this.titleText);

    this.messageText = new Konva.Text({
      x: cardX + 60,
      y: cardY + 110,
      width: cardWidth - 120,
      text: OUTCOME_STYLES.win.message,
      align: "center",
      fontSize: 20,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fill: "#475569",
      lineHeight: 1.4,
    });
    this.group.add(this.messageText);

    this.finalScoreText = new Konva.Text({
      x: cardX + 40,
      y: cardY + 200,
      width: cardWidth - 80,
      text: "0",
      align: "center",
      fontSize: 80,
      fontFamily: "Clash Display, 'Trebuchet MS', Arial, sans-serif",
      fill: "#0f172a",
    });
    this.group.add(this.finalScoreText);

    const scoreLabel = new Konva.Text({
      x: cardX + 40,
      y: cardY + 290,
      width: cardWidth - 80,
      text: "Museums matched",
      align: "center",
      fontSize: 20,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fill: "#64748b",
    });
    this.group.add(scoreLabel);

    const promptText = new Konva.Text({
      x: cardX + 60,
      y: cardY + 320,
      width: cardWidth - 120,
      text: "Ready for another destination? Tap below to hop back in.",
      align: "center",
      fontSize: 16,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fill: "#475569",
      lineHeight: 1.4,
    });
    this.group.add(promptText);

    const playAgainButtonGroup = new Konva.Group({
      x: STAGE_WIDTH / 2 - 130,
      y: cardY + cardHeight - 80,
    });
    const playAgainButton = new Konva.Rect({
      width: 260,
      height: 56,
      cornerRadius: 16,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 260, y: 0 },
      fillLinearGradientColorStops: [0, "#1f4d7a", 1, "#3b82f6"],
      shadowColor: "rgba(59, 130, 246, 0.4)",
      shadowBlur: 18,
      shadowOffsetY: 6,
    });
    const playAgainText = new Konva.Text({
      x: 0,
      y: 18,
      width: 260,
      text: "Play again",
      align: "center",
      fontSize: 20,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fontStyle: "600",
      fill: "#ffffff",
    });
    playAgainButtonGroup.add(playAgainButton);
    playAgainButtonGroup.add(playAgainText);
    playAgainButtonGroup.on("click tap", onPlayAgainClick);
    playAgainButtonGroup.on("mouseenter", () => {
      const stage = this.group.getStage();
      if (stage) stage.container().style.cursor = "pointer";
    });
    playAgainButtonGroup.on("mouseleave", () => {
      const stage = this.group.getStage();
      if (stage) stage.container().style.cursor = "default";
    });
    this.group.add(playAgainButtonGroup);
  }

  /**
   * Update the final score display
   */
  updateFinalScore(score: number): void {
    this.finalScoreText.text(`${score}`);
    this.group.getLayer()?.batchDraw();
  }

  updateOutcome(outcome: ResultOutcome, customMessage?: string): void {
    const style = OUTCOME_STYLES[outcome];
    this.outcomeLabelText.text(style.label.toUpperCase());
    this.outcomeLabelTag.fill(style.badgeColor);
    this.titleText.text(style.title);
    this.messageText.text(customMessage ?? style.message);
    this.centerOutcomeLabel();
    this.group.getLayer()?.batchDraw();
  }

  /**
   * Show the screen
   */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  /**
   * Hide the screen
   */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
    const stage = this.group.getStage();
    if (stage) stage.container().style.cursor = "default";
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  private centerOutcomeLabel(): void {
    this.outcomeLabel.offsetX(this.outcomeLabel.width() / 2);
  }
}
