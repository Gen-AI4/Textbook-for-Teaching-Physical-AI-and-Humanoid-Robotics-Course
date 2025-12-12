// api/_types.ts
export interface HonoEnv {
  Variables: {
    user?: any;
  };
  Bindings: {
    [key: string]: any;
  };
}