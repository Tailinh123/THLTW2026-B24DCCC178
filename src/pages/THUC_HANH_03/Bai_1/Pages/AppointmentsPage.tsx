
import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Select, Space, Badge, Empty } from 'antd';
import type { Appointment, AppointmentStatus, Employee } from '../types';
import AppointmentTable, { STATUS_COLORS, STATUS_LABELS } from '../components/AppointmentTable';

interface Props {
  appointments: Appointment[];
  employees: Employee[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onEdit: (a: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentsPage: React.FC<Props> = ({
  appointments, employees, onStatusChange, onEdit, onDelete,
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
              className={`bb-status-card ${filterStatus === st ? 'bb-status-active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === st ? undefined : st)}
            >
              <Space>
                <Badge color={STATUS_COLORS[st]} />
                <div>
                  <div className="bb-status-label">{STATUS_LABELS[st]}</div>
                  <div className="bb-status-value">
                    {appointments.filter(a => a.status === st).length}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {}
      <Card className="bb-filter-card">
        <Space wrap>
          <Select
            placeholder="Lọc nhân viên" allowClear style={{ width: 200 }}
            value={filterEmp} onChange={setFilterEmp}
            options={employees.map(e => ({ value: e.id, label: e.name }))}
          />
          <Select
            placeholder="Trạng thái" allowClear style={{ width: 160 }}
            value={filterStatus}
            onChange={v => setFilterStatus(v as AppointmentStatus | undefined)}
            options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
        </Space>
      </Card>

      {}
      <Card className="bb-card">
        {filtered.length === 0
          ? <Empty description="Không có lịch hẹn phù hợp" />
          : <AppointmentTable
              appointments={filtered}
              employees={employees}
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