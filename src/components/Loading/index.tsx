import React from 'react';
import style from './style.module.css';

interface Props {
  loadingSize?: number;
  labelSize?: number;
  label?: string;
  className?: string;
  color?: string;
}

function Loading({ loadingSize = 24, labelSize = 14, label, className, color }: Props) {
  return (
    <div
      className={`d-flex w-fit flex-column align-items-center ${className}`}
      style={{
        fontSize: loadingSize,
        borderColor: color || 'inherit'
      }}>
      <div className={`${style.loadingRing}`}></div>
      {label && (
        <span
          className="mt-6"
          style={{
            fontSize: labelSize
          }}>
          {label}
        </span>
      )}
    </div>
  );
}

export default Loading;
