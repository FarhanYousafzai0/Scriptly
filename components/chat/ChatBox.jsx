import React from 'react'
import AgentPicker from '../Layout/AgentPicker';

const ChatBox = () => {


    const [conversationId, setConversationId] = useState(null);
    const [agent, setAgent] = useState("scriptWriter");
    const [log, setLog] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();


 async function ensureConversation(){

    if(conversationId)return conversationId;

    const r = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ title: "Untitled" })
      });
      const c = await r.json();
      setConversationId(c.id)
      return c.id;

    }


// On Send :

async function OnSend() {

    const text = inputRef.current?.value?.trim();
    if(!text || loading)return;
    setLoading(true);
    const id = await ensureConversation()
    setLog(prev => (prev ? prev + "\n\n— — —\n\n" : "") + `You: ${text}\nAI: `);


    try {
        

        
    } catch (error) {
        
    }
    
}






        



  return (
    <>
    
    <div className="space-y-3">
      <div className="flex items-center gap-3">
      <AgentPicker value={agents} onChange={setAgents} />
      </div>

      <Textarea  placeholder="Ask something…" rows={4} />
      <Button  disabled={loading}>
       
      </Button>

      <div className="rounded-md border p-3 whitespace-pre-wrap min-h-[160px]">
        {log || "—"}
      </div>
    </div>
    
    </>
  )
}

export default ChatBox