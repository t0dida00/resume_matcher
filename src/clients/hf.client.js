import { InferenceClient } from "@huggingface/inference";
import { cfg } from "../config/env.js";

if (!cfg.hfToken) {
    throw new Error("HF_ACCESS_TOKEN is missing");
}

export const hf = new InferenceClient(cfg.hfToken);
