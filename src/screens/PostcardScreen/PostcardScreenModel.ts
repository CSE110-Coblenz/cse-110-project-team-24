/**
 * PostcardScreenModel - Manages postcard view state
 */

import { GameStateManager } from "../../GameStateManager";

// Postcard interface
export interface Postcard {
    title: string;
    cityID: string;
    postcardImageSrc: string;
    xPos: number;
    yPos: number;
}


export class PostcardScreenModel {

    // Add a property to hold the postcards
    private postcards: Postcard[] = [];

    // Keeps track of view state
    private isZoomedIn: boolean = false;

    constructor() {
        // Initialize postcards
        //Note: xPos and yPos are relative to percentages of screen size
        this.postcards = [
                        {
                title: "Boston",
                cityID: "boston",
                postcardImageSrc: "/public/Postcards/BostonPostcard.jpg",
                xPos: 42,
                yPos: 65,
            },
            {
                title: "New York",
                cityID: "newyork",
                postcardImageSrc: "/public/Postcards/NewYorkPostcard.jpg",
                xPos: 80,
                yPos: 80,
            },
            {
                title: "Washington DC",
                cityID: "dc",
                postcardImageSrc: "/public/Postcards/DCPostcard.jpg",
                xPos: 15,
                yPos: 85,
            },
            {
                title: "Chicago",
                cityID: "chicago",
                postcardImageSrc: "/public/Postcards/ChicagoPostcard.jpg",
                xPos: 20,
                yPos:15,
            },
            {
                title: "Los Angeles",
                cityID: "losangeles",
                postcardImageSrc: "/public/Postcards/LAPostcard.jpg",
                xPos: 55,
                yPos: 25,
            },
            {
                title: "San Diego",
                cityID: "sandiego",
                postcardImageSrc: "/public/Postcards/SanDiegoPostcard.jpg",
                xPos: 85,
                yPos: 15,
            },





        ];
    }

    // Displays the postcards which are unlocked
    getActivePostcards(): Postcard[] {
        const achievedPostcards: Postcard[] = [];
        for (const postcard of this.postcards) {
            if (GameStateManager.getInstance() != null && GameStateManager.getInstance().getCompletedCities()[postcard.cityID]) {
                achievedPostcards.push(postcard);

            }
        }
        return achievedPostcards;
    }

    // Zoom in on a postcard
    getIsZoomedIn(): boolean {
        return this.isZoomedIn;
    }
    setIsZoomedIn(zoomedIn: boolean): void {
        this.isZoomedIn = zoomedIn;
    }

}
