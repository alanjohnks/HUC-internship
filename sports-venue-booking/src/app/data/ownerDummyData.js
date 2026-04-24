export const getAnalyticsData = () => ({
  revenue: "42,920.00",
  bookings: 842,
  occupancy: "92.4%",
});

export const getVenues = () => ([
  {
    id: 1,
    name: "The Arena Central",
    type: "Premium Turf • Indoor",
    status: "Approved",
    slots: "24 / 24",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYgzCXcHxpYHfxODIroLTh2sKTG0zcjwCkc3bF3DlgLJTRgE5fTGFNmDg4toes4G5zPXki96_9bTssyZUEY4M4lIRdi0yyHO9Mtqb7hr0IF9hZBhJuecuqifJ5q2Gt-TBfolbFy1qxyKNga0ODlMpiYarrK6sreonesNGayv9tDpI9DPrKlRg4aMkWBoJlUlQvN3CbuBhtKUL4dtpzVRAykuhFtMNcYaZYqYfN13vRAIxHQfV69SQuCF23Izyi_mQTpLW7hTZmNswf"
  },
  {
    id: 2,
    name: "Apex Courts Elite",
    type: "Hardwood • Basketball",
    status: "Pending",
    slots: "0 / 12",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQaCgoIsbNXMZAXLKtkcPkyB5jYLm8MbZtKSjmpW7VSzB-Pry2f8QDxY5cUlYvMJzA-dAQRVOtiJbWJDrhmbFhfN-uWXbXNe_wRtblsGI5rV1zly7CRXPXAfDNIWnWXpNgU6epxkAYQ9_C7iPuAWSCfYlhqRFIgRFXc5zCCasqgQsZOW-oo35bUesPSACRnR_hTGipSUMN8Ib4tD5-R74gsjzpsuCkCyTjYOQVI3kwIml9JJR_0xYGUv5d0BsS9rqImMARNlk4Yu0i"
  }
]);

export const getActivities = () => ([
  {
    id: 1,
    name: "Marcus K. Wright",
    email: "marcus.w@gmail.com",
    initials: "MK",
    venue: "The Arena Central",
    time: "Today, 06:00 PM - 08:00 PM",
    amount: "$120.00",
    status: "Confirmed"
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@outlook.com",
    initials: "JD",
    venue: "Apex Courts Elite",
    time: "Tomorrow, 09:00 AM - 11:00 AM",
    amount: "$85.00",
    status: "Scheduled"
  }
]);