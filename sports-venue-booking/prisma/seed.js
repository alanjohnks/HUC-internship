const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  console.log("Cleaning database...");

  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.chatRoom.deleteMany({});
  await prisma.matchParticipant.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.slot.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleaned");

  const password = await bcrypt.hash(
    "adxadx",
    10
  );

  console.log("Creating admins...");

  await prisma.user.create({
    data: {
      name: "Admin One",
      email: "adx@gmail.com",
      password,
      role: "ADMIN",
      profileImage:
        "https://i.pravatar.cc/300?img=1",
    },
  });

  await prisma.user.create({
    data: {
      name: "Admin Two",
      email: "admin2@gmail.com",
      password,
      role: "ADMIN",
      profileImage:
        "https://i.pravatar.cc/300?img=2",
    },
  });

  console.log("Creating owners...");

  const owners = [];

  for (let i = 1; i <= 5; i++) {
    const owner =
      await prisma.user.create({
        data: {
          name: `Owner ${i}`,
          email: `owner${i}@gmail.com`,
          password,
          role: "OWNER",
          bio: "Professional venue owner",
          profileImage: `https://i.pravatar.cc/300?img=${
            i + 10
          }`,
        },
      });

    owners.push(owner);
  }

  console.log("Creating users...");

  const users = [];

  for (let i = 1; i <= 5; i++) {
    const user =
      await prisma.user.create({
        data: {
          name: `User ${i}`,
          email: `user${i}@gmail.com`,
          password,
          role: "USER",
          bio: "Sports enthusiast",
          profileImage: `https://i.pravatar.cc/300?img=${
            i + 20
          }`,
        },
      });

    users.push(user);
  }

  const sports = [
    "Football",
    "Cricket",
    "Badminton",
    "Basketball",
    "Tennis",
  ];

  const sportsData = {
    Football: {
      names: [
        "GoalNest Arena",
        "Elite Football Hub",
        "Turf Titans",
        "Victory Football Arena",
        "Striker's Point",
        "Kickoff Grounds",
        "Urban Goal Arena",
        "Champions Turf",
      ],

      images: [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        "https://images.unsplash.com/photo-1486286701208-1d58e9338013",
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974",
      ],
    },

    Cricket: {
      names: [
        "Boundary Cricket Club",
        "PowerPlay Stadium",
        "Skyline Cricket Arena",
        "Royal Pitch Ground",
        "Legends Cricket Hub",
        "Premier Cricket Nets",
        "Spin Masters Arena",
        "Century Sports Ground",
      ],

      images: [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
        "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972",
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
      ],
    },

    Badminton: {
      names: [
        "Smash Point",
        "Feather Arena",
        "Ace Badminton Club",
        "Rapid Shuttle Arena",
        "Prime Smash Court",
        "Victory Shuttle Hub",
        "Elite Racquet Zone",
        "Power Smash Arena",
      ],

      images: [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
        "https://images.unsplash.com/photo-1613918431703-aa5081f10a19",
        "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef",
      ],
    },

    Basketball: {
      names: [
        "Hoops Nation",
        "Sky Dunk Arena",
        "Urban Basket Court",
        "Elite Hoopers Hub",
        "Full Court Arena",
        "Downtown Basketball Club",
        "JumpShot Arena",
        "MVP Courts",
      ],

      images: [
        "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        "https://images.unsplash.com/photo-1519861531473-9200262188bf",
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a",
      ],
    },

    Tennis: {
      names: [
        "Grand Slam Courts",
        "Ace Tennis Arena",
        "TopSpin Club",
        "Elite Serve Courts",
        "Victory Tennis Hub",
        "Centre Court Arena",
        "Match Point Club",
        "Pro Tennis Grounds",
      ],

      images: [
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6",
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      ],
    },
  };

  const locations = [
    "Koramangala",
    "HSR Layout",
    "Whitefield",
    "Indiranagar",
    "BTM Layout",
    "Marathahalli",
    "Electronic City",
    "Yelahanka",
    "JP Nagar",
    "Bellandur",
  ];

  console.log("Creating venues...");

  const venues = [];

  for (let i = 1; i <= 40; i++) {
    const owner =
      owners[
        Math.floor(
          Math.random() *
            owners.length
        )
      ];

    const approved = i > 10;

    const sport =
      sports[
        Math.floor(
          Math.random() *
            sports.length
        )
      ];

    const sportData =
      sportsData[sport];

    const venueName =
      sportData.names[
        Math.floor(
          Math.random() *
            sportData.names.length
        )
      ];

    const venueImages =
      sportData.images;

    const venue =
      await prisma.venue.create({
        data: {
          name: `${venueName} ${
            i + 10
          }`,

          description: `Professional ${sport.toLowerCase()} venue with premium facilities and modern infrastructure.`,

          location:
            locations[
              Math.floor(
                Math.random() *
                  locations.length
              )
            ],

          sport,

          pricePerHour:
            Math.floor(
              Math.random() *
                4000
            ) + 500,

          images: venueImages,

          approved,

          ownerId: owner.id,
        },
      });

    venues.push(venue);

    const slotTemplates = [
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
      [10, 11],
      [11, 12],
      [12, 13],
      [13, 14],
      [14, 15],
      [15, 16],
      [16, 17],
      [17, 18],
      [18, 19],
      [19, 20],
    ];

    for (const slot of slotTemplates) {
      const start =
        new Date();

      start.setHours(
        slot[0],
        0,
        0,
        0
      );

      const end =
        new Date();

      end.setHours(
        slot[1],
        0,
        0,
        0
      );

      await prisma.slot.create({
        data: {
          venueId: venue.id,
          startTime: start,
          endTime: end,
        },
      });
    }
  }

  console.log("Creating follows...");

  for (const user of users) {
    const randomOwner =
      owners[
        Math.floor(
          Math.random() *
            owners.length
        )
      ];

    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId:
          randomOwner.id,
      },
    });

    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        title: "New follower",
        message: `${user.name} started following you`,
        senderId: user.id,
        receiverId:
          randomOwner.id,
      },
    });
  }

  console.log("Creating matches...");

  const approvedVenues =
    await prisma.venue.findMany({
      where: {
        approved: true,
      },

      include: {
        slots: true,
      },
    });

  for (let i = 0; i < 25; i++) {
    const creator =
      users[
        Math.floor(
          Math.random() *
            users.length
        )
      ];

    const venue =
      approvedVenues[
        Math.floor(
          Math.random() *
            approvedVenues.length
        )
      ];

    const slot =
      venue.slots[
        Math.floor(
          Math.random() *
            venue.slots.length
        )
      ];

    const maxPlayers =
      Math.floor(
        Math.random() * 8
      ) + 2;

    const totalPrice =
      venue.pricePerHour ||
      1000;

    const splitPrice = Number(
      (
        totalPrice /
        maxPlayers
      ).toFixed(2)
    );

    const visibility =
      Math.random() > 0.5
        ? "PUBLIC"
        : "PRIVATE";

    const match =
      await prisma.match.create({
        data: {
          title: `${venue.sport} Match ${
            i + 1
          }`,

          description:
            "Friendly community sports match",

          sport:
            venue.sport,

          visibility,

          maxPlayers,

          currentPlayers: 1,

          totalPrice,

          splitPrice,

          creatorId:
            creator.id,

          venueId: venue.id,

          slotId: slot.id,

          participants: {
            create: {
              userId:
                creator.id,

              paymentStatus:
                "PAID",

              amountPaid:
                splitPrice,

              isOrganizer: true,
            },
          },

          ...(visibility ===
            "PUBLIC" && {
            chatRoom: {
              create: {},
            },
          }),
        },

        include: {
          chatRoom: true,
        },
      });

    const extraPlayers =
      Math.floor(
        Math.random() *
          (maxPlayers - 1)
      );

    const shuffled =
      [...users].sort(
        () => 0.5 - Math.random()
      );

    for (
      let j = 0;
      j < extraPlayers;
      j++
    ) {
      const player =
        shuffled[j];

      if (
        player.id ===
        creator.id
      )
        continue;

      await prisma.matchParticipant.create(
        {
          data: {
            userId:
              player.id,

            matchId:
              match.id,

            paymentStatus:
              "PAID",

            amountPaid:
              splitPrice,
          },
        }
      );

      await prisma.match.update({
        where: {
          id: match.id,
        },

        data: {
          currentPlayers: {
            increment: 1,
          },
        },
      });

      await prisma.notification.create(
        {
          data: {
            type:
              "MATCH_JOINED",

            title:
              "Player Joined",

            message: `${player.name} joined your match`,

            senderId:
              player.id,

            receiverId:
              creator.id,

            matchId:
              match.id,
          },
        }
      );

      if (
        visibility ===
          "PUBLIC" &&
        match.chatRoom
      ) {
        const sampleMessages = [
          "Ready for the game 🔥",
          "Who's bringing the ball?",
          "Let's win this 💪",
          "See you guys at the venue",
          "Anyone coming early?",
          "Excited for tonight ⚽",
        ];

        await prisma.message.create(
          {
            data: {
              content:
                sampleMessages[
                  Math.floor(
                    Math.random() *
                      sampleMessages.length
                  )
                ],

              senderId:
                player.id,

              chatRoomId:
                match.chatRoom
                  .id,
            },
          }
        );
      }
    }
  }

  console.log(
    "Seed completed successfully"
  );

  console.log(
    "ADMIN LOGIN"
  );

  console.log(
    "Email: adx@gmail.com"
  );

  console.log(
    "Password: adxadx"
  );
}

seed()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });