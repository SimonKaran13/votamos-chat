import HowTo from '@/components/how-to';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo funciona votamos.chat',
  description:
    'Descubre cómo usar votamos.chat – compara partidos, haz preguntas y obtén respuestas basadas en fuentes.',
};

function HowToPage() {
  return (
    <>
      <h1 className="mb-2 mt-4 text-xl font-bold md:text-2xl">
        ¿Qué puedo hacer con <span className="underline">votamos.chat</span>?
      </h1>
      <HowTo />
    </>
  );
}

export default HowToPage;
