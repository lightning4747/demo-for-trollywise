import React, { useState, useEffect } from 'react';

interface TextTypeProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  cursorClassName?: string;
}

export const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 50,
  className = '',
  cursorClassName = 'text-emerald-400',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
    }
  }, [displayedText, text, typingSpeed]);

  return (
    <span className={`inline-flex items-center flex-wrap ${className}`}>
      <span>{displayedText}</span>
      {!isDone && (
        <span className={`inline-block w-[3px] h-[0.85em] ml-1 bg-emerald-400 animate-pulse rounded-sm ${cursorClassName}`} />
      )}
    </span>
  );
};
