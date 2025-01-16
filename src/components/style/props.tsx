type Props = (
  value:
    | null
    | boolean
    | number
    | string
    | any[]
    | { [key: string]: any }
    | Record<string, any>
) => string;

export default Props;
