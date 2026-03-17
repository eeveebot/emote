'use strict';

// Emote module
// provides various emote commands like dunno, shrug, downy, etc.

import fs from 'node:fs';
import yaml from 'js-yaml';
import { NatsClient, log } from '@eeveebot/libeevee';
import {
  registerAllCommands,
  setupCommandHandlers,
} from './commandRegistry.mjs';

// Record module startup time for uptime tracking
const moduleStartTime = Date.now();

// Rate limit configuration interface
interface RateLimitConfig {
  mode: 'enqueue' | 'drop';
  level: 'channel' | 'user' | 'global';
  limit: number;
  interval: string; // e.g., "30s", "1m", "5m"
}

// Emote module configuration interface
interface EmoteConfig {
  ratelimit?: RateLimitConfig;
}

const natsClients: InstanceType<typeof NatsClient>[] = [];
const natsSubscriptions: Array<Promise<string | boolean>> = [];

/**
 * Load emote configuration from YAML file
 * @returns EmoteConfig parsed from YAML file
 */
function loadEmoteConfig(): EmoteConfig {
  // Get the config file path from environment variable
  const configPath = process.env.MODULE_CONFIG_PATH;
  if (!configPath) {
    log.warn('MODULE_CONFIG_PATH not set, using default rate limit config', {
      producer: 'emote',
    });
    return {};
  }

  try {
    // Read the YAML file
    const configFile = fs.readFileSync(configPath, 'utf8');

    // Parse the YAML content
    const config = yaml.load(configFile) as EmoteConfig;

    log.info('Loaded emote configuration', {
      producer: 'emote',
      configPath,
    });

    return config;
  } catch (error) {
    log.error('Failed to load emote configuration, using defaults', {
      producer: 'emote',
      configPath,
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

// Load configuration at startup
const emoteConfig = loadEmoteConfig();

// Default rate limit configuration
const defaultRateLimit: RateLimitConfig = {
  mode: 'drop',
  level: 'user',
  limit: 5,
  interval: '1m',
};

// Use configured rate limit or default
const rateLimitConfig: RateLimitConfig =
  emoteConfig.ratelimit || defaultRateLimit;

// Function to register all emote commands with the router
async function registerEmoteCommands(): Promise<void> {
  // Register all commands using the command registry
  await registerAllCommands(nats, rateLimitConfig);
}

//
// Setup NATS connection

// Get host and token
const natsHost = process.env.NATS_HOST || false;
if (!natsHost) {
  const msg = 'environment variable NATS_HOST is not set.';
  throw new Error(msg);
}

const natsToken = process.env.NATS_TOKEN || false;
if (!natsToken) {
  const msg = 'environment variable NATS_TOKEN is not set.';
  throw new Error(msg);
}

const nats = new NatsClient({
  natsHost: natsHost as string,
  natsToken: natsToken as string,
});
natsClients.push(nats);
await nats.connect();

// Register commands at startup
await registerEmoteCommands();

// Subscribe to stats.uptime messages and respond with module uptime
const statsUptimeSub = nats.subscribe('stats.uptime', (subject, message) => {
  try {
    const data = JSON.parse(message.string());
    log.info('Received stats.uptime request', {
      producer: 'emote',
      replyChannel: data.replyChannel,
    });

    // Calculate uptime in milliseconds
    const uptime = Date.now() - moduleStartTime;

    // Send uptime back via the ephemeral reply channel
    const uptimeResponse = {
      module: 'emote',
      uptime: uptime,
      uptimeFormatted: `${Math.floor(uptime / 86400000)}d ${Math.floor((uptime % 86400000) / 3600000)}h ${Math.floor((uptime % 3600000) / 60000)}m ${Math.floor((uptime % 60000) / 1000)}s`,
    };

    if (data.replyChannel) {
      void nats.publish(data.replyChannel, JSON.stringify(uptimeResponse));
    }
  } catch (error) {
    log.error('Failed to process stats.uptime request', {
      producer: 'emote',
      error: error,
    });
  }
});
natsSubscriptions.push(statsUptimeSub);

// Set up all command handlers using the command registry
const commandSubscriptions = await setupCommandHandlers(nats);
natsSubscriptions.push(...commandSubscriptions);

// Subscribe to control messages for re-registering commands
const controlSubRegisterCommandAll = nats.subscribe(
  'control.registerCommands',
  () => {
    log.info('Received control.registerCommands control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandAll);

// Subscribe to control messages for re-registering individual commands
const controlSubRegisterCommandDunno = nats.subscribe(
  'control.registerCommands.dunno',
  () => {
    log.info('Received control.registerCommands.dunno control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandDunno);

const controlSubRegisterCommandShrug = nats.subscribe(
  'control.registerCommands.shrug',
  () => {
    log.info('Received control.registerCommands.shrug control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandShrug);

const controlSubRegisterCommandDudeweed = nats.subscribe(
  'control.registerCommands.dudeweed',
  () => {
    log.info('Received control.registerCommands.dudeweed control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandDudeweed);

const controlSubRegisterCommandDowny = nats.subscribe(
  'control.registerCommands.downy',
  () => {
    log.info('Received control.registerCommands.downy control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandDowny);

const controlSubRegisterCommandDoubledowny = nats.subscribe(
  'control.registerCommands.doubledowny',
  () => {
    log.info('Received control.registerCommands.doubledowny control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandDoubledowny);

const controlSubRegisterCommandTripledowny = nats.subscribe(
  'control.registerCommands.tripledowny',
  () => {
    log.info('Received control.registerCommands.tripledowny control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandTripledowny);

const controlSubRegisterCommandRainbowdowny = nats.subscribe(
  'control.registerCommands.rainbowdowny',
  () => {
    log.info('Received control.registerCommands.rainbowdowny control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandRainbowdowny);

const controlSubRegisterCommandId = nats.subscribe(
  'control.registerCommands.id',
  () => {
    log.info('Received control.registerCommands.id control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandId);

const controlSubRegisterCommandLd = nats.subscribe(
  'control.registerCommands.ld',
  () => {
    log.info('Received control.registerCommands.ld control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandLd);

const controlSubRegisterCommandLv = nats.subscribe(
  'control.registerCommands.lv',
  () => {
    log.info('Received control.registerCommands.lv control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandLv);

const controlSubRegisterCommandIntense = nats.subscribe(
  'control.registerCommands.intense',
  () => {
    log.info('Received control.registerCommands.intense control message', {
      producer: 'emote',
    });
    void registerEmoteCommands();
  }
);
natsSubscriptions.push(controlSubRegisterCommandIntense);

// Help information for emote commands
const emoteHelp = [
  {
    command: 'dunno',
    descr: 'dunno face',
    params: [],
  },
  {
    command: 'shrug',
    descr: 'shrug face',
    params: [],
  },
  {
    command: 'dudeweed',
    descr: 'dude weed lmao',
    params: [],
  },
  {
    command: 'downy',
    descr: 'downy face',
    params: [],
  },
  {
    command: 'doubledowny',
    descr: 'two downys in a row',
    params: [],
  },
  {
    command: 'tripledowny',
    descr: 'three downys in a row',
    params: [],
  },
  {
    command: 'rainbowdowny',
    descr: 'rainbow-ized downy face',
    params: [],
  },
  {
    command: 'id',
    descr: 'illegal drugs',
    params: [],
  },
  {
    command: 'ld',
    descr: 'legal drugs',
    params: [],
  },
  {
    command: 'lv',
    descr: 'heart',
    params: [],
  },
  {
    command: 'intense',
    descr: 'intensify your text',
    params: [
      {
        param: 'text',
        required: true,
        descr: 'Text to intensify',
      },
    ],
  },
];

// Function to publish help information
async function publishHelp(): Promise<void> {
  const helpUpdate = {
    from: 'emote',
    help: emoteHelp,
  };

  try {
    await nats.publish('help.update', JSON.stringify(helpUpdate));
    log.info('Published emote help information', {
      producer: 'emote',
    });
  } catch (error) {
    log.error('Failed to publish emote help information', {
      producer: 'emote',
      error: error,
    });
  }
}

// Publish help information at startup
await publishHelp();

// Subscribe to help update requests
const helpUpdateRequestSub = nats.subscribe('help.updateRequest', () => {
  log.info('Received help.updateRequest message', {
    producer: 'emote',
  });
  void publishHelp();
});
natsSubscriptions.push(helpUpdateRequestSub);
