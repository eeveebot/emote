import { NatsClient, log } from '@eeveebot/libeevee';
import { colorizeForPlatform } from '../utils/colorize.mjs';
import {
  recordEmoteCommand,
  recordProcessingTime,
  recordEmoteError,
  recordNatsPublish,
  recordNatsSubscribe,
} from '../lib/metrics.mjs';

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleDunnoCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<string | boolean> {
  // Subscribe to command execution messages for dunno
  const dunnoCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    (subject, message) => {
      recordNatsSubscribe(subject);
      const startTime = Date.now();
      try {
        const data = JSON.parse(message.string());
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

        // Send response on chat.message.outgoing.$PLATFORM.$INSTANCE.$CHANNEL
        const response = {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: coloredFace,
          trace: data.trace,
          type: 'message.outgoing',
        };

        const outgoingTopic = `chat.message.outgoing.${data.platform}.${data.instance}.${data.channel}`;
        void nats.publish(outgoingTopic, JSON.stringify(response));
        recordNatsPublish(outgoingTopic, 'command_response');

        // Record successful command execution
        recordEmoteCommand(
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
        if (
          typeof error === 'object' &&
          error !== null &&
          'platform' in error &&
          'network' in error &&
          'channel' in error
        ) {
          // If we have the data, record with specific details
          recordEmoteCommand(
            error.platform,
            error.network,
            error.channel,
            'error'
          );
        } else {
          // Otherwise record with unknown details
          recordEmoteCommand(
            'unknown',
            'unknown',
            'unknown',
            'error'
          );
        }
        recordEmoteError('process_error');
      } finally {
        // Record processing time
        const duration = Date.now() - startTime;
        recordProcessingTime(duration / 1000); // Convert to seconds
      }
    }
  );

  return dunnoCommandSub;
}
