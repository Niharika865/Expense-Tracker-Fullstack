import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">

      {/* Card */}
      <div className="text-center bg-white/80 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-blue-100">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-blue-700 tracking-wide mb-3">
          Expense Tracker
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8 text-sm">
          Track expenses • Control budget • Save smarter
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-105"
        >
          Start Tracking
        </button>

      </div>
    </div>
  );
}