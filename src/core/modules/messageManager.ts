import cleanStack from 'clean-stack'; // eslint-disable-line import/default
import { KeyValue, } from '../models/helperTypes';

export class MessageManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recordedMessages: KeyValue<RecordedMessage<any>[]> = {
    debug: [],
    info: [],
    warn: [],
    error: [],
    fatal: [],
  };

  public addMessage<T = string>(message: Message<T>): void {
    const recorded: RecordedMessage<T> = {
      message: message.message,
      source: message.source,
    };

    if (message.error !== undefined) {
      recorded.error = {
        message: message.error.message,
        stack: cleanStack(message.error.stack),
      };
    }

    if (message.additional) {
      recorded.additional = message.additional;
    }

    this.recordedMessages[message.level].push(recorded);
  }

  public get all(): KeyValue<RecordedMessage[]> {
    return this.recordedMessages;
  }

  public get debug(): RecordedMessage[] {
    return this.recordedMessages.debug;
  }

  public get info(): RecordedMessage[] {
    return this.recordedMessages.info;
  }

  public get warn(): RecordedMessage[] {
    return this.recordedMessages.warn;
  }

  public get error(): RecordedMessage[] {
    return this.recordedMessages.error;
  }

  public get fatal(): RecordedMessage[] {
    return this.recordedMessages.fatal;
  }

  public get totalCount(): number {
    return Object.values(this.recordedMessages).reduce((res, val) => res + val.length, 0);
  }
}


export interface Message<T = string> {
  level: ErrorLevel;
  source: string;
  message: string;
  error?: Error;
  additional?: T;
}

interface RecordedMessage<T = string> {
  source: string;
  message: string;
  error?: RecordedMessageError;
  additional?: T;
}

interface RecordedMessageError {
  message: string;
  stack: string;
}

export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}
