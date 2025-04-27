import React from "react";
import {
  ChevronLeftIcon,
  ChevronUpIcon,
  PlusIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { ChatbotPane } from "../../../../components/Chatbot/ChatbotPane";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";

interface MainContentSectionProps {
  chatbotOpen: boolean;
  onCloseChatbot: () => void;
}

export const MainContentSection: React.FC<MainContentSectionProps> = ({
  chatbotOpen,
  onCloseChatbot
}): JSX.Element => {
  // Frameworks data
  const frameworks = [
    {
      id: 1,
      name: "BRSR",
      description: "Business Responsibility and Sustainability Report",
      status: "Active",
      lastUpdated: "June 12, 2024",
      category: "Environmental",
    },
    {
      id: 2,
      name: "GRI",
      description: "Global Reporting Initiative",
      status: "Active",
      lastUpdated: "May 15, 2024",
      category: "Environmental",
    },
    {
      id: 3,
      name: "SASB",
      description: "Sustainability Accounting Standards Board",
      status: "Inactive",
      lastUpdated: "March 22, 2024",
      category: "Financial",
    },
    {
      id: 4,
      name: "TCFD",
      description: "Task Force on Climate-related Financial Disclosures",
      status: "Active",
      lastUpdated: "April 5, 2024",
      category: "Environmental",
    },
    {
      id: 5,
      name: "CDSB",
      description: "Climate Disclosure Standards Board",
      status: "Inactive",
      lastUpdated: "January 8, 2024",
      category: "Environmental",
    },
    {
      id: 6,
      name: "ESRS",
      description: "European Sustainability Reporting Standards",
      status: "Active",
      lastUpdated: "June 20, 2024",
      category: "Governance",
    },
  ];
  
  // Disclosure items with sub-items
  const disclosureItems = [
    {
      id: 1,
      title: "C0. Introduction",
      subItems: [
        { id: 101, title: "Basis 1", description: "Details about Basis 1" },
        { id: 102, title: "Basis 2", description: "Details about Basis 2" },
        { id: 103, title: "Basis 3", description: "Details about Basis 3" },
      ]
    },
    {
      id: 2,
      title: "Governance Structure",
      subItems: [
        { id: 201, title: "Board Composition", description: "Details about board composition" },
        { id: 202, title: "Committees", description: "Details about committees" },
        { id: 203, title: "Executive Leadership", description: "Details about executive leadership" },
      ]
    },
    {
      id: 3,
      title: "Environmental Performance",
      subItems: [
        { id: 301, title: "Carbon Emissions", description: "Details about carbon emissions" },
        { id: 302, title: "Water Usage", description: "Details about water usage" },
        { id: 303, title: "Waste Management", description: "Details about waste management" },
      ]
    },
    {
      id: 4,
      title: "Social Impacts",
      subItems: [
        { id: 401, title: "Employee Welfare", description: "Details about employee welfare" },
        { id: 402, title: "Community Engagement", description: "Details about community engagement" },
        { id: 403, title: "Diversity & Inclusion", description: "Details about diversity and inclusion" },
      ]
    },
    {
      id: 5,
      title: "Financial Metrics",
      subItems: [
        { id: 501, title: "Revenue Breakdown", description: "Details about revenue breakdown" },
        { id: 502, title: "ESG Investments", description: "Details about ESG investments" },
        { id: 503, title: "Risk Assessment", description: "Details about risk assessment" },
      ]
    },
  ];

  return (
    <div className="flex flex-col w-full h-[calc(100vh-67px)] overflow-auto">
      <div className="flex items-center p-6 gap-4">
        <Button variant="outline" size="icon" className="bg-white rounded-md">
          <ChevronLeftIcon className="h-3.5 w-[9px]" />
        </Button>
        <h1 className="font-bold text-2xl text-[#000000cc] tracking-[-0.08px]">
          Disclosures
        </h1>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="frameworks" className="w-full">
          <div className="border-b border-[#d6d6d6] mx-6">
            <TabsList className="bg-transparent h-[55px]">
              <TabsTrigger
                value="frameworks"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#1f1f1f] data-[state=active]:text-[#000000cc] data-[state=inactive]:text-[#0000008f] rounded-t-md h-[55px] font-['Arial-Narrow',Helvetica]"
              >
                Frameworks
              </TabsTrigger>
              <TabsTrigger
                value="disclosures"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#1f1f1f] data-[state=inactive]:text-[#0000008f] rounded-t-md h-[55px] font-['Arial-Narrow',Helvetica]"
              >
                Disclosures
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#1f1f1f] data-[state=inactive]:text-[#0000008f] rounded-t-md h-[55px] font-['Arial-Narrow',Helvetica]"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="frameworks" className="p-6 overflow-auto">
            <div className="flex" style={{ flexWrap: chatbotOpen ? "wrap" : "nowrap" }}>
              <div className={`${chatbotOpen ? 'w-[68%]' : 'w-full'} transition-all duration-300`}>
                <div className="flex flex-col space-y-6">
              {/* Top action section */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                  <div className="relative w-[300px]">
                    <Input 
                      className="pl-10 pr-4 h-10 rounded-md border-[#d6d6d6]" 
                      placeholder="Search frameworks..."
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[150px] h-10 border-[#d6d6d6]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[150px] h-10 border-[#d6d6d6]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-[#1f1f1f] text-white rounded-md h-10 px-4">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">Add Framework</span>
                </Button>
              </div>

              {/* Frameworks Table */}
              <Card className="w-full border-[#d6d6d6]">
                <CardHeader className="bg-[#f9f9f9] px-6 py-4 border-b border-[#d6d6d6]">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-bold text-[#000000cc]">
                      Available Frameworks
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-[#0000008f]">
                      <span>Showing 1-6 of 6 results</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 border-[#d6d6d6] opacity-50"
                          disabled
                        >
                          <ChevronLeftIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 border-[#d6d6d6] opacity-50"
                          disabled
                        >
                          <ChevronLeftIcon className="h-3.5 w-3.5 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#d6d6d6]">
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#000000cc]">
                          <div className="flex items-center gap-1">
                            Framework
                            <ChevronsUpDownIcon className="h-3.5 w-3.5" />
                          </div>
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#000000cc]">
                          <div className="flex items-center gap-1">
                            Description
                            <ChevronsUpDownIcon className="h-3.5 w-3.5" />
                          </div>
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#000000cc]">
                          <div className="flex items-center gap-1">
                            Status
                            <ChevronsUpDownIcon className="h-3.5 w-3.5" />
                          </div>
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#000000cc]">
                          <div className="flex items-center gap-1">
                            Last Updated
                            <ChevronsUpDownIcon className="h-3.5 w-3.5" />
                          </div>
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-[#000000cc]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {frameworks.map((framework) => (
                        <tr 
                          key={framework.id} 
                          className="border-b border-[#d6d6d6] hover:bg-[#f9f9f9]"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-[#f0f0f0] rounded-md flex items-center justify-center text-lg font-bold text-[#1f1f1f]">
                                {framework.name.slice(0, 1)}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#000000cc]">
                                  {framework.name}
                                </div>
                                <Badge 
                                  className="bg-[#ebebeb] text-[#0000008f] font-normal border-none text-xs mt-1"
                                >
                                  {framework.category}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#0000008f]">
                            {framework.description}
                          </td>
                          <td className="py-4 px-6">
                            {framework.status === "Active" ? (
                              <span className="flex items-center gap-1.5 text-[#22c55e] text-sm">
                                <CheckIcon className="h-3.5 w-3.5" />
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-[#ef4444] text-sm">
                                <XIcon className="h-3.5 w-3.5" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#0000008f]">
                            {framework.lastUpdated}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3 border-[#d6d6d6] text-sm"
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3 border-[#d6d6d6] text-sm"
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Framework Details Card */}
              <Card className="w-full border-[#d6d6d6]">
                <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-[#d6d6d6]">
                  <CardTitle className="text-base font-bold text-[#000000cc]">
                    Framework Details
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <ChevronUpIcon className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-4">What are disclosure frameworks?</h3>
                      <p className="text-sm text-[#0000008f] leading-relaxed">
                        Disclosure frameworks provide standardized guidelines and structures
                        for organizations to report on their sustainability performance,
                        impacts, and governance. They ensure consistency, comparability,
                        and transparency in corporate reporting.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-4">Why use multiple frameworks?</h3>
                      <p className="text-sm text-[#0000008f] leading-relaxed">
                        Different stakeholders and jurisdictions may require reports aligned
                        with specific frameworks. Using multiple frameworks allows you to address
                        various regulatory requirements, investor expectations, and stakeholder
                        needs efficiently.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-4">Getting started</h3>
                      <p className="text-sm text-[#0000008f] leading-relaxed">
                        Select a framework to activate it for your organization. Once activated,
                        you can begin responding to its disclosure requirements through guided workflows.
                        Our platform helps identify overlaps between frameworks to streamline reporting.
                      </p>
                      <Button 
                        variant="link" 
                        className="text-[#1f1f1f] p-0 h-auto mt-2 text-sm font-semibold"
                      >
                        View documentation
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>  
          </div>
          </TabsContent>

          <TabsContent value="disclosures" className="p-6">
            <div className="flex" style={{ flexWrap: chatbotOpen ? "wrap" : "nowrap" }}>
              <div className={`${chatbotOpen ? 'w-[68%]' : 'w-full'} transition-all duration-300`}>
                <div className="flex flex-col space-y-6">
                  {/* Top action section */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 items-center">
                      <div className="relative w-[300px]">
                        <Input 
                          className="pl-10 pr-4 h-10 rounded-md border-[#d6d6d6]" 
                          placeholder="Search disclosures..."
                        />
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <Select>
                        <SelectTrigger className="w-[150px] h-10 border-[#d6d6d6]">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="governance">Governance</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-[#1f1f1f] text-white rounded-md h-10 px-4">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">Add Disclosure</span>
                    </Button>
                  </div>

                  {/* Disclosures List */}
                  <Card className="w-full border-[#d6d6d6]">
                    <CardHeader className="bg-[#f9f9f9] px-6 py-4 border-b border-[#d6d6d6]">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-bold text-[#000000cc]">
                          Disclosure Items
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-[#0000008f]">
                          <span>Showing all disclosure items</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Accordion type="single" collapsible className="w-full">
                        {disclosureItems.map((item) => (
                          <AccordionItem key={item.id} value={`item-${item.id}`} className="border-b border-[#d6d6d6]">
                            <AccordionTrigger className="py-4 px-4 hover:bg-[#f9f9f9] hover:no-underline rounded-md">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#f0f0f0] rounded-md flex items-center justify-center text-lg font-bold text-[#1f1f1f]">
                                  {item.id}
                                </div>
                                <div className="text-base font-semibold text-[#000000cc]">
                                  {item.title}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pt-2">
                              <div className="pl-12 space-y-3">
                                {item.subItems.map((subItem) => (
                                  <div 
                                    key={subItem.id} 
                                    className="p-3 border border-[#d6d6d6] rounded-md hover:bg-[#f9f9f9] cursor-pointer"
                                  >
                                    <div className="font-medium text-[#000000cc] mb-1">
                                      {subItem.title}
                                    </div>
                                    <div className="text-sm text-[#0000008f]">
                                      {subItem.description}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>

                  {/* Disclosure Details Card */}
                  <Card className="w-full border-[#d6d6d6]">
                    <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-[#d6d6d6]">
                      <CardTitle className="text-base font-bold text-[#000000cc]">
                        Disclosure Details
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <ChevronUpIcon className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <h3 className="text-sm font-semibold text-[#000000cc] mb-4">What are disclosure items?</h3>
                          <p className="text-sm text-[#0000008f] leading-relaxed">
                            Disclosure items are specific pieces of information that companies
                            need to report on as part of their sustainability reporting.
                            Each item relates to a specific environmental, social, or governance topic.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#000000cc] mb-4">Managing disclosures</h3>
                          <p className="text-sm text-[#0000008f] leading-relaxed">
                            Click on a disclosure item to view its sub-items and detailed requirements.
                            You can respond to each sub-item individually and track your progress.
                            Your responses will be saved and can be exported as part of your final report.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#000000cc] mb-4">Getting started</h3>
                          <p className="text-sm text-[#0000008f] leading-relaxed">
                            Begin by exploring the disclosure items listed above.
                            Focus on items that are most relevant to your organization
                            and prioritize those with upcoming deadlines or regulatory requirements.
                          </p>
                          <Button 
                            variant="link" 
                            className="text-[#1f1f1f] p-0 h-auto mt-2 text-sm font-semibold"
                          >
                            View guidance
                            <ExternalLinkIcon className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-6">
            <div className="flex flex-col space-y-6 max-w-3xl">
              <Card className="border-[#d6d6d6]">
                <CardHeader className="py-4 px-6">
                  <CardTitle className="text-base font-bold text-[#000000cc]">
                    Disclosure Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-2">Reporting Period</h3>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-[#0000008f] mb-1 block">Start Date</label>
                          <Input 
                            type="date" 
                            className="h-10 border-[#d6d6d6]"
                            defaultValue="2024-01-01"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-[#0000008f] mb-1 block">End Date</label>
                          <Input 
                            type="date" 
                            className="h-10 border-[#d6d6d6]"
                            defaultValue="2024-12-31"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-2">Default View</h3>
                      <Select defaultValue="frameworks">
                        <SelectTrigger className="w-full h-10 border-[#d6d6d6]">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frameworks">Frameworks</SelectItem>
                          <SelectItem value="disclosures">Disclosures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-2">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#000000cc]">Framework updates</p>
                            <p className="text-xs text-[#0000008f]">
                              Get notified when frameworks are updated
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-[#1f1f1f] rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#000000cc]">Disclosure deadlines</p>
                            <p className="text-xs text-[#0000008f]">
                              Get reminded about upcoming deadlines
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-[#1f1f1f] rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#000000cc]">Workflow activity</p>
                            <p className="text-xs text-[#0000008f]">
                              Get notified about comments and changes
                            </p>
                          </div>
                          <div className="h-5 w-10 bg-[#d6d6d6] rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#d6d6d6]">
                <CardHeader className="py-4 px-6">
                  <CardTitle className="text-base font-bold text-[#000000cc]">
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-2">Data Export</h3>
                      <p className="text-sm text-[#0000008f] mb-4">
                        Export your disclosure data for use in other systems or reports.
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="h-10 border-[#d6d6d6] text-sm"
                        >
                          Export as XLSX
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-10 border-[#d6d6d6] text-sm"
                        >
                          Export as CSV
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-10 border-[#d6d6d6] text-sm"
                        >
                          Export as PDF
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#000000cc] mb-2">Data Retention</h3>
                      <p className="text-sm text-[#0000008f] mb-4">
                        Set how long disclosure data should be kept in the system.
                      </p>
                      <Select defaultValue="5years">
                        <SelectTrigger className="w-[250px] h-10 border-[#d6d6d6]">
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1year">1 year</SelectItem>
                          <SelectItem value="3years">3 years</SelectItem>
                          <SelectItem value="5years">5 years</SelectItem>
                          <SelectItem value="7years">7 years</SelectItem>
                          <SelectItem value="10years">10 years</SelectItem>
                          <SelectItem value="indefinite">Indefinitely</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  className="h-10 px-4 border-[#d6d6d6] text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-[#1f1f1f] text-white h-10 px-4 text-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chatbot Pane - Floating in the bottom right */}
      {chatbotOpen && (
        <div className="fixed right-6 bottom-6 bg-white border border-[#eaeaea] rounded-lg shadow-lg w-[380px] h-[500px] overflow-hidden z-50">
          <div className="border-b border-[#eaeaea] p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <img className="h-4 w-4" src="/svg-2.svg" alt="Copilot" />
              </div>
              <span className="font-semibold text-gray-800">Copilot</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={onCloseChatbot}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Embed the ChatbotPane without header as we already have one */}
          <div className="h-[calc(100%-57px)]">
            <ChatbotPane isOpen={true} onClose={onCloseChatbot} embedded={true} />
          </div>
        </div>
      )}
    </div>
  );
};