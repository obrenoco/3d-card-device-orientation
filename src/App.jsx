import { useCallback, useEffect, useState } from "react";
import { OrientationInfo } from "./page";
import "./styles.css";

export default function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "50px"
      }}
    >
      <OrientationInfo />
    </div>
  );
}
