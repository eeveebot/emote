'use strict';

// Emote module
// provides various emote commands like dunno, shrug, downy, etc.

import {
  NatsClient,
  createNatsConnection,
  registerGracefulShutdown,
  createModuleMetrics,
  loadModuleConfig,
  RateLimitConfig,
  defaultRateLimit,
  initializeSystemMetrics,
  setupHttpServer,
  registerStatsHandlers,
  registerHelp,
  HelpEntry,
} from '@eeveebot/libeevee';
import {
  registerAllCommands,
  setupCommandHandlers,
} from './commandRegistry.mjs';

// Initialize module-scoped metrics recorder
const metrics = createModuleMetrics('emote');

// Initialize system metrics
initializeSystemMetrics('emote');



// Record module startup time for uptime tracking
const moduleStartTime = Date.now();

// Emote module configuration interface
interface EmoteConfig {
  ratelimit?: RateLimitConfig;
}

const natsClients: InstanceType<typeof NatsClient>[] = [];

// Setup HTTP server for metrics and health checks
setupHttpServer({
  port: process.env.HTTP_API_PORT || '9000',
  serviceName: 'emote',
  natsClients: natsClients,
});
const natsSubscriptions: Array<Promise<string | boolean>> = [];

// Load configuration at startup
const emoteConfig = loadModuleConfig<EmoteConfig>({});

// Use configured rate limit or default
const rateLimitConfig: RateLimitConfig =
  emoteConfig.ratelimit || defaultRateLimit;

// Register graceful shutdown handlers
registerGracefulShutdown(natsClients);

// Setup NATS connection
const nats = await createNatsConnection();
natsClients.push(nats);

// Function to register all emote commands with the router
async function registerEmoteCommands(): Promise<void> {
  // Register all commands using the command registry
  await registerAllCommands(nats, rateLimitConfig);
}

// Register commands at startup
await registerEmoteCommands();

// Subscribe to command execution messages
const commandSubs = await setupCommandHandlers(nats);
natsSubscriptions.push(...commandSubs);

// Subscribe to stats.uptime and stats.emit.request
const statsSubs = registerStatsHandlers({ nats, moduleName: 'emote', startTime: moduleStartTime, metrics });
natsSubscriptions.push(...statsSubs);

// Emote help entries
const emoteHelp: HelpEntry[] = [
  {
    command: 'dunno',
    descr: 'Shrug with style',
    params: [],
  },
  {
    command: 'shrug',
    descr: '¯\\_(ツ)_/¯',
    params: [],
  },
  {
    command: 'dudeweed',
    descr: 'Dude weed lmao',
    params: [],
  },
  {
    command: 'downy',
    descr: 'Downy emote',
    params: [],
  },
  {
    command: 'doubledowny',
    descr: 'Double downy emote',
    params: [],
  },
  {
    command: 'tripledowny',
    descr: 'Triple downy emote',
    params: [],
  },
  {
    command: 'rainbowdowny',
    descr: 'Rainbow downy emote',
    params: [],
  },
  {
    command: 'id',
    descr: 'ID emote',
    params: [],
  },
  {
    command: 'ld',
    descr: 'LD emote',
    params: [],
  },
  {
    command: 'lv',
    descr: 'LV emote',
    params: [],
  },
  {
    command: 'intense',
    descr: 'Intense emote',
    params: [
      {
        param: 'text',
        required: true,
        descr: 'The text to intense-ify',
      },
    ],
  },
];

// Register help information
const helpSubs = await registerHelp(nats, 'emote', emoteHelp, metrics);
natsSubscriptions.push(...helpSubs);
