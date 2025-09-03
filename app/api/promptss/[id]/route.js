import { Prompt } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";



export async function GET(req,{params}){

await connectDB();

// Get Prompt

   try {
    const doc = await Prompt.findById(params.id).lean();
    return doc ? NextResponse.json(doc) : NextResponse.json({error: "Prompt not found"}, {status: 404});
   } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
   }

}



// Update Prompt

export async function PUT(req,{params}){

await connectDB()
    try {
        const data = await req.json();
        const doc = await Prompt.findByIdAndUpdate(params.id,data,{new: true}).lean();
        return doc ? NextResponse.json(doc) : NextResponse.json({error: "Prompt not found"}, {status: 404});
        
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}



// Delete Prompt

export async function DELETE(req,{params}){
    await connectDB();

    try {
        const doc = await Prompt.findByIdAndDelete(params.id).lean();
        return doc ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Prompt not found" }, { status: 404 });
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}