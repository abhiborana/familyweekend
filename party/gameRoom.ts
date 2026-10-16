import { routePartykitRequest, Server } from "partyserver";
import type { Connection } from "partyserver";
import { applyAction, createInitialState } from "../src/engine";
import type { ClientRole, GameAction, GameState, TeamId } from "../src/engine/types";

type HelloMessage = {
  type: "hello";
  role: ClientRole;
};

type ActionMessage = {
  type: "action";
  action: GameAction;
};

type BuzzMessage = {
  type: "buzz";
  teamId: TeamId;
};

type ClientMessage = HelloMessage | ActionMessage | BuzzMessage;

type ServerMessage =
  | { type: "state"; state: GameState }
  | { type: "error"; message: string };

const HOST_ONLY = new Set<GameAction["type"]>([
  "SET_FAMILIES",
  "START_GAME",
  "END_GAME",
  "OPEN_BUZZERS",
  "RESET_BUZZERS",
  "DISMISS_BUZZER_FOCUS",
  "SET_TV_VIEW",
  "SUBMIT_FACEOFF_ANSWER",
  "FACEOFF_INCORRECT",
  "START_FACEOFF_MEMBER",
  "MARK_FACEOFF_ON_BOARD",
  "MARK_FACEOFF_MEMBER_MISS",
  "REVEAL_QUESTION",
  "REVEAL_FINAL_OPTIONS",
  "REVEAL_ANSWER",
  "MARK_CORRECT",
  "MARK_INCORRECT",
  "GIVE_STRIKE",
  "START_STEAL",
  "RESOLVE_STEAL",
  "AWARD_POINTS",
  "NEXT_QUESTION",
  "NEXT_ROUND",
  "GO_TO_BOARD_ROUND",
  "GO_TO_RAPID_FIRE",
  "GO_TO_JUMBLE",
  "FORCE_PHASE",
  "START_TIMER",
  "TICK",
  "STOP_TIMER",
  "LOG_RAPID_ANSWER",
  "SET_RAPID_ANSWER",
  "PASS_RAPID_QUESTION",
  "SAME_ANSWER_BUZZ",
  "REVEAL_RAPID_QUESTION",
  "FINISH_RAPID_PLAYER",
  "EVALUATE_RAPID_SCORE",
  "START_FINAL_ROUND",
  "UPDATE_FINAL_ORDER",
  "CLEAR_FINAL_DRAG",
  "SUBMIT_FINAL_ORDER",
  "TRIGGER_SFX",
  "CLEAR_SFX",
  "UNDO",
  "SET_ROOM_CODE",
]);

export class GameRoom extends Server {
  state!: GameState;
  roles = new Map<string, ClientRole>();

  onStart() {
    this.state = createInitialState(this.name.toUpperCase());
  }

  onConnect(connection: Connection) {
    this.send(connection, { type: "state", state: this.stripSnapshot(this.state) });
  }

  onClose(connection: Connection) {
    this.roles.delete(connection.id);
  }

  onMessage(sender: Connection, message: string | ArrayBuffer) {
    if (typeof message !== "string") {
      this.send(sender, { type: "error", message: "Invalid message" });
      return;
    }

    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(message) as ClientMessage;
    } catch {
      this.send(sender, { type: "error", message: "Invalid message" });
      return;
    }

    if (parsed.type === "hello") {
      this.roles.set(sender.id, parsed.role);
      this.send(sender, { type: "state", state: this.stripSnapshot(this.state) });
      return;
    }

    if (parsed.type === "buzz") {
      const role = this.roles.get(sender.id);
      const teamFromRole =
        role === "familyA" ? "A" : role === "familyB" ? "B" : parsed.teamId;
      const next = applyAction(this.state, {
        type: "LOCK_BUZZER",
        payload: { teamId: teamFromRole },
      });
      if (next !== this.state) {
        this.state = next;
        this.broadcastState();
      }
      return;
    }

    if (parsed.type === "action") {
      const role = this.roles.get(sender.id);
      if (role !== "host") {
        this.send(sender, { type: "error", message: "Only host can send actions" });
        return;
      }
      if (!HOST_ONLY.has(parsed.action.type) && parsed.action.type !== "LOCK_BUZZER") {
        this.send(sender, { type: "error", message: "Unknown action" });
        return;
      }
      this.state = applyAction(this.state, parsed.action);
      this.broadcastState();
    }
  }

  private stripSnapshot(state: GameState): GameState {
    return { ...state, lastSnapshot: null };
  }

  private broadcastState() {
    const payload: ServerMessage = {
      type: "state",
      state: this.stripSnapshot(this.state),
    };
    this.broadcast(JSON.stringify(payload));
  }

  private send(connection: Connection, payload: ServerMessage) {
    connection.send(JSON.stringify(payload));
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
