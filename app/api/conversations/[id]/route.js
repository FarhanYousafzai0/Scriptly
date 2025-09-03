import { Message } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";



export async function POST(req,{params}){

await connectDB();

try {
    
const {role,content} = await req.json();

const message = await Message.creat({

    role,
    content,
    conversationId: params.id,
})

return message ? NextResponse.json(message) : NextResponse.json({error: "Failed to create message"}, {status: 500});

} catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
}

}