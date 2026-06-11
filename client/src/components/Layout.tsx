import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

function Layout({
  children,
}: Props) {
  return (
    <div className="flex bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}

export default Layout;