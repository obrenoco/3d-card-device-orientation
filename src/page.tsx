import React, { useEffect, useState } from "react";
import { useDeviceOrientation } from "./useDeviceOrientation";

const Toggle = ({ onToggle }: { onToggle: (toggleState: boolean) => void }) => {
  const [isToggled, setIsToggled] = useState(false);
  const onClick = () => {
    setIsToggled(!isToggled);
    onToggle(!isToggled);
  };
  return <input onClick={onClick} type="checkbox" />;
};

export const OrientationInfo = (): React.ReactElement => {
  const {
    orientation,
    requestAccess,
    revokeAccess,
    error,
    cssTransformInverse
  } = useDeviceOrientation();

  useEffect(() => {
    requestAccess();
  });

  const errorElement = error ? (
    <div className="error">{error.message}</div>
  ) : null;

  return (
    <>
      {errorElement}
      <div
        style={{
          width: "300px",
          height: "300px",
          backgroundColor: "red",
          backgroundSize: "cover",
          backgroundImage:
            "url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/77734800-52e0-4bfa-b934-463af6a42d47/d3443e2-403124f4-1bf5-45ec-b47e-ff3ff692f142.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc3NzM0ODAwLTUyZTAtNGJmYS1iOTM0LTQ2M2FmNmE0MmQ0N1wvZDM0NDNlMi00MDMxMjRmNC0xYmY1LTQ1ZWMtYjQ3ZS1mZjNmZjY5MmYxNDIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.fFhAU83upInk4j3rHw6J5GC6_9wqPTrRFZIdZ8QIAl0)",
          ...cssTransformInverse
        }}
      />
    </>
  );
};
