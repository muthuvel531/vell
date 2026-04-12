"use client";

import Image from 'next/image';
import { Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dailySpecials } from '@/lib/menu-data';
import { useCart } from '@/components/cart-provider';

export function DailySpecials() {
  const { addItem } = useCart();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            {"Today's Specials"}
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {dailySpecials.map((special) => (
            <Card key={special.id} className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 shrink-0">
                    <Image
                      src={special.image}
                      alt={special.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Limited Time
                    </Badge>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {special.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {special.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{special.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{special.originalPrice}
                        </span>
                      </div>
                      <Button
                        onClick={() => addItem({
                          id: special.id,
                          name: special.name,
                          description: special.description,
                          price: special.price,
                          image: special.image,
                          category: 'meals',
                          available: special.available,
                        })}
                        disabled={!special.available}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
