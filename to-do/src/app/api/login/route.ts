import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
