import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find();
    return NextResponse.json(todos);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  if (!body.title || !body.deadline) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const todo = await Todo.create({
  title: body.title,
  deadline: body.deadline,
});

  return NextResponse.json(todo);
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    await Todo.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
