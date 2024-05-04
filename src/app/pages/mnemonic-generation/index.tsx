import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import Create from '@/app/pages/mnemonic-generation/create'
export default function TabsDemo() {
  return (
    <Tabs defaultValue="create" className="w-[400px] sm:w-[400px] md:w-[600px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Create />
      </TabsContent>
      <TabsContent value="history">Coming soon</TabsContent>
    </Tabs>
  )
}
