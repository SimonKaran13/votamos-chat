import DonationStatusCard from '@/components/donation-status-card';
import { getWompiTransaction } from '@/lib/wompi/get-wompi-transaction';

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const actualSearchParams = await searchParams;
  const transactionId = actualSearchParams.id;

  if (!transactionId) {
    return <DonationStatusCard transactionId="" initialTransaction={null} />;
  }

  const transaction = await getWompiTransaction(transactionId).catch(
    () => null,
  );

  return (
    <DonationStatusCard
      transactionId={transactionId}
      initialTransaction={transaction}
    />
  );
}

export default Page;
