import Sidebar from "./Sidebar";
import Starfield from "./Starfield";

type Props = {
  children: React.ReactNode;
};

function Layout({
  children,
}: Props) {

  return (

    <div
      className="
      min-h-screen
      bg-slate-950
      text-white
      "
    >

      <Starfield />

      <div className="flex">

        <Sidebar />

        <main
          className="
          flex-1
          p-8
          "
        >
          {children}
        </main>

      </div>

    </div>

  );

}

export default Layout;