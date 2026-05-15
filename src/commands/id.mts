import { NatsClient, log, createModuleMetrics, sendChatMessage, NatsSubscriptionResult } from '@eeveebot/libeevee';
import { randomColorForPlatform as colorizeForPlatform } from '@eeveebot/libeevee';
import type { NatsCommandData } from '../lib/types.mjs';

const metrics = createModuleMetrics('emote');

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleIdCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<NatsSubscriptionResult> {
  // Subscribe to command execution messages for id
  const idCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    async (subject, message) => {
      metrics.recordNatsSubscribe(subject);
      const startTime = Date.now();
      let data: NatsCommandData = {} as NatsCommandData;
      try {
        data = JSON.parse(message.string());
        log.info('Received command.execute for id', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Generate random values for id command
        const x = Math.floor(Math.random() * 4);
        const y = Math.floor(Math.random() * 999);

        let responseText = 'illegal drugs';

        if (y >= 800) {
          const dbladez = [
            'illegal dbladez',
            'I snuck dbladez into prison up my ass.',
            'I love sniffing whole lines of dbladez.',
            'Twenty-five years in prison was worth it for just one hit of dbladez',
            'Taking dbladez ruined my life.',
          ];
          responseText = dbladez[x];
        }

        // Colorize for IRC platform
        responseText = colorizeForPlatform(responseText, data.platform);

        await sendChatMessage(nats, {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: responseText,
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
        log.error('Failed to process id command', {
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

  return idCommandSub;
}
