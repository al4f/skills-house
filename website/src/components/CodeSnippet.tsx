import { useState } from "react";

type CodeSnippetProps = {
  code: string;
  label?: string;
  prompt?: string;
};

export function CodeSnippet({ code, label, prompt = "$" }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="code-snippet">
      {label ? <span className="code-snippet-label">{label}</span> : null}
      <div className="code-snippet-body">
        <span className="code-snippet-prompt" aria-hidden="true">
          {prompt}
        </span>
        <code className="code-snippet-code">{code}</code>
        <button type="button" className="code-snippet-copy" onClick={handleCopy} aria-label="Copy command">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
