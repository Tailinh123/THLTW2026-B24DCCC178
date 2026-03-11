import { Button, Form, Input, Select, Table } from "antd";

const QuestionManager = ({
  questions = [],
  setQuestions,
  subjects = [],
  blocks = [],
}: any) => {

  const [form] = Form.useForm();

  const handleAdd = (values: any) => {

    const newQuestion = {
      id: Date.now().toString(),
      ...values,
    };

    setQuestions([...questions, newQuestion]);
    form.resetFields();
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleAdd}>

        <Form.Item name="subjectId" label="Môn học">
          <Select
            options={(subjects || []).map((s: any) => ({
              value: s.id,
              label: s.name,
            }))}
          />
        </Form.Item>

        <Form.Item name="blockId" label="Khối kiến thức">
          <Select
            options={(blocks || []).map((b: any) => ({
              value: b.id,
              label: b.name,
            }))}
          />
        </Form.Item>

        <Form.Item name="content" label="Nội dung câu hỏi">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="difficulty" label="Mức độ khó">
          <Select
            options={[
              { value: "Dễ", label: "Dễ" },
              { value: "Trung bình", label: "Trung bình" },
              { value: "Khó", label: "Khó" },
              { value: "Rất khó", label: "Rất khó" },
            ]}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Thêm câu hỏi
        </Button>

      </Form>

      <Table
        style={{ marginTop: 20 }}
        dataSource={questions}
        rowKey="id"
        columns={[
          { title: "Môn", dataIndex: "subjectId" },
          { title: "Khối", dataIndex: "blockId" },
          { title: "Câu hỏi", dataIndex: "content" },
          { title: "Mức độ", dataIndex: "difficulty" },
        ]}
      />
    </>
  );
};

export default QuestionManager;
