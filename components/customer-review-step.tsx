"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Trash2, Users, MessageSquare, Check, X } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  vipTier: string
  lastPurchase: string
  generatedSMS: string
  avatar?: string
}

// Mock customer data - in real app this would come from your database
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    vipTier: "Platinum",
    lastPurchase: "Designer handbag - $450",
    generatedSMS:
      "Hi Sarah! 🌟 Exclusive 30% off luxury handbags just for our Platinum members. Your favorite brands await! Shop now: mall.com/vip",
  },
  {
    id: "2",
    name: "Michael Chen",
    phone: "+1 (555) 234-5678",
    vipTier: "Gold",
    lastPurchase: "Smart watch - $299",
    generatedSMS:
      "Michael, your Gold status unlocks 25% off tech accessories! New smartwatch collections just arrived. Limited time: mall.com/tech",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    phone: "+1 (555) 345-6789",
    vipTier: "Platinum",
    lastPurchase: "Jewelry set - $680",
    lastPurchase: "Jewelry set - $680",
    generatedSMS:
      "Emma! ✨ Platinum exclusive: 35% off fine jewelry. New arrivals from your favorite designers. Don't miss out: mall.com/jewelry",
  },
  {
    id: "4",
    name: "David Kim",
    phone: "+1 (555) 456-7890",
    vipTier: "Silver",
    lastPurchase: "Casual wear - $120",
    generatedSMS:
      "David, Silver member special! 20% off casual wear + free styling session. Upgrade your wardrobe today: mall.com/style",
  },
]

interface CustomerReviewStepProps {
  campaignData: any
}

export function CustomerReviewStep({ campaignData }: CustomerReviewStepProps) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedMessage, setEditedMessage] = useState("")

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id)
    setEditedMessage(customer.generatedSMS)
  }

  const handleSaveEdit = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === customerId ? { ...customer, generatedSMS: editedMessage } : customer)),
    )
    setEditingId(null)
    setEditedMessage("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedMessage("")
  }

  const handleDelete = (customerId: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-purple-100 text-purple-800"
      case "Gold":
        return "bg-yellow-100 text-yellow-800"
      case "Silver":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Review Target Customers & Messages
        </CardTitle>
        <CardDescription>
          Review and edit personalized SMS messages for each customer in your target audience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{customers.length}</div>
            <div className="text-sm text-muted-foreground">Total Recipients</div>
          </div>
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.vipTier === "Platinum").length}
            </div>
            <div className="text-sm text-muted-foreground">Platinum Members</div>
          </div>
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(customers.reduce((acc, c) => acc + c.generatedSMS.length, 0) / customers.length)}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Message Length</div>
          </div>
        </div>

        <Separator />

        {/* Customer List */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Generated Messages ({customers.length})
          </h4>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 space-y-3">
                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </div>
                    <Badge className={getTierColor(customer.vipTier)}>{customer.vipTier}</Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Last Purchase:</div>
                    <div className="font-medium">{customer.lastPurchase}</div>
                  </div>
                </div>

                {/* SMS Message */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Generated SMS:</Label>
                  {editingId === customer.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveEdit(customer.id)} className="h-8">
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 bg-transparent">
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{customer.generatedSMS}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{customer.generatedSMS.length} characters</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(customer)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(customer.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No customers in target audience</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
