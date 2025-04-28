import {
  BoldIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  FileTextIcon,
  ItalicIcon,
  PlusIcon,
  XIcon,
  ListIcon,
  LinkIcon,
} from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { createEditor, Editor } from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { ChatbotPane } from "../../../../components/Chatbot/ChatbotPane";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Dialog } from "../../../../components/ui/dialog";
import { Progress } from "../../../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Separator } from "../../../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

// Define custom types for our editor
type CustomElement = { type: 'paragraph' | 'heading' | 'subheading'; children: CustomText[] }
type CustomText = { text: string; bold?: boolean; italic?: boolean }

// Define a type guard for custom elements
const isCustomElement = (element: any): element is CustomElement => {
  return ['paragraph', 'heading', 'subheading'].includes(element.type)
}

// Leaf component for rendering formatted text
const Leaf = ({ attributes, children, leaf }: { attributes: any, children: any, leaf: any }) => {
  if ((leaf as any).bold) {
    children = <strong>{children}</strong>
  }

  if ((leaf as any).italic) {
    children = <em>{children}</em>
  }

  return <span {...attributes}>{children}</span>
}

// Define initial content for the editor
const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

// Custom formats for text styling
const CustomEditor = {
  isBoldMarkActive(editor: any) {
    const marks = Editor.marks(editor)
    return marks ? marks.bold === true : false
  },

  isItalicMarkActive(editor: any) {
    const marks = Editor.marks(editor)
    return marks ? marks.italic === true : false
  },

  toggleBoldMark(editor: any) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    if (isActive) {
      Editor.removeMark(editor, 'bold')
    } else {
      Editor.addMark(editor, 'bold', true)
    }
  },

  toggleItalicMark(editor: any) {
    const isActive = CustomEditor.isItalicMarkActive(editor)
    if (isActive) {
      Editor.removeMark(editor, 'italic')
    } else {
      Editor.addMark(editor, 'italic', true)
    }
  },
  
  toggleBlockType(editor: any, blockType: string) {
    const isActive = CustomEditor.isBlockActive(editor, blockType)
    const newProperties: Partial<CustomElement> = {
      type: isActive ? 'paragraph' : blockType as any,
    }
    
    Editor.withoutNormalizing(editor, () => {
      (Editor as any).setNodes(editor, newProperties, { match: (n: any) => isCustomElement(n) });
    });
  },
  
  isBlockActive(editor: any, blockType: string) {
    const [match] = Editor.nodes(editor, {
      match: n => isCustomElement(n) && n.type === blockType,
    })
    
    return !!match
  }
}

