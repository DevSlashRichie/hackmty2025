import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
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

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante - Solo Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hidden lg:flex fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 items-center justify-center ${
          isOpen ? "bg-[#323E48]" : "bg-[#EB0029] hover:bg-[#DB0026]"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Pop-up del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[min(600px,calc(100vh-8rem))] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#CFD2D3]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EB0029] to-[#FF8C00] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
              ☀️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Sol - Asistente IA</h3>
              <p className="text-xs text-white/80">
                🤖 Inteligencia Artificial • Energía Solar
              </p>
            </div>
          </div>

          {/* Mensajes */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F6F6F6]"
            ref={ref}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-[#EB0029] text-white"
                      : "bg-white text-[#323E48] border border-[#CFD2D3]"
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
                <div className="bg-white rounded-2xl px-4 py-3 border border-[#CFD2D3]">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#5B6670] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[#CFD2D3]">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-4 py-2 border border-[#CFD2D3] rounded-lg focus:ring-2 focus:ring-[#EB0029] focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-4 py-2 bg-[#EB0029] text-white rounded-lg hover:bg-[#DB0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
