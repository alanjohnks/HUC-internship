const BASE_URL = "http://localhost:3000/api";

export const fetchVenues = async () => {
  const res = await fetch("/api/venues");

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("Venues not JSON:", text);
    return [];
  }
};

export const fetchBookings = async () => {
  try {
    const res = await fetch("/api/bookings", {
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    if (!res.ok) {
      throw new Error(data?.error || "Request failed");
    }

    return data;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    throw err;
  }
};





export const bookSlot = async (slotId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ slotId }),
  });

  return res.json();
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // important
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Login failed");
  }

  return result;
};




export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("NOT JSON RESPONSE:", text);
    throw new Error("Server returned HTML instead of JSON");
  }
};



