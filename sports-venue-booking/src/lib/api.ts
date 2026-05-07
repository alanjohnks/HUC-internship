const BASE_URL = "/api";

async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...(options.headers || {}),
    },

    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}

export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const fetchVenues = async () => {
  return apiFetch("/venues");
};

export const fetchVenueById = async (
  venueId: string
) => {
  return apiFetch(`/venues/${venueId}`);
};

export const createVenue = async (data: any) => {
  return apiFetch("/venues", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateVenue = async (
  venueId: string,
  data: any
) => {
  return apiFetch(`/venues/${venueId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteVenue = async (
  venueId: string
) => {
  return apiFetch(`/venues/${venueId}`, {
    method: "DELETE",
  });
};

export const fetchBookings = async () => {
  return apiFetch("/owners/matches");
};

export const bookSlot = async (slotId: string) => {
  return apiFetch("/matches", {
    method: "POST",
    body: JSON.stringify({
      slotId,
      visibility: "PRIVATE",
      maxPlayers: 1,
    }),
  });
};

export const createMatch = async (data: {
  title?: string;
  description?: string;
  sport?: string;
  visibility: "PUBLIC" | "PRIVATE";
  maxPlayers: number;
  totalPrice: number;
  venueId: string;
  slotId: string;
}) => {
  return apiFetch("/matches", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const fetchExploreMatches =
  async () => {
    return apiFetch("/matches/explore");
  };

export const fetchOwnerMatches = async () => {
  return apiFetch("/owners/matches");
};

export const joinMatch = async (
  matchId: string
) => {
  return apiFetch(`/matches/${matchId}/join`, {
    method: "POST",
  });
};

export const followUser = async (
  userId: string
) => {
  return apiFetch(`/follow/${userId}`, {
    method: "POST",
  });
};

export const unfollowUser = async (
  userId: string
) => {
  return apiFetch(`/follow/${userId}`, {
    method: "DELETE",
  });
};

export const fetchMessages = async (
  matchId: string
) => {
  return apiFetch(
    `/chat/${matchId}/messages`
  );
};

export const fetchNotifications =
  async () => {
    return apiFetch("/notifications");
  };

export const updateProfile = async (
  data: any
) => {
  return apiFetch("/users", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};