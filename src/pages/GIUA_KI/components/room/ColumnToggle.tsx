

import React from 'react';
import { Button, Popover, Checkbox } from 'antd';
import { Columns3 } from 'lucide-react';
import { ALL_COLUMN_KEYS, COLUMN_LABELS, ColumnKey } from '../../constants';

interface ColumnToggleProps {
  visibleColumns: string[];
  onChange: (columns: string[]) => void;
}

const ColumnToggle: React.FC<ColumnToggleProps> = ({ visibleColumns, onChange }) => {
  const handleChange = (checkedValues: Array<string | number | boolean>) => {
    const stringValues = checkedValues.map(String);
    // Always keep 'actions' visible
    if (!stringValues.includes('actions')) {
      stringValues.push('actions');
    }
    onChange(stringValues);
  };

  const options = ALL_COLUMN_KEYS
    .filter((key) => key !== 'actions')
    .map((key) => ({
      label: COLUMN_LABELS[key as ColumnKey],
      value: key,
    }));

  const content = (
    <div className="gk-column-toggle__list">
      <Checkbox.Group
        options={options}
        value={visibleColumns.filter((c) => c !== 'actions')}
        onChange={handleChange}
        style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      title="Hiển thị cột"
      trigger="click"
      placement="bottomRight"
    >
      <Button
        className="gk-header-btn"
        aria-label="Tùy chỉnh cột hiển thị"
      >
        <Columns3 size={15} />
      </Button>
    </Popover>
  );
};

export default React.memo(ColumnToggle);
