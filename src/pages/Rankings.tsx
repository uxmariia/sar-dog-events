import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Trophy, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Rankings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("athletes_rankings")
        .select("*")
        .order("total_score", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getPlaceBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500">🥇 1 місце</Badge>;
    if (index === 1) return <Badge className="bg-gray-400">🥈 2 місце</Badge>;
    if (index === 2) return <Badge className="bg-orange-600">🥉 3 місце</Badge>;
    return <span className="text-muted-foreground">{index + 1}</span>;
  };

  if (!user || isLoading) {
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary" />
            Рейтинг спортсменів
          </h1>
          <p className="text-muted-foreground text-lg">
            Загальний рейтинг спортсменів SAR за результатами змагань
          </p>
        </div>

        {!rankings || rankings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Немає доступних даних рейтингу</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Топ спортсменів
              </CardTitle>
              <CardDescription>
                Рейтинг формується на основі результатів офіційних змагань SAR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Місце</TableHead>
                      <TableHead>Спортсмен</TableHead>
                      <TableHead>Собака</TableHead>
                      <TableHead>Команда</TableHead>
                      <TableHead className="text-center">Змагань</TableHead>
                      <TableHead className="text-center">Кращий результат</TableHead>
                      <TableHead className="text-right">Загальні бали</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((ranking, index) => (
                      <TableRow key={ranking.id} className={index < 3 ? "bg-secondary/30" : ""}>
                        <TableCell className="font-medium">{getPlaceBadge(index)}</TableCell>
                        <TableCell className="font-semibold">{ranking.athlete_name}</TableCell>
                        <TableCell>{ranking.dog_name}</TableCell>
                        <TableCell>{ranking.team_name || "—"}</TableCell>
                        <TableCell className="text-center">{ranking.competitions_count}</TableCell>
                        <TableCell className="text-center">
                          {ranking.best_place ? (
                            <Badge variant="outline">{ranking.best_place} місце</Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {ranking.total_score.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Rankings;
