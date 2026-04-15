import React, { useState } from 'react';
import { Card, Space, Button, Empty, Modal, Form, InputNumber, Divider, Row, Col, Progress, Statistic, Typography, DatePicker, notification } from 'antd';
import { AimOutlined, TargetOutlined, CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import { useStudy } from '../../hooks/useStudy';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function GoalModule() {
  const study = useStudy();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const currentGoal = study.getGoal(selectedMonth);
  const currentMinutes = study.getMonthMinutes(selectedMonth);
  const currentHours = +(currentMinutes / 60).toFixed(1);

  const openGoalForm = () => {
    form.setFieldsValue({
      targetHours: currentGoal?.targetHours ?? 20,
      categoryGoals: currentGoal?.categoryGoals ?? {},
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const vals = await form.validateFields();
      const catGoals: Record<string, number> = {};
      study.categories.forEach(c => {
        const v = vals[`cat_${c.id}`];
        if (v && v > 0) catGoals[c.id] = v;
      });
      study.setGoal({ id: selectedMonth, targetHours: vals.targetHours, categoryGoals: catGoals });
      notification.success({ message: "Đã lưu mục tiêu tháng!" });
      setOpen(false);
    } catch {}
  };

  const pct = currentGoal ? Math.min(100, Math.round((currentHours / currentGoal.targetHours) * 100)) : 0;
  const progressColor = pct >= 100 ? "#52c41a" : pct >= 70 ? "#1890ff" : pct >= 40 ? "#fa8c16" : "#f5222d";

  // Per-category stats
  const catStats = study.categories.map(cat => {
    const catMins = study.getMonthLogs(selectedMonth)
      .filter(l => l.categoryId === cat.id)
      .reduce((s, l) => s + l.duration, 0);
    const catHrs = +(catMins / 60).toFixed(1);
    const catGoalH = currentGoal?.categoryGoals?.[cat.id] ?? 0;
    const catPct = catGoalH > 0 ? Math.min(100, Math.round((catHrs / catGoalH) * 100)) : 0;
    return { ...cat, hours: catHrs, goalHours: catGoalH, pct: catPct };
  }).filter(c => c.hours > 0 || c.goalHours > 0);

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card
          title={<Space><AimOutlined /><span>Mục tiêu Tháng</span></Space>}
          extra={
            <Space>
              <DatePicker
                picker="month"
                value={dayjs(selectedMonth)}
                onChange={d => setSelectedMonth(d ? d.format("YYYY-MM") : dayjs().format("YYYY-MM"))}
                format="MM/YYYY"
                allowClear={false}
              />
              <Button type="primary" icon={<TargetOutlined />} onClick={openGoalForm}>
                {currentGoal ? "Sửa mục tiêu" : "Đặt mục tiêu"}
              </Button>
            </Space>
          }
        >
          {!currentGoal ? (
            <Empty description={
              <Space direction="vertical" align="center">
                <Text>Chưa có mục tiêu cho tháng {dayjs(selectedMonth).format("MM/YYYY")}</Text>
                <Button type="primary" onClick={openGoalForm}>Đặt mục tiêu ngay</Button>
              </Space>
            } />
          ) : (
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Progress
                  type="circle"
                  percent={pct}
                  strokeColor={progressColor}
                  width={160}
                  format={p => (
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: progressColor }}>{p}%</div>
                      <div style={{ fontSize: 11, color: "#999" }}>hoàn thành</div>
                    </div>
                  )}
                />
              </Col>
              <Col xs={24} sm={16}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic title="Mục tiêu" value={currentGoal.targetHours} suffix="giờ"
                      prefix={<TargetOutlined />} valueStyle={{ color: "#1890ff" }} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Đã học" value={currentHours} suffix="giờ"
                      prefix={<CheckCircleOutlined />} valueStyle={{ color: progressColor }} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Còn lại"
                      value={Math.max(0, +(currentGoal.targetHours - currentHours).toFixed(1))}
                      suffix="giờ" prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: currentGoal.targetHours - currentHours <= 0 ? "#52c41a" : "#fa8c16" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Số buổi học"
                      value={study.getMonthLogs(selectedMonth).length}
                      suffix="buổi" prefix={<CalendarOutlined />}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Card>

        {catStats.length > 0 && (
          <Card title={<Space><BarChartOutlined /><span>Theo môn học</span></Space>}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {catStats.map(cat => (
                <div key={cat.id} style={{ width: '100%' }}>
                  <Row justify="space-between" style={{ marginBottom: 4 }}>
                    <Space>
                      <span>{cat.icon}</span>
                      <Text strong>{cat.name}</Text>
                    </Space>
                    <Space>
                      <Text type="secondary">{cat.hours}h</Text>
                      {cat.goalHours > 0 && <Text type="secondary">/ {cat.goalHours}h mục tiêu</Text>}
                    </Space>
                  </Row>
                  <Progress
                    percent={cat.goalHours > 0 ? cat.pct : 100}
                    strokeColor={cat.color}
                    showInfo={cat.goalHours > 0}
                    format={p => `${p}%`}
                  />
                </div>
              ))}
            </Space>
          </Card>
        )}
      </Space>

      <Modal
        title={`Đặt mục tiêu — Tháng ${dayjs(selectedMonth).format("MM/YYYY")}`}
        visible={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Lưu mục tiêu"
        cancelText="Hủy"
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="targetHours" label="Tổng số giờ học mục tiêu / tháng"
            rules={[
              { required: true, message: "Nhập mục tiêu giờ!" },
              { type: "number", min: 0.5, max: 744, message: "Từ 0.5 đến 744 giờ!" },
            ]}>
            <InputNumber min={0.5} max={744} step={0.5} style={{ width: "100%" }} addonAfter="giờ" />
          </Form.Item>
          <Divider orientation="left"><Text type="secondary" style={{ fontSize: 12 }}>Mục tiêu theo môn (tuỳ chọn)</Text></Divider>
          {study.categories.map(cat => (
            <Form.Item key={cat.id} name={`cat_${cat.id}`}
              label={<Space><span>{cat.icon}</span><Text>{cat.name}</Text></Space>}
              rules={[{ type: "number", min: 0, max: 744, message: "Từ 0–744 giờ!" }]}>
              <InputNumber min={0} max={744} step={0.5} style={{ width: "100%" }} addonAfter="giờ" placeholder="0" />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
}
