import { useRef, useState } from "react";
import { MessageSquare, X, CornerDownLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Turn = { role: "you" | "ezrp"; text: string };

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    setTurns((t) => [...t, { role: "you", text: question }, { role: "ezrp", text: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => "Request failed"));
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let acc = "";
      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        acc += chunk;
        setTurns((t) => {
          const next = [...t];
          next[next.length - 1] = { role: "ezrp", text: acc };
          return next;
        });
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
      }
      if (!acc.trim()) {
        setTurns((t) => {
          const next = [...t];
          next[next.length - 1] = {
            role: "ezrp",
            text: "I couldn't put an answer together for that one. Try naming a topic, like accounts payable or cutover.",
          };
          return next;
        });
      }
    } catch (error) {
      setTurns((t) => {
        const next = [...t];
        next[next.length - 1] = {
          role: "ezrp",
          text: `Something went wrong reaching the assistant: ${
            error instanceof Error ? error.message : "unknown error"
          }`,
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q || busy) return;
    setValue("");
    void ask(q);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110"
      >
        {open ? <X className="size-4" /> : <MessageSquare className="size-4" />}
        {open ? "Close" : "Ask for a guide"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            className="panel fixed bottom-20 right-5 z-50 flex h-[28rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col rounded-lg"
          >
            <header className="border-b border-border px-4 py-3">
              <p className="label-xs">EZRP assistant</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Answers come only from the guide library.
              </p>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {turns.length === 0 && (
                <div className="space-y-2">
                  {[
                    "What happens in accounts payable?",
                    "How does cutover work?",
                    "Which guides cover data?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => void ask(s)}
                      className="block w-full rounded border border-border bg-muted/50 px-3 py-2 text-left text-sm transition hover:border-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {turns.map((t, i) => (
                <div key={i} className="text-sm">
                  <p className="label-xs">{t.role}</p>
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed">
                    {t.text || (busy && i === turns.length - 1 ? "thinking…" : "")}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about a topic…"
                className="min-w-0 flex-1 rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1 rounded bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                <CornerDownLeft className="size-4" />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
