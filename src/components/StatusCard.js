import React from 'react';

const StatusCard = ({ title, status, description, icon: Icon, action, actionLabel }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failure':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIconColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failure':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Verified';
      case 'failure':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return 'Not Started';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-2 rounded-full bg-white ${getStatusIconColor()}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${status === 'success' ? 'bg-green-100 text-green-800' : ''}
            ${status === 'failure' ? 'bg-red-100 text-red-800' : ''}
            ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${!status || status === 'not_started' ? 'bg-gray-100 text-gray-800' : ''}
          `}>
            {getStatusText()}
          </span>
        </div>
      </div>
      {action && (
        <div className="mt-4">
          <button
            onClick={action}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusCard;