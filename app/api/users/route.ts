import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectToDB();
    let user = await User.findOne({
      _clerkId: userId,
    });
    //when in the user sign in for the first time, we create a new user
    if (!user) {
      user = await User.create({
        _clerkId: userId,
      });
      await user.save();
    }
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("[users,get]", err);
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
