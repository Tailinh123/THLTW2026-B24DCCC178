import { Button, Form, Input, Table } from "antd";

const SubjectManager = ({ subjects, setSubjects }: any) => {

  const [form] = Form.useForm();

  const handleAdd = (values: any) => {

    const newSubject = {
      id: Date.now().toString(),
      ...values,
    };

    setSubjects([...subjects, newSubject]);
    form.resetFields();
  };

  return (
    <>
      <Form layout="inline" form={form} onFinish={handleAdd}>

        <Form.Item name="code" rules={[{ required: true }]}>
          <Input placeholder="Mã môn" />
        </Form.Item>

        <Form.Item name="name" rules={[{ required: true }]}>
          <Input placeholder="Tên môn" />
        </Form.Item>

        <Form.Item name="credits" rules={[{ required: true }]}>
          <Input placeholder="Số tín chỉ" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Thêm môn
        </Button>

      </Form>

      <Table
        style={{ marginTop: 20 }}
        dataSource={subjects}
        rowKey="id"
        columns={[
          { title: "Mã môn", dataIndex: "code" },
          { title: "Tên môn", dataIndex: "name" },
          { title: "Tín chỉ", dataIndex: "credits" },
        ]}
      />
    </>
  );
};

export default SubjectManager;