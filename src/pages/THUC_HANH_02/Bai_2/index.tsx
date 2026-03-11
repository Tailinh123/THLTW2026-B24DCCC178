import { Tabs, Card } from "antd";
import { useState } from "react";

import KnowledgeBlockManager from "./components/KnowledgeBlockManager";
import SubjectManager from "./components/SubjectManager";
import QuestionManager from "./components/QuestionManager";
import ExamManager from "./components/ExamManager";

import { KnowledgeBlock, Subject, Question, Exam } from "./types";

const { TabPane } = Tabs;

const QuestionBankPage = () => {

  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  return (
    <Card title="Hệ thống ngân hàng câu hỏi">

      <Tabs defaultActiveKey="1">

        <TabPane tab="Khối kiến thức" key="1">
          <KnowledgeBlockManager
            blocks={blocks}
            setBlocks={setBlocks}
          />
        </TabPane>

        <TabPane tab="Môn học" key="2">
          <SubjectManager
            subjects={subjects}
            setSubjects={setSubjects}
          />
        </TabPane>

        <TabPane tab="Câu hỏi" key="3">
          <QuestionManager
            questions={questions}
            setQuestions={setQuestions}
            subjects={subjects}
            blocks={blocks}
          />
        </TabPane>

        <TabPane tab="Đề thi" key="4">
          <ExamManager
            questions={questions}
            subjects={subjects}
            exams={exams}
            setExams={setExams}
          />
        </TabPane>

      </Tabs>

    </Card>
  );
};

export default QuestionBankPage;