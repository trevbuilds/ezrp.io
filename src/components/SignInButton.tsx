import { useId, useState, type ReactNode } from "react";

import { dismissAuthNotice, REDIRECT_SOURCE, signInWithGoogle, useAuthNotice } from "@/lib/auth";

/**
 * One button for every place that offers sign-in. It also shows why a sign-in
 * failed, because the usual reason — Google not switched on for the site, or
 * the editor preview, which can't host the redirect — is something the visitor
 * can act on and a silent button is not.
 *
 * A page can carry several of these, so each shows only its own failure. The
 * one in the header also shows a failure that came back with the page from
 * Google, since no button was clicked for that one.
 */
export function SignInButton({
  children = "Sign in with Google",
  className,
  noticeClassName = "mt-2 text-xs text-destructive",
  showsRedirectNotice = false,
}: {
  children?: ReactNode;
  className?: string;
  noticeClassName?: string;
  showsRedirectNotice?: boolean;
}) {
  const source = useId();
  const [pending, setPending] = useState(false);
  const found = useAuthNotice();
  const notice =
    found && (found.source === source || (showsRedirectNotice && found.source === REDIRECT_SOURCE))
      ? found.message
      : null;

  const onClick = async () => {
    setPending(true);
    try {
      await signInWithGoogle(source);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button type="button" onClick={onClick} disabled={pending} className={className}>
        {pending ? "Opening Google…" : children}
      </button>
      {notice && (
        <p role="alert" className={noticeClassName}>
          {notice}{" "}
          <button type="button" onClick={dismissAuthNotice} className="underline">
            Dismiss
          </button>
        </p>
      )}
    </>
  );
}
