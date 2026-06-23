type Props = {
  label?: string;
};

export default function LoadingState({ label = "Loading..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
      <p className="text-cyan-400/80 text-sm uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
