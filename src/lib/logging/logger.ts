type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: unknown;
}

function log(level: LogLevel, payload: LogPayload): void {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    ...payload,
    error:
      payload.error instanceof Error
        ? { name: payload.error.name, message: payload.error.message, stack: payload.error.stack }
        : payload.error,
  };
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  // Structured JSON for production log aggregation; pretty in development if needed
  console[method](JSON.stringify(entry));
}

export const logger = {
  debug: (payload: LogPayload) => log("debug", payload),
  info: (payload: LogPayload) => log("info", payload),
  warn: (payload: LogPayload) => log("warn", payload),
  error: (payload: LogPayload) => log("error", payload),
};
