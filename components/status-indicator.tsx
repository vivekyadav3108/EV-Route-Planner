import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type StatusType = "loading" | "success" | "error" | "info"

interface StatusIndicatorProps {
  status: StatusType
  message: string
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "loading":
        return "bg-blue-50 border-blue-200 text-blue-700"
      case "success":
        return "bg-green-50 border-green-200 text-green-700"
      case "error":
        return "bg-red-50 border-red-200 text-red-700"
      case "info":
        return "bg-gray-50 border-gray-200 text-gray-700"
      default:
        return "bg-gray-50 border-gray-200 text-gray-700"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "info":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Alert className={`${getStatusStyles()} max-w-md`}>
      <div className="flex items-center">
        {getStatusIcon()}
        <AlertDescription className="ml-2">{message}</AlertDescription>
      </div>
    </Alert>
  )
}
