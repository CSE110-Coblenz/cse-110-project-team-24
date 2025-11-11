export type CityInformationEntry = {

    cityIDtype: string;
    cityName: string;
    description: string;
    image1Url: string;
    image2Url: string;
    minigameTitle: string;
    minigameInfo: string;
    
};

export class CityInfoModel {

    private cityInfoData: CityInformationEntry[] = [
        //PLACEHOLDER DATA
        {
            cityIDtype: "newyork",
            cityName: "New York City",
            description: "New York City, city and port located at the mouth of the Hudson River, southeastern New York state, northeastern U.S. It is the largest and most influential American metropolis, encompassing Manhattan and Staten islands, the western sections of Long Island, and a small portion of the New York state mainland to the north of Manhattan. New York City is in reality a collection of many neighbourhoods scattered among the city’s five boroughs—Manhattan, Brooklyn, the Bronx, Queens, and Staten Island—each exhibiting its own lifestyle. Moving from one city neighbourhood to the next may be like passing from one country to another. New York is the most populous and the most international city in the country. Its urban area extends into adjoining parts of New York, New Jersey, and Connecticut. ",
            image1Url: "../../../public/USmap.png",
            image2Url: "../../../public/USmap.png",
            minigameTitle: "Taxi Trivia",
            minigameInfo: "Click on the taxi with the correct answer to the question!",
        },
        {
            cityIDtype: "boston",
            cityName: "Boston",
            description: "A historic city with rich colonial heritage and modern charm.",
            image1Url: "images/boston1.jpg",
            image2Url: "images/boston2.jpg",
            minigameTitle: "Boston History Trivia",
            minigameInfo: "How well do you know Boston's history?",
        }
    ];

    getCityInfo(cityIDtype: string): CityInformationEntry | undefined {
        return this.cityInfoData.find(city => city.cityIDtype === cityIDtype);
    }

}