import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/capa/Header";
import { Navbar } from "./components/capa/NavBar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Stats from "./pages/Stat";
import Profile from "./pages/Profiles";
import History from "./pages/Historys";

function App() {
  return (
    <BrowserRouter>
      {/* min-h-screen: asegura que el fondo cubra toda la pantalla.
          flex-col: organiza el Header, el Contenido y la Navbar.
      */}
      <div className="min-h-screen flex flex-col bg-tranki-background">
        <Header />

        {/* CAMBIO AQUÍ: 
            Aumentamos el padding bottom (pb-32 ≈ 128px).
            Esto empuja el contenido hacia arriba para que la Navbar no tape nada.
        */}
        <main className="flex-1 p-4 pb-32"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <Navbar />
      </div>
    </BrowserRouter>
  );
}

export default App;