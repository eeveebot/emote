declare module 'irc-colors' {
  export function red(text: string): string;
  export function green(text: string): string;
  export function yellow(text: string): string;
  export function blue(text: string): string;
  export function purple(text: string): string;
  export function cyan(text: string): string;
  export function white(text: string): string;
  export function gray(text: string): string;
  export function lightgreen(text: string): string;
  export function lightyellow(text: string): string;
  export function lightblue(text: string): string;
  export function pink(text: string): string;
  export function lightgray(text: string): string;
  export function rainbow(text: string): string;
  export function stripColors(text: string): string;
  export function stripStyle(text: string): string;
  export function stripColorsAndStyle(text: string): string;
}
