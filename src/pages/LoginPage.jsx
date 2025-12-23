import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import { useGame } from "../context/GameContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setAnaDialogue } = useGame();

  const [formData, setFormData] = useState({ teamId: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Verifying Credentials");

  useEffect(() => {
    setAnaDialogue("Authentication required. Please enter Team ID.");
  }, [setAnaDialogue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamId || !formData.password) return;

    setIsProcessing(true);
    setProcessMessage("Verifying Credentials...");

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/team/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setProcessMessage(data.message || "Invalid credentials");
        setTimeout(() => setIsProcessing(false), 2000);
        return;
      }
      const accessToken = data.data.accessToken;

      setProcessMessage("Accessing Genova Realm...");
      setTimeout(() => {
        login(formData.teamId, accessToken);
        navigate("/dashboard");
        setIsProcessing(false);
      }, 1200);

    } catch (err) {
      setProcessMessage("System Error");
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <TerminalCard title="SYSTEM ACCESS">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            placeholder="TEAM ID"
            value={formData.teamId}
            onChange={e => setFormData({ ...formData, teamId: e.target.value })}
            className="w-full p-3 bg-black border"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={e =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-3 bg-black border"
          />
          <NeonButton type="submit" className="w-full">
            LOGIN
          </NeonButton>
        </form>
      </TerminalCard>

      {isProcessing && (
        <Motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-neon-cyan font-mono">{processMessage}</div>
        </Motion.div>
      )}
    </div>
  );
};

export default LoginPage;
