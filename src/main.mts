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
  registerStatsHandlers
} from '@eeveebot/libeevee';
import {
  registerAllCommands,
} from './commandRegistry.mjs';

// Initialize module-scoped metrics recorder
const metrics = createModuleMetrics('emote');

// Initialize system metrics
initializeSystemMetrics('emote');

// Setup HTTP server for metrics and health checks
setupHttpServer({
  port: process.env.HTTP_API_PORT || '9000',
  serviceName: 'emote',
});

// Record module startup time for uptime tracking
const moduleStartTime = Date.now();

// Emote module configuration interface
interface EmoteConfig {
  ratelimit?: RateLimitConfig;
}

const natsClients: InstanceType<typeof NatsClient>[] = [];
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

// Subscribe to stats.uptime and stats.emit.request
const statsSubs = registerStatsHandlers({ nats, moduleName: 'emote', startTime: moduleStartTime, metrics });
natsSubscriptions.push(...statsSubs);
