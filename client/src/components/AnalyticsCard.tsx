type Props = {
  icon: string;
  title: string;
  value: string;
};

function AnalyticsCard({
  icon,
  title,
  value,
}: Props) {
  return (
    <div
      className="
      bg-slate-900
      border
      border-purple-500/20
      rounded-xl
      p-6
      shadow-lg
    "
    >
      <div className="text-3xl mb-2">
        {icon}
      </div>

      <h3 className="text-gray-400">
        {title}
      </h3>

      <p className="text-xl font-bold text-purple-400 mt-2">
        {value}
      </p>
    </div>
  );
}

export default AnalyticsCard;