export class MessageManager {
  private messages: Message[] = [];

  public addMessage(message: Message): void {
    this.messages.push(message);
  }
}


interface Message {
  source: string;
  message: string;
  stack?: string;
  level: ErrorLevel;
}

export enum ErrorLevel {
  debug,
  info,
  warn,
  error,
  fatal,
}
