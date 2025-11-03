import Konva from "konva";

let score = 0; 

export function startLAXGame(layer: Konva.Layer) {

  layer.find(".popup").forEach((n) => n.destroy());

  const popup = new Konva.Group({
    name: "popup",
    x: 250,
    y: 200,
  });

  const rect = new Konva.Rect({
    width: 700,
    height: 480,
    fill: "white",
    stroke: "black",
    cornerRadius: 12,
    shadowBlur: 10,
  });
  rect.listening(false);
  popup.add(rect);

  const question = new Konva.Text({
    text: "Which state is Los Angeles in？",
    x: 30,
    y: 30,
    fontSize: 22,
    fontFamily: "Arial",
    fill: "black",
    fontStyle: "bold",
  });

  popup.add(question);

  const options = [
    { text: "A. Texas", correct: false },
    { text: "B. California", correct: true },
    { text: "C. Arizona", correct: false },
    { text: "D. Nevada", correct: false },
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
    height: 480,
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
      startLAXGame(layer); 
    }
    layer.draw();
  }, 2000);
}

function nextQuestion(layer: Konva.Layer) {
  const popup = new Konva.Group({
    name: "popup",
    x: 250,
    y: 200,
  });

  const rect = new Konva.Rect({
    width: 700,
    height: 600,
    fill: "white",
    stroke: "black",
    cornerRadius: 12,
    shadowBlur: 10,
  });

  popup.add(rect);

  const question = new Konva.Text({
    text: "What is the short term of Los Angeles International Airport?",
    x: 30,
    y: 30,
    fontSize: 22,
    fontFamily: "Arial",
    fill: "black",
    fontStyle: "bold",
  });

  popup.add(question);

  const options = [
    { text: "A. LAX", correct: true },
    { text: "B. LGA", correct: false },
    { text: "C. LSA", correct: false },
    { text: "D. LAS", correct: false },
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
    height: 600,
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
      if (correct) score++;

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
          const laxDot = layer.findOne("#LAX") as Konva.Circle;
        console.log("🔍 laxDot found?", !!laxDot);
        if (laxDot) {
            laxDot.fill("green");
            layer.draw();
            console.log("✅ new fill color:", laxDot.fill());
        }

      setTimeout(() => {
        msg.destroy();
        scoreText.destroy();
        rect.destroy();
        layer.draw();
      }, 3000);
    });

    popup.add(btn);
    popup.add(txt);
  });


  layer.add(popup);
  layer.draw();

}
