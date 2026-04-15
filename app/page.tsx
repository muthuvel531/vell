import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Utensils, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { DailySpecials } from '@/components/daily-specials';
import { MenuCard } from '@/components/menu-card';
import { menuItems } from '@/lib/menu-data';

const features = [
  {
    icon: Utensils,
    title: 'Fresh & Tasty',
    description: 'Made fresh daily with quality ingredients',
  },
  {
    icon: Clock,
    title: 'Quick Service',
    description: 'Order online and skip the queue',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'UPI, Card, or Cash - your choice',
  },
  {
    icon: MapPin,
    title: 'Campus Location',
    description: 'Conveniently located in main building',
  },
];

const popularItems = menuItems.filter((item) => item.isSpecial).slice(0, 4);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-food.jpg"
              alt="Delicious canteen food"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-xl">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                JJ FAMILEY              <br />
                <span className="text-primary">RESTORENT </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
               Fresh, affordable, and ready when you are. Order online from your home and skip the queue.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/menu">
                  <Button size="lg" className="gap-2">
                    View Menu
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/order">
                  <Button size="lg" variant="outline">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="text-center">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Daily Specials */}
        <DailySpecials />

        {/* Popular Items Preview */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Popular Items
              </h2>
              <Link href="/menu">
                <Button variant="ghost" className="gap-2">
                  See All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularItems.length > 0 ? (
                popularItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))
              ) : (
                menuItems.slice(0, 4).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))
              )}


               {popularItems.length > 0 ? (
                popularItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))
              ) : (
                menuItems.slice(0, 5).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))
              )}


              
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-balance">
              Hungry? Order Now!
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-md mx-auto">
              Skip the queue and get your food ready when you arrive. Fast, easy, and convenient.
            </p>
            <Link href="/order" className="inline-block mt-8">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Your Order
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
