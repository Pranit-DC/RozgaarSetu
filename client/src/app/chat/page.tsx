"use client";
import { useRole } from "../context/RoleContext";
import { Card } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useState } from "react";

export default function ChatPage() {
  const { role } = useRole();
  const [messages, setMessages] = useState<{from:string; text:string; ts:number}[]>([
    { from: role === 'worker' ? 'employer' : 'worker', text: 'Hi, can you come at 5 PM?', ts: Date.now()-600000 },
    { from: role, text: 'Yes, that works for me.', ts: Date.now()-300000 }
  ]);
  const [draft, setDraft] = useState('');

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-[24px] font-semibold tracking-tight">Chat</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Prototype in-app communication</p>
      </header>
      <Card variant="soft" className="p-0 flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {messages.map((m,i)=>(
            <div key={i} className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-[13px] font-medium leading-snug shadow-sm ${m.from===role ? 'self-end bg-[var(--apple-accent)] text-white' : 'bg-[var(--apple-bg-alt)] text-[var(--apple-text)] border border-[var(--apple-border)]'}`}>{m.text}</div>
          ))}
        </div>
        <form className="p-4 border-t border-[var(--apple-border)] flex gap-3" onSubmit={e=>{e.preventDefault(); if(!draft.trim()) return; setMessages(ms=>[...ms,{from:role,text:draft,ts:Date.now()}]); setDraft('');}}>
          <Input placeholder="Type a message" value={draft} onChange={e=>setDraft(e.target.value)} className="flex-1" />
          <Button type="submit" disabled={!draft.trim()}>Send</Button>
        </form>
      </Card>
    </section>
  );
}
