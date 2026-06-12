function Starfield() {

  const stars =
    Array.from(
      { length: 250 },
      (_, i) => i
    );

  return (

    <div
      className="
      fixed
      inset-0
      -z-10
      overflow-hidden
      "
    >

      {stars.map((star) => (

        <div
          key={star}
          className="
          absolute
          text-white
          opacity-30
          animate-pulse
          "
          style={{
            left:
              `${Math.random() * 100}%`,
            top:
              `${Math.random() * 100}%`,
            fontSize:
              `${Math.random() * 8 + 4}px`,
          }}
        >
          ✦
        </div>

      ))}

    </div>

  );

}

export default Starfield;