import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { GoTopButton } from "./components/GoTopButton";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { SweetDetail } from "./pages/SweetDetail";
import { Showcase } from "./pages/Showcase";
import { Reviews } from "./pages/Reviews";
import { Contact } from "./pages/Contact";
import { Admin } from "./admin/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sweet/:id" element={<SweetDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <GoTopButton />
      </div>
    </BrowserRouter>
  );
}
