const calculateScores = doc => {
  const defaultArchetypes = ['Achievement', 'People First', 'One-Team', 'Innovation', 'Customer-Centric', 'Greater-Good'];
  const defaultPairs = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 5]
  ];

  const isBusinessImperative = doc.exerciseName === 'Business Imperative Prioritisation';

  const archetypes = isBusinessImperative ? [...new Set(doc.archetypes?.map(pair => pair.split('-')).flat())] : defaultArchetypes;
  const pairs = isBusinessImperative
    ? doc.archetypes?.map(pair => pair.split('-')?.map(archetype => archetypes.indexOf(archetype)))
    : defaultPairs;

  if (!doc.optionValues) {
    throw new Error('Option values are undefined');
  }

  // Convert optionValues object to array
  const responses = Object.values(doc.optionValues);

  // Validate the number of responses
  if (pairs.length !== responses.length) {
    throw new Error(`Mismatch between pairs (${pairs.length}) and responses (${responses.length})`);
  }

  const scores = Array(archetypes.length).fill(0);

  pairs.forEach(([left, right], index) => {
    const value = responses[index];
    scores[left] += 4 - value; // Subtracting 4 to convert 1-7 scale to -3 to +3 scale
    scores[right] += value - 4;
  });

  // Convert scores to positive values
  const minScore = Math.min(...scores);
  const positiveScores = scores?.map(score => score - minScore + 1); // Shift scores to be all positive

  // Normalize scores to sum to 100
  const total = positiveScores.reduce((acc, score) => acc + score, 0);
  const normalizedScores = positiveScores?.map(score => (score / total) * 100);

  return normalizedScores?.map((value, index) => ({
    name: archetypes[index],
    value: Math.round(value * 100) / 100 // Round to two decimal places
  }));
};

export default calculateScores;
