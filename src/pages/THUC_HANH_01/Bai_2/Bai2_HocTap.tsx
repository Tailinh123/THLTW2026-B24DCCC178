import { useState, useEffect } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  FlagOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


type Session = {
  subject: string;
  date: string;
  duration: number;
};

type Goals = {
  [key: string]: number;
};

const DEFAULT_SUBJECTS = ["Toán", "Văn", "Anh", "Khoa học", "Công nghệ"];


function useLS<T>(key: string, init: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}


export default function Bai2_HocTap() {
  const [subjects, setSubjects] = useLS<string[]>("subjects", DEFAULT_SUBJECTS);
  const [sessions, setSessions] = useLS<Session[]>("sessions", []);
  const [goals, setGoals] = useLS<Goals>("goals", {});
  const [tab, setTab] = useState<"subjects" | "sessions" | "goals">("subjects");



  const [newSubject, setNewSubject] = useState("");

  function addSubject() {
    const name = newSubject.trim();
    if (!name || subjects.includes(name)) return;
    setSubjects([...subjects, name]);
    setNewSubject("");
  }


  const [form, setForm] = useState<Session>({
    subject: subjects[0],
    date: "",
    duration: 0,
  });

  function addSession() {
    if (!form.subject || !form.date || form.duration <= 0) return;
    setSessions([...sessions, form]);
    setForm({ subject: subjects[0], date: "", duration: 0 });
  }


  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

  function getActual(subject: string) {
    return sessions
      .filter(
        (s) =>
          s.subject === subject &&
          new Date(s.date).getMonth() === now.getMonth() &&
          new Date(s.date).getFullYear() === now.getFullYear()
      )
      .reduce((sum, s) => sum + s.duration, 0);
  }


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <BookOutlined /> Quản lý học tập
        </h2>

        { }
        <div style={styles.tabs}>
          <button onClick={() => setTab("subjects")} style={tab === "subjects" ? styles.activeTab : styles.tab}>
            <BookOutlined /> Môn học
          </button>

          <button onClick={() => setTab("sessions")} style={tab === "sessions" ? styles.activeTab : styles.tab}>
            <CalendarOutlined /> Lịch học
          </button>

          <button onClick={() => setTab("goals")} style={tab === "goals" ? styles.activeTab : styles.tab}>
            <FlagOutlined /> Mục tiêu
          </button>
        </div>

        { }
        {tab === "subjects" && (
          <>
            <div style={styles.row}>
              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Tên môn học..."
                style={styles.input}
              />
              <button onClick={addSubject} style={styles.primaryBtn}>
                <PlusOutlined /> Thêm
              </button>
            </div>

            {subjects.map((sub, i) => (
              <div key={i} style={styles.item}>
                {sub}
                <DeleteOutlined
                  onClick={() => setSubjects(subjects.filter((_, j) => j !== i))}
                  style={styles.deleteIcon}
                />
              </div>
            ))}
          </>
        )}

        { }
        {tab === "sessions" && (
          <>
            <div style={styles.grid}>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={styles.input}
              >
                {subjects.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={styles.input}
              />

              <input
                type="number"
                placeholder="Thời gian (phút)"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
                style={styles.input}
              />
            </div>

            <button onClick={addSession} style={styles.primaryBtn}>
              <PlusOutlined /> Thêm lịch
            </button>

            {sessions.map((ses, i) => (
              <div key={i} style={styles.item}>
                <b>{ses.subject}</b> — {ses.duration} phút
              </div>
            ))}
          </>
        )}

        { }
        {tab === "goals" &&
          subjects.map((sub) => {
            const goal = goals[`${monthKey}_${sub}`] || 0;
            const actual = getActual(sub);
            const percent = goal > 0 ? Math.min((actual / goal) * 100, 100) : 0;

            return (
              <div key={sub} style={{ marginBottom: 16 }}>
                <div style={styles.row}>
                  <span style={{ flex: 1 }}>{sub}</span>
                  <input
                    type="number"
                    value={goal || ""}
                    onChange={(e) =>
                      setGoals({
                        ...goals,
                        [`${monthKey}_${sub}`]: Number(e.target.value),
                      })
                    }
                    style={{ ...styles.input, width: 120 }}
                  />
                </div>

                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${percent}%` }} />
                </div>

                <small>{actual}/{goal} phút</small>
              </div>
            );
          })}
      </div>
    </div>
  );
}


const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    background: "#f1f5f9",
    padding: 40,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 720,
  },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "#fff",
  },
  activeTab: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    background: "#ff0000",
    color: "#fff",
    cursor: "pointer",
  },
  row: { display: "flex", gap: 8, marginBottom: 12 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  input: { padding: 8, borderRadius: 8, border: "1px solid #ddd" },
  primaryBtn: {
    padding: "8px 14px",
    background: "#bb0707",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  item: {
    padding: 10,
    background: "#f8fafc",
    borderRadius: 8,
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteIcon: { color: "red", cursor: "pointer" },
  progressBar: {
    height: 8,
    background: "#e2e8f0",
    borderRadius: 99,
    marginTop: 6,
  },
  progressFill: {
    height: "100%",
    background: "#6366f1",
    borderRadius: 99,
  },
};