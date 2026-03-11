import { useState } from "react";
import { Button, Form, Input, Table } from "antd";

const KnowledgeBlockManager = ({ blocks, setBlocks }: any) => {

  const [form] = Form.useForm();

  const handleAdd = (values: any) => {

    const newBlock = {
      id: Date.now().toString(),
      name: values.name,
    };

    setBlocks([...blocks, newBlock]);
    form.resetFields();
  };

  return (
    <>
      <Form layout="inline" form={form} onFinish={handleAdd}>
        <Form.Item
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Tên khối kiến thức" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form>

      <Table
        style={{ marginTop: 20 }}
        dataSource={blocks}
        rowKey="id"
        columns={[
          { title: "Tên khối kiến thức", dataIndex: "name" },
        ]}
      />
    </>
  );
};

export default KnowledgeBlockManager;