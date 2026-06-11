type Props = {
  civilization: any;
  onClose: () => void;
};

function CivilizationModal({
  civilization,
  onClose,
}: Props) {

  if (!civilization) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
      "
    >
      <div
        className="
        bg-slate-900
        border
        border-cyan-500/20
        rounded-xl
        p-8
        w-[600px]
        max-w-[90%]
        "
      >

        <div className="flex justify-between">

          <h2
            className="
            text-3xl
            font-bold
            text-cyan-400
            "
          >
            {civilization.species.name}
          </h2>

          <button
            onClick={onClose}
            className="
            text-red-400
            text-xl
            "
          >
            ✕
          </button>

        </div>

        <div className="mt-6 space-y-3">

          <p>
            <strong>Stage:</strong>
            {" "}
            {civilization.stage}
          </p>

          <p>
            <strong>Population:</strong>
            {" "}
            {civilization.species.population}
          </p>

          <p>
            <strong>Technology Level:</strong>
            {" "}
            {civilization.technology?.level}
          </p>

          <p>
            <strong>Technology Era:</strong>
            {" "}
            {civilization.technology?.era}
          </p>

          <hr className="border-slate-700" />

          <p>
            <strong>Food:</strong>
            {" "}
            {civilization.resources?.food}
          </p>

          <p>
            <strong>Wood:</strong>
            {" "}
            {civilization.resources?.wood}
          </p>

          <p>
            <strong>Stone:</strong>
            {" "}
            {civilization.resources?.stone}
          </p>

          <p>
            <strong>Metal:</strong>
            {" "}
            {civilization.resources?.metal}
          </p>

          <p>
            <strong>Energy:</strong>
            {" "}
            {civilization.resources?.energy}
          </p>

        </div>

      </div>
    </div>
  );
}

export default CivilizationModal;