import { Button, Select, Table, message } from "antd";
import { useState } from "react";

const ExamManager = ({ questions, subjects, exams, setExams }: any) => {

  const [subjectId, setSubjectId] = useState();

  const generateExam = () => {

    const filtered = questions.filter(
      (q: any) => q.subjectId === subjectId
    );

    if (filtered.length < 3) {
      message.error("Không đủ câu hỏi");
      return;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());

    const newExam = {
      id: Date.now().toString(),
      subjectId,
      questions: shuffled.slice(0, 3),
    };

    setExams([...exams, newExam]);
  };

  return (
    <>
      <Select
        placeholder="Chọn môn học"
        style={{ width: 200 }}
        onChange={setSubjectId}
        options={subjects.map((s: any) => ({
          value: s.id,
          label: s.name,
        }))}
      />

      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={generateExam}
      >
        Tạo đề thi
      </Button>

      <Table
        style={{ marginTop: 20 }}
        dataSource={exams}
        rowKey="id"
        columns={[
          { title: "Môn học", dataIndex: "subjectId" },
          {
            title: "Số câu hỏi",
            render: (r: any) => r.questions.length,
          },
        ]}
      />
    </>
  );
};

export default ExamManager;