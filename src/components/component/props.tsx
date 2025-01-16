type Props =
  | null
  | boolean
  | number
  | string
  | any[]
  | { [key: string]: any }
  | Record<string, any>;

export default Props;
