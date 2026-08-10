import React, { useState } from "react";

export default function LandingPageDemo({ alIrADashboard }) {
  const [emailLead, setEmailLead] = useState("");
  const [suscripto, setSuscripto] = useState(false);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (emailLead.trim()) {
      // Conexión futura con Supabase
      setSuscripto(true);
      setEmailLead("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#333333] font-sans selection:bg-[#4A6741] selection:text-white">
      {/* 1. NAVEGACIÓN LIMPIA */}
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
            href="#cursos"
            className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors"
          >
            Cursos
          </a>
          <a
            href="#recurso"
            className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors hidden sm:block"
          >
            Guía Gratis
          </a>
          <button
            onClick={alIrADashboard}
            className="text-xs font-bold bg-[#4A6741] text-white px-4 py-2 rounded-full hover:bg-[#3B5334] transition-all shadow-sm"
          >
            Acceso Alumnas 🔒
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION (PORTADA PRINCIPAL) */}
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
            href="#recurso"
            className="w-full sm:w-auto bg-[#4A6741] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md hover:bg-[#3B5334] transition-all transform hover:-translate-y-0.5"
          >
            Obtener Recurso Gratuito 🎁
          </a>
          <a
            href="#cursos"
            className="w-full sm:w-auto bg-[#FDF5E6] border border-[#F4E8D1] text-[#7A5C4F] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#F9F6F2] transition-all"
          >
            Explorar Cursos
          </a>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 🌿 NUEVO: CONCEPTO "SIMPLE Y TRANQUI" (DANIELA + 2 IMÁGENES) */}
      {/* ======================================================== */}
      {/* 🌿 CONCEPTO "SIMPLE Y TRANQUI" (FILOSOFÍA Y DANIELA) */}
      <section
        id="filosofia"
        className="bg-white border-y border-[#F4F1EC] py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* COLUMNA IZQUIERDA: Mosaico de Imágenes con Daniela destacada (5 cols en escritorio) */}
          <div className="md:col-span-5 relative flex items-center justify-center">
            <div className="grid grid-cols-12 gap-3 w-full items-end">
              {/* Foto secundaria/de apoyo (Izquierda - Más pequeña y desplazada hacia arriba) */}
              <div className="col-span-5 -mb-4">
                <img
                  src="/espacio-tranqui.jpg"
                  alt="Espacio Simple y Tranqui"
                  className="rounded-2xl shadow-sm object-cover h-56 w-full border border-[#F4F1EC] opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Foto de Daniela (Derecha - Protagonista, más alta y amplia) */}
              <div className="col-span-7 relative z-10">
                <div className="relative group">
                  <img
                    src="/daniela-1.jpg"
                    alt="Daniela Uzcátegui"
                    className="rounded-3xl shadow-xl object-cover h-80 sm:h-96 w-full border-2 border-[#FAF8F5] transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  {/* Tag/Etiqueta integrada sobre la foto de Daniela */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#FAF8F5]/95 backdrop-blur-md p-3 rounded-2xl border border-[#F4F1EC] text-center shadow-md">
                    <p className="text-xs text-[#4A6741] font-bold tracking-wide">
                      Daniela Uzcátegui
                    </p>
                    <p className="text-[10px] text-[#7A5C4F] font-medium mt-0.5">
                      Fundadora de Grow-It
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Textos y propuesta (7 cols en escritorio) */}
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
              <span className="text-2xl p-2 bg-white rounded-xl border border-[#F4F1EC] shadow-xs">
                🌱
              </span>
              <p className="text-xs sm:text-sm text-[#7A5C4F] font-semibold leading-snug">
                Menos caos operativo, más tranquilidad y estrategia consciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROPUESTA DE VALOR (TU SECCIÓN ORIGINAL) */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-[#F4F1EC] text-center shadow-sm">
            <span className="text-3xl mb-3 block">🌱</span>
            <h3 className="font-bold text-[#4A6741] text-base mb-2">
              Paso a paso sin rodeos
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Lecciones cortas y directas al grano. Sin tecnicismos innecesarios
              para que apliques desde el día uno.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#F4F1EC] text-center shadow-sm">
            <span className="text-3xl mb-3 block">💬</span>
            <h3 className="font-bold text-[#4A6741] text-base mb-2">
              Comunidad Interactiva
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Espacio integrado en cada módulo para dejar dudas, compartir
              avances y aprender acompañadas.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#F4F1EC] text-center shadow-sm">
            <span className="text-3xl mb-3 block">📄</span>
            <h3 className="font-bold text-[#4A6741] text-base mb-2">
              Materiales Prácticos
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Plantillas descargables y guías en PDF organizadas para trabajar
              con orden y calma.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 💬 NUEVO: SECCIÓN DE ALUMNAS Y TESTIMONIOS (2 IMÁGENES) */}
      {/* ======================================================== */}
      <section className="bg-white border-y border-[#F4F1EC] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#7A5C4F] font-bold text-xs uppercase tracking-wider">
              Testimonios
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A6741] mt-2">
              Lo que dicen nuestras alumnas
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Experiencias reales de la comunidad Grow-It
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tarjeta de Alumna 1 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] flex flex-col justify-between">
              <div>
                <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs md:text-sm text-gray-600 italic mb-6 leading-relaxed">
                  "Logré organizar por fin el caos que tenía en la cabeza. El
                  método me permitió entender qué paso dar cada día sin sentirme
                  abrumada."
                </p>
              </div>
              <div className="border-t border-[#F4F1EC] pt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                  alt="Alumna Grow-It"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#4A6741]"
                />
                <div>
                  <p className="font-bold text-[#4A6741] text-xs">
                    Comentario de Alumna
                  </p>
                  <p className="text-[10px] text-gray-400">Programa Grow-It</p>
                </div>
              </div>
            </div>

            {/* Tarjeta de Alumna 2 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] flex flex-col justify-between">
              <div>
                <div className="text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs md:text-sm text-gray-600 italic mb-6 leading-relaxed">
                  "El acompañamiento de Daniela es único. Ver los módulos
                  grabados a mi ritmo me ayudó a aplicar cambios inmediatos en
                  mi proyecto."
                </p>
              </div>
              <div className="border-t border-[#F4F1EC] pt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                  alt="Alumna Grow-It"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#4A6741]"
                />
                <div>
                  <p className="font-bold text-[#4A6741] text-xs">
                    Comentario de Alumna
                  </p>
                  <p className="text-[10px] text-gray-400">Programa Grow-It</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 🎥 NUEVO: MÓDULO DE MUESTRA CON GRABACIÓN DE CURSO */}
      {/* ======================================================== */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-[#4A6741] text-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="bg-[#3B5334] text-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Clase de Muestra
              </span>
              <h3 className="text-2xl font-bold text-white">
                Módulo 1: "Bases para un negocio en calma"
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-light">
                Conoce la metodología por dentro. Te compartimos el acceso a la
                grabación de este módulo para que compruebes el formato de
                enseñanza.
              </p>
              <div className="pt-2">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FDF5E6] text-[#7A5C4F] font-bold text-xs px-5 py-3 rounded-full hover:bg-white transition"
                >
                  ▶ Ver Grabación del Módulo
                </a>
              </div>
            </div>

            {/* Preview de Video */}
            <div className="md:col-span-6">
              <div className="aspect-video bg-[#3B5334]/60 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 border border-white/30">
                  <span className="text-xl ml-1 text-white">▶</span>
                </div>
                <p className="text-xs font-semibold text-white">
                  Grabación de Clase de Muestra
                </p>
                <p className="text-[10px] text-emerald-200 mt-1">
                  Video en alta definición
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO DE CURSOS (TU SECCIÓN ORIGINAL) */}
      <section id="cursos" className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A6741]">
            Nuestra Propuesta Formativa
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Elige el camino que mejor se adapte al momento actual de tu proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de Curso 1 */}
          <div className="bg-[#FDF5E6] rounded-3xl p-8 border border-[#F4E8D1] flex flex-col justify-between shadow-sm">
            <div>
              <span className="bg-[#4A6741] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Curso Estrella 🌟
              </span>
              <h3 className="text-xl font-bold text-[#7A5C4F] mt-4 mb-2">
                Estrategia y Organización Tranquila
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Aprende a estructurar tus metas digitales sin sobrecargarte de
                trabajo, priorizando tu paz mental.
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

          {/* Tarjeta de Curso 2 */}
          <div className="bg-white rounded-3xl p-8 border border-[#F4F1EC] flex flex-col justify-between shadow-sm">
            <div>
              <span className="bg-[#7A5C4F] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Taller Práctico ✨
              </span>
              <h3 className="text-xl font-bold text-[#4A6741] mt-4 mb-2">
                Gestión de Clientes y Proyectos
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Implementa un flujo de trabajo claro con herramientas simples
                para comunicarte mejor con tus clientes.
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

      {/* 5. LEAD MAGNET / DESCARGABLE (GANCHO) */}
      <section id="recurso" className="bg-[#4A6741] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-2xl mb-2 block">🎁</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Obtén tu Recurso de Regalo (Gancho)
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 max-w-xl mx-auto mb-8 font-light">
            Déjanos tu correo y te enviaremos gratuitamente la información
            completa y la plantilla en PDF para comenzar.
          </p>

          {suscripto ? (
            <div className="bg-[#FDF5E6] text-[#7A5C4F] p-4 rounded-2xl max-w-md mx-auto font-bold text-xs animate-fade-in">
              ¡Gracias por sumarte! 🌿 Revisa tu correo, te enviamos el recurso
              gratis.
            </div>
          ) : (
            <form
              onSubmit={handleLeadSubmit}
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
                Quiero el Descargable 📩
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 6. FOOTER Y ACCESO DIRECTO */}
      <footer className="bg-white border-t border-[#F4F1EC] py-10 px-6 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Grow-It / Simple y Tranqui. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={alIrADashboard}
              className="text-[#4A6741] font-semibold hover:underline"
            >
              Panel de Alumnas 🔐
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
