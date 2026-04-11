import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacidad',
  description:
    'Información breve sobre el tratamiento de datos en votamos.chat.',
  robots: 'noindex',
};

function PrivacyPage() {
  return (
    <section className="prose-sm my-8 max-w-full overflow-x-hidden dark:prose-invert md:prose">
      <h1>Privacidad</h1>
      <p>
        votamos.chat usa datos técnicos mínimos para que el servicio funcione,
        por ejemplo identificadores anónimos de sesión, contenido del chat y
        registros básicos de uso.
      </p>
      <p>
        No usamos esta página para vender datos personales. Si escribes datos
        personales o sensibles en el chat, evita compartir información que no
        quieras guardar o procesar.
      </p>
      <p>
        Los datos se usan para operar el producto, proteger la plataforma,
        mejorar la experiencia y analizar el uso de forma agregada cuando sea
        posible.
      </p>
      <p>
        Si tienes una solicitud sobre privacidad o eliminación de datos, usa los
        datos de contacto publicados en el{' '}
        <Link href="/impressum">Aviso legal</Link>.
      </p>
    </section>
  );
}

export default PrivacyPage;
