export default function LogoLoader() {
  return (
    <div className="flex items-end gap-1.5">
      <div
        className="h-9 w-9 rounded-full"
        style={{
          backgroundColor: "#1a4731",
          border: "2px solid #fff" /*  */,
          animation: "logoA 1.2s ease-in-out infinite",
        }}
      />
      <div
        className="h-6 w-6 rounded-full"
        style={{
          backgroundColor: "#b7e4c7",
          animation: "logoB 1.2s ease-in-out infinite 0.2s",
        }}
      />
      <div
        className="h-7 w-7 rounded-full"
        style={{
          backgroundColor: "#52b788",
          animation: "logoC 1.2s ease-in-out infinite 0.4s",
        }}
      />

      <style>{`
        @keyframes logoA {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.15); }
        }
        @keyframes logoB {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.15); }
        }
        @keyframes logoC {
          0%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
