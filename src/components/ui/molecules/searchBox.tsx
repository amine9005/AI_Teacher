import { Input } from "../atoms/input/input";
import { Button } from "../atoms/button/button";

type Props = {
  inputProps?: React.ComponentProps<"input">;
  buttonProps?: React.ComponentProps<typeof Button>;
  buttonChildren?: React.ReactNode;
};

const SearchBox = ({ inputProps, buttonProps, buttonChildren }: Props) => {
  return (
    <div>
      <Input {...inputProps} />
      <Button {...buttonProps}>{buttonChildren}</Button>
    </div>
  );
};

export default SearchBox;
