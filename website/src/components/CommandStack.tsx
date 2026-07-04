import { CodeSnippet } from "./CodeSnippet";

type CommandStackProps = {
  commands: { label: string; code: string }[];
  className?: string;
};

export function CommandStack({ commands, className }: CommandStackProps) {
  return (
    <div className={className ? `command-stack ${className}` : "command-stack"}>
      {commands.map((item) => (
        <CodeSnippet key={item.label} code={item.code} label={item.label} />
      ))}
    </div>
  );
}
