import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Encodes the real table URL so a printed code opens that table's menu. */
export function tableUrl(table: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/menu?table=${encodeURIComponent(table)}`;
}

export function TableQR({
  table,
  size = 220,
  className,
}: {
  table: string;
  size?: number;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(tableUrl(table), {
      width: size * 2,
      margin: 1,
      color: { dark: "#2b2c3d", light: "#ffffff" },
    })
      .then((url) => alive && setSrc(url))
      .catch(() => alive && setSrc(null));
    return () => {
      alive = false;
    };
  }, [table, size]);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-label={`Scannable QR code for table ${table}`}
    >
      {src ? (
        <img
          src={src}
          alt={`QR code that opens the menu for table ${table}`}
          width={size}
          height={size}
          className="h-full w-full rounded-md"
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-md bg-cream-200" />
      )}
    </div>
  );
}
