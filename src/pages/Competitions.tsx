import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Competitions = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: competitions, isLoading } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleRegister = async (competitionId: string, formData: FormData) => {
    if (!user) {
      toast.error("Увійдіть, щоб зареєструватися на змагання");
      return;
    }

    try {
      const { error } = await supabase
        .from("competition_registrations")
        .insert({
          competition_id: competitionId,
          user_id: user.id,
          dog_name: formData.get("dogName") as string,
          dog_breed: formData.get("dogBreed") as string,
          notes: formData.get("notes") as string,
        });

      if (error) throw error;

      toast.success("Реєстрацію успішно завершено!");
    } catch (error: any) {
      toast.error(error.message || "Помилка реєстрації");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      upcoming: "default",
      ongoing: "secondary",
      completed: "destructive",
    };
    const labels: Record<string, string> = {
      upcoming: "Майбутнє",
      ongoing: "В процесі",
      completed: "Завершено",
    };
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

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
          <h1 className="text-4xl font-bold mb-2">Змагання SAR</h1>
          <p className="text-muted-foreground text-lg">
            Переглядайте майбутні та минулі змагання з пошуково-рятувальної кінології
          </p>
        </div>

        {!competitions || competitions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Наразі немає запланованих змагань</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{competition.title}</CardTitle>
                    {getStatusBadge(competition.status)}
                  </div>
                  <CardDescription>{competition.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {competition.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(competition.start_date), "d MMMM yyyy", { locale: uk })}
                  </div>
                  {competition.max_participants && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      Макс. учасників: {competition.max_participants}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Реєстрація до: {format(new Date(competition.registration_deadline), "d MMMM yyyy", { locale: uk })}
                  </div>

                  {user && competition.status === "upcoming" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4">Зареєструватися</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Реєстрація на змагання</DialogTitle>
                          <DialogDescription>
                            Заповніть форму для реєстрації на {competition.title}
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister(competition.id, new FormData(e.currentTarget));
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="dogName">Кличка собаки</Label>
                            <Input id="dogName" name="dogName" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dogBreed">Порода собаки</Label>
                            <Input id="dogBreed" name="dogBreed" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Додаткові примітки (необов'язково)</Label>
                            <Textarea id="notes" name="notes" />
                          </div>
                          <Button type="submit" className="w-full">
                            Підтвердити реєстрацію
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {!user && competition.status === "upcoming" && (
                    <Button variant="outline" className="w-full mt-4" disabled>
                      Увійдіть для реєстрації
                    </Button>
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

export default Competitions;
