import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    issued: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Issued' },
    returned: { bg: 'bg-green-100', text: 'text-green-800', label: 'Returned' },
    overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
