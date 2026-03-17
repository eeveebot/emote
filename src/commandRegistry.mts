import { NatsClient, log } from '@eeveebot/libeevee';
import { recordNatsPublish } from './lib/metrics.mjs';
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

// Emote command UUIDs
export const dunnoCommandUUID = '0ac87398-83b6-42a1-8aaa-86ac3b6fb520';
export const shrugCommandUUID = '4756864a-dcf2-47eb-9e3e-bbc2e8b4e890';
export const dudeweedCommandUUID = '03ca4bbe-6a6f-456b-a47e-8ba9242aeba1';
export const downyCommandUUID = '2aa74b6e-3bb9-400b-bf8a-6277864aaf84';
export const doubledownyCommandUUID = '5e81ef72-f7e6-442c-97b2-3576c9134b7b';
export const tripledownyCommandUUID = 'd28fb23a-3dda-4e18-8fee-e162620f3f4d';
export const rainbowdownyCommandUUID = '089dabf3-fe9f-4795-aa64-8e0f233e9a73';
export const idCommandUUID = 'ba3bbcb3-61ea-4a46-9460-072db00aa903';
export const ldCommandUUID = 'a0b9079e-3633-4d1a-8fc8-1b9cd18c0ceb';
export const lvCommandUUID = 'd07043be-2bd8-47b4-bd03-d741a4b7623f';
export const intenseCommandUUID = '80ed7f0b-e3df-4184-8898-1e9695599ba2';

export interface CommandRegistration {
  type: 'command.register';
  commandUUID: string;
  commandDisplayName: string;
  platform: string;
  network: string;
  instance: string;
  channel: string;
  user: string;
  regex: string;
  platformPrefixAllowed: boolean;
  ratelimit: RateLimitConfig;
}

export interface RateLimitConfig {
  mode: 'enqueue' | 'drop';
  level: 'channel' | 'user' | 'global';
  limit: number;
  interval: string;
}

// Update the ratelimit property in CommandRegistration to use the proper type
export interface CommandRegistration {
  type: 'command.register';
  commandUUID: string;
  commandDisplayName: string;
  platform: string;
  network: string;
  instance: string;
  channel: string;
  user: string;
  regex: string;
  platformPrefixAllowed: boolean;
  ratelimit: RateLimitConfig;
}

export async function registerAllCommands(
  nats: InstanceType<typeof NatsClient>,
  rateLimitConfig: RateLimitConfig
): Promise<void> {
  // Define all command registrations
  const commandRegistrations: CommandRegistration[] = [
    {
      type: 'command.register',
      commandUUID: dunnoCommandUUID,
      commandDisplayName: 'dunno',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^dunno$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: shrugCommandUUID,
      commandDisplayName: 'shrug',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^shrug$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: dudeweedCommandUUID,
      commandDisplayName: 'dudeweed',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^dudeweed$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: downyCommandUUID,
      commandDisplayName: 'downy',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^downy$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: doubledownyCommandUUID,
      commandDisplayName: 'doubledowny',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^doubledowny$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: tripledownyCommandUUID,
      commandDisplayName: 'tripledowny',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^tripledowny$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: rainbowdownyCommandUUID,
      commandDisplayName: 'rainbowdowny',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^rainbowdowny$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: idCommandUUID,
      commandDisplayName: 'id',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^id$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: ldCommandUUID,
      commandDisplayName: 'ld',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^ld$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: lvCommandUUID,
      commandDisplayName: 'lv',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^lv$',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
    {
      type: 'command.register',
      commandUUID: intenseCommandUUID,
      commandDisplayName: 'intense',
      platform: '.*',
      network: '.*',
      instance: '.*',
      channel: '.*',
      user: '.*',
      regex: '^intense\\s+',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
  ];

  // Register all commands
  for (const registration of commandRegistrations) {
    try {
      await nats.publish('command.register', JSON.stringify(registration));
      recordNatsPublish('command.register', 'command_registration');
      log.info(
        `Registered ${registration.commandDisplayName} command with router`,
        {
          producer: 'emote',
          ratelimit: rateLimitConfig,
        }
      );
    } catch (error) {
      log.error(
        `Failed to register ${registration.commandDisplayName} command`,
        {
          producer: 'emote',
          error: error,
        }
      );
    }
  }
}

export async function setupCommandHandlers(
  nats: InstanceType<typeof NatsClient>
): Promise<Array<Promise<string | boolean>>> {
  const subscriptions: Array<Promise<string | boolean>> = [];

  // Set up all command handlers
  subscriptions.push(
    handleDunnoCommand({ nats, commandUUID: dunnoCommandUUID })
  );
  subscriptions.push(
    handleShrugCommand({ nats, commandUUID: shrugCommandUUID })
  );
  subscriptions.push(
    handleDudeweedCommand({ nats, commandUUID: dudeweedCommandUUID })
  );
  subscriptions.push(
    handleDownyCommand({ nats, commandUUID: downyCommandUUID })
  );
  subscriptions.push(
    handleDoubledownyCommand({
      nats,
      commandUUID: doubledownyCommandUUID,
    })
  );
  subscriptions.push(
    handleTripledownyCommand({
      nats,
      commandUUID: tripledownyCommandUUID,
    })
  );
  subscriptions.push(
    handleRainbowdownyCommand({
      nats,
      commandUUID: rainbowdownyCommandUUID,
    })
  );
  subscriptions.push(handleIdCommand({ nats, commandUUID: idCommandUUID }));
  subscriptions.push(handleLdCommand({ nats, commandUUID: ldCommandUUID }));
  subscriptions.push(handleLvCommand({ nats, commandUUID: lvCommandUUID }));
  subscriptions.push(
    handleIntenseCommand({ nats, commandUUID: intenseCommandUUID })
  );

  return subscriptions;
}
