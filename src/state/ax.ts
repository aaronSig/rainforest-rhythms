import { State } from "./types";

// shorthand action factory.
export default function ax(type: string, item?: { [key in keyof State]?: any }) {
  return {
    type,
    item
  };
}
