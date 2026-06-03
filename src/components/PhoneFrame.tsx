"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  label?: string;
  className?: string;
}

const PhoneFrame = forwardRef<HTMLDivElement, Props>(function PhoneFrame(
  { children, label, className = "" },
  ref,
) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__notch" />
      <div className="phone__screen" ref={ref}>
        {children}
      </div>
      {label && <span className="phone__label">{label}</span>}
    </div>
  );
});

export default PhoneFrame;
