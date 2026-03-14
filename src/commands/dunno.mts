import { NatsClient, log } from '@eeveebot/libeevee';

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

        // Send response on chat.message.outgoing.$PLATFORM.$INSTANCE.$CHANNEL
        const response = {
          channel: data.channel,
          network: data.network,
          instance: data.instance,
          platform: data.platform,
          text: selectedFace,
          trace: data.trace,
          type: 'message.outgoing',
        };

        const outgoingTopic = `chat.message.outgoing.${data.platform}.${data.instance}.${data.channel}`;
        void nats.publish(outgoingTopic, JSON.stringify(response));
      } catch (error) {
        log.error('Failed to process dunno command', {
          producer: 'emote',
          error: error,
        });
      }
    }
  );

  return dunnoCommandSub;
}
