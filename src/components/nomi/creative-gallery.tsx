import { CreativeCard } from "@/components/nomi/creative-card";

interface GalleryItem {
  src: string;
  alt: string;
  label: string;
  aspectRatio: "portrait" | "square" | "landscape";
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "https://picsum.photos/seed/nomi-gallery-1/900/1125",
    alt: "Editorial-style advertisement example",
    label: "01 / Editorial",
    aspectRatio: "portrait",
  },
  {
    src: "https://picsum.photos/seed/nomi-gallery-2/900/900",
    alt: "Lifestyle-style advertisement example",
    label: "02 / Lifestyle",
    aspectRatio: "square",
  },
  {
    src: "https://picsum.photos/seed/nomi-gallery-3/900/720",
    alt: "Product-first advertisement example",
    label: "03 / Product-first",
    aspectRatio: "landscape",
  },
  {
    src: "https://picsum.photos/seed/nomi-gallery-4/900/1125",
    alt: "Campaign-style advertisement example",
    label: "04 / Campaign",
    aspectRatio: "portrait",
  },
];

export function CreativeGallery() {
  const [item1, item2, item3, item4] = GALLERY_ITEMS;

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-(--container-default) px-6 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-xl md:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One product. Many directions.
          </h2>
        </div>

        {/* Desktop — true masonry: 3 independent columns, each stacking
            only its own content. No cross-column alignment attempted,
            so there's nothing that can create a gap. */}
        <div className="hidden gap-6 md:flex md:items-start">
          <div className="flex flex-1 flex-col">
            <CreativeCard
              src={item1.src}
              alt={item1.alt}
              label={item1.label}
              aspectRatio="portrait"
            />
          </div>

          <div className="flex flex-1 flex-col gap-6">
            <CreativeCard
              src={item2.src}
              alt={item2.alt}
              label={item2.label}
              aspectRatio="square"
              delay={0.08}
            />
            <CreativeCard
              src={item4.src}
              alt={item4.alt}
              label={item4.label}
              aspectRatio="portrait"
              delay={0.24}
            />
          </div>

          <div className="mt-16 flex flex-1 flex-col">
            <CreativeCard
              src={item3.src}
              alt={item3.alt}
              label={item3.label}
              aspectRatio="landscape"
              delay={0.16}
            />
          </div>
        </div>

        {/* Mobile — simple 2-column flow, unchanged */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          <div className="col-span-2">
            <CreativeCard
              src={item1.src}
              alt={item1.alt}
              label={item1.label}
              aspectRatio="portrait"
            />
          </div>
          <CreativeCard
            src={item2.src}
            alt={item2.alt}
            label={item2.label}
            aspectRatio="square"
            delay={0.08}
          />
          <CreativeCard
            src={item3.src}
            alt={item3.alt}
            label={item3.label}
            aspectRatio="landscape"
            delay={0.16}
          />
          <div className="col-span-2">
            <CreativeCard
              src={item4.src}
              alt={item4.alt}
              label={item4.label}
              aspectRatio="portrait"
              delay={0.24}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
