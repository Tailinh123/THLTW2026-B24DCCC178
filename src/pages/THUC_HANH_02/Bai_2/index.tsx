import { Tabs, Card } from "antd";
import { useState } from "react";

import KnowledgeBlockManager from "./components/KnowledgeBlockManager";
import SubjectManager from "./components/SubjectManager";
import QuestionManager from "./components/QuestionManager";
import ExamManager from "./components/ExamManager";

import { KnowledgeBlock, Subject, Question, Exam } from "./types";

const QuestionBankPage = () => {

  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  return (
    <Card title="Hệ thống ngân hàng câu hỏi">

      <Tabs
        items={[
          {
            key: "1",
            label: "Khối kiến thức",
            children: (
              <KnowledgeBlockManager
                blocks={blocks}
                setBlocks={setBlocks}
              />
            ),
          },

          {
            key: "2",
            label: "Môn học",
            children: (
              <SubjectManager
                subjects={subjects}
                setSubjects={setSubjects}
              />
            ),
          },

          {
            key: "3",
            label: "Câu hỏi",
            children: (
              <QuestionManager
                questions={questions}
                setQuestions={setQuestions}
                subjects={subjects}
                blocks={blocks}
              />
            ),
          },

          {
            key: "4",
            label: "Đề thi",
            children: (
              <ExamManager
                questions={questions}
                subjects={subjects}
                exams={exams}
                setExams={setExams}
              />
            ),
          },
        ]}
      />

    </Card>
  );
};

export default QuestionBankPage;