// shortMemory.ts

export type Role = "user" | "assistant";

export type MemoryMsg = {
  role: Role;
  content: string;
};

export type ShortMemory = {
  add: (role: Role, content: string) => void;
  addUser: (content: string) => void;
  addAssistant: (content: string) => void;
  context: () => ReadonlyArray<MemoryMsg>;
  clear: () => void;
  snapshot: () => ReadonlyArray<MemoryMsg>;
  restore: (snapshot: ReadonlyArray<MemoryMsg>) => void;
};

export type ShortMemoryConfig = {
  maxTurns?: number; // messages kept (not pairs)
};

const normalise = (s: unknown) => String(s ?? "").trim();

const trimToMax = (msgs: MemoryMsg[], maxTurns: number) => {
  if (maxTurns <= 0) return [];
  const start = Math.max(0, msgs.length - maxTurns);
  return msgs.slice(start);
};

export const createShortMemory = (
  config: ShortMemoryConfig = {}
): ShortMemory => {
  const maxTurns = config.maxTurns ?? 20;
  let msgs: MemoryMsg[] = [];

  const add = (role: Role, content: string) => {
    const text = normalise(content);
    if (!text) return;
    msgs = trimToMax([...msgs, { role, content: text }], maxTurns);
  };

  const clear = () => {
    msgs = [];
  };

  const snapshot = () => msgs.map((m) => ({ ...m }));

  const restore = (snapshotMsgs: ReadonlyArray<MemoryMsg>) => {
    msgs = trimToMax(
      (snapshotMsgs ?? [])
        .filter((m) => m && (m.role === "user" || m.role === "assistant"))
        .map((m) => ({ role: m.role, content: normalise(m.content) }))
        .filter((m) => m.content.length > 0),
      maxTurns
    );
  };

  return {
    add,
    addUser: (c) => add("user", c),
    addAssistant: (c) => add("assistant", c),
    context: () => msgs.slice(),
    clear,
    snapshot,
    restore,
  };
};
