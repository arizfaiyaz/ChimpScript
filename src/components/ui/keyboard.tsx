import { cn } from "../../lib/utils";

type KeyboardProps = {
  className?: string;
  activeKey?: string | null;
};

type KeyDef = {
  label: string;
  match?: string[];
  width?: string;
};

const rows: KeyDef[][] = [
  [
    { label: "~`" },
    { label: "!1", match: ["1", "!"] },
    { label: "@2", match: ["2", "@"] },
    { label: "#3", match: ["3", "#"] },
    { label: "$4", match: ["4", "$"] },
    { label: "%5", match: ["5", "%"] },
    { label: "^6", match: ["6", "^"] },
    { label: "&7", match: ["7", "&"] },
    { label: "*8", match: ["8", "*"] },
    { label: "(9", match: ["9", "("] },
    { label: ")0", match: ["0", ")"] },
    { label: "-_", match: ["-", "_"] },
    { label: "+=", match: ["+", "="] },
    { label: "delete", match: ["Delete", "Backspace"], width: "w-16" },
  ],
  [
    { label: "tab", match: ["Tab"], width: "w-14" },
    ...["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => ({
      label: letter,
      match: [letter, letter.toLowerCase()],
    })),
    { label: "{[", match: ["{", "["] },
    { label: "}]", match: ["}", "]"] },
    { label: "|\\", match: ["|", "\\"] },
  ],
  [
    { label: "caps", width: "w-[4.75rem]" },
    ...["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => ({
      label: letter,
      match: [letter, letter.toLowerCase()],
    })),
    { label: ":;", match: [":", ";"] },
    { label: "\"'", match: ['"', "'"] },
    { label: "return", match: ["Return", "Enter"], width: "w-[4.75rem]" },
  ],
  [
    { label: "shift", match: ["Shift"], width: "w-20" },
    ...["Z", "X", "C", "V", "B", "N", "M"].map((letter) => ({
      label: letter,
      match: [letter, letter.toLowerCase()],
    })),
    { label: "<,", match: ["<", ","] },
    { label: ">.", match: [">", "."] },
    { label: "?/", match: ["?", "/"] },
    { label: "shift", match: ["Shift"], width: "w-20" },
  ],
  [
    { label: "control", width: "w-16" },
    { label: "option", width: "w-16" },
    { label: "command", width: "w-20" },
    { label: "space", match: ["Space"], width: "w-72 max-w-[44vw]" },
    { label: "command", width: "w-20" },
    { label: "option", width: "w-16" },
  ],
];

function Key({ keyDef, activeKey }: { keyDef: KeyDef; activeKey: string | null | undefined }) {
  const isActive = Boolean(activeKey && keyDef.match?.includes(activeKey));

  return (
    <div
      className={cn(
        "flex h-10 min-w-10 shrink-0 items-center justify-center rounded-[7px] border border-white/10 bg-zinc-900/90 px-3 font-mono text-[0.68rem] font-medium uppercase text-zinc-400 shadow-key transition duration-100 md:h-11 md:min-w-11",
        keyDef.width,
        isActive && "translate-y-0.5 border-lime-300/80 bg-lime-300 text-zinc-950 shadow-[0_0_26px_rgba(190,242,100,0.35)]",
      )}
    >
      {keyDef.label}
    </div>
  );
}

export function Keyboard({ className, activeKey }: KeyboardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-max max-w-full overflow-x-auto rounded-[8px] border border-white/10 bg-black/25 p-3 backdrop-blur",
        className,
      )}
    >
      <div className="flex min-w-max flex-col items-center gap-2">
        {rows.map((row, index) => (
          <div className="flex gap-2" key={index}>
            {row.map((keyDef, keyIndex) => (
              <Key activeKey={activeKey} key={`${keyDef.label}-${keyIndex}`} keyDef={keyDef} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
