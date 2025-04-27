import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { SidebarSection } from "./sections/SidebarSection/SidebarSection";

export const ElementDefault = (): JSX.Element => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleChatbot = () => {
    setChatbotOpen(prev => !prev);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative flex">
        {sidebarOpen && <SidebarSection />}

        <div className="flex-1">
          <header className="w-full h-16 bg-white border-b border-solid flex items-center px-3">
            <div className="w-7 h-7 flex items-center justify-center">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
                <img className="w-4 h-4" alt="Menu" src="/svg.svg" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-4 mx-4" />

            <div className="w-[120px] h-[25px] bg-[url(/latspace.png)] bg-cover bg-[50%_50%]" />

            <div className="ml-auto">
              <Button
                variant="outline"
                className={`h-[37px] ${chatbotOpen ? 'bg-purple-100 border-purple-300' : 'bg-[#63347f25]'} rounded-xl border border-solid shadow-[0px_1px_2px_#0000000d] flex items-center`}
                onClick={toggleChatbot}
              >
                <img
                  className="w-4 h-4 mr-2"
                  alt="Copilot icon"
                  src="/svg-2.svg"
                />
                <span className={`font-medium ${chatbotOpen ? 'text-purple-700' : 'text-gray-800'} text-sm`}>
                  Copilot
                </span>
              </Button>
            </div>
          </header>

          <MainContentSection chatbotOpen={chatbotOpen} onCloseChatbot={() => setChatbotOpen(false)} sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
};
