"use client";

import { CommandInterface } from '@/components/command-interface';
import { ClipboardManager } from '@/components/clipboard-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Desktop Commander</h1>
        
        <Tabs defaultValue="commands" className="w-full">
          <TabsList>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="clipboard">Clipboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commands">
            <div className="p-4 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Computer Control</h2>
              <CommandInterface />
            </div>
          </TabsContent>
          
          <TabsContent value="clipboard">
            <div className="p-4 border rounded-lg">
              <ClipboardManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
