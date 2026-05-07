import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();

    const db = client.db();

    const venues = db.collection("Venue");
    const slots = db.collection("Slot");

    const ownerId = new ObjectId(
      "69eb034a448e369bb91c72f7"
    );

    const venueData = [
      {
        name: "Elite Football Arena",
        sport: "Football",
        location: "Koramangala, Bangalore",
        pricePerHour: 3200,
      },

      {
        name: "Smash Badminton Hub",
        sport: "Badminton",
        location: "HSR Layout, Bangalore",
        pricePerHour: 1200,
      },

      {
        name: "Champions Cricket Box",
        sport: "Cricket",
        location: "Indiranagar, Bangalore",
        pricePerHour: 2500,
      },

      {
        name: "Ace Tennis Club",
        sport: "Tennis",
        location: "Whitefield, Bangalore",
        pricePerHour: 2800,
      },

      {
        name: "Urban Basketball Court",
        sport: "Basketball",
        location: "Marathahalli, Bangalore",
        pricePerHour: 1800,
      },

      {
        name: "PowerPlay Turf",
        sport: "Football",
        location: "BTM Layout, Bangalore",
        pricePerHour: 3000,
      },

      {
        name: "Victory Sports Arena",
        sport: "Multi Sport",
        location: "Electronic City, Bangalore",
        pricePerHour: 3500,
      },

      {
        name: "Spin Table Tennis Center",
        sport: "Table Tennis",
        location: "Jayanagar, Bangalore",
        pricePerHour: 900,
      },

      {
        name: "Pro Volleyball Court",
        sport: "Volleyball",
        location: "Bellandur, Bangalore",
        pricePerHour: 1700,
      },

      {
        name: "Racquet Zone",
        sport: "Squash",
        location: "Sarjapur Road, Bangalore",
        pricePerHour: 1400,
      },

      {
        name: "Street Football Hub",
        sport: "Football",
        location: "Hebbal, Bangalore",
        pricePerHour: 2100,
      },

      {
        name: "Skyline Turf Arena",
        sport: "Football",
        location: "MG Road, Bangalore",
        pricePerHour: 4200,
      },

      {
        name: "Prime Cricket Nets",
        sport: "Cricket",
        location: "Rajajinagar, Bangalore",
        pricePerHour: 1600,
      },

      {
        name: "Velocity Basketball Arena",
        sport: "Basketball",
        location: "Yelahanka, Bangalore",
        pricePerHour: 2600,
      },

      {
        name: "Court Kings",
        sport: "Badminton",
        location: "Banashankari, Bangalore",
        pricePerHour: 1100,
      },

      {
        name: "Fusion Sports Complex",
        sport: "Multi Sport",
        location: "KR Puram, Bangalore",
        pricePerHour: 3900,
      },

      {
        name: "Goal Rush Turf",
        sport: "Football",
        location: "JP Nagar, Bangalore",
        pricePerHour: 3400,
      },

      {
        name: "Champion Indoor Arena",
        sport: "Futsal",
        location: "Ulsoor, Bangalore",
        pricePerHour: 2400,
      },

      {
        name: "Smash Point Arena",
        sport: "Badminton",
        location: "Kalyan Nagar, Bangalore",
        pricePerHour: 1000,
      },

      {
        name: "Arena X Sports Hub",
        sport: "Multi Sport",
        location: "Domlur, Bangalore",
        pricePerHour: 4500,
      },
    ];

    for (const venue of venueData) {
      const createdVenue = await venues.insertOne({
        ...venue,

        description:
          "Premium sports venue for matches and tournaments",

        images: [
          "https://images.unsplash.com/photo-1517466787929-bc90951d0974",
        ],

        approved: true,

        ownerId,

        createdAt: new Date(),

        updatedAt: new Date(),
      });

      const slotTemplates = [
        { start: 6, end: 7 },

        { start: 7, end: 8 },

        { start: 8, end: 9 },

        { start: 9, end: 10 },

        { start: 10, end: 11 },

        { start: 11, end: 12 },

        { start: 12, end: 13 },

        { start: 13, end: 14 },

        { start: 14, end: 15 },

        { start: 15, end: 16 },

        { start: 16, end: 17 },

        { start: 17, end: 18 },

        { start: 18, end: 19 },

        { start: 19, end: 20 },

        { start: 20, end: 21 },
      ];

      const today = new Date();

      const slotDocs = slotTemplates.map(
        (slot) => {
          const startTime = new Date(today);

          startTime.setHours(
            slot.start,
            0,
            0,
            0
          );

          const endTime = new Date(today);

          endTime.setHours(slot.end, 0, 0, 0);

          return {
            venueId: createdVenue.insertedId,

            startTime,

            endTime,

            isActive: true,

            createdAt: new Date(),
          };
        }
      );

      await slots.insertMany(slotDocs);
    }

    console.log(
      "20 venues with slots created successfully"
    );
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

seed();