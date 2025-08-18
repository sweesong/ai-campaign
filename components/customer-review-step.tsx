"use client"

import { useState } from "react"
import { CampaignData } from './campaign-creation-form'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit2, Trash2, Users, Check, X, Search, Plus, Loader2, UserPlus, RotateCcw, Target } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  vipTier: string
  lastPurchase: string
  generatedSMS: string
  avatar?: string
  isGenerating?: boolean
}

const allCustomersDatabase: Omit<Customer, "generatedSMS">[] = [
  {
    id: "5",
    name: "Jessica Williams",
    phone: "+1 (555) 567-8901",
    vipTier: "Platinum",
    lastPurchase: "Luxury perfume - $180",
  },
  {
    id: "6",
    name: "Robert Taylor",
    phone: "+1 (555) 678-9012",
    vipTier: "Gold",
    lastPurchase: "Sports equipment - $320",
  },
  {
    id: "7",
    name: "Lisa Anderson",
    phone: "+1 (555) 789-0123",
    vipTier: "Silver",
    lastPurchase: "Home decor - $95",
  },
  {
    id: "8",
    name: "James Wilson",
    phone: "+1 (555) 890-1234",
    vipTier: "Platinum",
    lastPurchase: "Designer shoes - $420",
  },
  {
    id: "9",
    name: "Maria Garcia",
    phone: "+1 (555) 901-2345",
    vipTier: "Gold",
    lastPurchase: "Electronics - $250",
  },
]

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
      "David, Silver member perk! 20% off casual wear + free styling session. Upgrade your wardrobe today: mall.com/style",
  },
]

interface CustomerReviewStepProps {
  campaignData: CampaignData
}

