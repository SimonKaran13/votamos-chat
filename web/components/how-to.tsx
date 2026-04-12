'use client';

import {
  useContextParties,
  useCurrentContext,
} from '@/components/providers/context-provider';
import { DEFAULT_CONTEXT_ID } from '@/lib/constants';
import { exportHowToPDF } from '@/lib/how-to-pdf-export';
import type { PartyDetails } from '@/lib/party-details';
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

const GENERAL_QUESTIONS = [
  '¿Cómo funciona la primera vuelta de la elección presidencial en Colombia?',
  '¿Qué papel cumple la Registraduría Nacional en estas elecciones?',
  '¿Qué funciones tiene el Consejo Nacional Electoral?',
];

const INTRO_TEXT = {
  main: 'votamos.chat es una herramienta interactiva de IA que te ayuda a informarte sobre las posiciones y planes de los partidos y candidatos políticos. Puedes hacerle preguntas al asistente de IA sobre diversos temas políticos, y te dará respuestas neutrales basadas en los programas de gobierno y otras publicaciones de los partidos.',
  sources:
    'Todas las respuestas incluyen las fuentes correspondientes y utilizan documentos relevantes para la elección correspondiente.',
};

const PROCESS_STEPS = [
  'Haces una pregunta',
  'votamos.chat busca en documentos relevantes (como programas electorales y de partido) para encontrar la información adecuada.',
  'La información relevante se utiliza para generar una respuesta comprensible y basada en fuentes.',
  'Ahora puedes clasificar la posición de una candidatura haciendo clic en el botón debajo de la respuesta.',
];

const FALLBACK_CONTEXT_NAME = 'Elecciones Presidenciales 2026 (Primera Vuelta)';
const FALLBACK_CONTEXT_DATE = '2026-05-31';
const FALLBACK_LOCATION_NAME = 'Colombia';
const PREFERRED_PARTY_NAMES = [
  'Pacto Histórico',
  'Centro Democrático',
  'Con Claudia Imparables',
  'Dignidad & Compromiso',
  'Defensores de la Patria',
];

const PARTY_ARTICLES: Record<string, string> = {
  'Pacto Histórico': 'el',
  'Centro Democrático': 'el',
};

function withArticle(partyName: string): string {
  const article = PARTY_ARTICLES[partyName];
  return article ? `${article} ${partyName}` : partyName;
}

function formatContextDate(date: string | null | undefined) {
  if (!date) return null;

  const parsedDate = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate);
}

function getOrderedPartyNames(parties?: PartyDetails[]) {
  if (!parties?.length) {
    return PREFERRED_PARTY_NAMES;
  }

  const availableNames = new Set(parties.map((party) => party.name));
  const prioritized = PREFERRED_PARTY_NAMES.filter((name) =>
    availableNames.has(name),
  );
  const remaining = [...availableNames]
    .filter((name) => !prioritized.includes(name))
    .sort((left, right) => left.localeCompare(right, 'es-CO'));

  return [...prioritized, ...remaining];
}

function buildPartySpecificQuestions(partyNames: string[]) {
  const [
    partyA = 'Pacto Histórico',
    partyB = 'Centro Democrático',
    partyC = 'Con Claudia Imparables',
    partyD = 'Dignidad & Compromiso',
    partyE = 'Defensores de la Patria',
  ] = partyNames;

  return [
    `¿Cuál es la posición de ${partyA} sobre el salario mínimo?`,
    `¿Qué propone ${withArticle(partyB)} en materia de seguridad?`,
    `¿Cómo plantea ${partyC} combatir la corrupción?`,
    `¿Qué medidas propone ${partyD} para mejorar la educación pública?`,
    `¿Cómo quiere ${partyE} impulsar el crecimiento económico?`,
  ];
}

function buildCompareQuestions(partyNames: string[]) {
  const [
    partyA = 'Pacto Histórico',
    partyB = 'Centro Democrático',
    partyC = 'Con Claudia Imparables',
    partyD = 'Dignidad & Compromiso',
  ] = partyNames;

  return [
    `¿En qué se diferencian ${partyA} y ${partyB} en seguridad?`,
    `Compara las propuestas de ${partyA} y ${partyC} sobre salud.`,
    `¿Qué diferencias hay entre ${partyD} y ${partyB} frente al empleo y la economía?`,
  ];
}

