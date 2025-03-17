import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../routes/routes";
import { Bot } from "lucide-react";

const AIAssistant = ({ product, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  //   console.log("product is ", product);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const requestBody = {
        prompt,
        ...(product ? { product } : { products }), // Dynamically set context
      };

      const res = await axios.post(`${BASE_URL}/ai/prompt`, requestBody);
      console.log("response is ", res);
      setResponse(res.data.data);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("Failed to fetch AI response.");
    }
    setLoading(false);
    setPrompt("");
  };

  return (
    <div>
      {/* AI Button */}
      <button
        className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot size={24} />
      </button>

      {/* Assistant Chatbox */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 bg-white shadow-xl rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* Response Display */}
          <div className="h-40 overflow-auto p-2 border border-gray-300 rounded bg-gray-100 text-sm whitespace-pre-line">
            {loading ? (
              <span className="text-gray-500">Thinking...</span>
            ) : response ? (
              response.split("\n").map((line, index) => (
                <p key={index} className="mb-1">
                  {line}
                </p>
              ))
            ) : (
              <span className="text-gray-500">
                Ask something about the product!
              </span>
            )}
          </div>

          {/* Input Box */}
          <div className="mt-3 flex">
            <input
              type="text"
              className="flex-grow p-2 border rounded-l text-sm"
              placeholder="Type your question..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700 transition"
              onClick={handleSendPrompt}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
