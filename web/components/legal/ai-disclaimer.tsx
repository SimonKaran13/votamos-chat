import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/chat/responsive-drawer-dialog';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CpuIcon,
  GitBranch,
} from 'lucide-react';

function AiDisclaimerContent() {
  return (
    <div className="px-4 pb-4 text-sm text-foreground md:px-0 md:pb-0">
      <p>
        Las respuestas de votamos.chat son generadas por una{' '}
        <span className="font-semibold">inteligencia artificial</span>. Se basan
        en informacion extraida de{' '}
        <span className="font-semibold">programas de gobierno</span> y otras
        fuentes <span className="font-semibold">publicamente disponibles</span>.
        Aunque votamos.chat busca ofrecer informacion precisa sobre posturas y
        propuestas politicas, ten en cuenta lo siguiente:
      </p>

      <ul className="flex list-inside flex-col gap-4 py-4 *:flex *:items-center *:gap-2">
        <li>
          <CpuIcon className="mr-2 size-6 shrink-0" />
          <span className="inline-block">
            La{' '}
            <span className="font-semibold">generacion y el procesamiento</span>{' '}
            de todo el contenido son{' '}
            <span className="font-semibold">automaticos</span>.
          </span>
        </li>
        <li>
          <AlertCircleIcon className="mr-2 size-6 shrink-0" />
          <span className="inline-block">
            Las respuestas{' '}
            <span className="font-semibold">
              no son declaraciones oficiales
            </span>{' '}
            de las candidaturas o partidos.
          </span>
        </li>
        <li>
          <GitBranch className="mr-2 size-6 shrink-0" />
          <span className="inline-block">
            Las{' '}
            <span className="font-semibold">posturas politicas complejas</span>{' '}
            pueden no quedar reflejadas en todos sus matices.
          </span>
        </li>
        <li>
          <AlertTriangleIcon className="mr-2 size-6 shrink-0" />
          <span className="inline-block">
            A veces puede haber{' '}
            <span className="font-semibold">imprecisiones</span> o{' '}
            <span className="font-semibold">interpretaciones incorrectas</span>.
          </span>
        </li>
      </ul>

      <p>
        Este chat con IA es una{' '}
        <span className="font-semibold">herramienta informativa</span> para
        conocer distintas posiciones politicas. Si necesitas informacion{' '}
        <span className="font-semibold">oficial o vinculante</span>, consulta
        las <span className="font-semibold">fuentes oficiales</span> de cada
        candidatura.
      </p>
    </div>
  );
}

function AiDisclaimer() {
  return (
    <ResponsiveDialog>
      <p className="my-2 text-center text-xs text-muted-foreground">
        votamos.chat puede cometer errores.{' '}
        <ResponsiveDialogTrigger className="font-semibold underline">
          Mas informacion aqui.
        </ResponsiveDialogTrigger>
      </p>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Aviso sobre IA</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <AiDisclaimerContent />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default AiDisclaimer;
