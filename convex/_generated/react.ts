import {
  useQuery as useQueryImpl,
  useMutation as useMutationImpl,
  useAction as useActionImpl,
} from "convex/react";
import { api } from "./api"; // Keep import but use it or ignore

// Re-export implementations
export const useQuery = useQueryImpl;
export const useMutation = useMutationImpl;
export const useAction = useActionImpl;

// Dummy usage to satisfy unused variable check if strict, though usually api is used in types
// In this mock file, we can just export it or use it.
export { api };
