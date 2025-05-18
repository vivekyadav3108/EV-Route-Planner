"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function MapFallback({ error }: { error: string }) {
  return (
    <div className="h-full w-full bg-gray-100 p-6 flex flex-col items-center justify-center">
      <Alert variant="destructive" className="max-w-2xl mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Google Maps API Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">How to Fix This Error</h2>

        <div className="space-y-4 mb-6">
          <p>
            The error <code className="bg-gray-100 px-2 py-1 rounded">BillingNotEnabledMapError</code> occurs because
            the Google Maps JavaScript API requires billing to be enabled on your Google Cloud Platform account.
          </p>

          <h3 className="font-semibold text-lg">Follow these steps to fix the issue:</h3>

          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>
              Go to the{" "}
              <a
                href="https://console.cloud.google.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Google Cloud Console Billing page
              </a>
            </li>
            <li>Sign in with the Google account associated with your API key</li>
            <li>Link a billing account to your project</li>
            <li>Enable billing for the Google Maps JavaScript API</li>
            <li>Wait a few minutes for the changes to take effect</li>
          </ol>

          <p className="text-sm text-gray-600">
            Note: Google Maps Platform offers a $200 monthly credit, which is enough for most small to medium-sized
            applications. You likely won't be charged unless you exceed this free tier.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            Reload Page
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              window.open(
                "https://developers.google.com/maps/documentation/javascript/error-messages#billing-not-enabled-map-error",
                "_blank",
              )
            }
            className="flex items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Google Maps Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}
