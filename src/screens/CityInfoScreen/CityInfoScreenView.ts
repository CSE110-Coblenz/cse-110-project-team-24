import Konva from "konva";
import type { View } from "../../types.ts";
import type { CityInformationEntry } from "./CityInfoScreenModel.ts";
import { STAGE_WIDTH } from "../../constants.ts";
import { STAGE_HEIGHT } from "../../constants.ts";

export class CityInfoView implements View {
	private group: Konva.Group;
    private infoGroup: Konva.Group;

    constructor(returnToHome: () => void) {
        this.group = new Konva.Group({ visible: false });
        this.infoGroup = new Konva.Group();


        console.log("CityInfoView initialized");

        //Add a background rectangle
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: 'lightblue',
        });
        this.group.add(background);

            //Button to return home
            Konva.Image.fromURL("/public/Postcards/PinImage.png", (img) => {
              img.width(100);
              img.height(100);
              img.x(STAGE_WIDTH - img.width() - 20);
              img.y(20);
              img.on("click", () => {
                returnToHome();
              });
              img.on("mouseover", () => {
                img.scale({ x: 1.1, y: 1.1 }); // Slightly enlarge the image
                img.getLayer()?.draw();
                });
              img.on("mouseout", () => {
                img.scale({ x: 1, y: 1 }); // Reset the image size
                img.getLayer()?.draw();
                });
              this.group.add(img);
            });
    }


    displayCityInfo(cityInfo: CityInformationEntry, playMinigame: (cityName: string) => void): void {

        // Clear previous info
        this.infoGroup.destroyChildren();

        //Show title
        const title = new Konva.Text({
            x: 0 + STAGE_WIDTH / 10,
            y: 0 + STAGE_HEIGHT / 20,
            text: cityInfo.cityName,
            fontSize: 100,
            fontFamily: 'Arial',
            fill: 'black',
        });
        title.offsetX(title.width() / 2); // Center horizontally
        this.infoGroup.add(title);

        //Show description
        const description = new Konva.Text({
            x: 0 + STAGE_WIDTH / 5.5,
            y: 0 + STAGE_HEIGHT / 8,
            text: cityInfo.description,
            fontSize: 70,
            fontFamily: 'Arial',
            fill: 'black',
            width: STAGE_WIDTH - STAGE_WIDTH / 1.4,
        });
        description.offsetX(description.width() / 2); // Center horizontally
        this.infoGroup.add(description);

        //Show image
        Konva.Image.fromURL(cityInfo.image1Url, (img) => {
            img.x(STAGE_WIDTH / 2);
            img.y(STAGE_HEIGHT / 4);
            img.width(STAGE_WIDTH / 4);
            img.height(STAGE_HEIGHT / 4);
            img.offsetX(img.width() / 2); 
            img.offsetY(img.height() / 2);

            this.infoGroup.add(img);
        });

        //Show second image
        Konva.Image.fromURL(cityInfo.image2Url, (img) => {
            img.x(STAGE_WIDTH / 2);
            img.y(STAGE_HEIGHT / 1.5);
            img.width(STAGE_WIDTH / 4);
            img.height(STAGE_HEIGHT / 4);
            img.offsetX(img.width() / 2); 
            img.offsetY(img.height() / 2);

            this.infoGroup.add(img);
        });


        //Show minigame title
        const minititle = new Konva.Text({
            x: STAGE_WIDTH - (STAGE_WIDTH / 10) * 3,
            y: STAGE_HEIGHT / 20,
            text: cityInfo.minigameTitle,
            fontSize: 100,
            fontFamily: 'Arial',
            fill: 'black',
        });
        minititle.offsetX(minititle.width() / 2); // Center horizontally
        this.infoGroup.add(minititle);

        //Show description
        const minidescription = new Konva.Text({
            x: STAGE_WIDTH - STAGE_WIDTH / 5.5,
            y: 0 + STAGE_HEIGHT / 8,
            text: cityInfo.minigameInfo,
            fontSize: 70,
            fontFamily: 'Arial',
            fill: 'black',
            width: STAGE_WIDTH - STAGE_WIDTH / 1.4,
        });
        minidescription.offsetX(minidescription.width() / 2); // Center horizontally
        this.infoGroup.add(minidescription);

        //Add play minigame button
        const playButton = new Konva.Rect({
            x: STAGE_WIDTH - STAGE_WIDTH / 5 - 150,
            y: STAGE_HEIGHT / 2.5,
            width: 500,
            height: 300,
            fill: 'green',
            cornerRadius: 20,
        });
        playButton.on("mouseover", () => {
            playButton.fill('darkgreen');
            playButton.getLayer()?.draw();
        });
        playButton.on("mouseout", () => {
            playButton.fill('green');
            playButton.getLayer()?.draw();
        });
        playButton.on("click", () => {
            playMinigame(cityInfo.cityIDtype);
        });
        const playButtonText = new Konva.Text({
            x: playButton.x() + playButton.width() / 2,
            y: playButton.y() + playButton.height() / 2,
            text: "Play Minigame",
            fontSize: 70,
            fontFamily: 'Arial',
            fill: 'white',
        });
        playButtonText.on("click", () => {
            playMinigame(cityInfo.cityIDtype);
        });
        playButtonText.on("mouseover", () => {
            playButton.fill('darkgreen');
            playButton.getLayer()?.draw();
        });
        playButtonText.on("mouseout", () => {
            playButton.fill('green');
            playButton.getLayer()?.draw();
        });
        playButtonText.offsetX(playButtonText.width() / 2);
        playButtonText.offsetY(playButtonText.height() / 2);

        this.infoGroup.add(playButton);
        this.infoGroup.add(playButtonText);


        console.log(`Displaying info for city: ${cityInfo.cityName}`);

    }


	show(): void {
		this.group.visible(true);
        this.infoGroup.visible(true);
        this.group.add(this.infoGroup);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}