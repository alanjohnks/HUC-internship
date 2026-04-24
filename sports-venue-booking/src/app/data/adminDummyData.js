export const getStats = () => {
  return [
    { title: "Total Users", value: "14,282", change: "+12.5%" },
    { title: "Total Bookings", value: "2,854", change: "+8.2%" },
    { title: "Pending Approvals", value: "24", change: "High priority" },
  ];
};

export const getApprovals = () => {
  return [
    {
      name: "Elite Soccer Center",
      owner: "Marcus Thorne",
      location: "Austin, TX",
      date: "Oct 24, 2023",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG1RLR4XMmswK6C3CZZvl2_nkS11vKnXx_qpQvQRtOdqreT-BHRSMYpMpWZcpQV_L-C69xx6s-LCbpaY0CY8QrkFW1AaeedzGAlpp_z8dtPcpnYfVRLTUS9F5y82-AH2UywOAb0IqZSHruq98YX4RPkKITpy64xV31aXyGQcZiIqv_y3dMTbi6f3xhRJZ7dLVlIefAsB2P96NChmw2jf1yHWFr47W5QYaIkHkrJbmwN71VNFNXtk4a9WXv-grvBgz8uY-332lLJ3hN"
    }
  ];
};

export const getUsers = () => {
  return [
    { name: "Alex Rivera", role: "Venue Owner", status: "Active" },
    { name: "Elena Sotillo", role: "Premium User", status: "Flagged" },
    { name: "Jordan Smith", role: "Standard User", status: "Active" },
  ];
};