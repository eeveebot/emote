import { NatsClient, log } from '@eeveebot/libeevee';
import { colorizeForPlatform } from '../utils/colorize.mjs';

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleDownyCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<string | boolean> {
  // Subscribe to command execution messages for downy
  const downyCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    (subject, message) => {
      try {
        const data = JSON.parse(message.string());
        log.info('Received command.execute for downy', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Downy text
        const downyText = ".'\x1f/\x1f)";
        
        // Colorize for IRC platform
        const coloredDowny = colorizeForPlatform(downyText, data.platform);

        // Send response on chat.message.outgoing.$PLATFORM.$INSTANCE.$CHANNEL
        const response = {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: coloredDowny,
          trace: data.trace,
          type: 'message.outgoing',
        };

        const outgoingTopic = `chat.message.outgoing.${data.platform}.${data.instance}.${data.channel}`;
        void nats.publish(outgoingTopic, JSON.stringify(response));
      } catch (error) {
        log.error('Failed to process downy command', {
          producer: 'emote',
          error: error,
        });
      }
    }
  );

  return downyCommandSub;
}
