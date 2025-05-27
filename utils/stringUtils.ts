export function generateFormattedString(): string {
  return `${rand(2)}-${rand(3)}-${rand(2)}`;
}

function rand(length: number): string {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}
