export interface Listing {
    id: number;
    title: string;
    category: string;
    image: string;
    gallery?: string[];
    price: number;
    quantity: number;
    minOrder?: number;
    rating: number;
    soldQuantity: number;
    location: string;
    farmer: string;
    farmerLocation?: string;
    status: 'online' | 'offline';
    syncStatus: 'synced' | 'pending' | 'online-only';
    description?: string;
    updatedAt?: string;
}

export const sampleListings: Listing[] = [
    {
        id: 1,
        title: "Organic Red Tomatoes",
        category: "Tomatoes",
        image: "/tomatoes.png",
        gallery: ["/tomatoes.png", "/farmer.png", "/potatoes.png"],
        price: 60,
        quantity: 200,
        minOrder: 10,
        rating: 4.5,
        soldQuantity: 122,
        location: "Addis Ababa",
        farmer: "Abebe Kebede",
        farmerLocation: "Hawassa, Sidama Region",
        status: "online",
        syncStatus: "synced",
        description: "Premium quality red tomatoes, organically grown without pesticides. Freshly harvested and ready for bulk purchase. Ideal for retail and catering businesses.",
        updatedAt: "2023-12-24"
    },
    {
        id: 2,
        title: "Premium Ethiopian Arabica Coffee Beans",
        category: "Coffee Beans",
        image: "/farmer.png",
        gallery: ["/farmer.png", "/tomatoes.png", "/potatoes.png"],
        price: 450,
        quantity: 150,
        minOrder: 5,
        rating: 4.8,
        soldQuantity: 215,
        location: "Sidama",
        farmer: "Tigist Hailu",
        farmerLocation: "Yirgalem, Sidama Region",
        status: "online",
        syncStatus: "synced",
        description: "World-renowned Sidama Arabica coffee beans. Hand-picked and sun-dried to perfection. Experience the rich, floral notes and balanced acidity.",
        updatedAt: "2023-12-23"
    },
    {
        id: 3,
        title: "Local Highland Potatoes",
        category: "Potatoes",
        image: "/potatoes.png",
        gallery: ["/potatoes.png", "/tomatoes.png", "/farmer.png"],
        price: 35,
        quantity: 500,
        minOrder: 50,
        rating: 4.3,
        soldQuantity: 387,
        location: "Oromia Region",
        farmer: "Dawit Lemma",
        farmerLocation: "Ambo, Oromia Region",
        status: "offline",
        syncStatus: "pending",
        description: "High-yield highland potatoes from the rich soils of Ambo. Perfect for making fries or traditional Ethiopian stews.",
        updatedAt: "2023-12-22"
    },
    {
        id: 4,
        title: "Finest White Teff Grain",
        category: "Teff Grain",
        image: "/farmer.png",
        gallery: ["/farmer.png", "/tomatoes.png"],
        price: 150,
        quantity: 300,
        minOrder: 25,
        rating: 4.7,
        soldQuantity: 198,
        location: "Amhara Region",
        farmer: "Zeneb Tesfaye",
        farmerLocation: "Gojjam, Amhara Region",
        status: "online",
        syncStatus: "synced",
        description: "Grade A white teff grain, meticulously cleaned and stone-ground. The essential ingredient for perfect, sour injera.",
        updatedAt: "2023-12-21"
    },
    {
        id: 5,
        title: "Fresh Green Cabbage",
        category: "Cabbage",
        image: "/farmer.png",
        gallery: ["/farmer.png", "/potatoes.png"],
        price: 25,
        quantity: 180,
        minOrder: 20,
        rating: 4.2,
        soldQuantity: 156,
        location: "Tigray Region",
        farmer: "Alem Wolde",
        farmerLocation: "Mekelle, Tigray Region",
        status: "online",
        syncStatus: "synced",
        description: "Crispy and fresh green cabbage, harvested daily. Rich in nutrients and perfect for salads or cooking.",
        updatedAt: "2023-12-20"
    },
    {
        id: 6,
        title: "Sweet Red Onions",
        category: "Onions",
        image: "/farmer.png",
        gallery: ["/farmer.png", "/tomatoes.png"],
        price: 40,
        quantity: 250,
        minOrder: 15,
        rating: 4.6,
        soldQuantity: 289,
        location: "Addis Ababa",
        farmer: "Mulugeta Girma",
        farmerLocation: "Addis Ababa, Ethiopia",
        status: "offline",
        syncStatus: "pending",
        description: "High-quality red onions with a long shelf life. Pungent and flavorful, a staple for any kitchen.",
        updatedAt: "2023-12-19"
    },
    {
        id: 7,
        title: "Organic Bananas",
        category: "Bananas",
        image: "/farmer.png",
        gallery: ["/farmer.png", "/tomatoes.png"],
        price: 55,
        quantity: 120,
        minOrder: 10,
        rating: 4.4,
        soldQuantity: 98,
        location: "Oromia Region",
        farmer: "Hanna Bekele",
        farmerLocation: "Jimma, Oromia Region",
        status: "online",
        syncStatus: "synced",
        description: "Naturally ripened organic bananas. Sweet, creamy, and packed with energy.",
        updatedAt: "2023-12-18"
    },
    {
        id: 8,
        title: "Premium Wheat Grain",
        category: "Wheat Grain",
        image: "/farmer.png",
        gallery: ["/farmer.png"],
        price: 120,
        quantity: 400,
        minOrder: 50,
        rating: 4.5,
        soldQuantity: 342,
        location: "Amhara Region",
        farmer: "Yohannes Alemu",
        farmerLocation: "Gondar, Amhara Region",
        status: "online",
        syncStatus: "synced",
        description: "High-protein wheat grain, ideal for baking bread and other flour-based products.",
        updatedAt: "2023-12-17"
    },
    {
        id: 9,
        title: "Fresh Harvest Carrots",
        category: "Carrots",
        image: "/farmer.png",
        gallery: ["/farmer.png"],
        price: 45,
        quantity: 160,
        minOrder: 10,
        rating: 4.3,
        soldQuantity: 124,
        location: "Sidama",
        farmer: "Sara Negussie",
        farmerLocation: "Hawassa, Sidama Region",
        status: "online",
        syncStatus: "synced",
        description: "Sweet and crunchy carrots, freshly harvested from the fertile lands of Sidama.",
        updatedAt: "2023-12-16"
    },
    {
        id: 10,
        title: "Premium Barley Grain",
        category: "Barley Grain",
        image: "/farmer.png",
        gallery: ["/farmer.png"],
        price: 110,
        quantity: 350,
        minOrder: 30,
        rating: 4.6,
        soldQuantity: 267,
        location: "Tigray Region",
        farmer: "Tekle Habtemariam",
        farmerLocation: "Adigrat, Tigray Region",
        status: "offline",
        syncStatus: "pending",
        description: "High-quality barley grain, suitable for traditional soups and beverages.",
        updatedAt: "2023-12-15"
    }
];
