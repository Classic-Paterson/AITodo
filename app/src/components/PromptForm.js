import React, { useState } from "react";

const PromptForm = ({ executePrompt, undoLastPrompt }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    executePrompt(prompt);
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-2 mb-2">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="flex-1 border p-2 mr-2 placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-sky-500 focus:ring-1 rounded-lg shadow-md"
        placeholder="Prompt for anything..."
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white rounded-lg shadow-md">
        Execute
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          undoLastPrompt();
        }}
        className="bg-red-500 hover:bg-red-600 px-5 py-2 text-white ml-2 rounded-lg shadow-md"
      >
        Undo
      </button>
    </form>
  );  
};

export default PromptForm;
