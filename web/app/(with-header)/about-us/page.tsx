import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description:
    'Las personas detrás de votamos.chat – quienes somos y por qué queremos hacer la política accesible de manera interactiva.',
};

function AboutUs() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-6 pt-4">
      <div className="relative aspect-[3/4] w-72">
        <Image
          src="/images/simon-karan.webp"
          alt="About Us"
          fill
          sizes="(max-width: 768px) 100vw, 75vw"
          className="object-cover"
        />
      </div>
      <section className="space-y-4">
        <p>
          <span className="font-bold [&_a]:underline">
            Detrás de <Link href="/">votamos.chat</Link> está:{' '}
            <a href="https://www.linkedin.com/in/simonkaran/" target="_blank">
              Simon
            </a>
            .
          </span>
        </p>

        <p className="[&_a]:underline">
          La idea de <Link href="/">votamos.chat</Link> surge en 2025 a partir
          de una conversación y reflexión posteriores al atentado en contra de
          Miguel Uribe Turbay. Pensando en el impacto que una noticia así
          tendría en la política colombiana, y con las elecciones presidenciales
          a la vuelta de la esquina, era el momento de tomar acción y
          desarrollar una herramienta para ayudar a los colombianos a poder
          informarse, de manera neutral, clara y accesible, acerca de las
          diferentes propuestas de los candidatos a la Presidencia.
        </p>
        <p className="[&_a]:underline">
          Amigos de mi universidad en Alemania ya habían explorado esta idea
          para las elecciones parlamentarias alemanas de 2025, por lo que decidí
          unirme al equipo de{' '}
          <a target="_blank" href="https://wahl.chat/">
            wahl.chat
          </a>
          . Durante mi tiempo con ellos, contribuí al desarrollo de la
          plataforma en Alemania, donde ampliamos nuestro soporte a las
          elecciones regionales y para alcalde de la ciudad donde estoy
          localizado, Múnich.
        </p>
        <p className="[&_a]:underline">
          Gracias a esta experiencia, decidí crear{' '}
          <Link href="/">votamos.chat</Link>, con el objetivo de ofrecer una
          forma más intuitiva, interactiva y moderna de entender la política y
          tomar decisiones informadas. A futuro, la visión es expandir este
          modelo a más países y contextos electorales.
        </p>

        <p className="[&_a]:underline">
          Agradezco profundamente por su ayuda a:{' '}
          <a target="_blank" href="https://www.linkedin.com/in/robin-frasch/">
            Robin
          </a>
          ,{' '}
          <a
            target="_blank"
            href="https://www.linkedin.com/in/jos%C3%A9-pablo-%C3%A1lvarez-acosta/"
          >
            José Pablo
          </a>
          , Julia,{' '}
          <a
            target="_blank"
            href="https://www.linkedin.com/in/camila-escobar-h29/"
          >
            Camila
          </a>{' '}
          y a todo el equipo detrás de{' '}
          <a target="_blank" href="https://wahl.chat/about-us">
            wahl.chat
          </a>
        </p>
        <p className="[&_a]:underline">
          ¿Te gustaría ayudar a <Link href="/">votamos.chat</Link>? Puedes
          contribuir en{' '}
          <a
            target="_blank"
            href="https://github.com/SimonKaran13/votamos-chat"
          >
            Github
          </a>{' '}
          o escribir a <a href="mailto:info@votamos.chat">info@votamos.chat</a>{' '}
          o hacer una <Link href="/donar">donación vía Wompi</Link>.
        </p>
      </section>
    </div>
  );
}

export default AboutUs;