export function CustomerReviewStep({ campaignData }: CustomerReviewStepProps) {
  const [originalCustomers, setOriginalCustomers] = useState<Customer[]>(mockCustomers)
  const [manuallyAddedCustomers, setManuallyAddedCustomers] = useState<Customer[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedMessage, setEditedMessage] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSearchQuery, setModalSearchQuery] = useState("")
  const [modalSearchResults, setModalSearchResults] = useState<Omit<Customer, "generatedSMS">[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Omit<Customer, "generatedSMS"> | null>(null)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)

  console.log("campaignData", campaignData)

  const handleModalSearch = (query: string) => {
    setModalSearchQuery(query)
    if (query.length > 0) {
      const results = allCustomersDatabase
        .filter(
          (customer) =>
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query) ||
            customer.vipTier.toLowerCase().includes(query.toLowerCase()),
        )
        .filter(
          (customer) =>
            !originalCustomers.some((existing) => existing.id === customer.id) &&
            !manuallyAddedCustomers.some((existing) => existing.id === customer.id),
        )
      setModalSearchResults(results)
    } else {
      setModalSearchResults([])
    }
  }

  const generateSMSForCustomer = (customerData: Omit<Customer, "generatedSMS">) => {
    const { vipTier, lastPurchase, name } = customerData

    let smsTemplate = ""
    if (vipTier === "Platinum") {
      smsTemplate = `${name}! ✨ Platinum exclusive: 35% off ${lastPurchase.split(" - ")[0].toLowerCase()}. Premium collection just for you! mall.com/vip`
    } else if (vipTier === "Gold") {
      smsTemplate = `${name}, Gold member special! 25% off ${lastPurchase.split(" - ")[0].toLowerCase()} + free consultation. Limited time: mall.com/gold`
    } else {
      smsTemplate = `${name}, Silver member perk! 20% off ${lastPurchase.split(" - ")[0].toLowerCase()} + exclusive access. Shop now: mall.com/silver`
    }

    return smsTemplate
  }

  const handleCustomerSelect = async (customerData: Omit<Customer, "generatedSMS">) => {
    setSelectedCustomer(customerData)
    setIsGeneratingMessage(true)
    setGeneratedMessage("")

    // Simulate AI SMS generation with 2-3 second delay
    setTimeout(() => {
      const smsMessage = generateSMSForCustomer(customerData)
      setGeneratedMessage(smsMessage)
      setIsGeneratingMessage(false)
    }, 2500)
  }

  const handleRegenerateMessage = () => {
    if (selectedCustomer) {
      setIsGeneratingMessage(true)
      setTimeout(() => {
        const smsMessage = generateSMSForCustomer(selectedCustomer)
        setGeneratedMessage(smsMessage)
        setIsGeneratingMessage(false)
      }, 2500)
    }
  }

  const handleAddToList = () => {
    if (selectedCustomer && generatedMessage) {
      const newCustomer: Customer = {
        ...selectedCustomer,
        generatedSMS: generatedMessage,
      }
      setManuallyAddedCustomers((prev) => [...prev, newCustomer])
      handleCloseModal()
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalSearchQuery("")
    setModalSearchResults([])
    setSelectedCustomer(null)
    setGeneratedMessage("")
    setIsGeneratingMessage(false)
  }

  const handleSaveEdit = (customerId: string) => {
    setOriginalCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId ? { ...customer, generatedSMS: editedMessage } : customer,
      ),
    )
    setManuallyAddedCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId ? { ...customer, generatedSMS: editedMessage } : customer,
      ),
    )
    setEditingId(null)
    setEditedMessage("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedMessage("")
  }

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id)
    setEditedMessage(customer.generatedSMS)
  }

  const handleDelete = (customerId: string) => {
    setOriginalCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== customerId))
    setManuallyAddedCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== customerId))
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

  const totalCustomers = originalCustomers.length + manuallyAddedCustomers.length
  const allCustomers = [...originalCustomers, ...manuallyAddedCustomers]
  const platinumCount = allCustomers.filter((c) => c.vipTier === "Platinum").length
  const avgMessageLength =
    allCustomers.length > 0
      ? Math.round(
        allCustomers.filter((c) => c.generatedSMS).reduce((acc, c) => acc + c.generatedSMS.length, 0) /
        allCustomers.filter((c) => c.generatedSMS).length,
      )
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Review Target Customers & Messages
        </CardTitle>
        <CardDescription>
          Review and edit personalized SMS messages, or add more customers to your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <Label className="font-medium">Add More Customers</Label>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="w-full justify-start gap-2">
            <Search className="h-4 w-4" />
            Search and add customers to campaign...
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add Customer to Campaign</DialogTitle>
              <DialogDescription>Search for customers and generate personalized SMS messages</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              {!selectedCustomer ? (
                <>
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers by name, phone, or VIP tier..."
                      value={modalSearchQuery}
                      onChange={(e) => handleModalSearch(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                  </div>

                  {/* Search Results */}
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {modalSearchResults.length > 0 ? (
                      modalSearchResults.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
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
                                <div className="text-xs text-muted-foreground mt-1">
                                  Last purchase: {customer.lastPurchase}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTierColor(customer.vipTier)}>{customer.vipTier}</Badge>
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : modalSearchQuery.length > 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No customers found matching{modalSearchQuery}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start typing to search for customers</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Selected Customer & Message Generation */}
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {selectedCustomer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{selectedCustomer.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedCustomer.phone}</div>
                        <div className="text-xs text-muted-foreground">
                          Last purchase: {selectedCustomer.lastPurchase}
                        </div>
                      </div>
                      <Badge className={getTierColor(selectedCustomer.vipTier)}>{selectedCustomer.vipTier}</Badge>
                    </div>

                    {/* Generated Message */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Generated SMS Message</Label>
                        {!isGeneratingMessage && generatedMessage && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRegenerateMessage}
                            className="h-8 gap-1 bg-transparent"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Regenerate
                          </Button>
                        )}
                      </div>

                      <div className="min-h-[100px] p-4 border rounded-lg bg-background">
                        {isGeneratingMessage ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm">
                              Generating personalized SMS based on purchase history and campaign settings...
                            </span>
                          </div>
                        ) : generatedMessage ? (
                          <div className="space-y-2">
                            <p className="text-sm">{generatedMessage}</p>
                            <div className="text-xs text-muted-foreground">{generatedMessage.length} characters</div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleAddToList}
                        disabled={isGeneratingMessage || !generatedMessage}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to List
                      </Button>
                      <Button variant="outline" onClick={handleCloseModal} className="flex-1 bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Separator />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{totalCustomers}</div>
            <div className="text-sm text-muted-foreground">Total Recipients</div>
          </div>
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{platinumCount}</div>
            <div className="text-sm text-muted-foreground">Platinum Members</div>
          </div>
          <div className="bg-muted p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{avgMessageLength}</div>
            <div className="text-sm text-muted-foreground">Avg. Message Length</div>
          </div>
        </div>

        <Separator />

        {/* Original Target Audience */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Original Target Audience ({originalCustomers.length})
          </h4>

          {originalCustomers.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {originalCustomers.map((customer) => (
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
                    {customer.isGenerating ? (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Generating personalized SMS based on purchase history and campaign settings...
                          </span>
                        </div>
                      </div>
                    ) : editingId === customer.id ? (
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
                          <span className="text-xs text-muted-foreground">
                            {customer.generatedSMS.length} characters
                          </span>
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No customers in original target audience</p>
            </div>
          )}
        </div>

        {/* Manually Added Customers */}
        {manuallyAddedCustomers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Manually Added Customers ({manuallyAddedCustomers.length})
              </h4>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {manuallyAddedCustomers.map((customer) => (
                  <div key={customer.id} className="border rounded-lg p-4 space-y-3 bg-blue-50/50">
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
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Manually Added
                        </Badge>
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="h-8 bg-transparent"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm">{customer.generatedSMS}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">
                              {customer.generatedSMS.length} characters
                            </span>
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
