import { CoachingOptions } from "@/assets/Options";

export default function getAbstractImage(option: string) {
  const item = CoachingOptions.find((item) => item.name === option);
  return item?.abstract ?? "/ab1.png";
}
