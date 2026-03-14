import { NatsClient, log } from '@eeveebot/libeevee';

export interface CommandHandlerParams {
  nats: InstanceType<typeof NatsClient>;
  commandUUID: string;
}

export async function handleIdCommand({
  nats,
  commandUUID,
}: CommandHandlerParams): Promise<string | boolean> {
  // Subscribe to command execution messages for id
  const idCommandSub = nats.subscribe(
    `command.execute.${commandUUID}`,
    (subject, message) => {
      try {
        const data = JSON.parse(message.string());
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
      } catch (error) {
        log.error('Failed to process id command', {
          producer: 'emote',
          error: error,
        });
      }
    }
  );

  return idCommandSub;
}
