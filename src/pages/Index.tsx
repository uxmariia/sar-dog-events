import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Scale, FileText, Medal, TrendingUp, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Trophy,
      title: "Змагання",
      description: "Переглядайте майбутні змагання та реєструйтеся онлайн",
      link: "/competitions",
    },
    {
      icon: Scale,
      title: "Судді",
      description: "База всіх сертифікованих суддів SAR в Україні",
      link: "/judges",
    },
    {
      icon: Users,
      title: "Команди",
      description: "Знайдіть команди з пошуково-рятувальної кінології",
      link: "/teams",
    },
    {
      icon: FileText,
      title: "Документи",
      description: "Положення, регламенти та інші важливі документи",
      link: "/documents",
    },
    {
      icon: Medal,
      title: "Результати",
      description: "Результати минулих змагань",
      link: "/results",
    },
    {
      icon: TrendingUp,
      title: "Рейтинг",
      description: "Рейтинг спортсменів (для зареєстрованих)",
      link: "/rankings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Платформа SAR Ukraine
          </h1>
          <p className="text-xl text-muted-foreground">
            Єдина платформа для спортсменів пошуково-рятувальної кінологічної служби
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link to="/competitions">
                Переглянути змагання
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link to="/auth">Зареєструватися</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full justify-between group">
                    <Link to={feature.link}>
                      Перейти
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Про SAR</CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Пошуково-рятувальна кінологічна служба (SAR) - це спеціалізована дисципліна,
              де собаки та їх провідники працюють разом для пошуку та рятування людей.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Ця платформа створена для об'єднання спортсменів SAR по всій Україні,
              надання доступу до актуальної інформації про змагання, суддів, команди
              та рейтинги. Зареєструйтеся, щоб отримати повний доступ до всіх функцій.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
