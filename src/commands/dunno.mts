import { NatsClient, log, createModuleMetrics, sendChatMessage, NatsSubscriptionResult } from '@eeveebot/libeevee';
import { randomColorForPlatform as colorizeForPlatform } from '@eeveebot/libeevee';
import type { NatsCommandData } from '../lib/types.mjs';

const metrics = createModuleMetrics('emote');

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleDunnoCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<NatsSubscriptionResult> {
  // Subscribe to command execution messages for dunno
  const dunnoCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    async (subject, message) => {
      metrics.recordNatsSubscribe(subject);
      const startTime = Date.now();
      let data: NatsCommandData = {} as NatsCommandData;
      try {
        data = JSON.parse(message.string());
        log.info('Received command.execute for dunno', {
          producer: 'emote',
          platform: data.platform,
          instance: data.instance,
          channel: data.channel,
          user: data.user,
          originalText: data.originalText,
        });

        // Dunno faces array
        const faces = [
          '‾\\(ツ)/‾',
          '¯\\(º_o)/¯',
          '¯\\_(シ)_/¯',
          '〳 ◔ Ĺ̯ ◔ \\',
          '乁໒( ͒ ⌂ ͒ )७ㄏ',
          'ʕ ᵒ̌ ‸ ᵒ̌ ʔ',
          '(⊹◕ʖ̯◕)',
          '໒( " ͠° ʖ̫ °͠ " )७ㄏ',
          'ʕ ͠° ʖ̫ °͠ ʔ',
        ];

        // Select a random face
        const selectedFace = faces[Math.floor(Math.random() * faces.length)];

        // Colorize for IRC platform
        const coloredFace = colorizeForPlatform(selectedFace, data.platform);

        await sendChatMessage(nats, {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: coloredFace,
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
        log.error('Failed to process dunno command', {
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

  return dunnoCommandSub;
}
