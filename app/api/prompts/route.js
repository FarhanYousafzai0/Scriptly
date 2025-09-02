import { Prompt } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";


// Get Prompts

export async function GET(req){
await connectDB();
try {
    
    const item = await Prompt.find().sort({createdAt: -1}).limit(10).lean()
    return NextResponse.json(item);

} catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
}

}


// Post Promot 
export async function POST(req){
    await connectDB();
   try {
    const {body} = await req.json();
    const item = await Prompt.create(body);
    return NextResponse.json(item);
    
   } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
   }
}