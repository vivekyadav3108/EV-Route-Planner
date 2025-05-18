"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { indianEVModels, getVehiclesByBrand } from "@/data/india-ev-models"
import { cn } from "@/lib/utils"

interface VehicleSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function VehicleSelector({ value, onChange }: VehicleSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [vehiclesByBrand, setVehiclesByBrand] = useState<Record<string, typeof indianEVModels>>({})

  useEffect(() => {
    setVehiclesByBrand(getVehiclesByBrand())
  }, [])

  const selectedVehicle = indianEVModels.find((vehicle) => vehicle.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedVehicle ? (
            <div className="flex items-center">
              <span>
                {selectedVehicle.brand} {selectedVehicle.model}
              </span>
              {selectedVehicle.variant && <span className="ml-1 text-gray-500">({selectedVehicle.variant})</span>}
            </div>
          ) : (
            "Select vehicle"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search vehicle..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No vehicle found.</CommandEmpty>
            <ScrollArea className="h-[300px]">
              {Object.entries(vehiclesByBrand).map(([brand, vehicles]) => {
                // Filter vehicles based on search query
                const filteredVehicles = searchQuery
                  ? vehicles.filter((v) =>
                      `${v.brand} ${v.model} ${v.variant || ""}`.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                  : vehicles

                if (filteredVehicles.length === 0) return null

                return (
                  <CommandGroup key={brand} heading={brand}>
                    {filteredVehicles.map((vehicle) => (
                      <CommandItem
                        key={vehicle.id}
                        value={vehicle.id}
                        onSelect={() => {
                          onChange(vehicle.id)
                          setOpen(false)
                        }}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <span>{vehicle.model}</span>
                          {vehicle.variant && <span className="ml-1 text-gray-500">({vehicle.variant})</span>}
                          <span className="ml-2 text-xs text-gray-500">{vehicle.range} km</span>
                        </div>
                        <Check className={cn("h-4 w-4", value === vehicle.id ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              })}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
