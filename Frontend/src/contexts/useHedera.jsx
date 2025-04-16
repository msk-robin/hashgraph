import { useContext } from "react";
import { HederaContext } from "./HederaContext";

export const useHedera = () => useContext(HederaContext);
