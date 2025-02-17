import { styled } from 'nativewind';
import { TextInput } from 'utils/wrappers/styled-react-native';

type Props = {
  value: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  style?: string;
  disabled?: boolean;
};

const MultilineText = ({ value, setValue, placeholder, style, disabled = false }: Props) => {
  const bg = disabled ? 'bg-slate-100' : 'bg-slate-50';
  return (
    <TextInput
      editable={!disabled}
      selectTextOnFocus={!disabled}
      autoCapitalize="none"
      scrollEnabled
      multiline
      autoCorrect={false}
      autoComplete="off"
      placeholder={placeholder}
      onChangeText={setValue}
      value={value}
      className={` border-slate-400 p-4 shadow-lg ${bg} ${style}`}
    />
  );
};

export default styled(MultilineText);
