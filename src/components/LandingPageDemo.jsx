import React, { useState } from 'react';

export default function LandingPageDemo({ alIrADashboard }) {
  const [emailLead, setEmailLead] = useState('');
  const [suscripto, setSuscripto] = useState(false);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (emailLead.trim()) {
      // Aquí conectaremos luego con Supabase
      setSuscripto(true);
      setEmailLead('');
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
          <a href="#cursos" className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors">
            Cursos
          </a>
          <a href="#recurso" className="text-xs font-semibold text-[#7A5C4F] hover:text-[#4A6741] transition-colors hidden sm:block">
            Guía Gratis
          </a>
          {/* Botón para navegar al Dashboard actual en la prueba */}
          <button 
            onClick={alIrADashboard}
            className="text-xs font-bold bg-[#4A6741] text-white px-4 py-2 rounded-full hover:bg-[#3B5334] transition-all shadow-sm"
          >
            Acceso Alumnas 🔒
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION (PORTADA PRINCIPAL) */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <span className="inline-block bg-[#FDF5E6] border border-[#F4E8D1] text-[#7A5C4F] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Aprender a tu propio ritmo
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4A6741] leading-tight mb-6">
          Aprende sin abrumarte y con resultados reales 🌿
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-light">
          Cursos y herramientas metodológicas diseñadas bajo la filosofía <strong className="text-[#7A5C4F] font-semibold">Simple y Tranqui</strong> para hacer crecer tu proyecto con calma y estrategia.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a 
            href="#cursos"
            className="w-full sm:w-auto bg-[#4A6741] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md hover:bg-[#3B5334] transition-all transform hover:-translate-y-0.5"
          >
            Explorar Cursos Disponible
          </a>
          <a 
            href="#recurso"
            className="w-full sm:w-auto bg-[#FDF5E6] border border-[#F4E8D1] text-[#7A5C4F] font-bold text-sm px-8 py-4 rounded-full hover:bg-[#F9F6F2] transition-all"
          >
            Descargar Guía Gratuita 📖
          </a>
        </div>
      </section>

      {/* 3. PROPUESTA DE VALOR */}
      <section className="bg-white border-y border-[#F4F1EC] py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] text-center">
            <span className="text-3xl mb-3 block">🌱</span>
            <h3 className="font-bold text-[#4A6741] text-base mb-2">Paso a paso sin rodeos</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Lecciones cortas y directas al grano. Sin tecnicismos innecesarios para que apliques desde el día uno.
            </p>
          </div>
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] text-center">
            <span className="text-3xl mb-3 block">💬</span>
            <h3 className="font-bold text-[#4A6741] text-base mb-2">Comunidad Interactiva</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Espacio integrado en cada módulo para dejar dudas, compartir avances y aprender acompañadas.
            </p>
          </div>
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#F4F1EC] text-center">
            <span className="text-3xl mb-3 block">📄</span>
            <h3 className="font-bold text-[#4A6741] text-base mb-2">Materiales Prácticos</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Plantillas descargables y guías en PDF organizadas para trabajar con orden y calma.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO DE CURSOS */}
      <section id="cursos" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A6741]">Nuestra Propuesta Formativa</h2>
          <p className="text-xs text-gray-500 mt-2">Elige el camino que mejor se adapte al momento actual de tu proyecto</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de Curso 1 */}
          <div className="bg-[#FDF5E6] rounded-3xl p-8 border border-[#F4E8D1] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="bg-[#4A6741] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Curso Estrella 🌟
              </span>
              <h3 className="text-xl font-bold text-[#7A5C4F] mt-4 mb-2">
                Estrategia y Organización Tranquila
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Aprende a estructurar tus metas digitales sin sobrecargarte de trabajo, priorizando tu paz mental.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F4E8D1] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Acceso de por vida</span>
                <span className="text-lg font-bold text-[#4A6741]">$49 USD</span>
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
          <div className="bg-white rounded-3xl p-8 border border-[#F4F1EC] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="bg-[#7A5C4F] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                Taller Práctico ✨
              </span>
              <h3 className="text-xl font-bold text-[#4A6741] mt-4 mb-2">
                Gestión de Clientes y Proyectos
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Implementa un flujo de trabajo claro con herramientas simples para comunicarte mejor con tus clientes.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F4F1EC] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Incluye plantillas</span>
                <span className="text-lg font-bold text-[#4A6741]">$29 USD</span>
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

      {/* 5. LEAD MAGNET (CAPTADOR DE SEMILLAS) */}
      <section id="recurso" className="bg-[#4A6741] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-2xl mb-2 block">🎁</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Comienza hoy con la Guía de Organización Tranqui
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 max-w-xl mx-auto mb-8 font-light">
            Déjanos tu correo y te enviaremos gratuitamente la plantilla PDF de planificación semanal para simplificar tus hábitos.
          </p>

          {suscripto ? (
            <div className="bg-[#FDF5E6] text-[#7A5C4F] p-4 rounded-2xl max-w-md mx-auto font-bold text-xs animate-fade-in">
              ¡Gracias por sumarte! 🌿 Revisa tu correo, te enviamos el recurso gratis.
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
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
                Descargar PDF 📩
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 6. FOOTER Y ACCESO DIRECTO */}
      <footer className="bg-white border-t border-[#F4F1EC] py-10 px-6 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Grow-It / Simple y Tranqui. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <button onClick={alIrADashboard} className="text-[#4A6741] font-semibold hover:underline">
              Panel de Alumnas 🔐
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}