// Define a component for the toolbar buttons
const MarkButton = ({ format, icon }: { format: 'bold' | 'italic', icon: JSX.Element }) => {
  const editor = useSlate()
  const isActive = format === 'bold' 
    ? CustomEditor.isBoldMarkActive(editor)
    : CustomEditor.isItalicMarkActive(editor)
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-10 w-10 ${isActive ? 'opacity-100' : 'opacity-30'}`}
      onMouseDown={(e) => {
        e.preventDefault()
        if (format === 'bold') {
          CustomEditor.toggleBoldMark(editor)
        } else {
          CustomEditor.toggleItalicMark(editor)
        }
      }}
    >
      {icon}
    </Button>
  )
}

interface MainContentSectionProps {
  chatbotOpen: boolean;
  onCloseChatbot: () => void;
  sidebarOpen: boolean;
}

export const MainContentSection: React.FC<MainContentSectionProps> = ({ 
  chatbotOpen, 
  onCloseChatbot,
  sidebarOpen
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [cdpDialogOpen, setCdpDialogOpen] = React.useState(false);
  
  // Create and memoize the editor instance
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Define a rendering function for leaf nodes (text formatting)
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);
  
  // Define a rendering function for block elements
  const renderElement = useCallback((props: any) => {
    const { attributes, children, element } = props;
    
    const commonStyles = "break-words";
    
    switch (element.type) {
      case 'heading':
        return <h2 {...attributes} className={`text-xl font-bold mb-2 ${commonStyles}`}>{children}</h2>;
      case 'subheading':
        return <h3 {...attributes} className={`text-lg font-semibold mb-1 ${commonStyles}`}>{children}</h3>;
      default:
        return <p {...attributes} className={`mb-4 ${commonStyles}`}>{children}</p>;
    }
  }, []);
  
  // Handle value change in the editor
  const [value, setValue] = React.useState<CustomElement[]>(initialValue);

  // Disclosure requirements data with sub-items
  const disclosureItems = [
    { 
      id: 1, 
      title: "C0. Introduction", 
      expanded: true,
      subItems: [
        { id: 101, title: "C0.1", description: "Give a general description and introduction to your organisation" },
        { id: 102, title: "C0.2", description: "State the start and end date of the year for which you are reporting data and indicate whether you will be providing emissions data for past reporting years." },
        { id: 103, title: "C0.3", description: "Select the countries/areas in which you operate" },
        { id: 104, title: "C0.4", description: "Select the currency used for all financial information disclosed throughout your response." },
        { id: 105, title: "C0.5", description: "Select the option that describes the reporting boundary for which climate related impacts on your business are being reported. Note that this option should align with your chosen approach for consolidating your GHG inventory." },
        { id: 106, title: "C-CE0.7", description: "Which part of the concrete value chain does your organization operate in?" },
        { id: 107, title: "C-MM0.7", description: " Which part of the metals and mining value chain does your organization operate in?" },
        { id: 108, title: "C0.8", description: " Does your organization have an ISIN code or another unique identifier (e.g., Ticker, CUSIP, etc.)?" },
      ] 
    },
    { 
      id: 2, 
      title: "C1. Governance", 
      expanded: false,
      subItems: [
        { id: 201, title: "Circumstance 1", description: "Details about Circumstance 1" },
        { id: 202, title: "Circumstance 2", description: "Details about Circumstance 2" },
        { id: 203, title: "Circumstance 3", description: "Details about Circumstance 3" },
      ]
    },
    {
      id: 3,
      title: "C2. Risks and Opportunities",
      expanded: false,
      subItems: [
        { id: 301, title: "Board Responsibilities", description: "Details about board responsibilities" },
        { id: 302, title: "Management Oversight", description: "Details about management oversight" },
        { id: 303, title: "Supervisory Duties", description: "Details about supervisory duties" },
      ]
    },
    {
      id: 4,
      title: "C3. Business Strategy",
      expanded: false,
      subItems: [
        { id: 401, title: "Information Types", description: "Details about information types" },
        { id: 402, title: "Disclosure Format", description: "Details about disclosure format" },
        { id: 403, title: "Coverage Areas", description: "Details about coverage areas" },
      ]
    },
    { 
      id: 5, 
      title: "C4. Targets and Performance", 
      expanded: false,
      subItems: [
        { id: 501, title: "Performance Metrics", description: "Details about performance metrics" },
        { id: 502, title: "Long-term Plans", description: "Details about long-term plans" },
        { id: 503, title: "Reward Structure", description: "Details about reward structure" },
      ]
    },
    { 
      id: 6, 
      title: "C5. Emissions Methodology", 
      expanded: false,
      subItems: [
        { id: 601, title: "Process Overview", description: "Details about due diligence process" },
        { id: 602, title: "Risk Assessment", description: "Details about risk assessment" },
      ]
    },
    { 
      id: 7, 
      title: "C6. Emissions Data", 
      expanded: false,
      subItems: [
        { id: 701, title: "Control Framework", description: "Details about control framework" },
        { id: 702, title: "Risk Mitigation", description: "Details about risk mitigation" },
        { id: 703, title: "Monitoring Process", description: "Details about monitoring process" },
      ]
    },
    {
      id: 8,
      title: "C7. Emissions Breakdowns",
      expanded: false,
      subItems: [
        { id: 801, title: "Methodology", description: "Details about materiality methodology" },
        { id: 802, title: "Stakeholder Input", description: "Details about stakeholder input" },
        { id: 803, title: "Prioritization Criteria", description: "Details about prioritization criteria" },
      ]
    },
    {
      id: 9,
      title: "C8. Energy",
      expanded: false,
      subItems: [
        { id: 901, title: "Environmental Disclosures", description: "Details about environmental disclosures" },
        { id: 902, title: "Social Disclosures", description: "Details about social disclosures" },
        { id: 903, title: "Governance Disclosures", description: "Details about governance disclosures" },
      ]
    },
    {
      id: 10,
      title: "C9. Additional Metrics",
      expanded: false,
      subItems: [
        { id: 1001, title: "Business Strategy", description: "Details about business strategy" },
        { id: 1002, title: "Value Creation", description: "Details about value creation" },
        { id: 1003, title: "Supply Chain", description: "Details about supply chain" },
      ]
    },
    { 
      id: 11, 
      title: "C10. Verification", 
      expanded: false,
      subItems: [
        { id: 1101, title: "Stakeholder Engagement", description: "Details about stakeholder engagement" },
        { id: 1102, title: "Feedback Mechanisms", description: "Details about feedback mechanisms" },
        { id: 1103, title: "Response Actions", description: "Details about response actions" },
      ]
    },
    {
      id: 12,
      title: "C11. Carbon Pricing",
      expanded: false,
      subItems: [
        { id: 1201, title: "Key Impacts", description: "Details about key impacts" },
        { id: 1202, title: "Risk Assessment", description: "Details about risk assessment" },
        { id: 1203, title: "Opportunity Analysis", description: "Details about opportunity analysis" },
      ]
    },
  ];

  return (
    <div className={`flex flex-col w-full h-[calc(100vh-67px)] overflow-auto ${!sidebarOpen ? 'ml-0' : ''}`}>
      <div className="flex items-center p-6 gap-4">
        <Button variant="outline" size="icon" className="bg-white rounded-md">
          <ChevronLeftIcon className="h-3.5 w-[9px]" />
        </Button>
        <h1 className="font-bold text-2xl text-[#000000cc] tracking-[-0.08px]">
          CDP Climate Change Questionnaire 2025
        </h1>
        <Badge
          variant="outline"
          className="bg-[#ebebeb] rounded px-2 py-0.5 h-6"
        >
          <span className="font-light text-sm text-[#000000cc] tracking-[0.08px]">
            CDP - Sagar Cement 
          </span>
        </Badge>
        <Badge
          variant="outline"
          className="bg-[#ebebeb] rounded px-2 py-0.5 h-6"
        >
          <span className="font-normal text-sm text-[#000000cc] tracking-[0.08px] font-['Arial-Narrow',Helvetica]">
            2025
          </span>
        </Badge>
        <div className="flex-1" />
        <Button
          className="bg-white text-black border border-[#222] rounded-xl px-4 h-[37px] shadow flex items-center hover:bg-gray-100 mr-2"
          onClick={() => setCdpDialogOpen(true)}
        >
          Mock CDP Score
        </Button>
        <Button
          className="bg-black text-white rounded-xl px-4 h-[37px] shadow flex items-center hover:bg-gray-900"
          onClick={() => setDialogOpen(true)}
        >
          <FileTextIcon className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="standard" className="w-full">
          <div className="border-b border-[#d6d6d6] mx-6">
            <TabsList className="bg-transparent h-[55px]">
              <TabsTrigger
                value="standard"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#1f1f1f] data-[state=active]:text-[#000000cc] data-[state=inactive]:text-[#0000008f] rounded-t-md h-[55px] font-['Arial-Narrow',Helvetica]"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#1f1f1f] data-[state=inactive]:text-[#0000008f] rounded-t-md h-[55px] font-['Arial-Narrow',Helvetica]"
              >
                Files
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#1f1f1f] data-[state=inactive]:text-[#0000008f] rounded-t-md h-[55px] font-['Arial-Narrow',Helvetica]"
              >
                Activity
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="standard"
            className="flex p-6 overflow-auto"
          >
            <div className="flex w-full" style={{ flexWrap: chatbotOpen ? "wrap" : "nowrap" }}>
              {/* Left Panel - Disclosure Requirements */}
              <Card className={`${chatbotOpen ? 'w-[32%]' : 'w-[33%]'} h-[960px] overflow-auto`}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-bold text-[#000000cc] tracking-[0.08px]">
                      Disclosure Requirements
                    </CardTitle>
                    <div className="mt-4">
                      <Progress value={0} className="h-2 bg-neutral-100 rounded" />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-[#0000008f] font-['Arial-Narrow',Helvetica] tracking-[0.08px]">
                          0/170 complete
                        </span>
                        <span className="text-xs text-[#0000008f] font-['Arial-Narrow',Helvetica] tracking-[0.08px]">
                          0%
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <div className="border-t border-b border-[#d7dadb] mt-6 py-4 px-4">
                    <Select>
                      <SelectTrigger className="w-[73px] h-10 border-[#adadad]">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <CardContent className="p-0 overflow-auto">
                    <Accordion type="single" collapsible className="w-full">
                      {disclosureItems.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={`item-${item.id}`}
                          className="border-b border-[#d6d6d6] py-0"
                        >
                          <AccordionTrigger className="py-4 px-4 hover:no-underline">
                            <span className="text-sm text-[#000000cc] font-['Arial-Narrow',Helvetica] tracking-[0.08px]">
                              {item.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-0 pb-2">
                            <div className="border-l-2 border-[#d7dadb] pl-4 ml-1 space-y-2">
                              {item.subItems.map((subItem) => (
                                <div
                                  key={subItem.id}
                                  className="flex items-start py-2 hover:bg-[#f9f9f9] rounded px-2 cursor-pointer"
                                >
                                  <div className="w-full">
                                    <div className="font-medium text-sm text-[#000000cc] font-['Arial-Narrow',Helvetica] tracking-[0.08px]">
                                      {subItem.title}
                                    </div>
                                    <div className="text-xs text-[#0000008f] font-['Arial-Narrow',Helvetica] tracking-[0.08px] mt-1">
                                      {subItem.description}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>

                  <div className="border-t border-[#d7dadb] p-4 flex items-center gap-2">
                    <CheckCircleIcon className="h-3 w-[15px]" />
                    <span className="text-xs text-[#000000cc] font-['Arial-Narrow',Helvetica] tracking-[0.08px]">
                      All Changes Saved
                    </span>
                    <span className="text-xs text-[#0000008f] font-['Arial-Narrow',Helvetica] tracking-[0.08px] ml-auto">
                      Just now
                    </span>
                  </div>
                </Card>

              {/* Center Panel - Content Area */}
              <div className={`${chatbotOpen ? 'w-[36%]' : 'w-[67%]'} flex flex-col gap-6 pl-6 overflow-auto transition-all duration-300`}>
                {/* Main Content Card */}
                <Card className="w-full h-[619px]">
                  <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="border-b-2 border-neutral-100 p-6">
                      <Badge
                        variant="outline"
                        className="bg-[#ebebeb] rounded px-2 py-0.5 h-6 mb-4"
                      >
                        <span className="font-normal text-sm text-[#000000cc] tracking-[0.08px] font-['Arial-Narrow',Helvetica]">
                          C0.1
                        </span>
                      </Badge>
                      <p className="font-bold text-base text-[#000000cc] tracking-[0.08px] leading-[22.7px]">
                      Give a general description and introduction to your organisation
                      </p>
                    </div>

                    {/* Editor Section */}
                    <div className="border-b-2 border-neutral-100">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#0000008f] font-['Arial-Narrow',Helvetica]">
                            Assign Question
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-xl"
                          >
                            <PlusIcon className="h-3.5 w-3" />
                          </Button>
                        </div>
                        <Button className="bg-[#1f1f1f] text-white rounded h-8 flex items-center gap-2">
                          <CheckCircleIcon className="h-3.5 w-3" />
                          <span className="text-sm font-['Arial-Narrow',Helvetica]">
                            Mark Complete
                          </span>
                        </Button>
                      </div>

                      <div className="px-6 py-4">
                        <Slate 
                          editor={editor} 
                          initialValue={value} 
                          onChange={newValue => setValue(newValue as CustomElement[])}
                        >
                          <div className="flex gap-2 mb-4">
                            <Select
                              onValueChange={(value) => {
                                CustomEditor.toggleBlockType(editor, value);
                              }}
                            >
                              <SelectTrigger className="w-[200px] border-[#999999]">
                                <SelectValue placeholder="Normal" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paragraph">Normal</SelectItem>
                                <SelectItem value="heading">Heading</SelectItem>
                                <SelectItem value="subheading">
                                  Subheading
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <div className="flex border rounded border-[#999999] h-[42px]">
                              <MarkButton 
                                format="bold" 
                                icon={<BoldIcon className="h-3.5 w-3.5" />} 
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="border-l border-[#999999] h-10 w-10"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  CustomEditor.toggleItalicMark(editor);
                                }}
                              >
                                <ItalicIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="flex border rounded border-[#999999] h-[42px]">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-l-md h-10 w-10"
                              >
                                <ListIcon className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="border-l border-[#999999] h-10 w-10"
                              >
                                <LinkIcon className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="border-l border-[#999999] rounded-r-md h-10 w-10"
                              >
                                <img
                                  src="/img-21.svg"
                                  alt="Format"
                                  className="h-3.5 w-3"
                                />
                              </Button>
                            </div>

                            <Button
                              variant="outline"
                              className="ml-auto border-[#999999] opacity-30"
                            >
                              <span className="text-base text-[#000000cc] font-['Arial-Narrow',Helvetica]">
                                Related Answers 
                              </span>
                            </Button>
                          </div>

                          <div className="min-h-[150px] max-h-[350px] border border-gray-200 rounded-md p-3 mt-4 overflow-y-auto">
                            <Editable
                              renderElement={renderElement}
                              renderLeaf={renderLeaf}
                              placeholder="Start typing an answer..."
                              className="h-full outline-none text-base font-['Arial-Narrow',Helvetica] tracking-[0.08px] whitespace-pre-wrap"
                              onKeyDown={(event) => {
                                // Handle keyboard shortcuts
                                if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
                                  event.preventDefault();
                                  CustomEditor.toggleBoldMark(editor);
                                } else if (event.key === 'i' && (event.ctrlKey || event.metaKey)) {
                                  event.preventDefault();
                                  CustomEditor.toggleItalicMark(editor);
                                }
                              }}
                            />
                          </div>
                        </Slate>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                
                {/* Supporting Documentation Card */}
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between p-0 h-[41px]">
                    <div className="flex items-center gap-2 px-4">
                      <FileTextIcon className="h-3.5 w-3" />
                      <CardTitle className="text-lg font-bold text-[#000000cc] tracking-[0.08px]">
                        Supporting Documentation
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[41px] w-[41px]"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-4">
                    <p className="text-sm text-[#0000008f] tracking-[0.08px] mb-6">
                      Attach any supporting documentation that is relevant for
                      this question. This includes files like policies,
                      certifications, data reports, and more. Attached files are
                      available for review on the{" "}
                      <span className="font-bold">Files</span> tab.
                    </p>

                    <div className="bg-neutral-100 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <FileTextIcon className="h-[25px] w-[22px] mb-4" />
                      <p className="text-sm text-[#000000cc] font-['Arial-Narrow',Helvetica] tracking-[0.08px] mb-6">
                        Attach any files relevant to this question
                      </p>
                      <Button variant="outline" className="border-[#999999] mb-4">
                        Select file
                      </Button>
                      <p className="text-sm text-[#0000008f] font-['Arial-Narrow',Helvetica] tracking-[0.08px] mb-6">
                        Max size 10MB
                      </p>
                      <p className="text-xs text-[#0000008f] font-['Arial-Narrow',Helvetica] tracking-[0.08px]">
                        Accepted file formats: pdf, doc, docx, xlsx, csv, png,
                        jpg/jpeg, gif
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Card
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between p-0 h-[41px]">
                    <div className="flex items-center gap-2 px-4">
                      <ClockIcon className="h-3.5 w-3.5" />
                      <CardTitle className="text-lg font-bold text-[#000000cc] tracking-[0.08px]">
                        Activity
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[41px] w-[41px]"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    <div className="border-b border-[#d6d6d6] p-6">
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 bg-[#c480e7] rounded-xl flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">JC</span>
                        </div>
                        <Input
                          className="flex-1 h-[148px] border-[#999999]"
                          placeholder="Add a Comment"
                        />
                      </div>
                    </div>

                    
                  </CardContent>
                </Card> */}
              </div>
            {chatbotOpen && (
              <div className="w-[32%] flex flex-col h-full gap-6 pl-6 transition-all duration-300">
                  <div className="flex flex-col h-full bg-white border border-[#eaeaea] rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-[#eaeaea] p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <img className="h-4 w-4" src="/svg-2.svg" alt="Copilot" />
                        </div>
                        <span className="font-semibold text-gray-800">Copilot</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onCloseChatbot}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <ChatbotPane 
                        isOpen={true} 
                        onClose={onCloseChatbot} 
                        embedded={true} 
                        onInsertResponse={(response) => {
                          const formattedResponse = response.trim();
                          
                          // Define a helper to insert content into paragraphs
                          const insertFormattedText = () => {
                            // Split response into paragraphs if needed
                            const paragraphs = formattedResponse.split(/\n\s*\n/);
                            
                            if (paragraphs.length === 1) {
                              // Simple insert for single paragraph
                              editor.insertText(formattedResponse);
                            } else {
                              // For multiple paragraphs, insert as proper paragraphs
                              editor.insertText(paragraphs[0]);
                              
                              // Insert the rest as new paragraphs
                              for (let i = 1; i < paragraphs.length; i++) {
                                editor.insertBreak();
                                editor.insertText(paragraphs[i]);
                              }
                            }
                          };
                          
                          // Get selection and insert the text at cursor position
                          const selection = editor.selection;
                          if (selection) {
                            // Insert at current selection
                            insertFormattedText();
                          } else {
                            // If no selection, place cursor at end and insert
                            const point = Editor.end(editor, []);
                            editor.select(point);
                            insertFormattedText();
                          }
                          
                          // Ensure editor receives focus after insertion
                          setTimeout(() => {
                            ReactEditor.focus(editor);
                          }, 0);
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files">
            {/* Files tab content would go here */}
          </TabsContent>

          <TabsContent value="activity">
            {/* Activity tab content would go here */}
          </TabsContent>
        </Tabs>
      </div>
      
      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="flex flex-col items-center p-8 min-w-[500px] max-w-[600px]">
          <h2 className="text-2xl font-bold mb-2">Generate report</h2>
          <p className="text-gray-700 text-sm mb-6">Please choose the format for your report:</p>
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between bg-[#f8f8f8] rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-[#e6e6fa] rounded-md p-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-7.5A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5A2.25 2.25 0 0019.5 17.25V12.75M16.5 10.5l2.25 2.25m0 0l-2.25 2.25m2.25-2.25H9" /></svg>
                </div>
                <div>
                  <div className="font-semibold">Microsoft Word (standard report)</div>
                  <div className="text-xs text-gray-500">Ideal for internal review and sharing purposes</div>
                </div>
              </div>
              <Button className="bg-black text-white px-4 py-2 rounded-md text-sm">Generate report</Button>
            </div>
            <div className="flex items-center justify-between bg-[#f8f8f8] rounded-lg p-4 border border-gray-200 opacity-70">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-md p-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-7.5A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5A2.25 2.25 0 0019.5 17.25V12.75M16.5 10.5l2.25 2.25m0 0l-2.25 2.25m2.25-2.25H9" /></svg>
                </div>
                <div>
                  <div className="font-semibold">Inline XBRL (audit-ready report)</div>
                  <div className="text-xs text-gray-500">Compliant with CSRD audit requirements <span className='text-green-600'>✔</span></div>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs">Coming soon</span>
            </div>
          </div>
          <div className="mt-6 text-xs text-gray-400 text-center">
            Our team is incorporating the latest EFRAG requirement updates (introduced 30 August 2024). We will notify you as the Inline XBRL format becomes available.
          </div>
        </div>
      </Dialog>

      {/* CDP Score Dialog */}
      <Dialog open={cdpDialogOpen} onClose={() => setCdpDialogOpen(false)}>
        <div className="p-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-[#00b5ad] rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-2xl font-bold">B</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#333333]">CDP Climate Change Score</h2>
                <p className="text-[#666666]">Performance assessment for disclosure year 2023-2024</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#d4f6f4] rounded-lg px-6 py-3">
              <span className="text-3xl font-bold text-[#00b5ad]">B</span>
              <span className="text-sm text-[#006761]">Current Score</span>
            </div>
          </div>

          <div className="bg-[#f9f9f9] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 text-[#333333]">Score Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-[#666666] mb-1">Governance</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#00b5ad] mr-2">A-</span>
                  <span className="text-xs bg-[#e6f7f6] text-[#00b5ad] px-2 py-1 rounded">+1 from 2022</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-[#666666] mb-1">Targets</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#00b5ad] mr-2">B</span>
                  <span className="text-xs bg-[#e6f7f6] text-[#00b5ad] px-2 py-1 rounded">No change</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-[#666666] mb-1">Risk Management</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#00b5ad] mr-2">B+</span>
                  <span className="text-xs bg-[#e6f7f6] text-[#00b5ad] px-2 py-1 rounded">+2 from 2022</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-[#666666] mb-1">Emissions</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#f3a847] mr-2">C</span>
                  <span className="text-xs bg-[#fdf1e3] text-[#f3a847] px-2 py-1 rounded">-1 from 2022</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-6 mb-6">
            <div className="col-span-3 bg-white rounded-lg shadow-sm border border-[#eeeeee] p-6">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">Performance Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#d4f6f4] flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#00b5ad]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333]">Strong governance framework</h4>
                    <p className="text-sm text-[#666666]">Board-level oversight of climate-related issues with clear responsibility allocation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#d4f6f4] flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#00b5ad]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333]">Improved risk assessment</h4>
                    <p className="text-sm text-[#666666]">Comprehensive climate risk assessment integrated into overall risk management process.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#fdf1e3] flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#f3a847]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333]">Emission disclosure gaps</h4>
                    <p className="text-sm text-[#666666]">Incomplete Scope 3 emissions data and limited verification of reported emissions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#fdf1e3] flex items-center justify-center mt-0.5 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#f3a847]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#333333]">Target alignment</h4>
                    <p className="text-sm text-[#666666]">Targets not yet fully aligned with 1.5°C pathway; need for more ambitious interim targets.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-white rounded-lg shadow-sm border border-[#eeeeee] p-6">
              <h3 className="text-lg font-bold mb-4 text-[#333333]">Peer Comparison</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-[#666666] mb-1">
                  <span>Your Score</span>
                  <span>B</span>
                </div>
                <div className="w-full bg-[#eee] h-3 rounded-full overflow-hidden">
                  <div className="bg-[#00b5ad] h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-[#666666] mb-1">
                  <span>Industry Average</span>
                  <span>C</span>
                </div>
                <div className="w-full bg-[#eee] h-3 rounded-full overflow-hidden">
                  <div className="bg-[#f3a847] h-3 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-[#666666] mb-1">
                  <span>Industry Leader</span>
                  <span>A</span>
                </div>
                <div className="w-full bg-[#eee] h-3 rounded-full overflow-hidden">
                  <div className="bg-[#2dccb3] h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-[#eee]">
                <div className="text-sm text-[#666666] mb-2">Your position in sector:</div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-[#00b5ad] mr-2">Top 35%</span>
                  <span className="text-xs bg-[#e6f7f6] text-[#00b5ad] px-2 py-1 rounded">+15% from 2022</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#eeeeee] p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 text-[#333333]">Key Recommendations</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#f9f9f9] rounded-lg p-4">
                <h4 className="font-semibold text-[#333333] mb-2">Short-term Actions</h4>
                <ul className="text-sm text-[#666666] space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Complete Scope 3 emissions inventory
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Implement third-party verification for all emissions data
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Develop detailed climate transition plan
                  </li>
                </ul>
              </div>
              <div className="bg-[#f9f9f9] rounded-lg p-4">
                <h4 className="font-semibold text-[#333333] mb-2">Medium-term Actions</h4>
                <ul className="text-sm text-[#666666] space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Align targets with 1.5°C pathway
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Develop supplier engagement strategy for emissions reduction
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Implement internal carbon pricing mechanism
                  </li>
                </ul>
              </div>
              <div className="bg-[#f9f9f9] rounded-lg p-4">
                <h4 className="font-semibold text-[#333333] mb-2">Long-term Strategy</h4>
                <ul className="text-sm text-[#666666] space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Develop science-based net-zero strategy
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Integrate climate metrics into executive compensation
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#00b5ad] mr-2 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Expand climate scenario analysis to all business units
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <Button variant="outline" className="border-[#00b5ad] text-[#00b5ad] hover:bg-[#e6f7f6]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Detailed Report
            </Button>
            <Button className="bg-[#00b5ad] text-white hover:bg-[#009590]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              Improve Your Score
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};