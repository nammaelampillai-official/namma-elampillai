import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getSiteContentServer, getProductsServer } from "@/lib/server/data";

export default async function Home() {
  const content = await getSiteContentServer();
  const products = await getProductsServer();

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const { hero, featureCards, elampillai, priceRanges, visualCategories, customerStories, socialFeed, youtubeFeed } = content;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.backgroundImage || '/hero-saree.png'}
            alt="Luxurious Silk Saree"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 tracking-tight drop-shadow-md">
            {hero.title}
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto font-light text-heritage-cream drop-shadow-sm">
            {hero.subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={hero.ctaButtons.primary.link}>
              <Button size="lg" className="bg-heritage-gold text-heritage-maroon hover:bg-heritage-gold/90 border-none font-semibold">
                {hero.ctaButtons.primary.text}
              </Button>
            </Link>
            <Link href={hero.ctaButtons.secondary.link}>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                {hero.ctaButtons.secondary.text}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Categories Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-maroon dark:text-heritage-gold mb-4">Our Categories</h2>
            <div className="w-24 h-1 bg-heritage-gold mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {visualCategories.map((cat: any, idx: number) => (
              <Link
                key={idx}
                href={cat.link}
                className="group relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-heritage-gold/20 hover:border-heritage-gold transition-all duration-500 shadow-lg"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-heritage-maroon/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                  <span className="text-white font-serif font-bold text-sm md:text-lg">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sarees by Price Section */}
      <section className="py-16 md:py-24 bg-heritage-cream/10 dark:bg-muted/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-heritage-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-maroon dark:text-heritage-gold mb-4">Sarees by Price</h2>
            <p className="text-muted-foreground mb-4">Fine silk for every budget</p>
            <div className="w-24 h-1 bg-heritage-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {priceRanges.map((range: any, idx: number) => (
              <Link
                key={idx}
                href={`/products?min=${range.min || 0}${range.max ? `&max=${range.max}` : ''}`}
                className="group text-center"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-heritage-gold/10 group-hover:border-heritage-gold transition-colors duration-300 shadow-md">
                  <Image
                    src={range.image}
                    alt={range.label}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <h3 className="font-serif font-bold text-heritage-maroon group-hover:text-heritage-gold transition-colors text-lg">{range.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featureCards.map((card: any) => (
              <div key={card.id} className="text-center group p-8 rounded-2xl hover:bg-heritage-cream/5 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-heritage-gold/20">
                <div className="w-20 h-20 bg-heritage-maroon rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                  <span className="text-3xl text-heritage-gold">
                    {card.icon === 'sparkles' && '✨'}
                    {card.icon === 'badge-check' && '✓'}
                    {card.icon === 'users' && '👥'}
                    {card.icon === 'heart' && '❤️'}
                    {card.icon === 'star' && '⭐'}
                    {card.icon === 'shield' && '🛡️'}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-heritage-maroon mb-4">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-maroon dark:text-heritage-gold mb-4">Latest Arrivals</h2>
              <p className="text-muted-foreground">Explore our newest handpicked collections, fresh from the master weavers of Elampillai.</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="border-heritage-maroon text-heritage-maroon hover:bg-heritage-maroon hover:text-white transition-colors px-8">
                View All Collection
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Town Showcase Section */}
      <section className="py-24 bg-heritage-maroon text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 h-full">
            {[...Array(24)].map((_, i: number) => (
              <div key={i} className="border border-white/20"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 bg-heritage-gold/20 rounded-full border border-heritage-gold/30">
                <span className="text-heritage-gold text-sm font-bold uppercase tracking-widest">Village of Weavers</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight">
                Heart of <span className="text-heritage-gold italic">Elampillai</span>
              </h2>
              <p className="text-xl text-heritage-cream/80 leading-relaxed font-light">
                {elampillai.description}
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-4 mb-4">
                  {elampillai.images.slice(0, 3).map((img: any, idx: number) => (
                    <div key={idx} className="w-16 h-16 rounded-full border-4 border-heritage-maroon overflow-hidden relative shadow-xl">
                      <Image src={img} alt="Village" fill className="object-cover" />
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-full bg-heritage-gold text-heritage-maroon border-4 border-heritage-maroon flex items-center justify-center font-bold text-xl shadow-xl">
                    +
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative rounded-3xl overflow-hidden border-8 border-white/10 shadow-2xl rotate-3">
                <Image
                  src={elampillai.images[0]}
                  alt="Elampillai Town"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 aspect-video w-64 bg-white p-2 rounded-2xl shadow-2xl -rotate-6 hidden md:block">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image src={elampillai.images[1]} alt="Weaving" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="py-24 bg-white lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-heritage-maroon mb-4">Customer Stories</h2>
            <p className="text-gray-500 max-w-xl mx-auto italic">Hear from the beautiful people who chose the legacy of Elampillai for their special moments.</p>
            <div className="w-24 h-1 bg-heritage-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customerStories.map((story: any) => (
              <div key={story.id} className="p-10 rounded-[2rem] bg-heritage-cream/10 border border-heritage-gold/10 hover:shadow-2xl transition-all duration-500 relative group">
                <div className="absolute top-8 right-8 text-6xl text-heritage-gold/20 font-serif">"</div>
                <div className="flex gap-1 mb-6 text-heritage-gold group-hover:scale-110 transition-transform origin-left">
                  {[...Array(story.rating)].map((_, i: number) => (
                    <span key={i} className="text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-xl text-gray-700 font-serif italic mb-8 leading-relaxed">"{story.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-heritage-maroon/10 border-2 border-heritage-gold/20 flex items-center justify-center font-serif font-bold text-heritage-maroon text-2xl overflow-hidden">
                    {story.image ? <Image src={story.image} alt={story.name} fill className="object-cover" /> : story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-heritage-maroon text-lg">{story.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">📍 {story.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Feed Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-heritage-maroon mb-4">{youtubeFeed.title}</h2>
            <p className="text-gray-600">{youtubeFeed.subtitle}</p>
            <div className="w-24 h-1 bg-heritage-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {youtubeFeed.videos.map((video: any, idx: number) => (
              <div key={idx} className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="py-24 bg-heritage-cream/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-heritage-maroon mb-4">{socialFeed.title}</h2>
            <p className="text-gray-600">{socialFeed.subtitle}</p>
            <div className="w-24 h-1 bg-heritage-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {socialFeed.images.map((img: any, idx: number) => (
              <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden group shadow-lg">
                <Image
                  src={img}
                  alt={`Social Feed ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                    📸
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-heritage-maroon text-white hover:bg-heritage-maroon/90 px-8 py-6 text-lg rounded-2xl shadow-xl shadow-heritage-maroon/20">
              Follow Us on Instagram
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
