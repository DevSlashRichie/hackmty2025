import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useApi } from "@/api/use-api";
import Markdown from "react-markdown";

const PROMPT = `
role: system
name: Sol
content: |
  Eres **Sol**, un asistente virtual de energía solar y sustentabilidad impulsado por inteligencia artificial.

  ## Misión
  Ayudar a los usuarios a entender, optimizar y reducir su consumo energético, promoviendo el uso de energías limpias y soluciones sustentables.

  ## Contexto del entorno
  Operas dentro del ecosistema **Banorte**, como parte de un proyecto que impulsa a **desarrolladoras inmobiliarias** a instalar paneles solares en cada vivienda.
  Banorte ofrece **tasas preferenciales en créditos** a las desarrolladoras que integren soluciones solares, y proporciona a los usuarios finales una **aplicación** donde pueden:
  - Monitorear su consumo y ahorro energético.
  - Consultar su gasto mensual y por electrodoméstico.
  - Recibir consejos personalizados para mejorar la eficiencia energética.
  - Obtener recomendaciones de productos eficientes (por ejemplo, refrigeradores o lavadoras de bajo consumo).
  - Acceder a **créditos verdes Banorte** para adquirir soluciones sustentables.

  ## Capacidades principales
  - Generar y explicar **informes de consumo y ahorro energético**.
  - Estimar **ahorros potenciales** al instalar paneles solares u optimizar hábitos.
  - Ofrecer **consejos prácticos** para reducir el gasto eléctrico.
  - Detectar **electrodomésticos de alto consumo** y sugerir alternativas eficientes.
  - Recomendar **productos y servicios financieros verdes** de Banorte según el perfil del usuario.

  ## Estilo de comunicación
  - Amable, educativo y profesional.
  - Promueve la sostenibilidad con optimismo y claridad.
  - Evita tecnicismos innecesarios; usa lenguaje accesible.
  - Transmite confianza, apoyo y cercanía.
`;

export const Route = createFileRoute("/assistant")({
  beforeLoad: async () => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      throw redirect({ to: "/" });
    }
  },
  component: AssistantComponent,
});

function AssistantComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { api } = useApi();
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "¡Hola! Soy Sol, tu asistente de energía solar impulsado por IA 🤖\n\nPuedes preguntarme sobre tu consumo, ahorro, o pedirme consejos para optimizar tu uso de energía. ¿En qué puedo ayudarte?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const userName = sessionStorage.getItem("user_name") || user?.name;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("company_name");
    sessionStorage.removeItem("company_info");
    sessionStorage.removeItem("energy_profile");
    navigate({ to: "/" });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { role: "user" as const, content: message };
    const currentMessages = [...messages, newMessage];
    setMessages(currentMessages);
    setMessage("");
    setIsLoading(true);

    const history = currentMessages.map((m) => m.content);
    history[0] = PROMPT;

    try {
      const response = await api.energy.chat(history, message).submit();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F6F6F6] flex flex-col overflow-hidden">
      {/* Modal de configuración - Móvil */}
      {showConfig && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowConfig(false)}
          />
          <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#323E48]">
                Configuración
              </h3>
              <button
                onClick={() => setShowConfig(false)}
                className="p-2 hover:bg-[#F6F6F6] rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#323E48]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F6F6F6] rounded-lg p-4">
                <p className="text-xs text-[#5B6670] mb-1">Usuario</p>
                <p className="font-medium text-[#323E48]">{userName}</p>
                <p className="text-sm text-[#5B6670] mt-1">
                  {user?.email || "email@ejemplo.com"}
                </p>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setShowConfig(false);
                }}
                className="w-full px-4 py-3 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal - Chat */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
        {/* Header del Chat */}
        <div className="bg-gradient-to-r from-[#EB0029] to-[#FF8C00] p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
            ☀️
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">Sol - Asistente IA</h3>
            <p className="text-xs text-white/80">
              🤖 Inteligencia Artificial • Energía Solar
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/dashboard-prediction" })}
            className="hidden lg:block px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
          >
            ← Volver
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F6F6F6]" ref={ref}>
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#EB0029] text-white"
                      : "bg-white text-[#323E48] shadow-md border border-[#CFD2D3]"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">
                    <Markdown>{msg.content}</Markdown>
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-[#CFD2D3]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input de mensaje */}
        <div className="bg-white border-t border-[#CFD2D3] p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-3 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none text-sm"
              autoFocus
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="px-5 py-3 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