function buildAccordionContent({
  contextName,
  contextDate,
  locationName,
  partyNames,
  supportsVotingBehavior,
}: {
  contextName: string;
  contextDate: string | null;
  locationName: string;
  partyNames: string[];
  supportsVotingBehavior: boolean;
}) {
  const partySpecificQuestions = buildPartySpecificQuestions(partyNames);
  const compareQuestions = buildCompareQuestions(partyNames);
  const supportedContextLabel = contextDate
    ? `${contextName} - ${contextDate}`
    : contextName;

  return [
    {
      id: 'questions',
      title: '¿Qué preguntas puedo hacer?',
      content: {
        intro:
          'Puedes hacer preguntas sobre las posiciones de las candidaturas y movimientos de esta elección. Si quieres comparar varias opciones entre sí, puedes agregarlas al chat o simplemente mencionarlas en la pregunta. También puedes hacer preguntas generales sobre el proceso electoral en Colombia.',
        sections: [
          {
            subtitle: 'Ejemplos de preguntas específicas por candidatura:',
            list: partySpecificQuestions,
          },
          {
            subtitle: 'Ejemplos de preguntas comparativas:',
            list: compareQuestions,
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
        intro: 'Actualmente soportamos el siguiente contexto electoral:',
        list: [supportedContextLabel],
        outro:
          'Iremos añadiendo nuevos contextos electorales a medida que estén disponibles.',
      },
    },
    {
      id: 'number-parties',
      title: '¿Con cuántas candidaturas puedo chatear?',
      content: {
        paragraphs: [
          `Puedes iniciar el chat con hasta ${MAX_SELECTABLE_PARTIES} candidaturas simultáneamente, pero tienes la posibilidad de agregar más durante la conversación.`,
          'Además, puedes agregar o eliminar fácilmente más candidaturas en el chat mediante el botón sobre el campo de texto.',
        ],
      },
    },
    {
      id: 'position',
      title: 'Clasificar posición',
      content: {
        paragraphs: [
          'Cuando haces clic en este botón debajo de uno de los mensajes, se clasifica la posición de la propuesta. Se tienen en cuenta los siguientes criterios: viabilidad, efectos a corto plazo y efectos a largo plazo.',
          'Para esto utilizamos información actual y fuentes de internet proporcionadas por Perplexity.ai.',
        ],
      },
    },
    ...(supportsVotingBehavior
      ? [
          {
            id: 'voting-behavior-analyze',
            title: 'Analizar comportamiento de votación',
            content: {
              paragraphs: [
                'Con esta función puedes contextualizar la respuesta de una organización política a partir de votaciones registradas. Además, al hacer clic en "Mostrar votaciones" puedes ver detalles adicionales sobre los registros relevantes para contrastar discurso y actuación política.',
              ],
            },
          },
        ]
      : []),
    {
      id: 'data',
      title: '¿Qué datos se utilizan?',
      content: {
        intro:
          'Para ofrecer respuestas fundamentadas y basadas en fuentes, votamos.chat utiliza una variedad de fuentes de datos:',
        orderedList: [
          `Documentos de las candidaturas: Como base de datos se utilizan programas de gobierno, manifiestos, documentos de posición y otros materiales públicos de las candidaturas y movimientos de ${locationName}.`,
          ...(supportsVotingBehavior
            ? [
                'Comportamiento de votación: Para el análisis del comportamiento de votación utilizamos registros públicos de votaciones institucionales para contrastar las posiciones declaradas con actuaciones previas.',
              ]
            : []),
          'Fuentes de internet para la clasificación de posiciones: Para la clasificación diferenciada de posiciones, votamos.chat utiliza el servicio Perplexity.ai, que emplea fuentes de internet de alta calidad como medios de comunicación y fuentes institucionales.',
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
          'Basado en fuentes: Las respuestas deben basarse en las declaraciones relevantes de los documentos proporcionados.',
          'Neutralidad: Las posiciones de las candidaturas deben reproducirse de forma neutral y sin valoraciones.',
          'Transparencia: A cada afirmación se deben vincular directamente las fuentes relevantes para permitir una revisión detallada del contenido.',
        ],
      },
    },
    {
      id: 'party-selection',
      title: '¿Según qué criterios se seleccionan las candidaturas?',
      content: {
        paragraphs: [
          `La selección actual para ${contextName} se basa en la disponibilidad de programas de gobierno y otros documentos públicos verificables. Queremos ampliar gradualmente la cobertura para incluir más candidaturas, movimientos y coaliciones relevantes.`,
          'Si echas en falta alguna candidatura o movimiento, escríbenos un correo con su programa de gobierno, manifiesto u otros documentos relevantes en PDF a info@votamos.chat y lo añadiremos lo antes posible.',
        ],
      },
    },
    {
      id: 'affinity-test-difference',
      title:
        '¿En qué se diferencia votamos.chat de un test de afinidad política tradicional?',
      content: {
        intro:
          'En un test de afinidad electoral tradicional respondes un conjunto cerrado de preguntas. votamos.chat, en cambio, funciona como una conversación abierta para entender mejor qué proponen las candidaturas.',
        orderedList: [
          'Hacer preguntas sobre los temas que más te interesan.',
          'Entrar en detalle para comprender exactamente los términos, ideas y planes de las candidaturas.',
          'Analizar posiciones críticamente para entender los pros y los contras.',
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
          'Para poder mejorar votamos.chat, se utilizan las acciones realizadas en la página web y los historiales de chat anonimizados para determinar estadísticas agregadas, como el número de preguntas respondidas o las candidaturas con las que más se chatea.',
          'El desarrollo de votamos.chat se hace de forma científica, de vez en cuando daremos a nuestros usuarios la posibilidad de participar en estudios. Estos serán 100% voluntarios y no participar no tendrá ningún efecto sobre el uso posterior de votamos.chat. En estos estudios utilizaremos las estadísticas de uso anonimizadas para analizar el impacto de votamos.chat y mejorar su efecto positivo en la sociedad.',
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
          'Agradecemos el apoyo y siempre estamos en busca de voluntarios que quieran fortalecer la democracia junto a nosotros. Si tienes interés en colaborar, puedes contactar al e-mail info@votamos.chat.',
        ],
      },
    },
  ];
}

const PROCESS_STEP_ICONS = [
  <MessageCircleQuestionIcon key="icon1" className="absolute left-0 top-0" />,
  <TextSearchIcon key="icon2" className="absolute left-0 top-0" />,
  <MessageCircleReplyIcon key="icon3" className="absolute left-0 top-0" />,
  <WaypointsIcon key="icon4" className="absolute left-0 top-0" />,
];

function HowTo() {
  const [isExporting, setIsExporting] = useState(false);
  const context = useCurrentContext({ optional: true });
  const parties = useContextParties();
  const contextId = context?.context_id ?? DEFAULT_CONTEXT_ID;

  const partyNames = getOrderedPartyNames(parties);
  const contextName = context?.name ?? FALLBACK_CONTEXT_NAME;
  const contextDate = formatContextDate(context?.date ?? FALLBACK_CONTEXT_DATE);
  const locationName = context?.location_name ?? FALLBACK_LOCATION_NAME;
  const supportsVotingBehavior = context?.supports_voting_behavior ?? false;
  const accordionContent = buildAccordionContent({
    contextName,
    contextDate,
    locationName,
    partyNames,
    supportsVotingBehavior,
  });

  const buildQuestionLink = (question: string) => {
    const searchParams = new URLSearchParams({ q: question });

    return `/${contextId}/session?${searchParams.toString()}`;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      await exportHowToPDF({
        introText: INTRO_TEXT,
        processSteps: PROCESS_STEPS,
        accordionContent,
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
          {accordionContent.map((accordionItem) => (
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
                    <ol className="list-outside list-decimal py-4 pl-6 [&_li]:pt-1">
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
                    <ol className="list-outside list-decimal py-4 pl-6 [&_li]:pt-1">
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
                      const parts = text.split('info@votamos.chat');
                      return (
                        <>
                          {parts[0]}
                          <a
                            href="mailto:info@votamos.chat"
                            className="underline"
                          >
                            info@votamos.chat
                          </a>
                          {parts[1]}
                        </>
                      );
                    })()}
                  </>
                )}

                {/* Traditional comparator difference accordion */}
                {accordionItem.id === 'affinity-test-difference' && (
                  <>
                    {accordionItem.content.intro}
                    <br />
                    <br />
                    <span className="font-bold">Con votamos.chat puedes:</span>
                    <ol className="list-outside list-decimal py-2 pl-6 [&_li]:pt-1">
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
                      const parts = text.split('info@votamos.chat');
                      return (
                        <p>
                          {parts[0]}
                          <a
                            href="mailto:info@votamos.chat"
                            className="underline"
                          >
                            info@votamos.chat
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
