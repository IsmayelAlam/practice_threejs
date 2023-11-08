import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      blockCount: 10,
      blockSeed: 0,

      phase: "ready",
      startTime: 0,
      endTime: 0,

      start() {
        set((state) =>
          state.phase === "ready"
            ? { phase: "playing", startTime: Date.now() }
            : {}
        );
      },
      restart() {
        set((state) =>
          state.phase === "playing" || state.phase === "ended"
            ? { phase: "ready", blockSeed: Math.random() }
            : {}
        );
      },
      end() {
        set((state) =>
          state.phase === "playing"
            ? { phase: "ended", endTime: Date.now() }
            : {}
        );
      },
    };
  })
);
