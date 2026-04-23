import { WOMPI_CURRENCY } from '@/lib/wompi/wompi-config';

export type WompiTransaction = {
  id: string;
  reference: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | string;
  status_message?: string | null;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string | null;
  finalized_at?: string | null;
};

export function amountToCents(amountInCop: number) {
  return amountInCop * 100;
}

export function formatCopAmount(amount: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: WOMPI_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCopAmountFromCents(amountInCents: number) {
  return formatCopAmount(amountInCents / 100);
}

export function isFinalWompiStatus(status?: string | null) {
  return ['APPROVED', 'DECLINED', 'VOIDED', 'ERROR'].includes(status ?? '');
}
