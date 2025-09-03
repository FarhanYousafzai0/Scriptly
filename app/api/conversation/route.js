import { Conversation } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";




// Create Conversation 

export async function POST(req){

await connectDB();


    try {
        const {title} = await req.json()

        const conversation = await Conversation.create({title:title || "Untitled"});

        return conversation ? NextResponse.json(conversation) : NextResponse.json({error: "Failed to create conversation"}, {status: 500});
        
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}