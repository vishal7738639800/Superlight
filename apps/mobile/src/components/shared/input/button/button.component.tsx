import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
  disabled?: boolean;
};

const Button = ({ onPress, children, style, disabled = false }: Props) => {
  const bg = disabled ? 'bg-slate-600' : 'bg-black';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`rounded-fullp-4 flex flex-row items-center justify-center rounded-full p-4 drop-shadow-lg ${bg} ${style}`}>
      <Text className="font-bold text-white">{children}</Text>
    </Pressable>
  );
};

export default styled(Button);
