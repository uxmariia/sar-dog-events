import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Judges = () => {
  const { data: judges, isLoading } = useQuery({
    queryKey: ["judges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("judges")
        .select("*")
        .order("full_name", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Судді SAR</h1>
          <p className="text-muted-foreground text-lg">
            Сертифіковані судді з пошуково-рятувальної кінології в Україні
          </p>
        </div>

        {!judges || judges.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Немає доступних даних про суддів</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {judges.map((judge) => (
              <Card key={judge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={judge.photo_url || undefined} alt={judge.full_name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {judge.full_name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{judge.full_name}</CardTitle>
                      <Badge className="mt-2">{judge.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    {judge.region}
                  </div>
                  {judge.experience_years && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                      Досвід: {judge.experience_years} років
                    </div>
                  )}
                  {judge.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <a href={`mailto:${judge.email}`} className="hover:text-primary truncate">
                        {judge.email}
                      </a>
                    </div>
                  )}
                  {judge.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <a href={`tel:${judge.phone}`} className="hover:text-primary">
                        {judge.phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Judges;
