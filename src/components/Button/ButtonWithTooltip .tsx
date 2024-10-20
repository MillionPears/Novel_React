import React, { useState } from 'react';

interface ButtonWithTooltipProps {
  title: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const ButtonWithTooltip: React.FC<ButtonWithTooltipProps> = ({
  title,
  onClick,
  className,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <button
      className={`py-2 px-2 mr-2 rounded relative ${className || ''}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <span className="tooltip bg-gray text-white text-xs rounded py-1 px-2 absolute bottom-9  left-1/2 transform -translate-x-1/2 pointer-events-auto transition-opacity duration-300 opacity-100">
          {title}
        </span>
      )}
    </button>
  );
};

export default ButtonWithTooltip;
