import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 128,
  level = 'H',
  includeMargin = true,
}) => {
  return (
    <div>
      <QRCodeCanvas
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default QRCode;
