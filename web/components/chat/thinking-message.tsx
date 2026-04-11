import { cx } from 'class-variance-authority';

import AnimatedMessageSequence from './animated-message-sequence';
import { ChatMessageIcon } from './chat-message-icon';

function ThinkingMessage() {
  const messages = [
    'Buscando fuentes relevantes...',
    'Analizando fuentes...',
    'Procesando datos...',
    'Generando respuesta...',
    'Terminando...',
  ];

  return (
    <div className={cx('flex gap-3 md:gap-4 items-center')}>
      <ChatMessageIcon />

      <AnimatedMessageSequence
        className="text-muted-foreground"
        messages={messages}
      />
    </div>
  );
}

export default ThinkingMessage;
