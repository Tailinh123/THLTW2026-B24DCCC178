import { useState } from "react";

const MAX = 10;

export default function GuessGame() {
  const [secret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [done, setDone] = useState(false);

  function handleGuess() {
    const num = parseInt(input);
    if (!num || num < 1 || num > 100 || done) return;

    const next = [...guesses, num];
    setGuesses(next);
    setInput("");

    if (num === secret || next.length >= MAX) setDone(true);
  }

  const last = guesses.at(-1);
  const won = last === secret;
  const remaining = MAX - guesses.length;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🎲 Đoán Số Bí Ẩn</h2>
        <p style={s.sub}>
          Số từ 1 – 100 · Còn <b>{remaining}</b> lượt
        </p>

        {!done && (
          <div style={s.row}>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuess()}
              placeholder="Nhập số..."
              style={s.input}
            />
            <button onClick={handleGuess} style={s.btn}>
              Đoán
            </button>
          </div>
        )}

        {last && (
          <p
            style={{
              ...s.hint,
              color: won
                ? "#22c55e"
                : last < secret
                ? "#f97316"
                : "#3b82f6",
            }}
          >
            {won
              ? `🎉 Đúng rồi! Số là ${secret}`
              : done
              ? `😢 Hết lượt! Số đúng là ${secret}.`
              : last < secret
              ? "📉 Quá thấp!"
              : "📈 Quá cao!"}
          </p>
        )}

        {done && (
          <button
            onClick={() => window.location.reload()}
            style={s.btnFull}
          >
            Chơi lại
          </button>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
  },
  title: {
    margin: "0 0 4px",
    fontSize: 24,
    fontWeight: 800,
    textAlign: "center",
  },
  sub: {
    margin: "0 0 20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
  },
  row: {
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
  },
  btn: {
    padding: "10px 20px",
    borderRadius: 8,
    background: "#6366f1",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnFull: {
    marginTop: 16,
    width: "100%",
    padding: "10px 0",
    borderRadius: 8,
    background: "#6366f1",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
  hint: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: 15,
    marginTop: 16,
  },
};