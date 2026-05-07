# emote

> Emoticons, hot and fresh.

## Overview

The emote module provides a collection of text-based emote commands for the eevee chat bot. When a user triggers a command in a chat channel, emote responds with an ASCII/Unicode emoticon, a random selection from a face pool, or a transformed version of the user's input.

Emote fits into the eevee ecosystem as a standard NATS-based module: it registers its commands with the router at startup, then subscribes to `command.execute.<uuid>` topics to handle invocations. All communication flows through NATS — emote never talks to chat platforms directly.

The module is platform-agnostic. Commands are registered with `platform: '.*'` so they work on any connector (IRC, Discord, etc.). On IRC, emote output is automatically colorized using `randomColorForPlatform` from `@eeveebot/libeevee`.

## Features

- **11 emote commands** — shrug, dunno, downy (and variants), dudeweed, id, ld, lv, intense
- **Random face selection** — `dunno` and `shrug` pick from curated face pools for variety
- **Multi-line emotes** — `doubledowny` and `tripledowny` send the downy face 2 or 3 times
- **Text transformation** — `intense` wraps user-supplied text in `[... intensifies]` format
- **Random responses** — `id` and `ld` include rare alternate outputs for variety
- **IRC colorization** — output is colorized on IRC platforms via libeevee utilities
- **Rate limiting** — all commands respect the configured rate limit
- **Metrics** — command counts, processing times, and error rates are tracked via libeevee metrics
- **Graceful shutdown** — NATS connections are cleaned up on SIGTERM/SIGINT

## Install

This module is part of the eevee ecosystem and is not published independently.

```bash
# From the eevee project root
cd emote
npm install
```

## Configuration

Emote reads its configuration via `loadModuleConfig` from `@eeveebot/libeevee`. The only configurable option is rate limiting.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ratelimit` | `RateLimitConfig` | `defaultRateLimit` | Rate limit applied to all emote command registrations |

The module also respects the following environment variable:

| Variable | Default | Description |
|----------|---------|-------------|
| `HTTP_API_PORT` | `9000` | Port for the HTTP metrics and health-check server |

## Usage / Commands

All commands are triggered in chat by typing the command name, optionally prefixed with the platform's command prefix (e.g. `!` on IRC).

| Command | Output | Notes |
|---------|--------|-------|
| `dunno` | Random "I don't know" face | Picks from 9 faces including `‾\(ツ)/‾`, `¯\(º_o)/¯`, `ʕ ᵒ̌ ‸ ᵒ̌ ʔ`, and more |
| `shrug` | Random shrug face | Picks from 20 faces; classic `¯\_(ツ)_/¯` appears most frequently |
| `downy` | `.'​/)` | Single downy face |
| `doubledowny` | `.'​/)` × 2 | Downy face sent twice |
| `tripledowny` | `.'​/)` × 3 | Downy face sent three times |
| `rainbowdowny` | `.'​/)` | Downy face (with IRC colorization) |
| `dudeweed` | `dude weed lmao` | Classic meme |
| `id` | `illegal drugs` (80% chance) | ~20% chance of a random "dbladez" variant |
| `ld` | `legal drugs` (90% chance) | ~10% chance of an alternate message |
| `lv` | `♥` | A single heart |
| `intense <text>` | `[<text> intensifies]` | Wraps user text in intensify brackets |

### Examples

```
<user> !dunno
<eevee> 乁໒( ͒ ⌂ ͒ )७ㄏ

<user> !shrug
<eevee> ¯\_(ツ)_/¯

<user> !downy
<eevee> .'/)

<user> !doubledowny
<eevee> .'/)
<eevee> .'/)

<user> !dudeweed
<eevee> dude weed lmao

<user> !id
<eevee> illegal drugs

<user> !ld
<eevee> legal drugs

<user> !lv
<eevee> ♥

<user> !intense javascript
<eevee> [javascript intensifies]
```

### Special behaviors

- **`dunno` and `shrug`** — Each invocation selects a random face from a pool. The shrug pool is weighted toward the classic `¯\_(ツ)_/¯` (appears 4 times in the 20-entry array).
- **`id`** — Has a ~20% chance (when `y >= 800` out of 0–998) of selecting from 5 humorous "dbladez" variants instead of the default `illegal drugs`.
- **`ld`** — Has a ~7% chance of outputting one of three alternate messages: `"There are no legal drugs."`, `"All drugs are illegal."`, or `"Your drug use has been logged and reported."`
- **`intense`** — Requires trailing text (regex: `^intense\s+`). The text after the command is wrapped in `[... intensifies]` brackets. Unlike other commands, intense does not apply IRC colorization.

## Architecture

```
┌────────────┐  command.register   ┌────────┐
│   emote    │ ──────────────────► │ router │
│  (startup) │                     └────────┘
└────────────┘                         │
                                       │ command.execute.<uuid>
                                       ▼
┌──────────────────────────────────────────────┐
│                 emote module                  │
│                                              │
│  NATS subscribe ─► command handler           │
│                       │                      │
│                  select face / build text     │
│                       │                      │
│                  colorize (IRC only)          │
│                       │                      │
│                  sendChatMessage ──► NATS     │
│                                      │       │
│                              chat connector  │
└──────────────────────────────────────────────┘
```

**Startup flow:**

1. `main.mts` loads config and creates a NATS connection.
2. `registerAllCommands()` publishes a `command.register` message to the router for each of the 11 commands, each with a unique UUID and the configured rate limit.
3. `setupCommandHandlers()` subscribes to `command.execute.<uuid>` for each registered command.

**Command execution flow:**

1. The router matches a chat message to a command regex and publishes to `command.execute.<uuid>`.
2. The corresponding handler in `src/commands/` receives the message, selects or builds the emote text, optionally colorizes it, and calls `sendChatMessage()` to publish a response back through NATS.
3. The appropriate chat connector picks up the response and sends it to the channel.

**Source structure:**

```
src/
├── main.mts              # Entry point — NATS connection, command registration, subscriptions
├── commandRegistry.mts   # Registers all commands with router, sets up execution handlers
├── commands/
│   ├── dunno.mts         # Random "I don't know" face
│   ├── shrug.mts         # Random shrug face
│   ├── downy.mts         # Single downy emote
│   ├── doubledowny.mts   # Downy × 2
│   ├── tripledowny.mts   # Downy × 3
│   ├── rainbowdowny.mts  # Downy with color
│   ├── dudeweed.mts      # "dude weed lmao"
│   ├── id.mts            # "illegal drugs" with rare variants
│   ├── ld.mts            # "legal drugs" with rare variants
│   ├── lv.mts            # Heart emote
│   └── intense.mts       # [<text> intensifies]
└── utils/
    └── colorize.mts      # IRC colorization wrapper
```

## Development

```bash
cd emote
npm install
npm test        # lint with eslint
npm run build   # lint + compile TypeScript
npm run dev     # build + run locally
```

**Requirements:** Node.js ≥ 24.0.0, a running NATS server, and the eevee router.

## Contributing

Contributions are welcome! When adding a new emote command:

1. Create a new handler in `src/commands/<name>.mts` following the existing pattern (implement `handle<Name>Command`).
2. Add a stable UUID and import in `commandRegistry.mts`.
3. Add a registration entry in the `commandRegistrations` array with the command regex.
4. Add the handler to `setupCommandHandlers()`.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — see [LICENSE](./LICENSE) for the full text.
