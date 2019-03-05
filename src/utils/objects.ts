// Takes an array of items and returns an object with the items by their key
export function byNumberKey<Q extends any>(key: number | string, items: Q[]): { [key: number]: Q } {
  const mapped = items.map(i => ({ [i[key]]: i }));
  return Object.assign({}, ...mapped);
}

// can't work out the generic for the key type?
export function byStringKey<Q extends any>(key: number | string, items: Q[]): { [key: string]: Q } {
  const mapped = items.map(i => ({ [i[key]]: i }));
  return Object.assign({}, ...mapped);
}
