import Sidebar from "./Sidebar";
import Starfield from "./Starfield";
import GameHUD from "./GameHUD";

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

      <GameHUD />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8 animate-panel-enter">
          {children}
        </main>

      </div>

    </div>

  );

}

export default Layout;