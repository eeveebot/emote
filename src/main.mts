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
  registerCommand,
  registerHelp,
  HelpEntry,
  NatsSubscriptionResult,
} from '@eeveebot/libeevee';
import { handleDunnoCommand } from './commands/dunno.mjs';
import { handleShrugCommand } from './commands/shrug.mjs';
import { handleDudeweedCommand } from './commands/dudeweed.mjs';
import { handleDownyCommand } from './commands/downy.mjs';
import { handleDoubledownyCommand } from './commands/doubledowny.mjs';
import { handleTripledownyCommand } from './commands/tripledowny.mjs';
import { handleRainbowdownyCommand } from './commands/rainbowdowny.mjs';
import { handleIdCommand } from './commands/id.mjs';
import { handleLdCommand } from './commands/ld.mjs';
import { handleLvCommand } from './commands/lv.mjs';
import { handleIntenseCommand } from './commands/intense.mjs';
import fs from 'node:fs';

// Command UUIDs
const DUNNO_UUID = '0ac87398-83b6-42a1-8aaa-86ac3b6fb520';
const SHRUG_UUID = '4756864a-dcf2-47eb-9e3e-bbc2e8b4e890';
const DUDEWEED_UUID = '03ca4bbe-6a6f-456b-a47e-8ba9242aeba1';
const DOWNY_UUID = '2aa74b6e-3bb9-400b-bf8a-6277864aaf84';
const DOUBLE_DOWNY_UUID = '5e81ef72-f7e6-442c-97b2-3576c9134b7b';
const TRIPLE_DOWNY_UUID = 'd28fb23a-3dda-4e18-8fee-e162620f3f4d';
const RAINBOW_DOWNY_UUID = '089dabf3-fe9f-4795-aa64-8e0f233e9a73';
const ID_UUID = 'ba3bbcb3-61ea-4a46-9460-072db00aa903';
const LD_UUID = 'a0b9079e-3633-4d1a-8fc8-1b9cd18c0ceb';
const LV_UUID = 'd07043be-2bd8-47b4-bd03-d741a4b7623f';
const INTENSE_UUID = '80ed7f0b-e3df-4184-8898-1e9695599ba2';

// Initialize module-scoped metrics recorder
const metrics = createModuleMetrics('emote');

// Initialize system metrics
initializeSystemMetrics('emote');

// Record module startup time for uptime tracking
const moduleStartTime = Date.now();
const moduleVersion = JSON.parse(fs.readFileSync(new URL('package.json', 'file://' + process.cwd() + '/'), 'utf8')).version as string;

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
const natsSubscriptions: Array<Promise<NatsSubscriptionResult>> = [];

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

// Register commands with the router using registerCommand helper
const dunnoSubs = await registerCommand(nats, {
  commandUUID: DUNNO_UUID,
  commandDisplayName: 'dunno',
  regex: '^dunno$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...dunnoSubs);

const shrugSubs = await registerCommand(nats, {
  commandUUID: SHRUG_UUID,
  commandDisplayName: 'shrug',
  regex: '^shrug$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...shrugSubs);

const dudeweedSubs = await registerCommand(nats, {
  commandUUID: DUDEWEED_UUID,
  commandDisplayName: 'dudeweed',
  regex: '^dudeweed$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...dudeweedSubs);

const downySubs = await registerCommand(nats, {
  commandUUID: DOWNY_UUID,
  commandDisplayName: 'downy',
  regex: '^downy$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...downySubs);

const doubledownySubs = await registerCommand(nats, {
  commandUUID: DOUBLE_DOWNY_UUID,
  commandDisplayName: 'doubledowny',
  regex: '^doubledowny$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...doubledownySubs);

const tripledownySubs = await registerCommand(nats, {
  commandUUID: TRIPLE_DOWNY_UUID,
  commandDisplayName: 'tripledowny',
  regex: '^tripledowny$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...tripledownySubs);

const rainbowdownySubs = await registerCommand(nats, {
  commandUUID: RAINBOW_DOWNY_UUID,
  commandDisplayName: 'rainbowdowny',
  regex: '^rainbowdowny$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...rainbowdownySubs);

const idSubs = await registerCommand(nats, {
  commandUUID: ID_UUID,
  commandDisplayName: 'id',
  regex: '^id$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...idSubs);

const ldSubs = await registerCommand(nats, {
  commandUUID: LD_UUID,
  commandDisplayName: 'ld',
  regex: '^ld$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...ldSubs);

const lvSubs = await registerCommand(nats, {
  commandUUID: LV_UUID,
  commandDisplayName: 'lv',
  regex: '^lv$',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...lvSubs);

const intenseSubs = await registerCommand(nats, {
  commandUUID: INTENSE_UUID,
  commandDisplayName: 'intense',
  regex: '^intense\\s+',
  platformPrefixAllowed: true,
  ratelimit: rateLimitConfig,
}, metrics);
natsSubscriptions.push(...intenseSubs);

// Subscribe to command execution messages
natsSubscriptions.push(handleDunnoCommand({ nats, commandUUID: DUNNO_UUID }));
natsSubscriptions.push(handleShrugCommand({ nats, commandUUID: SHRUG_UUID }));
natsSubscriptions.push(handleDudeweedCommand({ nats, commandUUID: DUDEWEED_UUID }));
natsSubscriptions.push(handleDownyCommand({ nats, commandUUID: DOWNY_UUID }));
natsSubscriptions.push(handleDoubledownyCommand({ nats, commandUUID: DOUBLE_DOWNY_UUID }));
natsSubscriptions.push(handleTripledownyCommand({ nats, commandUUID: TRIPLE_DOWNY_UUID }));
natsSubscriptions.push(handleRainbowdownyCommand({ nats, commandUUID: RAINBOW_DOWNY_UUID }));
natsSubscriptions.push(handleIdCommand({ nats, commandUUID: ID_UUID }));
natsSubscriptions.push(handleLdCommand({ nats, commandUUID: LD_UUID }));
natsSubscriptions.push(handleLvCommand({ nats, commandUUID: LV_UUID }));
natsSubscriptions.push(handleIntenseCommand({ nats, commandUUID: INTENSE_UUID }));

// Subscribe to stats.uptime and stats.emit.request
const statsSubs = registerStatsHandlers({ nats, moduleName: 'emote', startTime: moduleStartTime, version: moduleVersion, metrics });
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
