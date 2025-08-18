import { CampaignCreationForm } from "@/components/campaign-creation-form"
import { CampaignDashboard } from "@/components/campaign-dashboard"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">SMS Campaign Manager</h1>
            <p className="text-muted-foreground">Create and manage AI-powered SMS campaigns for your VIP customers</p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Campaign Dashboard</TabsTrigger>
              <TabsTrigger value="create">Create Campaign</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <CampaignDashboard />
            </TabsContent>

            <TabsContent value="create">
              <CampaignCreationForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
