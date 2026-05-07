import { NatsClient, log, createModuleMetrics } from '@eeveebot/libeevee';
import { colorizeForPlatform } from '../utils/colorize.mjs';

const metrics = createModuleMetrics('emote');

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleLdCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<string | boolean> {
  // Subscribe to command execution messages for ld
  const ldCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    (subject, message) => {
      metrics.recordNatsSubscribe(subject);
      const startTime = Date.now();
      try {
        const data = JSON.parse(message.string());
        log.info('Received command.execute for ld', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Generate random value for ld command
        const x = Math.floor(Math.random() * 29);

        let responseText = 'legal drugs';

        if (x == 9) {
          responseText = 'There are no legal drugs.';
        } else if (x == 19) {
          responseText = 'All drugs are illegal.';
        } else if (x == 29) {
          responseText = 'Your drug use has been logged and reported.';
        }

        // Colorize for IRC platform
        responseText = colorizeForPlatform(responseText, data.platform);

        // Send response on chat.message.outgoing.$PLATFORM.$INSTANCE.$CHANNEL
        const response = {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: responseText,
          trace: data.trace,
          type: 'message.outgoing',
        };

        const outgoingTopic = `chat.message.outgoing.${data.platform}.${data.instance}.${data.channel}`;
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
        log.error('Failed to process ld command', {
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

  return ldCommandSub;
}
