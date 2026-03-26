'use client';

import { exportHowToPDF } from '@/lib/how-to-pdf-export';
import {
  DownloadIcon,
  MessageCircleQuestionIcon,
  MessageCircleReplyIcon,
  PlusIcon,
  TextSearchIcon,
  VoteIcon,
  WaypointsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ChatActionButtonHighlight from './chat/chat-action-button-highlight';
import { MAX_SELECTABLE_PARTIES } from './chat/chat-group-party-select-content';
import ProConIcon from './chat/pro-con-icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';

// Content configuration - single source of truth
const PARTY_SPECIFIC_QUESTIONS = [
  '¿Cuál es la posición del SPD sobre el cambio climático?',
  '¿Qué postura tiene el AfD sobre el freno de deuda?',
  '¿Cómo quiere la CDU/CSU reducir la burocracia?',
  '¿Cómo quieren los Verdes impulsar la digitalización?',
  '¿Cómo quieren el FDP y Die Linke implementar la reforma laboral?',
  '¿Cómo quieren Volt y el FDP mejorar la cooperación europea?',
];

const COMPARE_QUESTIONS = [
  '¿En qué se diferencian los partidos en la lucha contra el cambio climático?',
  '¿En qué se diferencian las posiciones de la CDU/CSU y el SPD sobre el freno de deuda?',
  'Compara las posiciones del FDP y AfD sobre el tema de la migración.',
];

const GENERAL_QUESTIONS = [
  '¿Cómo puedo solicitar el voto por correo?',
  '¿Quién está detrás de votamos.chat?',
  '¿Cómo funciona el voto por correo?',
];

const INTRO_TEXT = {
  main: 'votamos.chat es una herramienta interactiva de IA que te ayuda a informarte sobre las posiciones y planes de los partidos y candidatos políticos. Puedes hacerle preguntas al asistente de IA sobre diversos temas políticos, y te dará respuestas neutrales basadas en los programas de gobierno y otras publicaciones de los partidos.',
  sources:
    'Todas las respuestas incluyen las fuentes correspondientes y utilizan documentos relevantes para la elección correspondiente.',
};

const PROCESS_STEPS = [
  'Haces una pregunta',
  'votamos.chat busca en documentos relevantes como programas electorales y de partido para encontrar la información adecuada.',
  'La información relevante se utiliza para generar una respuesta comprensible y basada en fuentes.',
  'Ahora puedes clasificar la posición del partido haciendo clic en el botón debajo de la respuesta.',
];

const ACCORDION_CONTENT = [
  {
    id: 'questions',
    title: '¿Qué preguntas puedo hacer?',
    content: {
      intro:
        'En principio, puedes hacer todas las preguntas que tengas sobre las posiciones de los partidos. Si quieres comparar varios partidos entre sí, puedes agregarlos al chat o simplemente mencionarlos en la pregunta. Además, puedes hacer preguntas sobre temas generales como el proceso electoral.',
      sections: [
        {
          subtitle: 'Ejemplos de preguntas específicas de partido:',
          list: PARTY_SPECIFIC_QUESTIONS,
        },
        {
          subtitle: 'Ejemplos de preguntas comparativas:',
          list: COMPARE_QUESTIONS,
        },
        {
          subtitle: 'Ejemplos de preguntas generales:',
          list: GENERAL_QUESTIONS,
        },
      ],
    },
  },
  {
    id: 'elections-supported',
    title: '¿Qué elecciones están soportadas?',
    content: {
      intro: 'Actualmente soportamos las siguientes elecciones:',
      list: [
        'Landtagswahl Baden-Württemberg - 8. März 2026',
        'Landtagswahl Rheinland-Pfalz - 22. März 2026',
        'Kommunalwahl München - 8. März 2026',
      ],
      outro:
        'Adicionalmente, en la sección **Nacional** se pueden responder preguntas generales sobre las posiciones de los partidos.',
    },
  },
  {
    id: 'number-parties',
    title: '¿Con cuántos partidos puedo chatear?',
    content: {
      paragraphs: [
        `Puedes iniciar el chat con hasta ${MAX_SELECTABLE_PARTIES} partidos simultáneamente, pero tienes la posibilidad de agregar más partidos durante la conversación.`,
        'Además, puedes agregar o eliminar fácilmente más partidos al chat mediante el botón sobre el campo de texto.',
      ],
    },
  },
  {
    id: 'position',
    title: 'Clasificar posición',
    content: {
      paragraphs: [
        'Cuando haces clic en este botón debajo de uno de los mensajes, se clasifica la posición del mensaje. Se tienen en cuenta los siguientes criterios: viabilidad, efectos a corto y largo plazo.',
        'Para esto utilizamos información actual y fuentes de internet proporcionadas por Perplexity.ai.',
      ],
    },
  },
  {
    id: 'voting-behavior-analyze',
    title: 'Analizar comportamiento de votación',
    content: {
      paragraphs: [
        'Con esta función puedes contextualizar la respuesta de un partido en el marco de votaciones pasadas en el parlamento. Además, haciendo clic en "Mostrar votaciones" puedes visualizar información detallada sobre las votaciones relevantes. Esto permite evaluar los planes de un partido según su programa en función de su comportamiento político real.',
      ],
    },
  },
  {
    id: 'data',
    title: '¿Qué datos se utilizan?',
    content: {
      intro:
        'Para ofrecer respuestas fundamentadas y basadas en fuentes, votamos.chat utiliza una variedad de fuentes de datos:',
      orderedList: [
        'Documentos de los partidos: Como base de datos se utilizan programas de principios, programas electorales, documentos de posición y otros documentos de los partidos para obtener una imagen completa de sus posiciones.',
        'Comportamiento de votación en el parlamento: Para el análisis del comportamiento de votación utilizamos datos de votaciones parlamentarias proporcionados por abgeordnetenwatch.de. Estos datos permiten comparar las posiciones de los partidos con su comportamiento político real.',
        'Fuentes de internet para la clasificación de posiciones: Para la clasificación diferenciada de posiciones, votamos.chat utiliza el servicio Perplexity.ai, que emplea fuentes de internet de alta calidad como sitios de noticias.',
      ],
      outro:
        'Hemos listado todas las fuentes que utiliza votamos.chat en nuestra página web bajo /sources.',
    },
  },
  {
    id: 'guidelines',
    title: '¿Qué directrices sigue votamos.chat en sus respuestas?',
    content: {
      intro:
        'Las siguientes directrices aplican para las respuestas en los chats:',
      orderedList: [
        'Basado en fuentes: Las respuestas deben basarse en las declaraciones relevantes de los extractos de programas proporcionados.',
        'Neutralidad: Las posiciones de los partidos deben reproducirse de forma neutral y sin valoraciones.',
        'Transparencia: A cada declaración se deben vincular directamente las fuentes relevantes para permitir una revisión y verificación detallada del contenido.',
      ],
    },
  },
  {
    id: 'party-selection',
    title: '¿Según qué criterios se seleccionan los partidos?',
    content: {
      paragraphs: [
        'La selección original de partidos para el contexto federal se realizó antes de las elecciones federales de 2025 y se orientó a la publicación de sus programas electorales. Ahora queremos ofrecer gradualmente una selección de partidos lo más completa posible para las demás elecciones soportadas y agradecemos tu ayuda para ello.',
        'Si echas en falta algún partido, escríbenos un correo con su programa electoral o de principios u otros documentos relevantes en PDF a info@wahl.chat y lo añadiremos lo antes posible.',
      ],
    },
  },
  {
    id: 'about-founders',
    title: '¿Quién está detrás de votamos.chat y cómo surgió?',
    content: {
      intro:
        'votamos.chat fue fundada por cinco estudiantes de la LMU, TUM y la Universidad de Cambridge. Se reunieron para un proyecto de investigación conjunto sobre IA en Cambridge y desde entonces han concluido sus estudios.',
      sections: [
        {
          subtitle: 'Los miembros fundadores y sus posiciones actuales:',
          list: [
            'Sebastian Maier - Doctorando en la LMU Múnich',
            'Anton Wyrowski - Desarrollador en Perplexity',
            'Michel Schimpf - Doctorando en la Universidad de Cambridge',
            'Robin Frasch - Doctorando en la Universidad de Hamburgo',
            'Roman Mayr - Desarrollador en Knowunity',
          ],
        },
      ],
      origin:
        'A finales de noviembre de 2024, el equipo estaba almorzando juntos en Cambridge. Durante la conversación surgió el tema de que el abuelo del rapero alemán Ski Aggu había trabajado en el Wahl-O-Mat. Surgió la idea de construir un nuevo Wahl-O-Mat con IA para ayudar a clasificar las opiniones propias sobre los temas de la campaña electoral. ¿Pero no sería aún más interesante darle la vuelta al enfoque y chatear más detalladamente con los partidos relevantes para uno mismo? ¿Y no solo obtener una declaración sobre tesis predefinidas, sino poder aclarar preocupaciones completamente individuales? Así nació a finales de noviembre de 2024 la idea de wahl.chat, en la que se basa votamos.chat.',
      outro: 'Más información también se puede consultar bajo /about-us.',
    },
  },
  {
    id: 'wahl-o-mat-difference',
    title: '¿En qué se diferencia votamos.chat del Wahl-O-Mat?',
    content: {
      intro:
        'En el Wahl-O-Mat se decide sobre tesis predefinidas "estoy de acuerdo", "soy neutral en esto" o "estoy en contra". votamos.chat es como una conversación abierta para entender mejor qué exigen los partidos.',
      orderedList: [
        'Hacer preguntas sobre los temas que más te interesan.',
        'Entrar en detalle para comprender exactamente los términos, ideas y planes de los partidos.',
        'Analizar posiciones críticamente para sopesar los pros y contras.',
      ],
    },
  },
  {
    id: 'data-privacy',
    title: '¿Están seguros mis datos al usar votamos.chat?',
    content: {
      paragraphs: [
        'Sí, votamos.chat funciona sin cookies y sin recopilación de datos personales. Solo los chats se guardan de forma anónima. Mediante controles de acceso evitamos el acceso no autorizado a los chats de otros usuarios.',
        'No obstante, se debe evitar escribir datos personales sensibles en los chats.',
      ],
    },
  },
  {
    id: 'usage-statistics',
    title: '¿Se recopilan estadísticas de uso?',
    content: {
      paragraphs: [
        'Para mejorar continuamente votamos.chat, se utilizan las solicitudes del sitio web y los historiales de chat anonimizados para determinar estadísticas agregadas, como el número de preguntas respondidas o los partidos con los que más se chatea.',
        'Como acompañamos el desarrollo de votamos.chat de forma científica, de vez en cuando daremos a nuestros usuarios la posibilidad de participar en estudios. Estos serán 100% voluntarios y la negativa no tendrá ningún efecto sobre el uso posterior de votamos.chat. En estos estudios utilizaremos las estadísticas de uso anonimizadas para analizar el impacto de votamos.chat y mejorar su efecto positivo.',
      ],
    },
  },
  {
    id: 'learning',
    title: '¿Aprende votamos.chat de forma autónoma con el tiempo?',
    content: {
      paragraphs: [
        'No, los historiales de chat no se utilizan para el entrenamiento adicional de los LLMs. Sin embargo, trabajamos continuamente para mejorar la calidad de las respuestas, mantenemos nuestra base de datos siempre actualizada y planeamos agregar más documentos relevantes para la generación de respuestas.',
      ],
    },
  },
  {
    id: 'contribute',
    title: '¿Cómo puedo contribuir a votamos.chat?',
    content: {
      paragraphs: [
        'votamos.chat es un proyecto Open Source y nuestro código es públicamente accesible en GitHub bajo https://github.com/SimonKaran13/votamos-chat.',
        'Agradecemos el apoyo y siempre estamos en busca de voluntarios que quieran fortalecer la democracia junto a nosotros. Si tienes interés en colaborar, contáctanos en info@wahl.chat.',
      ],
    },
  },
];

const PROCESS_STEP_ICONS = [
  <MessageCircleQuestionIcon key="icon1" className="absolute left-0 top-0" />,
  <TextSearchIcon key="icon2" className="absolute left-0 top-0" />,
  <MessageCircleReplyIcon key="icon3" className="absolute left-0 top-0" />,
  <WaypointsIcon key="icon4" className="absolute left-0 top-0" />,
];

function HowTo() {
  const [isExporting, setIsExporting] = useState(false);

  const buildQuestionLink = (question: string) => {
    return `/session?q=${question}`;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      await exportHowToPDF({
        introText: INTRO_TEXT,
        processSteps: PROCESS_STEPS,
        accordionContent: ACCORDION_CONTENT,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Accordion type="single" collapsible asChild>
      <article>
        <section>
          <p>
            <span className="font-bold underline">votamos.chat</span>{' '}
            {INTRO_TEXT.main.startsWith('votamos.chat ')
              ? INTRO_TEXT.main.slice('votamos.chat '.length)
              : INTRO_TEXT.main}
            <br />
            {INTRO_TEXT.sources}
          </p>

          <p className="mt-4 text-sm font-semibold">El proceso es simple:</p>

          <ul className="[&_li]:mt-4 [&_li]:text-sm">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step} className="relative pl-10">
                {PROCESS_STEP_ICONS[index]}
                {step}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          {ACCORDION_CONTENT.map((accordionItem) => (
            <AccordionItem key={accordionItem.id} value={accordionItem.id}>
              <AccordionTrigger className="font-bold">
                {accordionItem.title}
              </AccordionTrigger>
              <AccordionContent>
                {/* Special rendering for questions accordion */}
                {accordionItem.id === 'questions' && (
                  <>
                    {accordionItem.content.intro}
                    <br />
                    <br />
                    {accordionItem.content.sections?.map((section) => (
                      <div key={section.subtitle}>
                        <span className="font-bold">{section.subtitle}</span>
                        <ul className="list-outside list-disc py-2 pl-4 [&_li]:pt-1">
                          {section.list?.map((question) => (
                            <li key={question}>
                              <Link
                                className="underline"
                                href={buildQuestionLink(question)}
                              >
                                {question}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <br />
                      </div>
                    ))}
                  </>
                )}

                {/* Elections supported accordion */}
                {accordionItem.id === 'elections-supported' && (
                  <>
                    {accordionItem.content.intro}
                    <ul className="list-outside list-disc py-2 pl-4 [&_li]:pt-1">
                      {accordionItem.content.list?.map((item) => (
                        <li key={item}>
                          <span className="font-bold">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <br />
                    {accordionItem.content.outro}
                  </>
                )}

                {/* Number of parties accordion */}
                {accordionItem.id === 'number-parties' && (
                  <>
                    {accordionItem.content.paragraphs?.[0]}
                    <br />
                    <br />
                    {(() => {
                      const text = accordionItem.content.paragraphs?.[1] || '';
                      const parts = text.split('botón');
                      return (
                        <>
                          {parts[0]}
                          botón{' '}
                          <span className="inline-block">
                            <PlusIcon className="size-4 rounded-full bg-primary p-1 text-primary-foreground" />
                          </span>
                          {parts[1]}
                        </>
                      );
                    })()}
                  </>
                )}

                {/* Position accordion */}
                {accordionItem.id === 'position' && (
                  <>
                    <div className="my-2 flex items-center justify-center">
                      <div className="relative rounded-md">
                        <Button
                          variant="outline"
                          className="h-8 px-2 group-data-[has-message-background]:bg-zinc-100 group-data-[has-message-background]:hover:bg-zinc-200 group-data-[has-message-background]:dark:bg-zinc-900 group-data-[has-message-background]:dark:hover:bg-zinc-800"
                          tooltip="Clasifica la posición en Pro o Contra"
                          type="button"
                        >
                          <ProConIcon />
                          <span className="text-xs">Clasificar posición</span>
                        </Button>
                        <ChatActionButtonHighlight showHighlight />
                      </div>
                    </div>
                    {accordionItem.content.paragraphs?.map((para, idx) => (
                      <p key={para}>
                        {para}
                        {idx <
                          (accordionItem.content.paragraphs?.length || 0) -
                            1 && <br />}
                      </p>
                    ))}
                  </>
                )}

                {/* Voting behavior accordion */}
                {accordionItem.id === 'voting-behavior-analyze' && (
                  <>
                    <div className="my-2 flex items-center justify-center">
                      <div className="relative rounded-md">
                        <Button
                          variant="outline"
                          className="h-8 px-2 group-data-[has-message-background]:bg-zinc-100 group-data-[has-message-background]:hover:bg-zinc-200 group-data-[has-message-background]:dark:bg-zinc-900 group-data-[has-message-background]:dark:hover:bg-zinc-800"
                          tooltip="Analiza el comportamiento de votación del partido"
                        >
                          <VoteIcon />
                          <span className="text-xs">
                            Comportamiento de votación
                          </span>
                        </Button>
                        <ChatActionButtonHighlight showHighlight />
                      </div>
                    </div>
                    <p>{accordionItem.content.paragraphs?.[0]}</p>
                  </>
                )}

                {/* Data sources accordion */}
                {accordionItem.id === 'data' && (
                  <>
                    {(() => {
                      const intro = accordionItem.content.intro || '';
                      const introParts = intro.split('votamos.chat');
                      return (
                        <>
                          {introParts[0]}
                          <span className="font-bold underline">
                            votamos.chat
                          </span>
                          {introParts[1]}
                        </>
                      );
                    })()}
                    <ol className="list-outside list-decimal py-4 pl-4 [&_li]:pt-1">
                      {accordionItem.content.orderedList?.map((item) => {
                        const parts = item.split(':');
                        const isVotingBehavior = parts[0].includes(
                          'Comportamiento de votación',
                        );
                        return (
                          <li key={item}>
                            <div className="pl-2">
                              {isVotingBehavior ? (
                                <>
                                  <span className="font-bold">{parts[0]}:</span>{' '}
                                  {(() => {
                                    const text = parts.slice(1).join(':');
                                    const linkParts = text.split(
                                      'abgeordnetenwatch.de',
                                    );
                                    return (
                                      <>
                                        {linkParts[0]}
                                        <a
                                          href="https://www.abgeordnetenwatch.de"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="underline"
                                        >
                                          abgeordnetenwatch.de
                                        </a>
                                        {linkParts[1]}
                                      </>
                                    );
                                  })()}
                                </>
                              ) : (
                                <>
                                  <span className="font-bold">{parts[0]}:</span>{' '}
                                  {parts.slice(1).join(':')}
                                </>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                    <br />
                    {(() => {
                      const outro = accordionItem.content.outro || '';
                      const outroParts = outro.split('votamos.chat');
                      const beforeLink = outroParts[0];
                      const afterVotamosChat = outroParts[1] || '';
                      const sourceParts = afterVotamosChat.split('/sources');
                      return (
                        <>
                          {beforeLink}
                          <span className="font-bold underline">
                            votamos.chat
                          </span>
                          {sourceParts[0]}
                          <Link href="/sources" className="underline">
                            aquí
                          </Link>
                          {sourceParts[1]}
                        </>
                      );
                    })()}
                  </>
                )}

                {/* Guidelines accordion */}
                {accordionItem.id === 'guidelines' && (
                  <>
                    {accordionItem.content.intro}
                    <ol className="list-outside list-decimal py-4 pl-4 [&_li]:pt-1">
                      {accordionItem.content.orderedList?.map((item) => {
                        const parts = item.split(':');
                        return (
                          <li key={item}>
                            <div className="pl-2">
                              <span className="font-bold">{parts[0]}:</span>{' '}
                              {parts.slice(1).join(':')}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </>
                )}

                {/* Party selection accordion */}
                {accordionItem.id === 'party-selection' && (
                  <>
                    {accordionItem.content.paragraphs?.[0]}
                    <br />
                    <br />
                    {(() => {
                      const text = accordionItem.content.paragraphs?.[1] || '';
                      const parts = text.split('info@wahl.chat');
                      return (
                        <>
                          {parts[0]}
                          <a href="mailto:info@wahl.chat" className="underline">
                            info@wahl.chat
                          </a>
                          {parts[1]}
                        </>
                      );
                    })()}
                  </>
                )}

                {/* About founders accordion */}
                {accordionItem.id === 'about-founders' && (
                  <>
                    {accordionItem.content.intro}
                    <br />
                    <br />
                    {accordionItem.content.sections?.map((section) => (
                      <div key={section.subtitle}>
                        <span className="font-bold">{section.subtitle}</span>
                        <ul className="list-outside list-disc py-2 pl-4 [&_li]:pt-1">
                          {section.list?.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <br />
                      </div>
                    ))}
                    <span className="font-bold">
                      ¿Cómo surgió votamos.chat?
                    </span>
                    <br />
                    <br />
                    {accordionItem.content.origin}
                    <br />
                    <br />
                    {(() => {
                      const outro = accordionItem.content.outro || '';
                      const parts = outro.split('/about-us');
                      return (
                        <>
                          {parts[0]}
                          <Link href="/about-us" className="underline">
                            /about-us
                          </Link>
                          {parts[1]}
                        </>
                      );
                    })()}
                  </>
                )}

                {/* Wahl-O-Mat difference accordion */}
                {accordionItem.id === 'wahl-o-mat-difference' && (
                  <>
                    {accordionItem.content.intro}
                    <br />
                    <br />
                    <span className="font-bold">Con votamos.chat puedes:</span>
                    <ol className="list-outside list-decimal py-2 pl-4 [&_li]:pt-1">
                      {accordionItem.content.orderedList?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </>
                )}

                {/* Data privacy accordion */}
                {accordionItem.id === 'data-privacy' &&
                  accordionItem.content.paragraphs?.map((para, idx) => (
                    <p key={para}>
                      {para}
                      {idx <
                        (accordionItem.content.paragraphs?.length || 0) - 1 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                    </p>
                  ))}

                {/* Usage statistics accordion */}
                {accordionItem.id === 'usage-statistics' &&
                  accordionItem.content.paragraphs?.map((para, idx) => (
                    <p key={para}>
                      {para}
                      {idx <
                        (accordionItem.content.paragraphs?.length || 0) - 1 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                    </p>
                  ))}

                {/* Learning accordion */}
                {accordionItem.id === 'learning' && (
                  <p>{accordionItem.content.paragraphs?.[0]}</p>
                )}

                {/* Contribute accordion */}
                {accordionItem.id === 'contribute' && (
                  <>
                    {(() => {
                      const text = accordionItem.content.paragraphs?.[0] || '';
                      const parts = text.split(
                        'https://github.com/SimonKaran13/votamos-chat',
                      );
                      return (
                        <p>
                          {parts[0]}
                          <a
                            href="https://github.com/SimonKaran13/votamos-chat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            https://github.com/SimonKaran13/votamos-chat
                          </a>
                          {parts[1]}
                        </p>
                      );
                    })()}
                    <br />
                    {(() => {
                      const text = accordionItem.content.paragraphs?.[1] || '';
                      const parts = text.split('info@wahl.chat');
                      return (
                        <p>
                          {parts[0]}
                          <a href="mailto:info@wahl.chat" className="underline">
                            info@wahl.chat
                          </a>
                          {parts[1]}
                        </p>
                      );
                    })()}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </section>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            variant="default"
            size="lg"
          >
            <DownloadIcon />
            {isExporting ? 'Generando PDF...' : 'Exportar como PDF'}
          </Button>
        </div>
      </article>
    </Accordion>
  );
}

export default HowTo;
