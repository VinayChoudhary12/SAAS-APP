import React, { useState } from "react";
import { Sparkles, Edit } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800)" },
    { length: 1200, text: "Medium (800-1200)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();
  console.log("TOKEN IN COMPONENT:", getToken);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter article topic");
      return;
    }

    try {
      setLoading(true);

      const prompt = `Write an Article about ${input} in ${selectedLength.text}`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        {
          prompt,
          length: selectedLength.length,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* LEFT SIDE */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5"
      >
        {/* Heading */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold">Article Configuration</h1>
        </div>

        {/* Topic Input */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Article Topic</p>
          <input
            type="text"
            placeholder="The future of artificial intelligence..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Length */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Article Length</p>

          <div className="flex flex-wrap gap-2">
            {articleLength.map((item, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedLength(item)}
                className={`px-4 py-1 text-sm rounded-full border transition ${
                  selectedLength.text === item.text
                    ? "bg-blue-100 text-blue-700 border-blue-400"
                    : "border-gray-300 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Edit className="w-5 h-5" />
          )}

          {loading ? "Generating..." : "Generate Article"}
        </button>
      </form>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4">
          <Edit className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold">Generated Article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <Edit className="w-10 h-10" />
              <p className="text-sm">
                Enter topic and click{" "}
                <span className="font-medium text-gray-600">
                  Generate Article
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[500px] overflow-y-auto text-sm text-gray-700 leading-7 whitespace-pre-line pr-2">
           <div className="reset-tw">
            <Markdown>{content}</Markdown> 
           </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;