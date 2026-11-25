import React from "react";
import XovaarLogo from "./XovaarLogo";

export default function FabrilifeLogo(props: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return <XovaarLogo {...props} />;
}
