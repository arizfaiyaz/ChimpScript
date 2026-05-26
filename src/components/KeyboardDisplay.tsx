import { Keyboard } from "./ui/keyboard";

type KeyboardDisplayProps = {
  activeKey: string | null;
};

export function KeyboardDisplay({ activeKey }: KeyboardDisplayProps) {
  return (
    <section className="pb-6">
      <Keyboard activeKey={activeKey} className="md:scale-[0.92] lg:scale-100" />
    </section>
  );
}
