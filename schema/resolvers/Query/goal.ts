import type { QueryResolvers } from "./../../types.generated";

export const goal: NonNullable<QueryResolvers["goal"]> = async (
  _parent,
  _arg,
  _ctx,
) => {
  throw new Error("goal resolver not implemented");
};
