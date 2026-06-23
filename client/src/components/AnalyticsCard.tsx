type Props = {
  icon: string;
  title: string;
  value: string;
};

function AnalyticsCard({ icon, title, value }: Props) {
  return (
    <div
      className="
      bg-slate-900/70 border border-purple-500/20 rounded-xl p-6
      shadow-lg transition-all duration-300
      hover:scale-[1.02] hover:border-purple-500/40
      hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]
    "
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-gray-400 text-sm uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-xl font-bold text-purple-400 mt-2">{value}</p>
    </div>
  );
}

export default AnalyticsCard;
