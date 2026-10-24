"use client"

import type { KeyboardEvent } from "react"

import { HitArea } from "@/components/site/hit-area"
import { cn } from "@/lib/utils"

const NEXT_KEYS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }

function SegmentedTabs<T extends string>({
  label,
  tabs,
  value,
  onValueChange,
  className,
  tabClassName,
}: {
  label: string
  tabs: readonly (readonly [T, string])[]
  value: T
  onValueChange: (value: T) => void
  className?: string
  tabClassName?: string
}) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex(([id]) => id === value)
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key in NEXT_KEYS
            ? (index + NEXT_KEYS[event.key] + tabs.length) % tabs.length
            : null

    if (target === null) {
      return
    }

    event.preventDefault()
    onValueChange(tabs[target][0])
    const buttons =
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")
    buttons[target]?.focus()
  }

  return (
    <div
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-1", className)}
      onKeyDown={onKeyDown}
      role="tablist"
    >
      {tabs.map(([id, name]) => (
        <button
          aria-selected={value === id}
          className={cn(
            "relative px-2 py-1 text-muted-foreground hover:text-foreground aria-selected:bg-muted aria-selected:text-foreground",
            tabClassName
          )}
          key={id}
          onClick={() => onValueChange(id)}
          role="tab"
          tabIndex={value === id ? 0 : -1}
          type="button"
        >
          <HitArea />
          {name}
        </button>
      ))}
    </div>
  )
}

export { SegmentedTabs }
