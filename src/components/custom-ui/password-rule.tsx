import React from 'react';
import { Text } from '~/components/ui/text';

interface PasswordRulesProps {
  password: string;
}

export function checkPasswordRules(password: string) {
  const isLengthValid = password.length >= 8;
  const isUppercaseValid = /[A-Z]/.test(password);
  const isNumberValid = /\d/.test(password);
  const isAlphanumericValid = /^[A-Za-z0-9]*$/.test(password);
  const allPassed = isLengthValid && isUppercaseValid && isNumberValid && isAlphanumericValid;
  return {
    isLengthValid,
    isUppercaseValid,
    isNumberValid,
    isAlphanumericValid,
    allPassed,
  };
}

export const PasswordRules: React.FC<PasswordRulesProps> = ({ password: password_ }) => {
  const [password, setPassword] = React.useState<string>(password_ || '');
  React.useEffect(() => {
    setPassword(password_);
  }, [password_]);
  const baseColors = !!password ? 'text-error' : 'text-foreground';
  const { isLengthValid, isUppercaseValid, isNumberValid, isAlphanumericValid } =
    checkPasswordRules(password);
  return (
    <>
      <Text
        className={`px-3 transition-colors duration-300 ${isLengthValid ? 'text-success' : baseColors}`}
      >
        {'\u2022'} Minimum 8 characters.
      </Text>
      <Text
        className={`px-3 transition-colors duration-300 ${isUppercaseValid ? 'text-success' : baseColors}`}
      >
        {'\u2022'} At least one uppercase letter (A-Z).
      </Text>
      <Text
        className={`px-3 transition-colors duration-300 ${isNumberValid ? 'text-success' : baseColors}`}
      >
        {'\u2022'} At least one number (0-9).
      </Text>
      <Text
        className={`px-3 transition-colors duration-300 ${isAlphanumericValid && !!password ? 'text-success' : baseColors}`}
      >
        {'\u2022'} Alphanumeric characters only (A-Z, a-z, 0-9).
      </Text>
    </>
  );
};
