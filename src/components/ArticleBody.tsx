import type { Article } from "@/content/articles";

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="mt-10">
      {article.blocks.map((block, i) => {
        switch (block.kind) {
          case "h":
            return (
              <h2 key={i} className="mt-10 text-2xl font-semibold first:mt-0">
                {block.text}
              </h2>
            );

          case "sub":
            return (
              <h3 key={i} className="mt-6 font-display text-base font-semibold text-primary">
                {block.text}
              </h3>
            );

          case "p":
            return (
              <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {block.text}
              </p>
            );

          case "bullets":
            return (
              <ul key={i} className="mt-3 space-y-2">
                {block.items.map((item) => (
                  <li key={item.text} className="flex gap-3 text-sm">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-muted-foreground">
                      {item.term && (
                        <span className="font-semibold text-foreground">{item.term}: </span>
                      )}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "steps":
            return (
              <ol key={i} className="mt-4 space-y-3">
                {block.items.map((item, n) => (
                  <li key={item.title} className="panel rounded p-4">
                    <div className="flex gap-3">
                      <span className="font-mono text-xs text-primary">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold">{item.title}</p>
                        {item.text && (
                          <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                        )}
                        {item.sub && (
                          <ul className="mt-2 space-y-1 border-l border-border pl-3">
                            {item.sub.map((s) => (
                              <li key={s} className="text-xs text-muted-foreground">
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            );

          case "qa":
            return (
              <div key={i} className="mt-4 space-y-3">
                {block.items.map((item, n) => (
                  <div key={item.title} className="panel rounded p-4">
                    <p className="font-display text-sm font-semibold">
                      <span className="mr-2 font-mono text-xs text-primary">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-accent">{item.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.plan}</p>
                  </div>
                ))}
              </div>
            );

          case "metrics":
            return (
              <div key={i} className="mt-4 grid gap-2 sm:grid-cols-2">
                {block.items.map((m) => (
                  <div key={m.name} className="panel rounded p-3">
                    <p className="font-display text-sm font-semibold">{m.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.text}</p>
                  </div>
                ))}
              </div>
            );

          case "callout":
            return (
              <p
                key={i}
                className="mt-5 border-l-2 border-primary pl-4 text-sm italic text-foreground"
              >
                {block.text}
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
