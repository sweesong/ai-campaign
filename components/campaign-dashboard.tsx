"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Clock,
} from "lucide-react"

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Holiday VIP Sale 2024",
    status: "active",
    vipSegment: "Platinum Members",
    targetCount: 1250,
    sentCount: 890,
    deliveredCount: 845,
    openRate: 68,
    responseRate: 12,
    createdAt: "2024-01-15",
    scheduledFor: "2024-01-20",
    type: "promotional",
  },
  {
    id: 2,
    name: "New Arrivals Spring Collection",
    status: "scheduled",
    vipSegment: "Gold Members",
    targetCount: 2100,
    sentCount: 0,
    deliveredCount: 0,
    openRate: 0,
    responseRate: 0,
    createdAt: "2024-01-18",
    scheduledFor: "2024-01-25",
    type: "new-arrivals",
  },
  {
    id: 3,
    name: "Exclusive Member Event",
    status: "completed",
    vipSegment: "All VIP Members",
    targetCount: 3500,
    sentCount: 3500,
    deliveredCount: 3420,
    openRate: 72,
    responseRate: 18,
    createdAt: "2024-01-10",
    scheduledFor: "2024-01-12",
    type: "exclusive-event",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "scheduled":
      return "bg-blue-500"
    case "completed":
      return "bg-gray-500"
    case "paused":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active":
      return "default"
    case "scheduled":
      return "secondary"
    case "completed":
      return "outline"
    case "paused":
      return "destructive"
    default:
      return "outline"
  }
}

export function CampaignDashboard() {
  const [campaigns] = useState(mockCampaigns)

  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0)
  const avgOpenRate = campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">{activeCampaigns} active campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,850</div>
            <p className="text-xs text-muted-foreground">Total VIP members</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Management */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {campaigns
              .filter((c) => c.status === "active")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                          <span>•</span>
                          <span>{campaign.vipSegment}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {campaign.scheduledFor}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {campaign.sentCount}/{campaign.targetCount}
                          </span>
                        </div>
                        <Progress value={(campaign.sentCount / campaign.targetCount) * 100} />
                        <p className="text-xs text-muted-foreground">
                          {Math.round((campaign.sentCount / campaign.targetCount) * 100)}% sent
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{campaign.openRate}%</div>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{campaign.responseRate}%</div>
                          <p className="text-xs text-muted-foreground">Response Rate</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{campaign.deliveredCount}</div>
                          <p className="text-xs text-muted-foreground">Delivered</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{campaign.targetCount - campaign.sentCount}</div>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="space-y-4">
            {campaigns
              .filter((c) => c.status === "scheduled")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                          <span>•</span>
                          <span>{campaign.vipSegment}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Scheduled for {campaign.scheduledFor}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Start Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Target Audience</p>
                        <p className="text-2xl font-bold">{campaign.targetCount}</p>
                        <p className="text-xs text-muted-foreground">VIP customers</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Campaign Type</p>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Created</p>
                        <p className="text-sm">{campaign.createdAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {campaigns
              .filter((c) => c.status === "completed")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                          <span>•</span>
                          <span>{campaign.vipSegment}</span>
                          <span>•</span>
                          <span>Completed {campaign.scheduledFor}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{campaign.sentCount}</div>
                        <p className="text-xs text-muted-foreground">Messages Sent</p>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold">{campaign.deliveredCount}</div>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{campaign.openRate}%</div>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{campaign.responseRate}%</div>
                        <p className="text-xs text-muted-foreground">Response Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
