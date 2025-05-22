export function generateFormattedString() {
  return `${rand(2)}-${rand(3)}-${rand(2)}`;
}

function rand(length: number) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}
