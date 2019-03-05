// shorthand action factory.
export default function ax(type: string, item?: any) {
  return {
    type,
    item
  };
}
