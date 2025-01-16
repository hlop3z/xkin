type Props = (config: {
  base: Record<string, any>;
  attrs: (props: any) => any;
  setup: (props: any) => any;
  theme: Record<string, Record<string, any>>;
}) => any;

export default Props;
