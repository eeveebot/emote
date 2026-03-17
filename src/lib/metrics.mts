import {
  commandCounter,
  commandProcessingTime,
  commandErrorCounter,
  natsPublishCounter,
  natsSubscribeCounter,
  log,
} from '@eeveebot/libeevee';

// Function to record command execution
export function recordEmoteCommand(
  platform: string,
  network: string,
  channel: string,
  result: string
): void {
  try {
    commandCounter.inc({
      module: 'emote',
      platform,
      network,
      channel,
      result,
    });
  } catch (error) {
    log.error('Failed to record emote command metric', {
      producer: 'emote-metrics',
      error,
    });
  }
}

// Function to record processing time
export function recordProcessingTime(duration: number): void {
  try {
    commandProcessingTime.observe({ module: 'emote' }, duration);
  } catch (error) {
    log.error('Failed to record emote processing time metric', {
      producer: 'emote-metrics',
      error,
    });
  }
}

// Function to record errors
export function recordEmoteError(errorType: string): void {
  try {
    commandErrorCounter.inc({
      module: 'emote',
      type: errorType,
    });
  } catch (error) {
    log.error('Failed to record emote error metric', {
      producer: 'emote-metrics',
      error,
    });
  }
}

// Function to record NATS publish operations
export function recordNatsPublish(subject: string, messageType: string): void {
  try {
    natsPublishCounter.inc({
      module: 'emote',
      type: messageType,
    });
  } catch (error) {
    log.error('Failed to record NATS publish metric', {
      producer: 'emote-metrics',
      error,
    });
  }
}

// Function to record NATS subscribe operations
export function recordNatsSubscribe(subject: string): void {
  try {
    natsSubscribeCounter.inc({
      module: 'emote',
      subject: subject,
    });
  } catch (error) {
    log.error('Failed to record NATS subscribe metric', {
      producer: 'emote-metrics',
      error,
    });
  }
}