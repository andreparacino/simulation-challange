export const getClassNames = (...classNames: (string | boolean | null | undefined)[]) =>
  classNames.filter(Boolean).join(" ").trim();
