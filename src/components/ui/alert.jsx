import React from 'react';

export function Alert({ className, ...props }) {
  return <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`} {...props} />;
}

export function AlertDescription({ className, ...props }) {
  return <p className={`text-sm ${className}`} {...props} />;
}