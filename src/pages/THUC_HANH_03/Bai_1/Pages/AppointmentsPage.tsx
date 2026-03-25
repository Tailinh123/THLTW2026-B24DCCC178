import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Select, Space, Badge, Empty } from 'antd';
import type { Appointment, AppointmentStatus } from '../types';
import { MOCK_EMPLOYEES } from '../types';
import AppointmentTable, { STATUS_COLORS, STATUS_LABELS } from '../components/AppointmentTable';

interface Props {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onEdit: (a: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentsPage: React.FC<Props> = ({
  appointments, onStatusChange, onEdit, onDelete,
}) => {
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | undefined>();
  const [filterEmp, setFilterEmp] = useState<string | undefined>();

  const filtered = useMemo(() =>
    appointments
      .filter(a =>
        (!filterStatus || a.status === filterStatus) &&
        (!filterEmp || a.employeeId === filterEmp)
      )
      .sort((a, b) => b.date.localeCompare(a.date)),
    [appointments, filterStatus, filterEmp]);

  return (
    <div>
      {}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {(Object.keys(STATUS_LABELS) as AppointmentStatus[]).map(st => (
          <Col xs={12} sm={6} key={st}>
            <Card
              size="small"
              style={{
                borderRadius: 10, border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                background: filterStatus === st ? '#f9f5ff' : '#fff',
              }}
              onClick={() => setFilterStatus(filterStatus === st ? undefined : st)}
            >
              <Space>
                <Badge color={STATUS_COLORS[st]} />
                <div>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>{STATUS_LABELS[st]}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {appointments.filter(a => a.status === st).length}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {}
      <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder="Lọc nhân viên" allowClear style={{ width: 180 }}
            value={filterEmp} onChange={setFilterEmp}
            options={MOCK_EMPLOYEES.map(e => ({ value: e.id, label: e.name }))}
          />
          <Select
            placeholder="Trạng thái" allowClear style={{ width: 150 }}
            value={filterStatus}
            onChange={v => setFilterStatus(v as AppointmentStatus | undefined)}
            options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
        </Space>
      </Card>

      {}
      <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {filtered.length === 0
          ? <Empty description="Không có lịch hẹn phù hợp" />
          : <AppointmentTable
              appointments={filtered}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
        }
      </Card>
    </div>
  );
};

export default AppointmentsPage;