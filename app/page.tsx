import Career from "@/components/Career";
import Header from "@/components/Header";
import Profile from "@/components/Profile";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main className="container-page">
      <Header />
      <Profile />
      <Skills />
      <Career />
    </main>
  );
}
