type Props = {
  title: string;
  value: number | string;
};

function StatCard({
  title,
  value,
}: Props) {

  return (
    <div className="
      bg-slate-900
      border
      border-cyan-500/20
      rounded-xl
      p-6
      shadow-lg
    ">
      <h3 className="text-gray-400">
        {title}
      </h3>

      <p className="
        text-3xl
        font-bold
        text-cyan-400
        mt-2
      ">
        {value}
      </p>
    </div>
  );
}

export default StatCard;