import Markdown from "react-markdown";
type Props = {
  summary: string;
};
const SummaryBox = ({ summary }: Props) => {
  return (
    <div className="bg-secondary p-4 h-[60vh] rounded-4xl overflow-y-scroll">
      <div className="reset-tw">
        <Markdown>{summary}</Markdown>
      </div>
    </div>
  );
};

export default SummaryBox;
