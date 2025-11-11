import Konva from "konva";

let score = 0; 

export function startIGGame(layer: Konva.Layer) {
    score = 0;
  layer.find(".popup").forEach((n) => n.destroy());

  const popup = new Konva.Group({
    name: "popup",
    x: 150,
    y: 100,
  });

  const rect = new Konva.Rect({
    width: 700,
    height: 700,
    fill: "white",
    stroke: "black",
    cornerRadius: 12,
    shadowBlur: 10,
  });
  rect.listening(false);
  popup.add(rect);

  const question = new Konva.Text({
    text: "What is the genre of music in Inglewood",
    x: 30,
    y: 30,
    fontSize: 22,
    fontFamily: "Arial",
    fill: "black",
    fontStyle: "bold",
  });

  popup.add(question);

  const options = [
    { text: "A. Country Music", correct: false },
    { text: "B. Jazz Music", correct: false },
    { text: "C. Hip Hop Music", correct: true },
    { text: "D. Classic Music", correct: false },
  ];

  options.forEach((opt, i) => {
    const btnY = 90 + i * 55;

    const btn = new Konva.Rect({
      x: 60,
      y: btnY,
      width: 380,
      height: 45,
      fill: "#2980b9",
      cornerRadius: 8,
      name: "optionBtn",
      shadowBlur: 4,
    });

    const txt = new Konva.Text({
      x: 80,
      y: btnY + 10,
      text: opt.text,
      fontSize: 18,
      fill: "white",
    });

    popup.add(btn);
    popup.add(txt);
    btn.on("click", () => {
      handleAnswer(opt.correct, layer, popup);
    });
  });


  layer.add(popup);
  popup.moveToTop();
  layer.draw();
}

function handleAnswer(correct: boolean, layer: Konva.Layer, popup: Konva.Group) {
  popup.destroy();
      const rect = new Konva.Rect({
    width: 700,
    height: 700,
    fill: "white",
    stroke: "black",
    cornerRadius: 12,
    shadowBlur: 10,
  });
    layer.add(rect);
  const message = new Konva.Text({
    x: 260,
    y: 250,
    text: correct ? "Correct!" : "Incorrect! Try again",
    fontSize: 22,
    fontFamily: "Arial",
    fill: correct ? "green" : "red",
  });
  layer.add(message);


  if (correct) score++;


  const scoreText = new Konva.Text({
    x: 260,
    y: 290,
    text: `current score: ${score}`,
    fontSize: 20,
    fill: "black",
  });
  layer.add(scoreText);
  layer.draw();

  setTimeout(() => {
    message.destroy();
    scoreText.destroy();
    rect.destroy();
    if (correct) {
      nextQuestion(layer);
    } else {
      startIGGame(layer); 
    }
    layer.draw();
  }, 2000);
}

function nextQuestion(layer: Konva.Layer) {
  const popup = new Konva.Group({
    name: "popup",
    x: 150,
    y: 100,
  });

  const rect = new Konva.Rect({
    width: 700,
    height: 700,
    fill: "white",
    stroke: "black",
    cornerRadius: 12,
    shadowBlur: 10,
  });

  popup.add(rect);

  const question = new Konva.Text({
    text: "What event could take place in Inglewood?",
    x: 30,
    y: 30,
    fontSize: 22,
    fontFamily: "Arial",
    fill: "black",
    fontStyle: "bold",
  });

  popup.add(question);

  const options = [
    { text: "A. Super Bowl", correct: true },
    { text: "B. US Open", correct: false },
    { text: "C. Winter Olymipic", correct: false },
    { text: "D. Cross-Country Game", correct: true },
  ];

  options.forEach((opt, i) => {
    const btnY = 90 + i * 55;

    const btn = new Konva.Rect({
      x: 60,
      y: btnY,
      width: 380,
      height: 45,
      fill: "#27ae60",
      cornerRadius: 8,
      name: "optionBtn",
      shadowBlur: 4,
    });

    const txt = new Konva.Text({
      x: 80,
      y: btnY + 10,
      text: opt.text,
      fontSize: 18,
      fill: "white",
    });

    btn.on("click", () => {
      const correct = opt.correct;
      popup.destroy();
          const rect = new Konva.Rect({
    width: 700,
    height: 700,
    fill: "white",
    stroke: "black",
    cornerRadius: 12,
    shadowBlur: 10,
  }); 
    layer.add(rect);
      const msg = new Konva.Text({
        x: 260,
        y: 250,
        text: correct ? "Correct! You finished all questions here!" : "Wrong! Try again",
        fontSize: 22,
        fill: correct ? "green" : "red",
      });

      layer.add(msg);
          if (correct) {
      score++;
    } 

      const scoreText = new Konva.Text({
        x: 260,
        y: 290,
        text: `total score: ${score}/2`,
        fontSize: 20,
        fill: "black",
      });
      layer.add(rect);
      layer.add(scoreText);
      layer.draw();

      setTimeout(() => {
        msg.destroy();
        scoreText.destroy();
        rect.destroy();
        layer.draw();
                if (!correct) { 
      nextQuestion(layer); 
    }
      }, 3000);
    });

    popup.add(btn);
    popup.add(txt);
  });


  layer.add(popup);
  layer.draw();

}
