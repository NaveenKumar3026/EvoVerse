const traits = [
  "strength",
  "intelligence",
  "speed",
  "adaptability",
  "aggression",
  "lifespan",
] as const;

export const generateMutation = () => {
  const trait =
    traits[
      Math.floor(
        Math.random() * traits.length
      )
    ];

  const change =
    Math.floor(Math.random() * 21) - 10;

  return {
    trait,
    change,
  };
};