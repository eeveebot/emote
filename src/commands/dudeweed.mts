import { NatsClient, log, createModuleMetrics, sendChatMessage, NatsSubscriptionResult } from '@eeveebot/libeevee';
import { randomColorForPlatform as colorizeForPlatform } from '@eeveebot/libeevee';

const metrics = createModuleMetrics('emote');

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleDudeweedCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<NatsSubscriptionResult> {
  // Subscribe to command execution messages for dudeweed
  const dudeweedCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    async (subject, message) => {
      metrics.recordNatsSubscribe(subject);
      const startTime = Date.now();
      let data: any = {};
      try {
        data = JSON.parse(message.string());
        log.info('Received command.execute for dudeweed', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Colorize for IRC platform
        const coloredText = colorizeForPlatform(
          'dude weed lmao',
          data.platform
        );

        await sendChatMessage(nats, {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: coloredText,
          trace: data.trace,
        }, metrics);

        // Record successful command execution
        metrics.recordCommand(
          data.platform,
          data.network,
          data.channel,
          'success'
        );
      } catch (error) {
        log.error('Failed to process dudeweed command', {
          producer: 'emote',
          error: error,
        });

        // Record failed command execution
        metrics.recordCommand(
          data.platform,
          data.network,
          data.channel,
          'error'
        );
        metrics.recordError('process_error');
      } finally {
        // Record processing time
        const duration = Date.now() - startTime;
        metrics.recordProcessingTime(duration / 1000); // Convert to seconds
      }
    }
  );

  return dudeweedCommandSub;
}
