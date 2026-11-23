import { splitName } from "@/src/content/site";

// Wordmark: a little dovetail joint as the mark, name set in Fraunces
export default function Logo({ name, className = "" }: { name: string; className?: string }) {
  const [first, last] = splitName(name);
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--walnut)" />
        <path d="M8 9h6l-1.5 5h7L18 9h6v14H8z" fill="var(--birch)" />
        <path d="M12.5 14h7l1 4h-9z" fill="var(--oak)" />
      </svg>
      <span className="font-serif text-[1.15rem] leading-none font-semibold tracking-tight">
        {first && `${first} `}
        <span className="text-copper italic">{last}</span>
      </span>
    </span>
  );
}
