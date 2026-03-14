import { NatsClient, log } from '@eeveebot/libeevee';
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
export const dunnoCommandUUID = '0AC87398-83B6-42A1-8AAA-86AC3B6FB520';
export const shrugCommandUUID = '4756864A-DCF2-47EB-9E3E-BBC2E8B4E890';
export const dudeweedCommandUUID = '03CA4BBE-6A6F-456B-A47E-8BA9242AEBA1';
export const downyCommandUUID = '2AA74B6E-3BB9-400B-BF8A-6277864AAF84';
export const doubledownyCommandUUID = '5E81EF72-F7E6-442C-97B2-3576C9134B7B';
export const tripledownyCommandUUID = 'D28FB23A-3DDA-4E18-8FEE-E162620F3F4D';
export const rainbowdownyCommandUUID = '089DABF3-FE9F-4795-AA64-8E0F233E9A73';
export const idCommandUUID = 'BA3BBCB3-61EA-4A46-9460-072DB00AA903';
export const ldCommandUUID = 'A0B9079E-3633-4D1A-8FC8-1B9CD18C0CEB';
export const lvCommandUUID = 'D07043BE-2BD8-47B4-BD03-D741A4B7623F';
export const intenseCommandUUID = '80ED7F0B-E3DF-4184-8898-1E9695599BA2';

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
      regex: '^intense ',
      platformPrefixAllowed: true,
      ratelimit: rateLimitConfig,
    },
  ];

  // Register all commands
  for (const registration of commandRegistrations) {
    try {
      await nats.publish('command.register', JSON.stringify(registration));
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
  subscriptions.push(
    handleIdCommand({ nats, commandUUID: idCommandUUID })
  );
  subscriptions.push(
    handleLdCommand({ nats, commandUUID: ldCommandUUID })
  );
  subscriptions.push(
    handleLvCommand({ nats, commandUUID: lvCommandUUID })
  );
  subscriptions.push(
    handleIntenseCommand({ nats, commandUUID: intenseCommandUUID })
  );

  return subscriptions;
}
