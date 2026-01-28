"use client"
import { ChevronLeft, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface IOSMessageScreenProps {
  onBack: () => void
  onLinkClick: () => void
}

export function IOSMessageScreen({ onBack, onLinkClick }: IOSMessageScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center px-4 py-2 border-b">
        <button onClick={onBack} className="flex items-center text-blue-600 font-medium">
          <ChevronLeft className="h-5 w-5" />
          <span>Geri</span>
        </button>
        <div className="ml-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Mesajlar</h1>
            <Badge variant="warning" className="bg-yellow-500 text-xs font-medium">
              DEMO
            </Badge>
          </div>
          <p className="text-sm text-gray-500">İş Ortağı</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4">
        <div className="max-w-[85%] bg-green-500 text-white p-3 rounded-lg ml-auto">
          <p className="text-[15px] leading-5">
            Değerli müşterimiz, teklif önkayıt formunuzu doldurarak hizmetlerimiz hakkında bilgi alabilirsiniz.
            Aşağıdaki linke tıklayarak formu doldurabilirsiniz.
          </p>
          <p className="text-[15px] leading-5 text-white underline mt-2 cursor-pointer" onClick={onLinkClick}>
            https://outsourcehub.net/teklif-onkayit
          </p>
          <p className="text-[15px] leading-5 mt-2">İş Ortağı Ekibi B002-TEKLIF</p>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center bg-gray-50 rounded-full border">
          <input
            type="text"
            placeholder="Mesaj"
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-[15px]"
          />
          <button className="p-2 rounded-full bg-blue-500 mr-1">
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

