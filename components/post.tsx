import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2 } from "lucide-react"

interface PostProps {
  username: string
  timeAgo: string
  content: string
}

export function Post({ username, timeAgo, content }: PostProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-2 flex flex-row items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg" alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-semibold">{username}</h2>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <p className="text-sm">{content}</p>
      </CardContent>
      <CardFooter className="p-1 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs">
          <Heart className="w-3 h-3 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <MessageCircle className="w-3 h-3 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <Share2 className="w-3 h-3 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}

