"use client";

import { useState } from "react";
import VenueCard from "./VenueCard";

export default function VenueList({ venues }: { venues: any[] }) {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("");

  const filteredVenues = venues.filter((v) => {
    const matchesSearch = v.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSport = sportFilter
      ? v.sport === sportFilter
      : true;

    return matchesSearch && matchesSport;
  });

  const uniqueSports = [
    ...new Set(venues.map((v) => v.sport).filter(Boolean)),
  ];

  return (
    <div>
      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search venues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Sport Filter */}
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none"
        >
          <option value="">All Sports</option>
          {uniqueSports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Venue Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))
        ) : (
          <p className="text-gray-400">No venues found</p>
        )}
      </div>
    </div>
  );
}