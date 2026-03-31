import type { Vote } from '@/lib/socket.types';
import { useMemo } from 'react';
import VoteChart from './vote-chart';

type Props = {
  vote: Vote;
};

function OverallVoteChart({ vote }: Props) {
  const [resultStatement, percentageStatement] = useMemo(() => {
    const { yes, no, abstain } = vote.voting_results.overall;

    const totalVotes = yes + no + abstain;

    if (totalVotes === 0) {
      return [
        'No se registraron votos válidos',
        'No fue posible determinar un resultado',
      ];
    }

    let outcome: string;
    let percentage: number;

    if (yes > no) {
      outcome = 'aprobado';
      percentage = (yes / totalVotes) * 100;
    } else if (no > yes) {
      outcome = 'rechazado';
      percentage = (no / totalVotes) * 100;
    } else {
      outcome = 'empatado';
      percentage = (no / totalVotes) * 100;
    }

    const resultStatement = (
      <>
        La propuesta fue{' '}
        <span className="font-bold">
          {outcome.charAt(0).toUpperCase() + outcome.slice(1)}.
        </span>
      </>
    );

    let percentageStatement: string;
    if (outcome === 'empatado') {
      percentageStatement = `La propuesta quedó empatada con ${percentage.toFixed(
        1,
      )}% de los votos para cada lado.`;
    } else {
      percentageStatement = `La propuesta fue ${outcome} con ${percentage.toFixed(1)}% de los votos.`;
    }

    return [resultStatement, percentageStatement];
  }, [vote.voting_results.overall]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4">
      <VoteChart
        voteResults={vote.voting_results.overall}
        memberCount={vote.voting_results.overall.members}
      />

      <div className="flex flex-col items-center justify-center text-center">
        <p>{resultStatement}</p>
        <p className="text-xs text-muted-foreground">{percentageStatement}</p>
      </div>
    </section>
  );
}

export default OverallVoteChart;
