import type {
  UseQueryForAPI,
  UseMutationForAPI,
  UseActionForAPI,
} from "convex/react";
import type { Api } from "./api";

export declare const useQuery: UseQueryForAPI<Api>;
export declare const useMutation: UseMutationForAPI<Api>;
export declare const useAction: UseActionForAPI<Api>;
