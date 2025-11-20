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
            description: "As the spiritual capital of the New England states, as the progenitor of the American Revolution and the nation, and as the earliest centre of American culture, Boston has influenced the country for some three centuries. Though Boston, like New England in general, has played a lessening role in national life since the early 20th century, it has remained the focal point of what may be the most diversified and dynamic combination of educational, cultural, medical, and scientific activities in the United States.",
            image1Url: "../../../public/USmap.png",
            image2Url: "../../../public/USmap.png",
            minigameTitle: "Boston History Trivia",
            minigameInfo: "How well do you know Boston's history?",
        },
        {
            cityIDtype: "dc",
            cityName: "Washington DC",
            description: "Washington is an extraordinary city, one with multiple personalities: a working federal city, an international metropolis, a picturesque tourist destination, an unmatched treasury of the country’s history and artifacts, and a cosmopolitan center that retains a neighborly small-town ambience. The role Washington plays as the capital of the United States often overshadows its lively local history and its complex political, economic, and social issues. About half the land in Washington is owned by the U.S. government, which pays no taxes on it. Several hundred thousand people in the D.C. metropolitan area work for the federal government.",
            image1Url: "../../../public/USmap.png",
            image2Url: "../../../public/USmap.png",
            minigameTitle: "Boston History Trivia",
            minigameInfo: "How well do you know Boston's history?",
        },
        {
            cityIDtype: "losangeles",
            cityName: "Los Angeles",
            description: "Los Angeles is California's most populous city and the second-most populous in the U.S., known for its role as a global hub for entertainment, culture, and commerce. Situated between the Pacific Ocean and mountains, it is a sprawling city with a diverse population, a car-dependent culture, and distinct, decentralized neighborhoods like Hollywood, Beverly Hills, and Downtown.",
            image1Url: "../../../public/USmap.png",
            image2Url: "../../../public/USmap.png",
            minigameTitle: "Boston History Trivia",
            minigameInfo: "How well do you know Boston's history?",
        },
        {
            cityIDtype: "sandiego",
            cityName: "San Diego",
            description: "San Diego is a major California city known for its mild climate, 70 miles of coastline, and numerous beaches. It's a cultural hub with attractions like the famous San Diego Zoo and Balboa Park, a significant naval presence, and a growing economy in tech and biotech. The city blends urban sophistication with a laid-back, coastal atmosphere, offering both diverse neighborhoods and extensive outdoor recreation.",
            image1Url: "../../../public/USmap.png",
            image2Url: "../../../public/USmap.png",
            minigameTitle: "Boston History Trivia",
            minigameInfo: "How well do you know Boston's history?",
        },
        {
            cityIDtype: "chicago",
            cityName: "Chicago",
            description: "Chicago is the third-largest city in the U.S. and a major hub for culture, commerce, and transportation, situated on the southwestern shore of Lake Michigan. Known for its iconic architecture, vibrant arts and music scene, and diverse food, the city is organized into 77 distinct neighborhoods. Historically, it became the nation's railroad hub and a key freshwater trading center, playing a crucial role in westward expansion and commerce.",
            image1Url: "../../../public/USmap.png",
            image2Url: "../../../public/USmap.png",
            minigameTitle: "Boston History Trivia",
            minigameInfo: "How well do you know Boston's history?",
        },

    ];

    getCityInfo(cityIDtype: string): CityInformationEntry | undefined {
        return this.cityInfoData.find(city => city.cityIDtype === cityIDtype);
    }

}

