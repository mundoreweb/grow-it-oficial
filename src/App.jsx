import { supabase } from "./supabaseClient";
import React, { useState, useEffect } from "react";

const MI_CORREO_ADMIN = "alquimia135@gmail.com";

function App() {
  /* ==========================================
     🌿 1. ESTADOS DE AUTENTICACIÓN Y SESIÓN
     ========================================== */
  const [sesion, setSesion] = useState(null);
  const [emailLogueado, setEmailLogueado] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [verPanelStaff, setVerPanelStaff] = useState(false);
  const [cargandoLogin, setCargandoLogin] = useState(false);
  const [nombreTemporal, setNombreTemporal] = useState(""); // Nombre de la alumna
  const [verificandoPerfil, setVerificandoPerfil] = useState(false);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [emailIngresado, setEmailIngresado] = useState("");
  const [notificaciones, setNotificaciones] = useState(0);

  /* ==========================================
     📖 2. ESTADOS DE NAVEGACIÓN (VISTAS)
     ========================================== */
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [moduloActivo, setModuloActivo] = useState(0); // Índice del módulo en pantalla
  const [pestanaStaff, setPestanaStaff] = useState("contenido"); // "contenido", "alumnas", "comunidad"

  /* ==========================================
     🎓 3. ESTADOS DE DATOS (CURSOS Y MODULOS)
     ========================================== */
  const [cursoEnEdicionBase, setCursoEnEdicionBase] = useState(null);
  const [listaDeCursos, setListaDeCursos] = useState([]);
  const [nuevoModulo, setNuevoModulo] = useState({
    id: null,
    curso_id: "",
    numero: "",
    titulo: "",
    info: "",
    video: "",
    clase_grabada: "",
    descargablesDinamicos: [{ nombre: "", archivo: null, urlExistente: null }],
  });
  const [subiendo, setSubiendo] = useState(false); // Loading para subidas de archivos
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [cursosPermitidosAlumna, setCursosPermitidosAlumna] = useState([]);

  /* ==========================================
     👥 4. ESTADOS DE ALUMNAS Y GESTIÓN
     ========================================== */
  const [listaAlumnas, setListaAlumnas] = useState([]);
  const [mostrandoModalAlumna, setMostrandoModalAlumna] = useState(false);
  const [nuevaAlumna, setNuevaAlumna] = useState({
    nombre: "",
    email: "",
    cursos: [],
  });

  /* ==========================================
     💬 5. ESTADOS DE COMUNIDAD (COMENTARIOS)
     ========================================== */
  const [listaComentarios, setListaComentarios] = useState([]); // General para Staff
  const [comentariosLeccion, setComentariosLeccion] = useState([]); // Específicos de la lección abierta
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [textoRespuesta, setTextoRespuesta] = useState(""); // Respuesta del Admin
  const [enviandoId, setEnviandoId] = useState(null); // Para mostrar loading en el botón de respuesta específico

  /* ==========================================
     ✨ 6. VARIABLES DERIVADAS (MEMORIA)
     ========================================== */
  // Estas no son estados, se calculan solas cada vez que el componente cambia
  const moduloActivoData = cursoSeleccionado?.modulos?.[moduloActivo] || null;

  /* ==========================================
     🛠️ 7. EFECTOS INICIALES
     ========================================== */
  useEffect(() => {
    document.title = "Simple y Tranqui - Oficial";
  }, []);

  /* ==========================================
   💬 CARGAR COMENTARIOS (AULA & STAFF)
   ========================================== */
  const cargarComentarios = async (esParaStaff = false) => {
    // 1. Validación temprana: Si no hay curso seleccionado y no es para staff, no hacemos nada
    if (!esParaStaff && !cursoSeleccionado?.id) return;

    try {
      // 2. Construcción de la consulta
      let query = supabase.from("comentarios").select(`
        id,
        contenido,
        respuesta_admin,
        created_at,
        perfil_id,
        curso_id,
        leido_admin,
        perfiles ( nombre_completo )
      `);

      // 3. Filtro inteligente:
      // Si es para la clase, solo mostramos los de ese curso.
      // Si es para Staff, traemos todos (o podrías filtrar por los no leídos primero).
      if (!esParaStaff) {
        query = query.eq("curso_id", cursoSeleccionado.id);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      // 4. Formateo de datos (Mapeo)
      const formateados = data.map((com) => ({
        ...com,
        nombreAlumna: com.perfiles?.nombre_completo || "Alumna anónima",
        fecha: new Date(com.created_at).toLocaleDateString(), // Pre-formateamos la fecha aquí
      }));

      // 5. Actualización de estados
      if (esParaStaff) {
        setListaComentarios(formateados);
      } else {
        setComentariosLeccion(formateados);
      }
    } catch (error) {
      console.error("Error en cargarComentarios:", error.message);
      // Aquí podrías poner un aviso silencioso o dejarlo solo en consola
    }
  };

  /* ==========================================
   🔄 8. EFECTOS (LÓGICA AUTOMÁTICA)
   ========================================== */

  // --- A. Verificar Rol de Administradora ---
  useEffect(() => {
    const verificarAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email === MI_CORREO_ADMIN) {
        setEsAdmin(true);
        setEmailLogueado(user.email); // Aprovechamos para guardar el correo
      }
    };
    verificarAdmin();
  }, []);

  // --- B. Cargar Comentarios del Aula ---
  // Se activa cada vez que la alumna cambia de curso
  useEffect(() => {
    if (cursoSeleccionado?.id) {
      cargarComentarios(false); // false = modo aula
    }
  }, [cursoSeleccionado?.id]);

  // --- C. Cargar Gestión de Comunidad ---
  // Se activa solo cuando entras a la pestaña de Staff
  useEffect(() => {
    if (esAdmin && pestanaStaff === "comunidad") {
      cargarComentarios(true); // true = modo gestión staff
    }
  }, [pestanaStaff, esAdmin]);

  /* ==========================================
   💬 ENVIAR RESPUESTA (ADMIN)
   ========================================== */
  const enviarRespuestaAdmin = async (comentarioId, texto) => {
    // 1. Validación de seguridad
    if (!texto.trim()) return;

    setEnviandoId(comentarioId); // Inicia el estado de carga visual

    try {
      // 2. Actualización en Supabase
      const { error } = await supabase
        .from("comentarios")
        .update({
          respuesta_admin: texto,
          leido_admin: true,
        })
        .eq("id", comentarioId);

      if (error) throw error;

      // 3. Pequeña pausa estética (opcional, para que el botón no parpadee)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 4. ACTUALIZACIÓN LOCAL (Imprescindible para limpiar el código)
      // Esto hace que la respuesta aparezca en pantalla al instante
      setListaComentarios((prev) =>
        prev.map((com) =>
          com.id === comentarioId
            ? { ...com, respuesta_admin: texto, leido_admin: true }
            : com,
        ),
      );

      // 5. Feedback visual (puedes quitar el alert si prefieres algo más sutil)
      console.log("Respuesta guardada con éxito 🌿");
    } catch (err) {
      console.error("Error en enviarRespuestaAdmin:", err.message);
      alert("No se pudo enviar la respuesta. Revisa tu conexión.");
    } finally {
      setEnviandoId(null); // Detiene el estado de carga
    }
  };

  const guardarSoloCurso = async () => {
    setSubiendo(true);
    console.log("1. Inicio - Archivo seleccionado:", nuevaImagenCursoFile);
    console.log("2. Modo Edición:", esEdicion, "ID:", cursoEnEdicionBase?.id);

    try {
      let urlImagenFinal = esEdicion ? cursoEnEdicionBase.fotoActual : null;

      if (nuevaImagenCursoFile) {
        console.log("3. Entrando a la subida de imagen...");
        const fileName = `${Date.now()}_portada.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("imagenes-cursos")
          .upload(fileName, nuevaImagenCursoFile);

        if (uploadError) {
          console.error("❌ Error en Storage:", uploadError);
          throw uploadError;
        }

        console.log("4. Subida exitosa:", uploadData);

        const { data } = supabase.storage
          .from("imagenes-cursos")
          .getPublicUrl(fileName);

        if (data?.publicUrl) {
          urlImagenFinal = data.publicUrl;
          console.log("🚀 5. URL generada y lista:", urlImagenFinal);
        }
      }

      console.log("6. Enviando a la DB - URL Final:", urlImagenFinal);

      if (esEdicion) {
        const { data: updateData, error: updateError } = await supabase
          .from("cursos")
          .update({
            nombre: nuevoModulo.nombreNuevoCurso.trim(),
            foto: urlImagenFinal,
          })
          .eq("id", cursoEnEdicionBase.id)
          .select(); // Agregamos select para ver qué devuelve

        if (updateError) throw updateError;
        console.log("7. Resultado Update DB:", updateData);
        alert("✅ Curso actualizado correctamente.");
      } else {
        const { error: insertError } = await supabase.from("cursos").insert([
          {
            nombre: nuevoModulo.nombreNuevoCurso.trim(),
            foto: urlImagenFinal,
          },
        ]);

        if (insertError) throw insertError;
        alert("✨ Nuevo curso creado con éxito.");
      }

      await cargarTodo(esAdmin);
      setNuevaImagenCursoFile(null);
    } catch (e) {
      console.error("🔴 ERROR COMPLETO:", e);
      alert("Error: " + e.message);
    } finally {
      setSubiendo(false);
    }
  };

  // Función para añadir otra fila de descargable en la UI
  const agregarFilaDescargable = () => {
    const ultimaFila =
      nuevoModulo.descargablesDinamicos[
        nuevoModulo.descargablesDinamicos.length - 1
      ];
    if (ultimaFila && !ultimaFila.nombre && !ultimaFila.archivo) {
      alert("Por favor, rellena la fila actual antes de agregar otra 🌿");
      return;
    }
    setNuevoModulo({
      ...nuevoModulo,
      descargablesDinamicos: [
        ...nuevoModulo.descargablesDinamicos,
        { nombre: "", archivo: null, urlExistente: null },
      ],
    });
  };

  const eliminarFilaDescargable = (index) => {
    const nuevasFilas = nuevoModulo.descargablesDinamicos.filter(
      (_, i) => i !== index,
    );

    setNuevoModulo({
      ...nuevoModulo,
      descargablesDinamicos: nuevasFilas,
    });
  };

  // 1. Definimos la función de cambio de sesión (fuera del useEffect)
  /* ==========================================
   🔐 MANEJAR CAMBIO DE SESIÓN
   ========================================== */
  const manejarCambioSesion = async (session) => {
    // 1. Si no hay sesión, reset total
    if (!session) {
      setSesion(null);
      setEsAdmin(false);
      setSesionIniciada(false);
      setVerificandoPerfil(false);
      return;
    }

    const email = session.user.email.trim().toLowerCase();

    // 2. 🛡️ FILTRO ANTI-REFRESCO (Evita el "Preparando tu espacio" al cambiar de pestaña)
    // Si ya tenemos una sesión cargada con este mismo email, no hacemos nada.
    if (sesionIniciada && sesion?.user?.email?.toLowerCase() === email) {
      console.log("♻️ Sesión estable, ignorando evento repetido.");
      return;
    }

    console.log("🚀 Iniciando validación para:", email);

    // Solo mostramos pantalla de carga si es la PRIMERA VEZ que entramos
    if (!sesionIniciada) {
      setVerificandoPerfil(true);
    }

    try {
      // 👑 CASO ADMINISTRADORA (Prioridad absoluta)
      if (email === MI_CORREO_ADMIN.toLowerCase().trim()) {
        console.log("👑 Acceso confirmado: Administradora");
        setSesion(session);
        setSesionIniciada(true);
        setEsAdmin(true);
        setNombreTemporal("Administradora 🌿");
        await cargarTodo(true, []);
        return; // Salida rápida para la jefa
      }

      // 👩‍🎓 CASO ALUMNA
      console.log("👩‍🎓 Buscando alumna en DB...");

      // Ponemos un tiempo límite a la consulta para que no se quede "colgada"
      const consultaDB = supabase
        .from("alumnas")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      const tiempoLimite = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 8000),
      );

      const { data: alumna, error: errorAlumna } = await Promise.race([
        consultaDB,
        tiempoLimite,
      ]);

      if (errorAlumna) throw errorAlumna;

      if (alumna) {
        console.log("✅ Alumna encontrada:", alumna.nombre);
        setSesion(session);
        setSesionIniciada(true);
        setNombreTemporal(alumna.nombre);
        const susCursos = alumna.cursos_permitidos || [];
        setCursosPermitidosAlumna(susCursos);
        await cargarTodo(false, susCursos);
      } else {
        // 🚪 SI NO ES ALUMNA, LA EXPULSAMOS
        console.warn("⚠️ Acceso denegado: No está en la lista de alumnas.");
        alert("Tu cuenta no tiene cursos activos o el acceso ha sido revocado.");
        await supabase.auth.signOut(); // Esto cierra la sesión de Supabase Auth
        setSesion(null);
        setSesionIniciada(false);
      }
    } catch (err) {
      console.error("🔥 Error en validación:", err.message);
    } finally {
      // IMPORTANTE: Pase lo que pase, apagamos la pantalla de carga al final
      console.log("🏁 Finalizando estado de carga");
      setVerificandoPerfil(false);
    }
  };

  /* ==========================================
   🔄 INICIALIZACIÓN DE LA APP (VERSIÓN FINAL)
   ========================================== */
  useEffect(() => {
    // 1. Escuchamos los cambios de sesión de forma directa
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Evento Auth:", event);

      // Solo llamamos a la lógica si hay una sesión real o si el usuario cerró sesión
      if (session || event === "SIGNED_OUT") {
        manejarCambioSesion(session);
      }
    });

    // 2. Limpieza: Solo se ejecuta cuando el usuario CIERRA la pestaña o la App
    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log("🧹 Conexión de seguridad liberada");
      }
    };
  }, []); // <--- IMPORTANTE: El [] asegura que esto se monte UNA sola vez.

  // 2. Función auxiliar para el modal (puedes ponerla fuera o dentro del useEffect)

  const obtenerComentarios = async () => {
    const moduloId = moduloActivoData?.id;

    // 1. Construimos la petición limpia
    let query = supabase
      .from("comentarios")
      .select("*, perfiles (nombre_completo)");

    // 2. Aplicamos lógica de visualización
    if (moduloId) {
      // Vista ALUMNA: Orden cronológico para seguir el hilo
      query = query
        .eq("modulo_id", moduloId)
        .order("created_at", { ascending: true });
    } else {
      // Vista STAFF: Todo lo nuevo primero para responder
      query = query.order("created_at", { ascending: false });
    }

    // 3. EJECUCIÓN REAL (Asegúrate de que sea 'await query')
    const { data, error } = await query;

    if (error) {
      console.error("❌ Error Supabase:", error.message);
    } else {
      // ACTUALIZACIÓN DE ESTADOS
      setComentariosLeccion(data || []);
      if (typeof setComentarios === "function") {
        setComentarios(data || []);
      }

      // Este log te dirá la verdad en la consola
      console.log(
        `✅ Sincronización Exitosa. Mensajes recibidos: ${data?.length}`,
      );
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, [moduloActivoData, sesionIniciada]);

  // 1. Definimos la función (El Motor)
  const manejarActualizacionManual = async () => {
    // 1. Usamos el ID del módulo actual
    const moduloId = moduloActivoData?.id;

    // 2. Limpieza visual instantánea usando los nombres correctos
    setComentariosLeccion([]);
    setListaComentarios([]);

    try {
      // 3. Construcción de la consulta
      let query = supabase
        .from("comentarios")
        .select("*, perfiles (nombre_completo)");

      if (moduloId) {
        // Si estamos en una lección específica
        query = query
          .eq("modulo_id", moduloId)
          .order("created_at", { ascending: true });
      } else {
        // Modo Gestión Staff: Todo lo nuevo primero
        query = query.order("created_at", { ascending: false });
      }

      // 4. Ejecución de la consulta
      // Nota: Supabase ya maneja la frescura de datos,
      // pero si quieres asegurar, basta con el await directo.
      const { data: mensajes, error: err } = await query;

      if (err) throw err;

      // 5. Sincronización de estados con los nombres nuevos
      const datosFormateados = mensajes || [];

      setComentariosLeccion(datosFormateados); // Para la vista de alumna
      setListaComentarios(datosFormateados); // Para tu Panel de Staff

      console.log("✅ Datos globales actualizados con éxito.");
    } catch (error) {
      console.error("❌ Error en actualización manual:", error.message);
    }
  };

  // 2. El Hook (La mecha que enciende el motor al cargar)
  useEffect(() => {
    manejarActualizacionManual();
  }, [moduloActivoData, sesionIniciada]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setEnviandoComentario(true);

    try {
      // 1. Obtener el usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada");

      // 2. OBTENER LOS IDs DIRECTAMENTE DEL MÓDULO ACTIVO

      const cursoIdFinal = moduloActivoData?.curso_id;
      const moduloIdFinal = moduloActivoData?.id;

      console.log(
        "🚀 Intentando guardar - Curso:",
        cursoIdFinal,
        "Módulo:",
        moduloIdFinal,
      );

      if (!cursoIdFinal || !moduloIdFinal) {
        throw new Error(
          "Datos de lección incompletos. Por favor, selecciona la lección de nuevo en el menú.",
        );
      }

      // 3. INSERCIÓN
      const { error: insertError } = await supabase.from("comentarios").insert([
        {
          perfil_id: user.id,
          curso_id: cursoIdFinal, // ✅ Ahora vendrá directamente del objeto activo
          modulo_id: moduloIdFinal, // ✅ Ya vimos que este funciona
          contenido: nuevoComentario.trim(),
          leido_admin: false,
        },
      ]);

      if (insertError) throw insertError;

      // 4. ÉXITO Y RECARGA
      setNuevoComentario("");

      // Avisamos al sistema que refresque la lista para que aparezca la respuesta de la guía
      if (typeof setActualizarComentarios === "function") {
        setActualizarComentarios((prev) => prev + 1);
      }

      alert("¡Mensaje enviado con éxito! 🌸");
    } catch (err) {
      console.error("DETALLE:", err.message);
      alert(err.message);
    } finally {
      setEnviandoComentario(false);
    }
  };

  const borrarComentario = async (idComentario) => {
    if (
      !confirm(
        "¿Estás segura de eliminarlo de la base de datos? Esta acción es definitiva. 🌿",
      )
    )
      return;

    try {
      // 1. Intentar borrar en Supabase
      const { error, status } = await supabase
        .from("comentarios")
        .delete()
        .eq("id", idComentario);
      if (error) {
        console.error("Error de Supabase:", error.message);
        alert("Supabase dice: " + error.message);
        return;
      }

      // 2. Si el status es 204 o 200, es que se borró correctamente
      console.log("Borrado exitoso. Status:", status);

      // 3. RECIÉN AHÍ lo quitamos de la vista
      setListaComentarios((prev) => prev.filter((c) => c.id !== idComentario));
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };
  const subirArchivoASupabase = async (archivo) => {
    if (!archivo) return null;

    try {
      // 1. Limpieza profunda del nombre
      const nombreLimpio = archivo.name
        .trim()
        .toLowerCase()
        .normalize("NFD") // Descompone caracteres con tildes
        .replace(/[\u0300-\u036f]/g, "") // Elimina las tildes físicamente
        .replace(/[^a-z0-9.]/g, "_"); // Todo lo que no sea letra/número a guion bajo

      // 2. Añadimos el Timestamp para que sea único
      const nombreArchivo = `${Date.now()}_${nombreLimpio}`;

      console.log("⬆️ Subiendo archivo:", nombreArchivo);

      // 3. Subida con upsert (por si acaso)
      const { data, error: uploadError } = await supabase.storage
        .from("material-descargable")
        .upload(nombreArchivo, archivo, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. Generación de la URL pública
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("material-descargable")
        .getPublicUrl(nombreArchivo);

      console.log("✅ URL generada:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("❌ Error en subirArchivoASupabase:", error.message);
      alert("No se pudo subir el archivo. Revisa el tamaño o el formato. 🌿");
      return null;
    }
  };

  const cargarTodo = async (esAdminActual = false, permitidos = []) => {
    try {
      // 1. CARGAR ALUMNAS (Solo si es Admin)
      if (esAdminActual) {
        const { data: dataAlumnas, error: errorAlumnas } = await supabase
          .from("alumnas")
          .select("*");

        if (!errorAlumnas && dataAlumnas) {
          setListaAlumnas(
            dataAlumnas.map((al) => ({
              id: al.id,
              nombre: al.nombre || "Sin nombre", // 👈 ¡Agregamos el nombre aquí!
              email: al.email,
              cursosPermitidos: al.cursos_permitidos || [],
            })),
          );
        }
      }

      // 2. CARGAR CURSOS Y MÓDULOS
      // Traemos todo el árbol de contenido de una sola vez
      const { data: dataCursos, error: errorCursos } = await supabase
        .from("cursos")
        .select(`*, modulos (*)`);

      if (errorCursos) throw errorCursos;

      if (dataCursos) {
        // 1. Mapeamos todos los cursos (como ya lo hacías)
        const todosLosCursos = dataCursos.map((c) => ({
          id: c.id,
          nombre: c.nombre, // 👈 Asegúrate que en la tabla 'cursos' la columna se llame 'nombre'
          foto: c.foto,
          modulos: (c.modulos || []).sort(
            (a, b) => Number(a.numero) - Number(b.numero),
          ),
        }));

        // 2. FILTRADO LÓGICO
        if (esAdminActual) {
          // 👑 ERES ADMIN: No hay filtros.

          setListaDeCursos(todosLosCursos);
        } else {
          // Si es alumna (Rosalba), solo filtramos los que coincidan con su lista de permitidos
          const cursosFiltrados = todosLosCursos.filter((curso) =>
            permitidos.includes(curso.nombre),
          );

          console.log(
            "Cursos encontrados para la alumna:",
            cursosFiltrados.length,
          );
          setListaDeCursos(cursosFiltrados);
        }
        if (cursoSeleccionado) {
          const cursoFresco = todosLosCursos.find(
            (c) => c.id === cursoSeleccionado.id,
          );
          if (cursoFresco) {
            setCursoSeleccionado(cursoFresco);
            console.log("📺 Vista del curso actual sincronizada.");
          }
        }
        console.log("✅ Datos globales actualizados con éxito.");
      }
    } catch (err) {
      console.error("❌ Error en cargarTodo:", err.message);
    }
  };

  const salirAlAula = () => {
    // 1. En lugar de false, mantenemos la sesión pero quitamos los modos de edición
    setEditandoIndex(null);
    setCursoEnEdicionBase(null);

    // 2. Limpiamos el formulario para que no haya datos "colgando"
    limpiarFormulario();

    // 3. (Opcional) Si tienes un estado para mostrar/ocultar el panel de control
    // setMostrandoPanelStaff(false);

    console.log("Saliendo del modo edición... ¡Bienvenida al aula! 🌿");
  };

  // --- 3. LÓGICA DE SESIÓN ---
  const manejarLogin = async (e) => {
    if (e) e.preventDefault();

    // 🟢 Cambiamos emailIngresado por emailLogueado
    if (!emailLogueado) {
      alert("Por favor, introduce tu correo. ✨");
      return;
    }

    try {
      setVerificandoPerfil(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: emailLogueado.trim().toLowerCase(), // 🟢 Aquí también
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      alert("¡Enlace enviado! Revisa tu bandeja de entrada. 🌿");
    } catch (err) {
      alert("No pudimos enviar el acceso: " + err.message);
    } finally {
      setVerificandoPerfil(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      // 1. Limpiamos estados de la UI (Apagamos el acceso)
      setSesionIniciada(false);
      setEsAdmin(false);
      setCursoSeleccionado(null);

      // 2. Limpiamos datos personales que puedan haber quedado en memoria
      setNombreTemporal(""); // <-- Importante: borramos el nombre de la alumna
      setCursosPermitidosAlumna([]); // <-- Limpiamos su lista de acceso
      setEmailInput(""); // <-- Limpiamos el campo del formulario de login

      // 3. Cerramos la sesión real en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 4. Limpiamos rastro manual en el navegador
      localStorage.removeItem("email_herbolario");

      // 5. Opcional: Recargar la página para asegurar un estado limpio al 100%
      // window.location.reload();
    } catch (err) {
      console.error("Error al cerrar sesión:", err.message);
    }
  };

  // --- 4. LÓGICA DE STAFF ---
  const registrarAlumna = async () => {
    // 1. Validación básica (Email y Nombre ahora son obligatorios)
    if (!nuevaAlumna.email.trim()) return alert("Escribe un email");
    if (!nuevaAlumna.nombre?.trim())
      return alert("Escribe el nombre de la alumna");

    try {
      // 2. Insertar en la tabla 'alumnas' (Ahora con la columna nombre)
      const { error } = await supabase.from("alumnas").insert([
        {
          nombre: nuevaAlumna.nombre.trim(), // <--- Ahora lo enviamos a la DB
          email: nuevaAlumna.email.trim().toLowerCase(),
          cursos_permitidos: nuevaAlumna.cursos,
        },
      ]);

      if (error) throw error;

      // 3. Éxito: Limpiamos y cerramos
      alert(`Acceso concedido a ${nuevaAlumna.nombre} 🌿`);

      // Limpia el formulario incluyendo el nombre
      setNuevaAlumna({ email: "", nombre: "", cursos: [] });
      setMostrandoModalAlumna(false);

      await cargarTodo(true);
    } catch (err) {
      console.error("Error registrando alumna:", err.message);
      alert("Hubo un error: " + err.message);
    }
  };

  const eliminarAlumna = async (idAlumna) => {
    if (window.confirm(`¿Revocar acceso a esta alumna?`)) {
      const { error } = await supabase
        .from("alumnas")
        .delete()
        .eq("id", idAlumna);

      if (error) {
        alert("No se pudo revocar el acceso: " + error.message);
      } else {
        alert("Acceso revocado ✨");
        // Pasamos 'true' para que recargue la lista de staff correctamente
        await cargarTodo(true);
      }
    }
  };

  const eliminarModulo = async (id, titulo) => {
    const confirmar = window.confirm(
      `⚠️ ¿Estás segura de que deseas eliminar permanentemente el módulo: "${titulo}"?`,
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase.from("modulos").delete().eq("id", id);

      if (error) throw error;

      alert("✅ Módulo eliminado con éxito.");

      // Si el módulo borrado es el que está en pantalla, limpiamos
      if (nuevoModulo.id === id) {
        limpiarFormulario();
      }

      // Refrescamos la lista pasando 'true' (o la variable esAdmin)
      await cargarTodo(true);
    } catch (e) {
      console.error("Error en eliminación:", e);
      alert("Hubo un error al eliminar: " + e.message);
    }
  };

  const guardarTodoElCurso = async () => {
    const esEdicion = cursoEnEdicionBase !== null;

    // Validación de nombre
    if (!nuevoModulo.nombreNuevoCurso?.trim()) {
      return alert("El nombre del curso no puede estar vacío 🌿");
    }

    try {
      setSubiendo(true);

      // 1. Manejo de la Imagen
      let urlImagenFinal = esEdicion
        ? cursoEnEdicionBase.fotoActual
        : previewImagenCurso;

      if (nuevaImagenCursoFile) {
        const fileName = `${Date.now()}_portada.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes-cursos")
          .upload(fileName, nuevaImagenCursoFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("imagenes-cursos").getPublicUrl(fileName);

        urlImagenFinal = publicUrl;
      }

      // 2. Decisión: ¿Actualizamos o Insertamos?
      if (esEdicion) {
        // --- MODO EDICIÓN ---
        const { error: updateError } = await supabase
          .from("cursos")
          .update({
            nombre: nuevoModulo.nombreNuevoCurso.trim(),
            foto: urlImagenFinal,
          })
          .eq("id", cursoEnEdicionBase.id);

        if (updateError) throw updateError;
        alert("✅ Curso actualizado correctamente.");
      } else {
        // --- MODO CREACIÓN ---
        const { error: insertError } = await supabase.from("cursos").insert([
          {
            nombre: nuevoModulo.nombreNuevoCurso.trim(),
            foto: urlImagenFinal,
          },
        ]);

        if (insertError) throw insertError;
        alert("✨ Nuevo curso creado con éxito.");
      }

      // 3. Limpieza y Refresco
      limpiarFormulario(); // Tu función centralizada
      if (esEdicion) setCursoEnEdicionBase(null); // Reset del modo edición
      await cargarTodo(true);
    } catch (e) {
      console.error("Error en la operación:", e);
      alert("Error: " + e.message);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarCursoCompleto = async (idCurso, nombre) => {
    const confirmar = window.confirm(
      `⚠️ CUIDADO: Vas a eliminar el curso "${nombre}" y TODOS sus módulos de forma permanente. ¿Estás totalmente segura?`,
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("cursos")
        .delete()
        .eq("id", idCurso);

      if (error) throw error;

      alert("✅ Curso y lecciones eliminados correctamente.");

      // 1. Refrescamos los datos (esAdmin es true porque estamos en staff)
      await cargarTodo(true);

      // 2. Si el curso eliminado era el que estaba en el formulario, lo limpiamos TODO
      if (nuevoModulo.curso_id === idCurso) {
        limpiarFormulario(); // Usamos la función que ya limpia imágenes y descargables
      }
    } catch (e) {
      console.error("Error al eliminar curso:", e);
      alert("Hubo un error al eliminar: " + e.message);
    }
  };

  const prepararEdicionCursoBase = (idCurso, nombreActual, fotoActual) => {
    // 1. Limpiamos cualquier edición de lección activa
    setEditandoIndex(null);

    // 2. Activamos el modo edición de curso
    setCursoEnEdicionBase({
      id: idCurso,
      nombre: nombreActual,
      foto: fotoActual,
    });

    // 3. Cargamos los datos del CURSO y limpiamos los de LECCIÓN
    setNuevoModulo({
      ...nuevoModulo,
      nombreNuevoCurso: nombreActual,
      curso_id: idCurso,
      // Limpiamos estos para que el formulario no confunda:
      titulo: "",
      video: "",
      info: "",
      numero: "",
    });

    setPreviewImagenCurso(fotoActual);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const extraerId = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") return null;
    const link = url.trim();
    if (!link.includes("http") && !link.includes("/")) return link;
    const ytRegExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = link.match(ytRegExp);
    if (ytMatch && ytMatch[1]) return ytMatch[1];
    return link;
  };

  const publicarTodoElContenido = async () => {
    // 1. Evitar doble clic
    if (subiendo) return;
    setSubiendo(true);

    console.log("🚀 INICIANDO PROCESO DE GUARDADO...");

    try {
      // 2. CAPTURA DE DATOS (Lo primero, antes de que nada falle)
      const infoParaEnviar = String(nuevoModulo.info || "").trim();
      const tituloParaEnviar = String(nuevoModulo.titulo || "").trim();
      const cursoIdValido =
        nuevoModulo.curso_id === "NUEVO" ? null : nuevoModulo.curso_id;

      if (!cursoIdValido) {
        throw new Error("Por favor, selecciona un curso.");
      }

      // 3. SUBIDA DE ARCHIVOS (Con protección total)
      const URL_BASE =
        "https://fgwiwgahflspovgbgpwp.supabase.co/storage/v1/object/public/material-descargable/";
      let listaDescargablesFinal = (nuevoModulo.descargablesDinamicos || [])
        .filter((d) => d.urlExistente)
        .map((d) => ({ label: d.nombre, url: d.urlExistente }));

      const archivosParaSubir = (
        nuevoModulo.descargablesDinamicos || []
      ).filter((item) => item.archivo instanceof File && !item.urlExistente);

      for (const item of archivosParaSubir) {
        try {
          const nombreFinal = `${Date.now()}_${item.archivo.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { error: upError } = await supabase.storage
            .from("material-descargable")
            .upload(nombreFinal, item.archivo);
          if (!upError) {
            listaDescargablesFinal.push({
              label: item.nombre || item.archivo.name,
              url: URL_BASE + nombreFinal,
            });
          }
        } catch (fileErr) {
          console.warn("Archivo no subido, pero continuamos:", fileErr.message);
        }
      }

      // 4. CONSTRUCCIÓN DEL OBJETO (Aquí es donde antes fallaba)
      const moduloParaDB = {
        curso_id: cursoIdValido,
        numero: parseInt(nuevoModulo.numero) || 0,
        titulo: tituloParaEnviar,
        info: infoParaEnviar, // <--- Aquí va el texto largo
        video: extraerId(nuevoModulo.video) || "",
        clase_grabada: extraerId(nuevoModulo.clase_grabada) || "",
        descargables: listaDescargablesFinal,
      };

      console.log("📦 DATOS LISTOS PARA SUPABASE:", {
        letras: moduloParaDB.info.length,
        primeras_palabras: moduloParaDB.info.substring(0, 30),
      });

      // 5. ENVÍO A SUPABASE
      const { data, error: dbError } = await (
        nuevoModulo.id
          ? supabase
              .from("modulos")
              .update(moduloParaDB)
              .eq("id", nuevoModulo.id)
          : supabase.from("modulos").insert([moduloParaDB])
      ).select();

      if (dbError) throw dbError;

      // 6. FINALIZACIÓN EXITOSA
      alert("✅ ÉXITO TOTAL: Módulo guardado con descripción larga.");

      // --- BLOQUE DE LIMPIEZA Y SALIDA ---

      // 1. Limpiamos el formulario (Llamamos a tu función de reset)
      if (typeof limpiarFormulario === "function") {
        limpiarFormulario();
      }

      // 2. Cerramos el panel (Solo usamos setEditando si existe)
      // Nota: Eliminé setNuevoModulo(false) para no corromper tus datos
      if (typeof setEditando === "function") {
        setEditando(false);
      }

      // 3. Recargamos la lista (Importante para ver el cambio de inmediato)
      if (typeof cargarTodo === "function") {
        await cargarTodo(esAdmin);
      }

      // 4. Feedback visual: Subir al inicio de la página
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ ERROR CRÍTICO EN GUARDADO:", err.message);
      alert("No se pudo guardar: " + err.message);
    } finally {
      // Liberamos el botón para que se pueda volver a usar
      setSubiendo(false);
    }
  };

  const limpiarFormulario = () => {
  // 1. Limpieza de índices y estados de edición
  // Usamos el chequeo de "typeof" para que si la función no existe, no rompa el código
  if (typeof setEditandoIndex === "function") setEditandoIndex(null);
  if (typeof setCursoEnEdicionBase === "function") setCursoEnEdicionBase(null);
  
  // 🛡️ Aquí estaban los errores: agregamos protección
  if (typeof setNuevaImagenCursoFile === "function") setNuevaImagenCursoFile(null);
  if (typeof setPreviewImagenCurso === "function") setPreviewImagenCurso(null);
  if (typeof setVideoPrincipalId === "function") setVideoPrincipalId("");
  if (typeof setClaseGrabadaId === "function") setClaseGrabadaId("");

  // 2. Reset del objeto principal (Esto es lo que limpia los textos que ves)
  setNuevoModulo({
    id: null,
    curso_id: "",
    cursoDestino: "",
    numero: "",
    titulo: "",
    info: "",
    video: "",
    clase_grabada: "",
    descargablesDinamicos: [{ nombre: "", archivo: null }], // Vuelve a un solo campo vacío
    nombreNuevoCurso: "",
    imagenCurso: null,
  });

  console.log("🧹 Formulario reseteado con éxito.");
};
  const getYoutubeId = (url) => {
    // 1. Si no hay URL, devolvemos "EMPTY" para que Supabase lo guarde felizmente
    if (!url || typeof url !== "string") return "EMPTY";

    // 2. Intentamos extraer el ID de 11 caracteres
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    // 3. Si la URL no es de YouTube pero el usuario escribió algo (ej. un ID directo),
    // devolvemos lo que escribió, de lo contrario "EMPTY".
    return url.trim() !== "" ? url.trim() : "EMPTY";
  };

  const prepararVideoParaVista = (videoData) => {
    if (!videoData || videoData === "EMPTY") return null;

    // 1. Si es un ID puro de 11 caracteres
    if (videoData.length === 11) {
      return `https://www.youtube.com/embed/${videoData}`;
    }

    // 2. NUEVO: Si es un link de YouTube LIVE (como el de tu error)
    if (videoData.includes("youtube.com/live/")) {
      const liveId = videoData.split("live/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${liveId}`;
    }

    // 3. Si es un link estándar, extraemos el ID con Regex
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoData.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    // 4. Si nada funciona, devolvemos el dato original por si ya fuera un embed
    return videoData;
  };

  const prepararEdicion = (modulo, nombreCurso) => {
    setCursoEnEdicionBase(null);

    setNuevoModulo({
      id: modulo.id,
      cursoDestino: nombreCurso,
      curso_id: modulo.curso_id,
      numero: modulo.numero ? modulo.numero.toString() : "",
      titulo: modulo.titulo,
      info: modulo.info || "",
      video: modulo.video || "",
      clase_grabada: modulo.clase_grabada || "",
      descargablesDinamicos:
        modulo.descargables && Array.isArray(modulo.descargables)
          ? modulo.descargables.map((d) => ({
              nombre: d.label,
              archivo: null,
              urlExistente: d.url,
            }))
          : [{ nombre: "", archivo: null }],

      // Limpiamos rastro de archivos que no pertenecen a esta lección
      nombreNuevoCurso: "",
      imagenCurso: null,
    });

    setEditandoIndex(modulo.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publicarLeccion = async () => {
    try {
      let urlDescargable = nuevoModulo.descargables;

      // 1. Subida de archivo (Mantenemos tu lógica)
      if (nuevoModulo.archivoDescargable) {
        const urlSubida = await subirArchivoASupabase(
          nuevoModulo.archivoDescargable,
        );
        if (urlSubida) urlDescargable = urlSubida;
      }

      // 2. BUSQUEDA SEGURA DEL CURSO
      // En lugar de usar el índice [cursoDestino], usamos el ID directamente
      const idCursoDestino = nuevoModulo.curso_id;

      if (!idCursoDestino) {
        throw new Error("Por favor, selecciona un curso para esta lección. 🌿");
      }

      // 3. INSERCIÓN
      const { error } = await supabase.from("modulos").insert([
        {
          curso_id: idCursoDestino || nuevoModulo.curso_id, // Doble verificación del ID del curso
          numero: String(nuevoModulo.numero || "").trim(), // Evita errores si el número es null
          titulo: String(nuevoModulo.titulo || "").trim(),
          info: String(nuevoModulo.info || "").trim(),
          video: videoPrincipalId || null,
          clase_grabada: claseGrabadaId || null,
          descargables: listaDescargablesFinal || [], // Si no hay archivos, enviamos una lista vacía
        },
      ]);

      if (error) throw error;

      alert("¡Lección y material publicados con éxito! 🚀");

      // 4. LIMPIEZA (Llamamos a tu función de limpiar para no repetir código)
      limpiarFormulario();
      await cargarTodo(esAdmin); // Refrescamos la lista visual
    } catch (error) {
      console.error("Error en publicarLeccion:", error);
      alert("Error: " + error.message);
    }
  };

  // C. VISTA PRINCIPAL (STAFF o DASHBOARD DE ALUMNA)
  if (verificandoPerfil) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F1EC]">
        <div className="text-center">
          <span className="text-4xl animate-pulse block mb-4">🌿</span>
          <p className="text-[#4A6741] font-serif italic">
            Preparando tu espacio...
          </p>
        </div>
      </div>
    );
  }

  // 2. SEGUNDO OBSTÁCULO: No hay sesión (Login)
  if (!sesion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F1EC]">
        <div className="text-center p-12 bg-white rounded-[4rem] shadow-sm border border-[#E5E0D8] max-w-md w-full">
          <h1 className="text-5xl italic text-[#4A6741] mb-8 font-serif">
            Simple y Tranqui
          </h1>

          {/* Cambiamos el texto para que sea inclusivo (Admin o Alumna) */}
          <p className="text-[#4A6741]/60 mb-6 px-4">
            Introduce tu correo para recibir tu acceso:
          </p>

          <input
            type="email"
            placeholder="tu-email@gmail.com"
            value={emailLogueado || ""}
            onChange={(e) => setEmailLogueado(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && manejarLogin()}
            className="w-full p-5 bg-[#F4F1EC] rounded-[2rem] border-none text-center mb-6 outline-none focus:ring-2 focus:ring-[#4A6741]/20 transition-all"
          />

          <button
            onClick={manejarLogin}
            disabled={verificandoPerfil} // Evita múltiples clics mientras envía el mail
            className={`w-full bg-[#4A6741] text-white py-5 rounded-[2rem] font-bold uppercase tracking-widest transition-all shadow-md ${
              verificandoPerfil
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#3d5535]"
            }`}
          >
            {verificandoPerfil ? "Enviando enlace..." : "RECIBIR ACCESO 🌿"}
          </button>

          <p className="mt-6 text-xs text-[#4A6741]/40 px-6">
            Te enviaremos un enlace mágico a tu bandeja de entrada. No necesitas
            contraseña.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#FDF5E6]">
      {/* SI es admin Y verPanelStaff está activado -> Mostramos Panel de Staff 
         SINO -> Mostramos el Aula (Dashboard)
      */}
      {esAdmin && verPanelStaff ? (
        /* ==========================================
           🛠️ VISTA: PANEL DE STAFF (Admin)
           ========================================== */
        <div className="p-8 animate-fadeIn w-full">
          {/* HEADER DEL PANEL */}
          <div className="w-full mb-10 flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#E5E0D8]">
            <div>
              <h1 className="text-3xl font-light italic text-[#4A6741]">
                Panel de Staff
              </h1>
              <div className="flex gap-6 mt-2">
                <button
                  onClick={() => setPestanaStaff("contenido")}
                  className={`text-[10px] uppercase font-bold transition-all ${pestanaStaff === "contenido" ? "text-[#d1ab71] border-b-2 border-[#d1ab71]" : "opacity-40 hover:opacity-100"}`}
                >
                  Contenido
                </button>
                <button
                  onClick={() => setPestanaStaff("alumnas")}
                  className={`text-[10px] uppercase font-bold transition-all ${pestanaStaff === "alumnas" ? "text-[#d1ab71] border-b-2 border-[#d1ab71]" : "opacity-40 hover:opacity-100"}`}
                >
                  Alumnas
                </button>
                <button
                  onClick={() => setPestanaStaff("comunidad")}
                  className={`text-[10px] uppercase font-bold transition-all flex items-center gap-2 ${pestanaStaff === "comunidad" ? "text-[#d1ab71] border-b-2 border-[#d1ab71]" : "opacity-40 hover:opacity-100"}`}
                >
                  Comunidad
                  {notificaciones > 0 && (
                    <span className="bg-[#d1ab71] text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">
                      {notificaciones}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <button
                  onClick={() => setPestanaStaff("comunidad")}
                  className="p-3 bg-[#F9F6F2] rounded-full hover:bg-[#F4F1EC] transition-all relative"
                >
                  <span className="text-lg">🔔</span>
                  {notificaciones > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#D1AB71] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {notificaciones}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => setVerPanelStaff(false)} // 👈 Ahora sí funcionará porque la variable existe
                className="px-6 py-2 bg-[#4A6741] text-white rounded-full flex items-center gap-2 hover:bg-[#3d5635] transition-all font-bold text-[10px] uppercase tracking-widest"
              >
                × SALIR AL AULA
              </button>
            </div>
          </div>

          {/* CUERPO DEL PANEL ADMIN */}
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-[#E5E0D8] min-h-[60vh]">
            {/* 1. CASO: CONTENIDO */}
            {pestanaStaff === "contenido" && (
              <div className="flex flex-col lg:flex-row gap-10 w-full animate-fadeIn">
                <div className="lg:w-[400px] flex-shrink-0 space-y-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4A6741] ml-4">
                    Cursos Activos
                  </h3>

                  {/* CAMBIO: Ahora mapeamos directamente la lista de cursos */}
                  {listaDeCursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F4F1EC]"
                    >
                      <div className="flex justify-between items-center mb-4 border-b border-[#F4F1EC] pb-2">
                        {/* CAMBIO: Usamos curso.nombre */}
                        <p className="notranslate text-[10px] font-extrabold text-[#d1ab71] uppercase tracking-widest">
                          {curso.nombre}
                        </p>

                        <div className="flex gap-4">
                          <button
                            onClick={() =>
                              prepararEdicionCursoBase(
                                curso.id,
                                curso.nombre,
                                curso.foto,
                              )
                            }
                            className="hover:rotate-45 transition-transform duration-300 text-lg"
                            title="Editar curso"
                          >
                            ⚙️
                          </button>
                          <button
                            onClick={() =>
                              eliminarCursoCompleto(curso.id, curso.nombre)
                            }
                            className="text-red-300 hover:text-red-600 hover:scale-125 transition-all text-lg"
                            title="Eliminar curso"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {/* CAMBIO: Usamos curso.modulos */}
                        {curso.modulos?.map((mod) => (
                          <div
                            key={mod.id}
                            className="flex justify-between items-center p-2 rounded-xl hover:bg-[#F9F6F2] group"
                          >
                            <span className="text-[11px] text-gray-600 truncate max-w-[200px]">
                              {mod.numero}. {mod.titulo}
                            </span>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* CAMBIO: Pasamos el nombre del curso para la edición */}
                              <button
                                onClick={() =>
                                  prepararEdicion(mod, curso.nombre)
                                }
                                className="text-[9px] uppercase font-bold text-[#4A6741]"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  eliminarModulo(mod.id, mod.titulo)
                                }
                                className="text-[9px] uppercase font-bold text-red-300"
                              >
                                Borrar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* === COLUMNA DERECHA: FORMULARIO DE GESTIÓN === */}
                <div className="flex-1 bg-white p-12 rounded-[3.5rem] shadow-sm border border-[#F4F1EC] space-y-10 animate-fadeIn overflow-y-auto max-h-[85vh]">
                  {/* CABECERA DINÁMICA */}
                  <div className="border-b border-[#F4F1EC] pb-6">
                    <h2 className="text-4xl italic text-[#4A6741]">
                      {editandoIndex !== null
                        ? "Editando Lección ✏️"
                        : cursoEnEdicionBase
                          ? "Ajustes del Curso ⚙️"
                          : "Creación de Contenidos 🌿"}
                    </h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                      {nuevoModulo.curso_id === "NUEVO"
                        ? "Nuevo Curso"
                        : "Gestión Administrativa"}
                    </p>
                  </div>

                  {/* 1. SELECCIÓN DE DESTINO */}
                  {!editandoIndex && !cursoEnEdicionBase && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#4A6741] ml-2">
                        1. Seleccionar Destino
                      </label>
                      <select
                        className="w-full p-4 bg-[#F9F6F2] rounded-2xl text-xs outline-none border border-transparent focus:border-[#4A6741]/20 transition-all"
                        value={nuevoModulo.curso_id}
                        onChange={(e) =>
                          setNuevoModulo({
                            ...nuevoModulo,
                            curso_id: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          Selecciona un curso existente...
                        </option>
                        <option value="NUEVO">
                          + Crear un curso totalmente nuevo
                        </option>
                        {Array.isArray(listaDeCursos) &&
                          listaDeCursos.map((curso) => (
                            <option
                              key={curso.id}
                              value={curso.id}
                              className="notranslate"
                            >
                              {curso.nombre}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* 2. CAMPOS DEL CURSO (Independiente) */}
                  {(nuevoModulo.curso_id === "NUEVO" || cursoEnEdicionBase) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-[#FDF5E6]/50 rounded-3xl border border-[#F4F1EC] animate-fadeIn">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-2">
                          Nombre del Curso
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Herbolaria para el Hogar"
                          className="w-full p-4 bg-white rounded-2xl text-xs outline-none border border-[#7A5C4F]/10"
                          value={nuevoModulo.nombreNuevoCurso}
                          onChange={(e) =>
                            setNuevoModulo({
                              ...nuevoModulo,
                              nombreNuevoCurso: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-2">
                          Imagen de Portada
                        </label>
                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-[#7A5C4F]/10 h-[52px]">
                          <input
                            type="file"
                            accept="image/*"
                            className="text-[9px] cursor-pointer w-full"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // 1. Esto es lo que necesita tu función 'guardarSoloCurso'
                                setNuevaImagenCursoFile(file);

                                // 2. Esto es para que tú veas la foto en el formulario (opcional)
                                setPreviewImagenCurso(
                                  URL.createObjectURL(file),
                                );

                                console.log("Archivo capturado:", file.name); // Para que verifiques en consola
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* BOTÓN DORADO: Solo para el curso */}
                      <button
                        onClick={guardarTodoElCurso}
                        disabled={subiendo}
                        className={`md:col-span-2 py-4 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md
                        ${subiendo ? "bg-gray-300" : "bg-[#d1ab71] hover:bg-[#c49e63] active:scale-95"}`}
                      >
                        {subiendo
                          ? "Procesando Curso..."
                          : cursoEnEdicionBase
                            ? "Guardar Cambios del Curso 🌿"
                            : "✨ Registrar Datos del Curso"}
                      </button>
                    </div>
                  )}

                  {/* 3. CAMPOS DE LECCIÓN (Se bloquean si no hay curso seleccionado) */}
                  {!cursoEnEdicionBase && (
                    <div
                      className={`space-y-6 animate-fadeIn transition-all duration-500 ${!nuevoModulo.curso_id || nuevoModulo.curso_id === "NUEVO" ? "opacity-30 pointer-events-none" : "opacity-100"}`}
                    >
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="titulo"
                          className="text-[10px] font-bold uppercase tracking-widest text-[#4A6741] ml-2"
                        >
                          2. Detalles de la Lección
                        </label>
                        {(!nuevoModulo.curso_id ||
                          nuevoModulo.curso_id === "NUEVO") && (
                          <span className="text-[9px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-bold">
                            ⚠️ DEBES CREAR EL CURSO PRIMERO
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <input
                          id="numero"
                          name="numero"
                          type="number"
                          placeholder="N°"
                          className="col-span-1 p-4 bg-[#F9F6F2] rounded-2xl text-xs outline-none focus:bg-white border focus:border-[#4A6741]/20 transition-all"
                          value={nuevoModulo.numero}
                          onChange={(e) =>
                            setNuevoModulo({
                              ...nuevoModulo,
                              numero: e.target.value,
                            })
                          }
                        />
                        <input
                          id="titulo"
                          name="titulo"
                          type="text"
                          placeholder="Título de la clase..."
                          className="col-span-3 p-4 bg-[#F9F6F2] rounded-2xl text-xs outline-none focus:bg-white border focus:border-[#4A6741]/20 transition-all"
                          value={nuevoModulo.titulo}
                          onChange={(e) =>
                            setNuevoModulo({
                              ...nuevoModulo,
                              titulo: e.target.value,
                            })
                          }
                        />
                      </div>

                      <textarea
                        id="info"
                        name="info"
                        placeholder="Descripción completa de la lección... Escribe aquí todo el contenido largo 🌿"
                        /* Ajustamos la altura mínima, el tamaño de letra y permitimos redimensionar */
                        className="w-full p-6 bg-[#F9F6F2] rounded-[2rem] text-sm outline-none min-h-[250px] focus:bg-white border focus:border-[#4A6741]/20 transition-all"
                        value={nuevoModulo.info || ""}
                        /* Usamos la versión de callback para garantizar que el estado previo sea correcto */
                        onChange={(e) =>
                          setNuevoModulo((prev) => ({
                            ...prev,
                            info: e.target.value,
                          }))
                        }
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          id="video"
                          name="video"
                          type="text"
                          placeholder="ID Video (YouTube/Vimeo)"
                          className="p-4 bg-[#F9F6F2] rounded-2xl text-xs outline-none focus:bg-white border focus:border-[#4A6741]/20"
                          value={nuevoModulo.video || ""}
                          onChange={(e) =>
                            setNuevoModulo((prev) => ({
                              ...prev,
                              video: e.target.value,
                            }))
                          }
                        />
                        <input
                          id="clase_grabada"
                          name="clase_grabada"
                          type="text"
                          placeholder="ID Clase Grabada (Opcional)"
                          className="p-4 bg-[#F9F6F2] rounded-2xl text-xs outline-none focus:bg-white border focus:border-[#4A6741]/20"
                          value={nuevoModulo.clase_grabada || ""}
                          onChange={(e) =>
                            setNuevoModulo((prev) => ({
                              ...prev,
                              clase_grabada: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* MATERIAL DESCARGABLE */}
                      <div className="space-y-4 pt-4 border-t border-[#F4F1EC]">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#4A6741] ml-2">
                            Material de Apoyo
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setNuevoModulo({
                                ...nuevoModulo,
                                descargablesDinamicos: [
                                  ...(nuevoModulo.descargablesDinamicos || []),
                                  { nombre: "", archivo: null },
                                ],
                              })
                            }
                            className="text-[9px] font-bold text-[#d1ab71] hover:underline"
                          >
                            + ✨ AÑADIR ARCHIVO
                          </button>
                        </div>

                        {(nuevoModulo.descargablesDinamicos || []).map(
                          (item, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-2 p-4 bg-[#F9F6F2]/50 rounded-2xl border border-[#F4F1EC] animate-fadeIn"
                            >
                              <div className="flex gap-4 items-center">
                                <input
                                  name={`nombre_archivo_${index}`}
                                  type="text"
                                  placeholder="Nombre del archivo..."
                                  className="flex-1 p-2 bg-white rounded-xl text-[10px] outline-none border border-transparent focus:border-[#4A6741]/10"
                                  value={item.nombre}
                                  onChange={(e) => {
                                    const nuevos = [
                                      ...nuevoModulo.descargablesDinamicos,
                                    ];
                                    nuevos[index].nombre = e.target.value;
                                    setNuevoModulo({
                                      ...nuevoModulo,
                                      descargablesDinamicos: nuevos,
                                    });
                                  }}
                                />

                                {/* Indicador de que el archivo YA existe en Supabase */}
                                {item.urlExistente && (
                                  <span className="text-[8px] bg-[#4A6741] text-white px-2 py-1 rounded-md font-bold">
                                    ☁️ EN NUBE
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nuevos =
                                      nuevoModulo.descargablesDinamicos.filter(
                                        (_, i) => i !== index,
                                      );
                                    setNuevoModulo({
                                      ...nuevoModulo,
                                      descargablesDinamicos: nuevos,
                                    });
                                  }}
                                  className="text-[#D9534F] hover:scale-110 transition-transform px-2"
                                >
                                  🗑️
                                </button>
                              </div>

                              <input
                                name={`archivo_${index}`}
                                type="file"
                                className="text-[9px] file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-[#4A6741]/10 file:text-[#4A6741]"
                                onChange={(e) => {
                                  const nuevos = [
                                    ...nuevoModulo.descargablesDinamicos,
                                  ];
                                  nuevos[index].archivo = e.target.files[0];
                                  // Si sube uno nuevo, quitamos la marca de "existente" para que el código de guardado sepa que debe subirlo
                                  nuevos[index].urlExistente = null;
                                  setNuevoModulo({
                                    ...nuevoModulo,
                                    descargablesDinamicos: nuevos,
                                  });
                                }}
                              />
                            </div>
                          ),
                        )}
                      </div>

                      {/* BOTÓN DE ACCIÓN */}
                      <button
                        type="button"
                        onClick={publicarTodoElContenido}
                        disabled={
                          subiendo ||
                          !nuevoModulo.curso_id ||
                          nuevoModulo.curso_id === "NUEVO"
                        }
                        className="w-full py-6 bg-[#4A6741] text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-[#3d5535] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        {subiendo ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando...
                          </span>
                        ) : nuevoModulo.id ? (
                          "Actualizar Lección ✨"
                        ) : (
                          "🚀 Publicar Lección ✨"
                        )}
                      </button>
                    </div>
                  )}

                  {/* BOTÓN CANCELAR */}
                  {(editandoIndex !== null || cursoEnEdicionBase) && (
                    <button
                      type="button"
                      onClick={limpiarFormulario}
                      className="w-full mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                      Cancelar y volver
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2. CASO: ALUMNAS */}
            {pestanaStaff === "alumnas" && (
              <div className="animate-fadeIn space-y-8">
                <div className="flex justify-between items-center bg-[#F9F6F2] p-8 rounded-[2.5rem] border border-[#E5E0D8]">
                  <h2 className="text-3xl italic text-[#4A6741]">
                    Base de Alumnas
                  </h2>
                  <button
                    onClick={() => {
                      console.log("¡Clic detectado!");
                      setMostrandoModalAlumna(true);
                    }}
                    className="relative z-50 bg-[#4A6741] text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                  >
                    ✨ Registrar Nueva Alumna
                  </button>
                </div>
                <div className="bg-white rounded-[3rem] border border-[#F4F1EC] overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#FDF5E6] border-b border-[#F4F1EC]">
                        <th className="p-6 text-[10px] uppercase text-[#4A6741]">
                          Email
                        </th>
                        <th className="p-6 text-right text-[10px] uppercase text-[#4A6741]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4F1EC]">
                      {/* Agregamos una validación para que no explote si no hay alumnas */}
                      {Array.isArray(listaAlumnas) &&
                      listaAlumnas.length > 0 ? (
                        listaAlumnas.map((alumna) => (
                          <tr key={alumna.id} className="hover:bg-[#F9F6F2]/50">
                            <td className="p-6 text-sm text-[#7A5C4F]">
                              {alumna.email}
                            </td>
                            <td className="p-6 text-right">
                              <button
                                onClick={() =>
                                  eliminarAlumna(alumna.id, alumna.email)
                                }
                                className="text-[10px] font-bold uppercase text-red-300 hover:text-red-500 transition-colors"
                              >
                                Quitar Acceso
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="p-10 text-center text-sm text-[#7A5C4F]/50 italic"
                          >
                            No hay alumnas registradas todavía 🌿
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. CASO: COMUNIDAD */}
            {pestanaStaff === "comunidad" && (
              <div className="animate-fadeIn space-y-6 max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl italic text-[#4A6741]">
                    Gestión de Comunidad
                  </h2>
                </div>

                {listaComentarios.length === 0 ? (
                  <div className="text-center p-20 bg-white/30 rounded-[3rem] border border-dashed border-[#4A6741]/20">
                    <p className="text-[#7A5C4F] italic opacity-40">
                      No hay preguntas aún. ¡Todo al día! 🌸
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {listaComentarios.map((com) => (
                      <div
                        key={com.id}
                        className="bg-white p-8 rounded-[2.5rem] border border-[#F4F1EC] shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] font-bold uppercase text-[#d1ab71] tracking-widest block mb-1">
                              Alumna
                            </span>
                            <p className="text-lg font-medium text-[#4A6741]">
                              {com.nombreAlumna}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] text-[#7A5C4F]/40">
                              {new Date(com.created_at).toLocaleDateString()}
                            </span>

                            {/* 🗑️ BOTÓN ELIMINAR: Aparecerá al pasar el mouse por la tarjeta */}
                            {esAdmin && (
                              <button
                                onClick={() => borrarComentario(com.id)}
                                className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100 transition-colors shadow-sm"
                              >
                                Eliminar Comentario ×
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[#7A5C4F] mb-6 italic text-lg">
                          "{com.contenido}"
                        </p>

                        {/* Caja de Respuesta */}
                        <div className="bg-[#F9F6F2] p-6 rounded-2xl border border-[#E5E0D8] focus-within:border-[#4A6741]/30 transition-all">
                          <p className="text-[9px] font-bold uppercase text-[#4A6741] mb-3 tracking-widest">
                            Tu Respuesta como Admin:
                          </p>

                          <textarea
                            id={`texto-res-${com.id}`} // ID único para recuperar el texto
                            className="w-full bg-transparent outline-none text-sm text-[#7A5C4F] min-h-[80px] resize-none placeholder:text-[#7A5C4F]/30"
                            placeholder="Escribe tu guía aquí..."
                            defaultValue={com.respuesta_admin}
                          />

                          <div className="flex justify-end mt-4">
                            <button
                              disabled={enviandoId === com.id}
                              onClick={() => {
                                // 1. Obtenemos el valor directamente del textarea por su ID
                                const textarea = document.getElementById(
                                  `texto-res-${com.id}`,
                                );
                                const textoParaEnviar = textarea
                                  ? textarea.value
                                  : "";

                                // 2. Llamamos a la función con el valor real
                                enviarRespuestaAdmin(com.id, textoParaEnviar);

                                // 3. (Opcional) Limpiar el textarea después de enviar
                                if (textarea) textarea.value = "";
                              }}
                              className={`
                                 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all
                                 ${
                                   enviandoId === com.id
                                     ? "bg-gray-400 cursor-not-allowed scale-95 text-white"
                                     : "bg-[#4A6741] hover:bg-[#3d5535] active:scale-95 text-white"
                                 }
                               `}
                            >
                              {enviandoId === com.id ? (
                                <span className="flex items-center gap-2">
                                  <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                                  Guardando... ✨
                                </span>
                              ) : (
                                "Enviar Respuesta 🌿"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==========================================
           📝 VISTA: ALUMNA (No es Admin)
           ========================================== */
        <div className="vista-alumna relative">
          {/* ⚙️ BOTÓN DE ACCESO RÁPIDO PARA ADMIN */}
          {esAdmin && (
            <div className="absolute top-10 right-10 z-50">
              <button
                onClick={() => setVerPanelStaff(true)}
                className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-[9px] uppercase tracking-tighter font-bold text-[#4A6741] hover:bg-white transition-all shadow-sm opacity-60 hover:opacity-100"
              >
                ⚙️ Entrar a Gestión
              </button>
            </div>
          )}
          {cursoSeleccionado ? (
            /* --- A. AULA DE CLASES --- */
            (() => {
              const c = cursoSeleccionado;
              const m = c?.modulos[moduloActivo];
              const youtubeId = getYoutubeId(m?.video);

              return (
                <div className="p-8 text-[#7A5C4F] animate-fadeIn">
                  <button
                    onClick={() => setCursoSeleccionado(null)}
                    className="mb-8 font-bold text-[#4A6741] uppercase text-[10px]"
                  >
                    ← Volver a mis cursos
                  </button>
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-1 bg-white p-6 rounded-[2.5rem] border border-[#E5E0D8] h-fit">
                      <h3 className="text-[10px] font-bold mb-6 text-[#4A6741] uppercase border-b border-[#F4F1EC] pb-2 tracking-widest">
                        Contenido
                      </h3>
                      <div className="space-y-2">
                        {c?.modulos.map((mod, i) => (
                          <button
                            key={mod.id || i} // Usamos el ID de la base de datos si existe
                            onClick={() => {
                              setModuloActivo(i); // Para que el botón se vea verde (diseño)
                              setModuloSeleccionado(mod); // <--- ESTO activa los comentarios (datos)
                            }}
                            className={`w-full p-5 rounded-2xl text-left transition-all ${
                              moduloActivo === i
                                ? "bg-[#4A6741] text-white shadow-lg scale-[1.02]"
                                : "bg-[#FDF5E6] text-[#7A5C4F] hover:bg-[#f3ead8]"
                            }`}
                          >
                            <span
                              className={`block text-[9px] uppercase font-bold tracking-[0.2em] mb-1 ${
                                moduloActivo === i
                                  ? "text-white/70"
                                  : "text-[#d1ab71]"
                              }`}
                            >
                              Módulo {String(mod.numero).padStart(2, "0")}
                            </span>
                            <span className="font-bold text-xs">
                              {mod.titulo}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-3 space-y-8">
                      {/* SECCIÓN PRINCIPAL DE CONTENIDO */}
                      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-[#E5E0D8] shadow-sm">
                        {/* 1. ENCABEZADO: TÍTULO Y DESCRIPCIÓN */}
                        <div className="mb-10">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[#d1ab71] font-bold tracking-[0.2em] text-[10px] uppercase bg-[#FDF5E6] px-3 py-1 rounded-full">
                              Módulo{" "}
                              {String(moduloActivoData?.numero || 0).padStart(
                                2,
                                "0",
                              )}
                            </span>
                          </div>
                          <h2 className="text-4xl italic text-[#4A6741] font-serif mb-4">
                            {moduloActivoData?.titulo}
                          </h2>
                          <div className="border-l-2 border-[#E5E0D8] pl-6 py-2">
                            <p className="text-[#d1ab71] font-bold uppercase text-[9px] tracking-widest mb-2">
                              Descripción del Módulo
                            </p>
                            <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed italic">
                              {moduloActivoData?.info}
                            </p>
                          </div>
                        </div>

                        {/* 2. ZONA DE VIDEOS (Grilla de 2 columnas) */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                          {/* VIDEO DEL MÓDULO */}
                          <div className="space-y-4">
                            <p className="text-[#4A6741] font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 ml-2">
                              <span>📖</span> Video de la Lección
                            </p>
                            <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] shadow-lg bg-[#f0ede9] border-4 border-white">
                              {moduloActivoData?.video &&
                              moduloActivoData.video !== "EMPTY" ? (
                                <iframe
                                  src={prepararVideoParaVista(
                                    moduloActivoData.video,
                                  )}
                                  className="absolute top-0 left-0 w-full h-full border-none"
                                  allowFullScreen
                                  title="Video del Módulo"
                                ></iframe>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-4xl">🌿</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* VIDEO DE CLASE GRABADA */}
                          {moduloActivoData?.clase_grabada &&
                            moduloActivoData.clase_grabada !== "EMPTY" && (
                              <div className="space-y-4">
                                <p className="text-[#d1ab71] font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 ml-2">
                                  <span>🎬</span> Clase Grabada en Vivo
                                </p>
                                <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-lg bg-black border-4 border-white">
                                  <iframe
                                    src={prepararVideoParaVista(
                                      moduloActivoData.clase_grabada,
                                    )}
                                    className="absolute top-0 left-0 w-full h-full border-none"
                                    allowFullScreen
                                    title="Clase Grabada"
                                  ></iframe>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* 3. MATERIAL DE APOYO */}
                        {moduloActivoData?.descargables &&
                          moduloActivoData.descargables.length > 0 && (
                            <div className="mt-12 pt-10 border-t border-[#F4F1EC]">
                              <h4 className="text-[#4A6741] font-bold uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                                Material de Apoyo 🌿
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {moduloActivoData?.descargables?.map(
                                  (item, idx) => {
                                    const urlFinal = item.url?.startsWith(
                                      "http",
                                    )
                                      ? item.url
                                      : `https://fgwiwgahflspovgbgpwp.supabase.co/storage/v1/object/public/descargables/${item.url}`;

                                    return (
                                      <a
                                        key={idx}
                                        href={urlFinal}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-between items-center bg-[#FDF5E6] hover:bg-[#F9F6F2] p-5 rounded-2xl border border-[#F4F1EC] transition-all group"
                                      >
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-bold uppercase text-[#7A5C4F] tracking-wider">
                                            {item.label ||
                                              "Guía PDF del Módulo"}
                                          </span>
                                          <span className="text-[9px] text-gray-400 italic mt-1">
                                            Documento adjunto
                                          </span>
                                        </div>
                                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                          <span className="text-sm">⬇️</span>
                                        </div>
                                      </a>
                                    );
                                  },
                                )}
                              </div>
                              <ComunidadInteractiva
                                moduloId={moduloActivoData?.id}
                                listaComentarios={comentariosLeccion} // Asegúrate que este sea el nombre de tu estado
                                nuevoComentario={nuevoComentario}
                                setNuevoComentario={setNuevoComentario}
                                enviarComentario={enviarComentario}
                                enviandoComentario={enviandoComentario}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            /* --- B. DASHBOARD MIS CURSOS --- */
            <div className="dashboard-alumna p-10 max-w-6xl mx-auto animate-fadeIn min-h-screen flex flex-col">
              {/* HEADER CON BOTÓN DE CERRAR SESIÓN AJUSTADO */}
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
                <div>
                  <h1 className="text-4xl font-light italic text-[#4A6741]">
                    {nombreTemporal || "Mis Cursos"}
                  </h1>
                  <p className="text-[10px] opacity-40 uppercase tracking-widest">
                    {emailLogueado}
                  </p>
                </div>

                <button
                  onClick={() => supabase.auth.signOut()}
                  className="px-6 py-2 border border-red-100 text-[10px] font-bold uppercase text-red-300 hover:bg-red-50 hover:text-red-500 transition-all rounded-full tracking-widest shadow-sm"
                >
                  Cerrar Sesión ×
                </button>
              </header>

              {/* CONTENEDOR PARA CENTRAR LOS CURSOS */}
              <div className="flex-grow flex flex-col justify-start items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full justify-items-center">
                  {/* 💡 AQUÍ EMPIEZA LA MEJORA: Validamos si hay cursos en la lista */}
                  {listaDeCursos.length > 0 ? (
                    listaDeCursos.map((curso) => (
                      <div
                        key={curso.id}
                        onClick={() => {
                          setCursoSeleccionado(curso);
                          setModuloActivo(0);
                        }}
                        /* Agregamos 'relative z-10' para que las sombras de hojas no tapen el clic */
                        className="cursor-pointer group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#F4F1EC] max-w-sm w-full relative z-10"
                      >
                        <div className="h-64 overflow-hidden bg-[#F9F6F2] flex items-center justify-center">
                          {curso.foto ? (
                            <img
                              src={curso.foto}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              alt={curso.nombre}
                            />
                          ) : (
                            <span className="text-[#4A6741] italic opacity-20 text-4xl">
                              {curso.nombre.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="p-8 text-center">
                          <h3 className="text-2xl italic text-[#4A6741] mb-2">
                            {curso.nombre}
                          </h3>
                          {/* Si es admin, podrías poner un puntito verde sutil */}
                          <p className="text-[10px] uppercase font-bold text-[#d1ab71] tracking-widest">
                            Entrar →
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* 🌸 MENSAJE PARA CUANDO NO HAY CURSOS (O ESTÁN CARGANDO) */
                    <div className="col-span-full text-center py-20 animate-fadeIn">
                      <p className="text-[#4A6741] italic opacity-60 text-lg">
                        Aún no tienes cursos inscritos. 🌸
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          👥 MODAL PARA REGISTRAR ALUMNA (Admin)
          ========================================== */}
      {mostrandoModalAlumna && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border border-[#E5E0D8]">
            <h2 className="text-3xl italic text-[#4A6741] mb-6 font-serif">
              Nueva Alumna
            </h2>

            {/* --- CAMPO NOMBRE (NUEVO) --- */}
            <p className="text-[10px] font-bold uppercase text-[#d1ab71] mb-2 ml-2 tracking-widest">
              Nombre Completo:
            </p>
            <input
              type="text"
              placeholder="Nombre de la alumna"
              className="w-full p-4 bg-[#F4F1EC] rounded-2xl mb-4 outline-none border border-transparent focus:border-[#4A6741]/20 transition-all text-[#7A5C4F]"
              value={nuevaAlumna.nombre || ""} // Asegúrate de que el estado inicial de nuevaAlumna tenga 'nombre: ""'
              onChange={(e) =>
                setNuevaAlumna({ ...nuevaAlumna, nombre: e.target.value })
              }
            />

            {/* --- CAMPO EMAIL (TUYO) --- */}
            <p className="text-[10px] font-bold uppercase text-[#d1ab71] mb-2 ml-2 tracking-widest">
              Correo Electrónico:
            </p>
            <input
              placeholder="Email de la alumna"
              className="w-full p-4 bg-[#F4F1EC] rounded-2xl mb-6 outline-none border border-transparent focus:border-[#4A6741]/20 transition-all text-[#7A5C4F]"
              value={nuevaAlumna.email}
              onChange={(e) =>
                setNuevaAlumna({ ...nuevaAlumna, email: e.target.value })
              }
            />

            {/* --- SECCIÓN DE CURSOS (TUYO) --- */}
            <p className="text-[10px] font-bold uppercase text-[#d1ab71] mb-3 ml-2 tracking-widest">
              Asignar Cursos:
            </p>
            <div className="max-h-48 overflow-y-auto mb-8 space-y-2 pr-2 custom-scrollbar">
              {Array.isArray(listaDeCursos) && listaDeCursos.length > 0 ? (
                listaDeCursos.map((curso) => (
                  <label
                    key={curso.id}
                    className="flex items-center gap-3 p-4 bg-[#F9F6F2] rounded-2xl cursor-pointer hover:bg-[#F4F1EC] transition-colors border border-transparent has-[:checked]:border-[#4A6741]/20"
                  >
                    <input
                      type="checkbox"
                      checked={nuevaAlumna.cursos.includes(curso.nombre)}
                      onChange={(e) => {
                        const actualizados = e.target.checked
                          ? [...nuevaAlumna.cursos, curso.nombre]
                          : nuevaAlumna.cursos.filter(
                              (c) => c !== curso.nombre,
                            );
                        setNuevaAlumna({
                          ...nuevaAlumna,
                          cursos: actualizados,
                        });
                      }}
                      className="accent-[#4A6741]"
                    />
                    <span className="text-[#7A5C4F] text-sm">
                      {curso.nombre}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-[#7A5C4F]/50 text-xs text-center py-4 italic">
                  No hay cursos disponibles
                </p>
              )}
            </div>

            <div className="flex gap-4 border-t border-[#F4F1EC] pt-6">
              <button
                onClick={() => setMostrandoModalAlumna(false)}
                className="flex-1 text-[#7A5C4F]/50 font-bold uppercase text-[10px] hover:text-[#7A5C4F] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={registrarAlumna}
                disabled={!nuevaAlumna.email || nuevaAlumna.cursos.length === 0}
                className="flex-1 bg-[#4A6741] text-white py-4 rounded-2xl font-bold uppercase text-[10px] shadow-md hover:bg-[#3d5535] transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ComunidadInteractiva = ({
  moduloId,
  listaComentarios,
  nuevoComentario,
  setNuevoComentario,
  enviarComentario,
  enviandoComentario,
}) => {
  return (
    <div className="bg-[#F9F6F2] p-8 md:p-12 rounded-[3.5rem] border border-[#E5E0D8] mt-8">
      {/* 1. Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white p-3 rounded-2xl shadow-sm">💬</div>
        <div>
          <h4 className="text-xl font-bold text-[#4A6741] font-serif italic">
            Comunidad Interactiva
          </h4>
          <p className="text-[#d1ab71] font-bold uppercase text-[9px] tracking-widest">
            Comparte tus dudas o avances
          </p>
        </div>
      </div>

      {/* 2. Input de texto y Botón */}
      <div className="flex gap-4 mb-8">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Escribe tu duda aquí..."
          className="w-full p-4 bg-white rounded-2xl text-sm outline-none border-none shadow-sm resize-none h-24"
        />
        <button
          onClick={enviarComentario}
          disabled={enviandoComentario || !nuevoComentario.trim()}
          className="bg-[#4A6741] text-white px-6 py-3 rounded-2xl hover:opacity-90 disabled:opacity-50 font-bold transition-all h-full"
        >
          {enviandoComentario ? "..." : "Enviar"}
        </button>
      </div>

      {/* 3. Visor de Comentarios y Respuestas */}
      <div className="mt-10 space-y-8">
        {/* Usamos listaComentarios que es la prop que recibe el componente */}
        {!listaComentarios || listaComentarios.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#7A5C4F] italic opacity-50 text-sm">
              Aún no hay dudas en esta lección. ¡Sé la primera en preguntar! 🌸
            </p>
          </div>
        ) : (
          listaComentarios.map((com) => (
            <div
              key={com.id}
              className="bg-white/50 rounded-3xl p-6 shadow-sm animate-fade-in border border-[#E5E0D8]/30"
            >
              {/* Bloque del mensaje de la Alumna */}
              <div className="flex items-start gap-4">
                <div className="bg-[#4A6741] text-white w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm">
                  {com.alumnas?.nombre?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-black text-[#4A6741] uppercase tracking-widest">
                      {com.alumnas?.nombre || com.nombre_completo || "Alumna"}
                    </span>
                    <span className="text-[10px] text-[#7A5C4F] opacity-60">
                      {new Date(com.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#7A5C4F] leading-relaxed">
                    {com.contenido}
                  </p>

                  {/* Bloque de Respuesta de la Administradora (Aquí aparece tu mensaje de Supabase) */}
                  {com.respuesta_admin && (
                    <div className="mt-5 p-5 bg-[#F4F1EC] rounded-2xl border-l-4 border-[#4A6741] shadow-inner relative overflow-hidden">
                      <div className="absolute top-2 right-3 opacity-10 text-2xl">
                        🌿
                      </div>

                      <span className="text-[10px] font-bold uppercase text-[#4A6741] tracking-widest block mb-2">
                        Respuesta de la Guía
                      </span>
                      <p className="text-sm text-[#7A5C4F] italic leading-relaxed">
                        "{com.respuesta_admin}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
