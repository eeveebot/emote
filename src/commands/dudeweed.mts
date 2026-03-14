import { NatsClient, log } from '@eeveebot/libeevee';
import { colorizeForPlatform } from '../utils/colorize.mjs';

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleDudeweedCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<string | boolean> {
  // Subscribe to command execution messages for dudeweed
  const dudeweedCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    (subject, message) => {
      try {
        const data = JSON.parse(message.string());
        log.info('Received command.execute for dudeweed', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Colorize for IRC platform
        const coloredText = colorizeForPlatform('dude weed lmao', data.platform);

        // Send response on chat.message.outgoing.$PLATFORM.$INSTANCE.$CHANNEL
        const response = {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: coloredText,
          trace: data.trace,
          type: 'message.outgoing',
        };

        const outgoingTopic = `chat.message.outgoing.${data.platform}.${data.instance}.${data.channel}`;
        void nats.publish(outgoingTopic, JSON.stringify(response));
      } catch (error) {
        log.error('Failed to process dudeweed command', {
          producer: 'emote',
          error: error,
        });
      }
    }
  );

  return dudeweedCommandSub;
}
