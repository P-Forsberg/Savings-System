export function formatSEK(value: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export function progressPercent(saved: number, target: number) {
  if (target <= 0) {
    return 0;
  }
  return Math.min(Math.round((saved / target) * 100), 100);
}

export function monthsBetween(from: string, to: string) {
  const a = new Date(from);
  const b = new Date(to);
  return Math.max(
    1,
    (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(),
  );
}

export function formatSek(value: number) {
  return formatSEK(value);
}

export function formatIsoDate(value: string) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("sv-SE");
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayIso() {
  return toInputDate(new Date());
}

export function nextYearIso() {
  const now = new Date();
  return toInputDate(new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()));
}
