import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

interface Personnel {
  id: string
  name: string
  tckn: string
  position: string
  avatar?: string
}

interface PersonnelListProps {
  personnel: Personnel[]
  title?: string
}

export function PersonnelList({ personnel, title }: PersonnelListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-base">{title || "Personel Listesi"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">No</TableHead>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>TCKN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personnel.map((person, index) => (
                  <TableRow key={person.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback>{`P${index + 1}`}</AvatarFallback>
                        </Avatar>
                        <span>{person.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{person.tckn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

