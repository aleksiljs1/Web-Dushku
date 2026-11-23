import { Fragment } from "react";

// Renders "Mobilojmë sipas *dëshirës* dhe *ëndrrave*" with the starred words in
// italic colour, so the owner can choose the accent words from the admin panel.
// Punctuation right after a starred phrase stays glued to it when lines wrap.
export default function Emph({ text, classes = ["text-oak-deep"] }: { text: string; classes?: string[] }) {
  const parts = text.split(/\*([^*]+)\*/g);
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) out.push(<Fragment key={i}>{parts[i]}</Fragment>);
      continue;
    }
    const em = (
      <em key={i} className={classes[((i - 1) / 2) % classes.length]}>
        {parts[i]}
      </em>
    );
    const punct = parts[i + 1]?.match(/^[,.;:!?…]+/)?.[0];
    if (punct) {
      out.push(
        <span key={`g${i}`} className="whitespace-nowrap">
          {em}
          {punct}
        </span>,
      );
      parts[i + 1] = parts[i + 1].slice(punct.length);
    } else out.push(em);
  }
  return <>{out}</>;
}
