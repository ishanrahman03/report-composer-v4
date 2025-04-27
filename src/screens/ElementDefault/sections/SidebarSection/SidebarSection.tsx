import {
  BarChart3Icon,
  Building2Icon,
  CarIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  MailIcon,
  MessageSquareIcon,
  SettingsIcon,
  StarIcon,
  TruckIcon,
  WrenchIcon,
  FileTextIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { ScrollArea } from "../../../../components/ui/scroll-area";

// Navigation items data
const mainNavItems = [
  { icon: <BarChart3Icon className="h-4 w-4" />, label: "Overview", path: "/" },
  { icon: <LayoutDashboardIcon className="h-4 w-4" />, label: "Dashboard", path: "/" },
  { icon: <StarIcon className="h-4 w-4" />, label: "Canvas", path: "/" },
  { icon: <FileTextIcon className="h-4 w-4" />, label: "Disclosures", path: "/disclosures" },
  { icon: <MailIcon className="h-4 w-4" />, label: "Email Workflow", path: "/" },
  { icon: <TruckIcon className="h-4 w-4" />, label: "Supply Chain", path: "/" },
];

const organizationItems = [
  { label: "Locations", icon: <Building2Icon className="h-4 w-4" /> },
  { label: "Vehicles", icon: <CarIcon className="h-4 w-4" /> },
  { label: "Equipment", icon: <WrenchIcon className="h-4 w-4" /> },
];

const scopeItems = [
  { label: "Scope 1" },
  { label: "Scope 2" },
  { label: "Scope 3" },
];

const actionItems = [
  { icon: <LineChartIcon className="h-4 w-4" />, label: "Measure" },
  { icon: <StarIcon className="h-4 w-4" />, label: "Act" },
  { icon: <MailIcon className="h-4 w-4" />, label: "Report" },
];

const bottomNavItems = [
  { icon: <SettingsIcon className="h-4 w-4" />, label: "Settings" },
  { icon: <HelpCircleIcon className="h-4 w-4" />, label: "Help Center" },
  { icon: <MessageSquareIcon className="h-4 w-4" />, label: "Feedback" },
];



export const SidebarSection = (): JSX.Element => {
  const location = useLocation();
  
  return (
    <div className="h-screen w-64 border-r border-border bg-neutral-50">
      <div className="flex h-12 items-center justify-between p-2">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900">
            <img className="h-4 w-4" alt="Logo" src="/svg-18.svg" />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <img className="h-4 w-4" alt="Menu" src="/svg-1.svg" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="p-2">
          {/* Main navigation items */}
          <nav className="space-y-1 pb-6">
            {mainNavItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`h-7 w-full justify-start px-2 font-normal ${
                  location.pathname === item.path ? "bg-zinc-100 text-zinc-900" : "text-zinc-700"
                }`}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-2 text-sm">{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
          
          
          {/* Accordion sections */}
          <div className="space-y-1">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="organization" className="border-none">
                <AccordionTrigger className="h-8 py-0 px-2 text-sm font-normal text-zinc-700 hover:no-underline">
                  <div className="flex items-center">
                    <img
                      className="mr-2 h-4 w-4"
                      alt="Organization"
                      src="/svg-8.svg"
                    />
                    <span>My Organization</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-l border-border pl-[15px] pt-0.5">
                  {organizationItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-7 w-full justify-start px-2 font-normal text-zinc-700"
                    >
                      <span className="text-sm">{item.label}</span>
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data-management" className="border-none">
                <AccordionTrigger className="h-8 py-0 px-2 text-sm font-normal text-zinc-700 hover:no-underline">
                  <div className="flex items-center">
                    <img className="mr-2 h-4 w-4" alt="Data" src="/svg-3.svg" />
                    <span>Data Management</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>

              {scopeItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`scope-${index + 1}`}
                  className="border-none"
                >
                  <AccordionTrigger className="h-8 py-0 px-2 text-sm font-normal text-zinc-700 hover:no-underline">
                    <div className="flex items-center">
                      <img
                        className="mr-2 h-4 w-4"
                        alt="Scope"
                        src="/svg-13.svg"
                      />
                      <span>{item.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Action items */}
          <nav className="space-y-1 py-6">
            {actionItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-7 w-full justify-start px-2 font-normal text-zinc-700"
              >
                {item.icon}
                <span className="ml-2 text-sm">{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Bottom navigation items */}
          <nav className="absolute bottom-16 space-y-1 pb-4">
            {bottomNavItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-7 w-full justify-start px-2 font-normal text-zinc-700"
              >
                {item.icon}
                <span className="ml-2 text-sm">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* User profile */}
      <div className="absolute bottom-0 flex h-12 w-[239px] items-center justify-between p-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 rounded-xl">
            <AvatarImage src="/ishan.png" alt="Ishan Rahman" />
            <AvatarFallback>IR</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-semibold leading-[17.5px] text-zinc-700">
              Ishan Rahman
            </p>
            <p className="text-xs font-normal leading-4 text-zinc-700">
              ishanrahman03@gmail.com
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <img className="h-4 w-4" alt="Menu" src="/svg-1.svg" />
        </Button>
      </div>
    </div>
  );
};
