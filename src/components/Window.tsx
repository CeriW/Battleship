import React from 'react';

const Window = (props: { children: React.ReactNode; title: string; className: string }) => {
  const { children, title, className } = props;

  return (
    <div className={`window ${className}`}>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Window;
