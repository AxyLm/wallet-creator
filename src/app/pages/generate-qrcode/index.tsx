import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import Create from './create'
export default function TabsDemo() {
  return (
    <div className="flex items-center justify-center mt-12 mb-8">
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
    </div>
  )
}
