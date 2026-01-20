'use client';

import {
  useContexts,
  useCurrentContext,
} from '@/components/providers/context-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import type { Context } from '@/lib/firebase/firebase.types';
import { cn, formatGermanDate } from '@/lib/utils';
import { CalendarIcon, CheckIcon, MapPinIcon, VoteIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function ContextIcon({
  context,
  className,
}: {
  context: Context;
  className?: string;
}) {
  if (context.icon_url) {
    return (
      <Image
        src={context.icon_url}
        alt={context.name}
        className={cn('size-12 rounded-md object-contain', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex size-12 items-center justify-center rounded-md bg-muted',
        className,
      )}
    >
      <VoteIcon className="size-6 text-muted-foreground" />
    </div>
  );
}

function ElectionOptionContent({
  context,
  isSelected,
  showCheckmark,
}: {
  context: Context;
  isSelected?: boolean;
  showCheckmark?: boolean;
}) {
  const formattedDate = formatGermanDate(context.date, 'long');

  return (
    <div className="flex w-full items-center gap-3 p-2">
      <ContextIcon context={context} />
      <div className="flex flex-1 flex-col items-start gap-1.5">
        <span className="text-lg font-medium leading-none text-foreground">
          {context.name}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted-foreground">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              <span className="leading-none">{formattedDate}</span>
            </span>
          )}
          {context.location_name && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3" />
              <span className="leading-none">{context.location_name}</span>
            </span>
          )}
        </div>
      </div>
      {showCheckmark && isSelected && (
        <CheckIcon className="size-4 shrink-0 text-primary" />
      )}
    </div>
  );
}

export function ElectionSelect() {
  const currentContext = useCurrentContext();
  const contexts = useContexts();
  const router = useRouter();

  const handleContextChange = (contextId: string) => {
    if (contextId !== currentContext.context_id) {
      router.push(`/${contextId}`);
    }
  };

  // Don't show selector if there's only one context
  if (contexts.length <= 1) {
    return (
      <div
        className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3"
        role="status"
        aria-label={`Aktuelle Wahl: ${currentContext.name}`}
      >
        <ElectionOptionContent context={currentContext} />
      </div>
    );
  }

  return (
    <Select
      value={currentContext.context_id}
      onValueChange={handleContextChange}
    >
      <SelectTrigger
        className="h-auto w-full p-3 [&>svg]:size-5"
        aria-label={`Wahl auswählen. Aktuell ausgewählt: ${currentContext.name}`}
      >
        <ElectionOptionContent context={currentContext} />
      </SelectTrigger>
      <SelectContent className="w-full" aria-label="Verfügbare Wahlen">
        {contexts.map((ctx) => {
          const isSelected = ctx.context_id === currentContext.context_id;
          const formattedDate = formatGermanDate(ctx.date, 'long');
          const ariaLabel = `${ctx.name}${formattedDate ? `, ${formattedDate}` : ''}${ctx.location_name ? `, ${ctx.location_name}` : ''}${isSelected ? ' (ausgewählt)' : ''}`;

          return (
            <SelectItem
              key={ctx.context_id}
              value={ctx.context_id}
              className="block w-full cursor-pointer px-3 py-2.5 [&>span:first-child]:hidden"
              aria-label={ariaLabel}
            >
              <ElectionOptionContent
                context={ctx}
                isSelected={isSelected}
                showCheckmark
              />
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default ElectionSelect;
