import {
  FunctionReference,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";
import { DataModel } from "./dataModel";

export declare const query: (
    args: any
) => FunctionReference<"query">;

export declare const mutation: (
    args: any
) => FunctionReference<"mutation">;

export declare const internalMutation: (
    args: any
) => FunctionReference<"mutation", "internal">;
