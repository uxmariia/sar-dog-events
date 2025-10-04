import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const Results = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select(`
          *,
          competitions (
            title,
            start_date,
            location
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getPlaceBadge = (place: number | null) => {
    if (!place) return null;
    
    const variants: Record<number, "default" | "secondary" | "destructive"> = {
      1: "default",
      2: "secondary",
      3: "destructive",
    };
    
    return (
      <Badge variant={variants[place] || "secondary"}>
        {place === 1 ? "🥇" : place === 2 ? "🥈" : place === 3 ? "🥉" : `${place} місце`}
      </Badge>
    );
  };

  const groupedResults = results?.reduce((acc: any, result: any) => {
    const competitionId = result.competition_id;
    if (!acc[competitionId]) {
      acc[competitionId] = {
        competition: result.competitions,
        results: [],
      };
    }
    acc[competitionId].results.push(result);
    return acc;
  }, {});

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
          <h1 className="text-4xl font-bold mb-2">Результати змагань</h1>
          <p className="text-muted-foreground text-lg">
            Результати минулих змагань з пошуково-рятувальної кінології
          </p>
        </div>

        {!groupedResults || Object.keys(groupedResults).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Немає доступних результатів</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedResults).map((group: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-primary" />
                        {group.competition.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.competition.location} • {new Date(group.competition.start_date).toLocaleDateString("uk-UA")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Місце</TableHead>
                          <TableHead>Спортсмен</TableHead>
                          <TableHead>Собака</TableHead>
                          <TableHead>Команда</TableHead>
                          <TableHead className="text-right">Бали</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.results
                          .sort((a: any, b: any) => (a.place || 999) - (b.place || 999))
                          .map((result: any) => (
                            <TableRow key={result.id}>
                              <TableCell>{getPlaceBadge(result.place)}</TableCell>
                              <TableCell className="font-medium">{result.athlete_name}</TableCell>
                              <TableCell>{result.dog_name}</TableCell>
                              <TableCell>{result.team_name || "—"}</TableCell>
                              <TableCell className="text-right font-semibold">{result.score}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
