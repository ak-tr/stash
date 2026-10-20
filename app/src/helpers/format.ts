// "1h 42m" / "2h" / "12m" until a timestamp, never below 1m
export const timeLeft = (at: number) => {
  const minutes = Math.max(1, Math.round((at - Date.now()) / 60000));
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
};

// en-GB, e.g. "4 Jan 2026"
export const date = (at: number) =>
  new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
