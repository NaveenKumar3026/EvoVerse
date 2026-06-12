import Layout from "../components/Layout";

function Achievements() {

  const achievements = [
    {
      title: "Strongest Empire",
      icon: "🏆",
      description:
        "Dominated the galaxy through military power",
    },
    {
      title: "Richest Civilization",
      icon: "💰",
      description:
        "Accumulated the largest wealth",
    },
    {
      title: "Technology Master",
      icon: "🚀",
      description:
        "Reached the highest tech level",
    },
    {
      title: "Population Giant",
      icon: "👥",
      description:
        "Maintained the largest population",
    },
  ];

  return (
    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-yellow-400
        mb-10
        "
      >
        Achievements
      </h1>

      <div
        className="
        grid
        md:grid-cols-2
        gap-6
        "
      >

        {achievements.map((achievement) => (

          <div
            key={achievement.title}
            className="
            bg-slate-900
            border
            border-yellow-500/20
            rounded-xl
            p-6
            "
          >

            <div className="text-5xl">
              {achievement.icon}
            </div>

            <h2
              className="
              text-2xl
              font-bold
              mt-4
              text-yellow-400
              "
            >
              {achievement.title}
            </h2>

            <p className="mt-2 text-gray-400">
              {achievement.description}
            </p>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Achievements;