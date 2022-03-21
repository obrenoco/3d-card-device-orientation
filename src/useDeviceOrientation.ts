// https://trekhleb.dev/blog/2021/gyro-web/
import { CSSProperties, useCallback, useEffect, useState } from "react";

type DeviceOrientation = {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean | null;
};

type UseDeviceOrientationData = {
  orientation: DeviceOrientation | null;
  error: Error | null;
  cssTransformInverse: CSSProperties;
  requestAccess: () => Promise<boolean>;
  revokeAccess: () => Promise<void>;
};

const roundAngle = (angle: number | null): number | null => {
  if (typeof angle !== "number") {
    return angle;
  }
  const fractionDigits = 2;
  return +angle.toFixed(fractionDigits);
};

export const useDeviceOrientation = (): UseDeviceOrientationData => {
  const [error, setError] = useState<Error | null>(null);
  const [orientation, setOrientation] = useState<DeviceOrientation | null>(
    null
  );
  const [cssTransformInverse, setCssTransformInverse] = useState<CSSProperties>(
    {}
  );

  const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
    const angles: DeviceOrientation = {
      alpha: roundAngle(event.alpha),
      beta: roundAngle(event.beta),
      gamma: roundAngle(event.gamma),
      absolute: event.absolute
    };
    setOrientation(angles);
    if (
      angles &&
      typeof angles.alpha === "number" &&
      typeof angles.beta === "number" &&
      typeof angles.gamma === "number"
    ) {
      const a = angles.alpha > 180 ? angles.alpha - 360 : angles.alpha;
      const b = angles.beta - 90;
      const g = angles.gamma > 180 ? 360 - angles.gamma : -angles.gamma;
      setCssTransformInverse({
        transform: `
         rotateY(${g}deg)
          `
      });
    }
  };

  const revokeAccessAsync = async (): Promise<void> => {
    window.removeEventListener("deviceorientation", onDeviceOrientation);
    setOrientation(null);
  };

  const requestAccessAsync = async (): Promise<boolean> => {
    if (!DeviceOrientationEvent) {
      setError(
        new Error("Device orientation event is not supported by your browser")
      );
      return false;
    }

    if (
      (DeviceOrientationEvent as any).requestPermission &&
      typeof (DeviceMotionEvent as any).requestPermission === "function"
    ) {
      let permission: PermissionState;
      try {
        permission = await (DeviceOrientationEvent as any).requestPermission();
      } catch (err) {
        setError(err);
        return false;
      }
      if (permission !== "granted") {
        setError(
          new Error("Request to access the device orientation was rejected")
        );
        return false;
      }
    }

    window.addEventListener("deviceorientation", onDeviceOrientation);

    return true;
  };

  const requestAccess = useCallback(requestAccessAsync, []);
  const revokeAccess = useCallback(revokeAccessAsync, []);

  useEffect(() => {
    return (): void => {
      revokeAccess();
    };
  }, [revokeAccess]);

  return {
    orientation,
    error,
    requestAccess,
    revokeAccess,
    cssTransformInverse
  };
};
