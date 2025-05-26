import React, { useCallback } from "react";
import { ELoginScreen } from "~/src/app/login";
import { RegisterStep } from "~/src/components/login/RegisterStep";
import { VerifyStep } from "~/src/components/login/VerifyStep";
import { DoneStep } from "./RegisterStepDone";

export default function RegisterScreen({
  onNextStep,
  onClose,
}: {
  onNextStep?: (step: ELoginScreen) => void;
  onClose?: () => void;
}) {
  const [step, setStep] = React.useState<ELoginScreen>(ELoginScreen.REGISTER);
  const [registerData, setRegisterData] = React.useState<{
    email: string;
    verifyCode?: string;
  }>({
    email: "",
    verifyCode: "",
  });
  const handleRegister = useCallback(
    (data: { email: string; verifyCode?: string }) => {
      setRegisterData(data);
      console.log({ data });
    },
    []
  );
  const handleStepChange = useCallback((step: ELoginScreen) => {
    onNextStep?.(step);
  }, []);
  const handleClose = () => {
    onClose?.();
  };
  const renderStep = () => {
    switch (step) {
      case ELoginScreen.REGISTER:
        return (
          <RegisterStep
            onNextStep={handleStepChange}
            onClose={handleClose}
            onRegister={handleRegister}
          />
        );
      case ELoginScreen.VERIFY:
        return (
          <VerifyStep
            data={registerData}
            onNextStep={handleStepChange}
            onClose={handleClose}
          />
        );
      case ELoginScreen.DONE:
        return <DoneStep onNextStep={handleStepChange} onClose={handleClose} />;
      default:
        return (
          <RegisterStep onNextStep={handleStepChange} onClose={handleClose} />
        );
    }
  };
  return <>{renderStep()}</>;
}
