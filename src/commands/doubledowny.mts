import { NatsClient, log, createModuleMetrics } from '@eeveebot/libeevee';
import { colorizeForPlatform } from '../utils/colorize.mjs';

const metrics = createModuleMetrics('emote');

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleDoubledownyCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<string | boolean> {
  // Subscribe to command execution messages for doubledowny
  const doubledownyCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    (subject, message) => {
      metrics.recordNatsSubscribe(subject);
      const startTime = Date.now();
      try {
        const data = JSON.parse(message.string());
        log.info('Received command.execute for doubledowny', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Doubledowny text
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
        // Send twice for doubledowny
        void nats.publish(outgoingTopic, JSON.stringify(response));
        metrics.recordNatsPublish('command_response');
        void nats.publish(outgoingTopic, JSON.stringify(response));
        metrics.recordNatsPublish('command_response');

        // Record successful command execution
        metrics.recordCommand(
          data.platform,
          data.network,
          data.channel,
          'success'
        );
      } catch (error) {
        log.error('Failed to process doubledowny command', {
          producer: 'emote',
          error: error,
        });

        // Record failed command execution
        if (
          typeof error === 'object' &&
          error !== null &&
          'platform' in error &&
          'network' in error &&
          'channel' in error
        ) {
          // If we have the data, record with specific details
          metrics.recordCommand(
            error.platform,
            error.network,
            error.channel,
            'error'
          );
        } else {
          // Otherwise record with unknown details
          metrics.recordCommand(
            'unknown',
            'unknown',
            'unknown',
            'error'
          );
        }
        metrics.recordError('process_error');
      } finally {
        // Record processing time
        const duration = Date.now() - startTime;
        metrics.recordProcessingTime(duration / 1000); // Convert to seconds
      }
    }
  );

  return doubledownyCommandSub;
}
