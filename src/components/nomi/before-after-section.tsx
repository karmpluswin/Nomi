import { BeforeAfterSlider } from "@/components/nomi/before-after-slider";

export function BeforeAfterSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-(--container-default) px-6 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-xl md:mb-16">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Drag to compare
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See the difference, directly.
          </h2>
        </div>

        <div className="mx-auto max-w-lg">
          <BeforeAfterSlider
            beforeSrc="https://i.ibb.co/5XQvQryD/example.jpg"
            afterSrc="https://images.admakeai.com/generated_images/29cfd269-4023-4a03-b10a-3e43ae939223.jpg"
          />
        </div>
      </div>
    </section>
  );
}
