import React, { useState } from "react";

export default function LandingPageDemo({ alIrADashboard }) {
  const [emailLead, setEmailLead] = useState("");
  const [paso, setPaso] = useState("landing"); // 'landing' | 'modulo'
  const [solicitoDescargable, setSolicitoDescargable] = useState(false);

  // Paso 1: Enviar correo para ver el módulo
  const handleRegistroModulo = (e) => {
    e.preventDefault();
    if (emailLead.trim()) {
      setPaso("modulo");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Paso 2: Solicitar descargable desde la página del módulo
  const handlePedirDescargable = () => {
    setSolicitoDescargable(true);
  };

  // ========================================================
  // 🎥 VISTA 2: PÁGINA DEL MÓDULO GRATUITO + DESCARGABLE
  // ========================================================
  if (paso === "modulo") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#333333] font-sans">
        <nav className="w-full bg-white border-b border-[#F4F1EC] px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={() => setPaso("landing")}
            className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors flex items-center gap-1"
          >
            ← Volver a la Landing
          </button>
          <span className="font-bold text-[#4A6741] text-sm uppercase">
            Simple y Tranqui
          </span>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-[#4A6741] text-white rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
            <div>
              <span className="bg-[#3B5334] text-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Clase de Muestra Exclusiva
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-3">
                Módulo 1: "Bases para un negocio en calma"
              </h1>
              <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed font-light mt-2">
                ¡Gracias por sumarte! Disfruta de esta lección grabada para
                conocer la metodología por dentro.
              </p>
            </div>

            <div className="aspect-video bg-[#3B5334]/80 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center text-center p-6 shadow-inner">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 border border-white/30 cursor-pointer hover:scale-105 transition-transform">
                <span className="text-2xl ml-1 text-white">▶</span>
              </div>
              <p className="text-sm font-semibold text-white">
                Grabación de Clase de Muestra
              </p>
              <p className="text-xs text-emerald-200 mt-1">
                Haz clic para reproducir el video
              </p>
            </div>

            <div className="bg-[#FDF5E6] text-[#333333] p-6 rounded-2xl border border-[#F4E8D1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#7A5C4F] text-sm">
                  ¿Quieres llevarte la plantilla de trabajo?
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Te enviamos la guía complementaria en PDF directo a tu correo
                  (<strong className="text-[#4A6741]">{emailLead}</strong>).
                </p>
              </div>

              {solicitoDescargable ? (
                <span className="bg-[#4A6741] text-white text-xs font-bold px-4 py-2.5 rounded-full shrink-0">
                  ✓ ¡PDF Enviado a tu correo!
                </span>
              ) : (
                <button
                  onClick={handlePedirDescargable}
                  className="bg-[#7A5C4F] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#63493E] transition-all shrink-0 shadow-sm"
                >
                  Quiero el Descargable 📥
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ========================================================
  // 🌿 VISTA 1: LANDING PAGE PRINCIPAL
  // ========================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#333333] font-sans selection:bg-[#4A6741] selection:text-white">
      {/* 1. NAVEGACIÓN */}
      <nav className="w-full bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#F4F1EC] sticky top-0 z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-bold text-[#4A6741] text-lg tracking-wide uppercase">
            Simple y Tranqui
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#filosofia"
            className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors hidden md:block"
          >
            Filosofía
          </a>
          <a
            href="#metodo"
            className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors hidden md:block"
          >
            El Método
          </a>
          <a
            href="#cursos"
            className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors"
          >
            Cursos
          </a>
          <button
            onClick={alIrADashboard}
            className="text-xs font-bold bg-[#4A6741] text-white px-4 py-2 rounded-full hover:bg-[#3B5334] transition-all shadow-sm"
          >
            Acceso Alumnas 🔒
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center">
        <span className="inline-block bg-[#FDF5E6] border border-[#F4E8D1] text-[#7A5C4F] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Aprender a tu propio ritmo
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4A6741] leading-tight mb-6">
          Aprende sin abrumarte y con resultados reales 🌿
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-light">
          Cursos y herramientas metodológicas diseñadas bajo la filosofía{" "}
          <strong className="text-[#7A5C4F] font-semibold">
            Simple y Tranqui
          </strong>{" "}
          para hacer crecer tu proyecto con calma y estrategia.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#registro-modulo"
            className="w-full sm:w-auto bg-[#4A6741] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md hover:bg-[#3B5334] transition-all transform hover:-translate-y-0.5"
          >
            Ver Clase de Muestra Gratis 🎬
          </a>
          <a
            href="#cursos"
            className="w-full sm:w-auto bg-[#FDF5E6] border border-[#F4E8D1] text-[#7A5C4F] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#F9F6F2] transition-all"
          >
            Explorar Cursos
          </a>
        </div>
      </section>

      {/* 3. FILOSOFÍA (SOLO DANIELA - LIMPIO Y DESTACADO) */}
      <section
        id="filosofia"
        className="bg-white border-y border-[#F4F1EC] py-20 px-6"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Foto de Daniela centrada y protagónica */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-xs w-full">
              <img
                src="/daniela-1.jpg"
                alt="Daniela Uzcátegui"
                className="rounded-3xl shadow-xl object-cover h-96 w-full border-2 border-[#FAF8F5] transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FAF8F5]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#F4F1EC] text-center shadow-md">
                <p className="text-xs text-[#4A6741] font-bold tracking-wide">
                  Daniela Uzcátegui
                </p>
                <p className="text-[10px] text-[#7A5C4F] font-medium mt-0.5">
                  Fundadora de Grow-It
                </p>
              </div>
            </div>
          </div>

          {/* Texto de Filosofía */}
          <div className="md:col-span-7 space-y-5">
            <span className="text-[#7A5C4F] font-bold text-xs uppercase tracking-widest bg-[#FDF5E6] border border-[#F4E8D1] px-3 py-1 rounded-full inline-block">
              Nuestra Filosofía
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4A6741] leading-tight">
              ¿Qué significa construir de forma{" "}
              <br className="hidden sm:inline" />
              <span className="text-[#7A5C4F]">Simple y Tranqui</span>?
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
              Emprender no tiene por qué ser un camino de estrés constante ni de
              listas infinitas de tareas. Creemos en avanzar con claridad,
              enfocándote únicamente en lo que realmente mueve la aguja de tu
              proyecto.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
              Te acompañamos a simplificar tus procesos, despejar la mente y
              construir bases sólidas para que disfrutes tanto del aprendizaje
              como de los resultados.
            </p>
            <div className="flex items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#F4F1EC] shadow-sm">
              <span className="text-2xl p-2 bg-white rounded-xl border border-[#F4F1EC]">
                🌱
              </span>
              <p className="text-xs sm:text-sm text-[#7A5C4F] font-semibold">
                Menos caos operativo, más tranquilidad y estrategia consciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NUEVA SECCIÓN: EL MÉTODO DE LOS CURSOS (TEXTO IZQ + IMAGEN DER) */}
      <section id="metodo" className="py-20 px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Texto a la Izquierda */}
          <div className="md:col-span-7 space-y-5">
            <span className="text-[#4A6741] font-bold text-xs uppercase tracking-widest bg-white border border-[#F4F1EC] px-3 py-1 rounded-full inline-block">
              Metodología Práctica
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4A6741] leading-tight">
              Aprende con talleres y clases diseñadas{" "}
              <span className="text-[#7A5C4F]">para la acción</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
              Nuestros programas están estructurados en módulos breves y al
              grano. Olvídate de teorías eternas: en cada lección encontrarás
              plantillas descargables y guías prácticas para aplicar de
              inmediato a tu negocio.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                Grabaciones en alta definición disponibles 24/7 a tu ritmo.
              </li>
              <li className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                Recursos ejecutables: plantillas, PDFs y guías de trabajo.
              </li>
            </ul>
          </div>

          {/* Imagen del Espacio / Curso a la Derecha */}
          <div className="md:col-span-5 flex justify-center">
            <img
              src="/espacio-tranqui.jpg"
              alt="Módulos y cursos Simple y Tranqui"
              className="rounded-3xl shadow-md object-cover h-80 w-full border border-[#F4F1EC]"
            />
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS CON ICONOS DE ALUMNAS */}
      <section className="bg-white border-y border-[#F4F1EC] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#7A5C4F] font-bold text-xs uppercase tracking-wider">
              Testimonios
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A6741] mt-2">
              Lo que dicen nuestras alumnas
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Experiencias reales de emprendedoras en la comunidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Alumna 1 - Icono Persona / Perfil */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs md:text-sm text-gray-600 italic mb-6 leading-relaxed">
                  "Logré organizar por fin el caos que tenía en la cabeza. El
                  método me permitió entender qué paso dar cada día sin sentirme
                  abrumada."
                </p>
              </div>
              <div className="border-t border-[#F4F1EC] pt-4 flex items-center gap-3">
                {/* Icono de Alumna 1 */}
                <div className="w-10 h-10 rounded-full bg-[#EBF2EA] text-[#4A6741] flex items-center justify-center border border-[#D5E3D3] shrink-0 font-bold text-sm">
                  🌸
                </div>
                <div>
                  <p className="font-bold text-[#4A6741] text-xs">
                    Alumna del Programa
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Emprendimiento Digital
                  </p>
                </div>
              </div>
            </div>

            {/* Alumna 2 - Icono Brote / Crecimiento */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs md:text-sm text-gray-600 italic mb-6 leading-relaxed">
                  "El acompañamiento de Daniela es único. Ver los módulos
                  grabados a mi ritmo me ayudó a aplicar cambios inmediatos en
                  mi proyecto."
                </p>
              </div>
              <div className="border-t border-[#F4F1EC] pt-4 flex items-center gap-3">
                {/* Icono de Alumna 2 */}
                <div className="w-10 h-10 rounded-full bg-[#FDF5E6] text-[#7A5C4F] flex items-center justify-center border border-[#F4E8D1] shrink-0 font-bold text-sm">
                  ✨
                </div>
                <div>
                  <p className="font-bold text-[#4A6741] text-xs">
                    Alumna del Taller
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Gestión de Proyectos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CATÁLOGO DE CURSOS */}
      <section id="cursos" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A6741]">
            Nuestra Propuesta Formativa
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Elige el camino que mejor se adapte al momento actual de tu proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FDF5E6] rounded-3xl p-8 border border-[#F4E8D1] flex flex-col justify-between">
            <div>
              <span className="bg-[#4A6741] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Curso Estrella 🌟
              </span>
              <h3 className="text-xl font-bold text-[#7A5C4F] mt-4 mb-2">
                Estrategia y Organización Tranquila
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Aprende a estructurar tus metas digitales sin sobrecargarte de
                trabajo.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F4E8D1] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">
                  Acceso de por vida
                </span>
                <span className="text-lg font-bold text-[#4A6741]">
                  $49 USD
                </span>
              </div>
              <button
                onClick={alIrADashboard}
                className="bg-[#4A6741] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#3B5334] transition-all"
              >
                Inscribirme
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#F4F1EC] flex flex-col justify-between">
            <div>
              <span className="bg-[#7A5C4F] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Taller Práctico ✨
              </span>
              <h3 className="text-xl font-bold text-[#4A6741] mt-4 mb-2">
                Gestión de Clientes y Proyectos
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Implementa un flujo de trabajo claro con herramientas simples.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F4F1EC] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">
                  Incluye plantillas
                </span>
                <span className="text-lg font-bold text-[#4A6741]">
                  $29 USD
                </span>
              </div>
              <button
                onClick={alIrADashboard}
                className="bg-[#7A5C4F] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#63493E] transition-all"
              >
                Inscribirme
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FORMULARIO (CAPTADOR: "VER UN MÓDULO") */}
      <section
        id="registro-modulo"
        className="bg-[#4A6741] text-white py-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-2xl mb-2 block">🎬</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Accede Gratis a un Módulo Completo
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 max-w-xl mx-auto mb-8 font-light">
            Ingresa tu correo a continuación para desbloquear de inmediato la
            lección grabada: <strong>"Bases para un negocio en calma"</strong>.
          </p>

          <form
            onSubmit={handleRegistroModulo}
            className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={emailLead}
              onChange={(e) => setEmailLead(e.target.value)}
              required
              className="px-5 py-3 rounded-full text-xs text-gray-800 focus:outline-none w-full bg-white"
            />
            <button
              type="submit"
              className="bg-[#7A5C4F] text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-[#63493E] transition-all shrink-0"
            >
              Ver un Módulo ▶
            </button>
          </form>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white border-t border-[#F4F1EC] py-10 px-6 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Grow-It / Simple y Tranqui. Todos los
            derechos reservados.
          </p>
          <button
            onClick={alIrADashboard}
            className="text-[#4A6741] font-semibold hover:underline"
          >
            Panel de Alumnas 🔐
          </button>
        </div>
      </footer>
    </div>
  );
}
