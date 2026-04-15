import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { BudgetThreshold } from '../types';
import { formatVND, CATEGORY_LABELS } from '../types';

const PIE_COLORS = ['#1890ff', '#52c41a', '#fa8c16'];

interface BudgetChartProps {
  spend: { food: number; stay: number; transport: number };
  threshold: BudgetThreshold;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ spend, threshold }) => {
  const pieData = [
    { name: CATEGORY_LABELS.food, value: spend.food },
    { name: CATEGORY_LABELS.stay, value: spend.stay },
    { name: CATEGORY_LABELS.transport, value: spend.transport },
  ];

  const barData = [
    { category: CATEGORY_LABELS.food, 'Đã chi': spend.food, 'Ngưỡng': threshold.food || 0 },
    { category: CATEGORY_LABELS.stay, 'Đã chi': spend.stay, 'Ngưỡng': threshold.stay || 0 },
    { category: CATEGORY_LABELS.transport, 'Đã chi': spend.transport, 'Ngưỡng': threshold.transport || 0 },
  ];

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card className="section-card" title="Phân bổ chi phí">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <ReTooltip formatter={(v: any) => formatVND(Number(v))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card className="section-card" title="So sánh với ngưỡng">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <ReTooltip formatter={(v: any) => formatVND(Number(v))} />
              <Legend />
              <Bar dataKey="Đã chi" fill="#fa8c16" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ngưỡng" fill="#91d5ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};
